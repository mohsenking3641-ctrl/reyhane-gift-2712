const express = require('express');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.SURPRISE_PIN;
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!PASSWORD || !/^\d{4}$/.test(PASSWORD)) {
  console.error('Set SURPRISE_PIN to a four-digit PIN.');
  process.exit(1);
}
if (!SESSION_SECRET || SESSION_SECRET.length < 32) {
  console.error('Set SESSION_SECRET to a random string of at least 32 characters.');
  process.exit(1);
}

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: { directives: {
  defaultSrc: ["'self'"], scriptSrc: ["'self'"],
  styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
  imgSrc: ["'self'", 'data:'], connectSrc: ["'self'"],
  mediaSrc: ["'self'", 'data:'], objectSrc: ["'none'"], frameAncestors: ["'none'"]
} } }));
app.use(express.json({ limit: '2kb' }));
app.use(session({ name: 'reyhane.sid', secret: SESSION_SECRET, resave: false,
  saveUninitialized: false, cookie: { httpOnly: true, sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production', maxAge: 30 * 60 * 1000 } }));

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8,
  standardHeaders: 'draft-7', legacyHeaders: false,
  message: { ok: false, message: 'چند لحظه صبر کن و دوباره امتحان کن.' } });

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/login.css', (req, res) => res.sendFile(path.join(__dirname, 'login.css')));
app.get('/login.js', (req, res) => res.sendFile(path.join(__dirname, 'login.js')));
app.post('/api/unlock', loginLimiter, (req, res) => {
  const pin = String(req.body?.pin ?? '');
  if (!/^\d{4}$/.test(pin) || pin !== PASSWORD)
    return res.status(401).json({ ok: false, message: 'این رمز درست نیست؛ دوباره امتحان کن 💗' });
  req.session.unlocked = true;
  req.session.save(err => {
    if (err) return res.status(500).json({ ok: false, message: 'یه مشکل کوچولو پیش اومد. دوباره تلاش کن.' });
    res.json({ ok: true });
  });
});
app.post('/api/lock', (req, res) => req.session.destroy(() => res.json({ ok: true })));
function requireUnlock(req, res, next) {
  if (req.session?.unlocked) return next();
  return res.redirect('/');
}
app.get('/surprise', requireUnlock, (req, res) => res.sendFile(path.join(__dirname, 'surprise.html')));
app.get('/style.css', requireUnlock, (req, res) => res.sendFile(path.join(__dirname, 'style.css')));
app.get('/app.js', requireUnlock, (req, res) => res.sendFile(path.join(__dirname, 'app.js')));
app.get('/music.mp3', requireUnlock, (req, res) => res.sendFile(path.join(__dirname, 'music.mp3')));
app.get('/api/status', (req, res) => res.json({ unlocked: !!req.session?.unlocked }));
app.listen(PORT, () => console.log(`Reyhane surprise listening on port ${PORT}`));
