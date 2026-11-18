# Reyhane Surprise

A Node.js / Express password-protected surprise site. The supplied background track is stored as `music.mp3` and is served only after the PIN session is unlocked.

## Render settings
- Build command: `npm install`
- Start command: `npm start`

Set these environment variables in the hosting dashboard:
- `SURPRISE_PIN`: a four-digit PIN (currently intended to be `2712`)
- `SESSION_SECRET`: a random string at least 32 characters long
- `NODE_ENV`: `production`

Do not commit real secrets to GitHub.
