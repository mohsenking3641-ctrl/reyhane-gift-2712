(() => {
  const $ = id => document.getElementById(id);
  const screens = [...document.querySelectorAll(".screen")];

  function show(id) {
    screens.forEach(s => s.classList.toggle("active", s.id === id));
    window.scrollTo({top:0,behavior:"smooth"});
    sprinklePaws(id);
  }

  // Larger paw prints are used on every stage, kept close to the screen edges.
  function sprinklePaws(screenId) {
    const positions = {
      welcome: [[5, 23], [88, 68], [12, 82]],
      story: [[6, 18], [90, 72], [13, 84]],
      gift: [[5, 27], [89, 70], [15, 84]],
      letter: [[3, 16], [94, 78], [8, 88]],
      question: [[6, 20], [91, 72], [13, 86]],
      ending: [[5, 18], [91, 74], [12, 86], [82, 14]]
    };
    (positions[screenId] || []).forEach(([left, top], index) => {
      setTimeout(() => {
        const paw = document.createElement("span");
        paw.className = "paw";
        paw.textContent = "🐾";
        paw.style.left = left + "%";
        paw.style.top = top + "%";
        paw.style.fontSize = (screenId === "ending" ? 38 : 32) + index * 3 + "px";
        document.body.appendChild(paw);
        setTimeout(() => paw.remove(), 7200);
      }, index * 340);
    });
  }

  const story = [
    ["یه چیزایی هست…","که دلم می‌خواد خودت از زبونم بشنوی."],
    ["مثلاً اینکه…","بودنت چقدر می‌تونه یه روز معمولی رو قشنگ کنه."],
    ["و اینکه…","برای گفتن یه حرف خیلی مهم، کلی ذوق دارم."]
  ];
  let storyIndex = 0;

  $("begin").addEventListener("click", () => {
    startMusic();
    storyIndex = 0;
    updateStory();
    show("story");
  });

  function updateStory() {
    $("storyTitle").textContent = story[storyIndex][0];
    $("storyLine").textContent = story[storyIndex][1];
    $("progress").style.width = ((storyIndex + 1) / story.length * 100) + "%";
    $("nextStory").textContent = storyIndex === story.length - 1 ? "یه سورپرایز دارم ♡" : "بعدی ♡";
  }

  $("nextStory").addEventListener("click", () => {
    if (storyIndex < story.length - 1) {
      storyIndex++;
      updateStory();
    } else {
      show("gift");
    }
  });

  $("openGift").addEventListener("click", () => {
    $("openGift").classList.add("open");
    $("giftHint").textContent = "یه عالمه عشق توشه… 💗";
    giftConfetti($("openGift"));
    setTimeout(() => show("letter"), 1250);
  });

  $("showQuestion").addEventListener("click", () => show("question"));

  document.querySelectorAll(".answer").forEach(btn => btn.addEventListener("click", () => {
    show("ending");
    startFinale();
    startMusic();
  }));

  const layer = $("floatLayer");
  const symbols = ["♡", "♥", "✧", "✦"];
  function floatOne() {
    const el = document.createElement("span");
    el.className = "floaty";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 100 + "%";
    el.style.fontSize = (13 + Math.random() * 15) + "px";
    el.style.animationDuration = (8 + Math.random() * 7) + "s";
    layer.appendChild(el);
    setTimeout(() => el.remove(), 16000);
  }
  setInterval(floatOne, 1450);
  for (let i = 0; i < 5; i++) setTimeout(floatOne, i * 260);

  const svgNS = "http://www.w3.org/2000/svg";
  const wordHeartStage = $("wordHeartStage");
  const nestedHeartStage = $("nestedHeartStage");
  const heartParticleLayer = $("heartParticleLayer");
  let finaleStarted = false;
  let heartTouched = false;

  // A hollow heart made by the words themselves: phrases are placed along the actual heart outline.
  function buildHundredWordHeart() {
    const group = $("wordHeartRows");
    const guide = $("wordHeartGuide");
    if (!group || !guide || group.childElementCount) return;
    const total = guide.getTotalLength();
    const count = 30;
    for (let i = 0; i < count; i++) {
      const distance = (total * (i + .5)) / count;
      const point = guide.getPointAtLength(distance);
      const before = guide.getPointAtLength(Math.max(0, distance - 1.5));
      const after = guide.getPointAtLength(Math.min(total, distance + 1.5));
      let angle = Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI;
      if (angle > 90 || angle < -90) angle += 180;
      const phrase = document.createElementNS(svgNS, "text");
      phrase.setAttribute("x", point.x.toFixed(2));
      phrase.setAttribute("y", point.y.toFixed(2));
      phrase.setAttribute("text-anchor", "middle");
      phrase.setAttribute("textLength", "45");
      phrase.setAttribute("lengthAdjust", "spacingAndGlyphs");
      phrase.setAttribute("class", "word-heart-line");
      phrase.setAttribute("transform", `rotate(${angle.toFixed(2)} ${point.x.toFixed(2)} ${point.y.toFixed(2)})`);
      phrase.style.setProperty("--word-delay", `${i * 78}ms`);
      phrase.textContent = "I LOVE YOU";
      group.appendChild(phrase);
    }
    buildNestedWordHearts();
  }

  // Three smaller hollow hearts are drawn from the same repeated words, inside the large heart.
  function buildNestedWordHearts() {
    const svg = $("wordHeartSvg");
    if (!svg || $("innerWordHearts")) return;
    const defs = svg.querySelector("defs");
    const group = document.createElementNS(svgNS, "g");
    group.setAttribute("id", "innerWordHearts");
    group.setAttribute("aria-hidden", "true");
    const rings = [
      { d: "M250 306 C232 289 181 258 181 224 C181 197 215 188 250 220 C285 188 319 197 319 224 C319 258 268 289 250 306Z", count: 13, delay: 2500, color: "#d46b99" },
      { d: "M250 286 C238 275 205 253 205 230 C205 211 226 205 250 226 C274 205 295 211 295 230 C295 253 262 275 250 286Z", count: 9, delay: 3400, color: "#e58ab0" },
      { d: "M250 267 C242 260 226 247 226 236 C226 225 238 222 250 235 C262 222 274 225 274 236 C274 247 258 260 250 267Z", count: 7, delay: 4100, color: "#f0a8c5" }
    ];
    rings.forEach((ring, ringIndex) => {
      const guide = document.createElementNS(svgNS, "path");
      guide.setAttribute("d", ring.d);
      guide.setAttribute("fill", "none");
      defs.appendChild(guide);
      const guideId = `innerWordHeartGuide${ringIndex}`;
      guide.setAttribute("id", guideId);
      for (let i = 0; i < ring.count; i++) {
        const distance = guide.getTotalLength() * (i + .5) / ring.count;
        const point = guide.getPointAtLength(distance);
        const before = guide.getPointAtLength(Math.max(0, distance - 1));
        const after = guide.getPointAtLength(Math.min(guide.getTotalLength(), distance + 1));
        let angle = Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI;
        if (angle > 90 || angle < -90) angle += 180;
        const word = document.createElementNS(svgNS, "text");
        word.setAttribute("x", point.x.toFixed(2));
        word.setAttribute("y", point.y.toFixed(2));
        word.setAttribute("text-anchor", "middle");
        word.setAttribute("textLength", ringIndex === 2 ? "24" : "31");
        word.setAttribute("lengthAdjust", "spacingAndGlyphs");
        word.setAttribute("class", `inner-word-heart inner-word-heart-${ringIndex + 1}`);
        word.setAttribute("fill", ring.color);
        word.setAttribute("transform", `rotate(${angle.toFixed(2)} ${point.x.toFixed(2)} ${point.y.toFixed(2)})`);
        word.style.setProperty("--inner-delay", `${ring.delay + i * 75}ms`);
        word.textContent = "I LOVE YOU";
        group.appendChild(word);
      }
    });
    svg.appendChild(group);
  }

  function createSideHearts() {
    const swarm = $("heartSwarm");
    if (!swarm) return;
    swarm.replaceChildren();
    const silhouette = document.createElementNS(svgNS, "svg");
    silhouette.setAttribute("class", "swarm-heart-silhouette");
    silhouette.setAttribute("viewBox", "0 0 500 455");
    silhouette.innerHTML = '<path d="M250 420 C205 378 42 267 42 145 C42 62 145 25 250 132 C355 25 458 62 458 145 C458 267 295 378 250 420Z"/>';
    swarm.appendChild(silhouette);

    const count = 24;
    for (let i = 0; i < count; i++) {
      const heart = document.createElement("span");
      heart.className = "cinematic-heart";
      heart.textContent = "♥";
      const fromLeft = i % 2 === 0;
      const fromX = fromLeft ? -window.innerWidth * 0.68 : window.innerWidth * 0.68;
      const fromY = (Math.random() - 0.5) * window.innerHeight * 0.58;
      const t = (Math.PI * 2 * i) / count;
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
      const targetX = hx * 8.3;
      const targetY = -hy * 7.3;
      const swirl = (Math.random() - 0.5) * 95;
      const delay = i * 48;
      heart.style.setProperty("--heart-size", (29 + Math.random() * 31) + "px");
      swarm.appendChild(heart);
      heart.animate([
        { transform: `translate(${fromX}px,${fromY}px) rotate(${fromLeft ? -100 : 100}deg) scale(.2)`, opacity: 0 },
        { transform: `translate(${fromX * .48}px,${fromY * .42 + swirl}px) rotate(${fromLeft ? 220 : -220}deg) scale(1.1)`, opacity: 1, offset: .48 },
        { transform: `translate(${targetX}px,${targetY}px) rotate(0deg) scale(1.15)`, opacity: 1, offset: .84 },
        { transform: `translate(${targetX}px,${targetY}px) rotate(0deg) scale(.15)`, opacity: 0 }
      ], {
        duration: 2350,
        delay,
        easing: "cubic-bezier(.18,.72,.24,1)",
        fill: "forwards"
      });
      setTimeout(() => heart.remove(), delay + 2500);
    }
    setTimeout(() => swarm.classList.add("assembled"), 1650);
  }

  function createBubbles() {
    for (let i = 0; i < 18; i++) {
      setTimeout(() => {
        const bubble = document.createElement("i");
        bubble.className = "bubble";
        const size = 12 + Math.random() * 31;
        bubble.style.width = size + "px";
        bubble.style.height = size + "px";
        bubble.style.left = (3 + Math.random() * 94) + "%";
        bubble.style.animationDuration = (7 + Math.random() * 5) + "s";
        document.body.appendChild(bubble);
        setTimeout(() => bubble.remove(), 13000);
      }, i * 230);
    }
  }

  function createButterflies() {
    const host = $("finaleButterflies");
    if (!host || host.childElementCount) return;
    ["🦋", "🦋", "🦋"].forEach((symbol, index) => {
      const butterfly = document.createElement("span");
      butterfly.className = "finale-butterfly butterfly-" + (index + 1);
      butterfly.textContent = symbol;
      host.appendChild(butterfly);
    });
  }

  function createFinalPaws() {
    const host = $("finalePaws");
    if (!host || host.childElementCount) return;
    const positions = [
      ["7%", "25%", "-16deg"], ["86%", "20%", "18deg"],
      ["12%", "76%", "12deg"], ["88%", "72%", "-12deg"],
      ["25%", "9%", "14deg"], ["75%", "88%", "-18deg"]
    ];
    positions.forEach(([left, top, rotate], index) => {
      const paw = document.createElement("span");
      paw.className = "finale-paw-print";
      paw.textContent = "🐾";
      paw.style.left = left;
      paw.style.top = top;
      paw.style.setProperty("--paw-rotate", rotate);
      paw.style.setProperty("--paw-delay", (index * 180) + "ms");
      host.appendChild(paw);
    });
  }

  function startFinale() {
    if (finaleStarted) return;
    finaleStarted = true;
    const ending = $("ending");
    ending.classList.add("finale-active");
    buildHundredWordHeart();
    createBubbles();
    createButterflies();
    createFinalPaws();
    const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reducedMotion) createSideHearts();

    // The glossy 3D hearts merge first; the typographic heart appears after them.
    setTimeout(() => {
      $("heartSwarm").classList.add("swarm-finished");
      wordHeartStage.classList.add("word-heart-visible");
      wordHeartStage.setAttribute("aria-pressed", "false");
    }, reducedMotion ? 80 : 3600);
  }

  function scatterHeartIntoLight() {
    if (heartTouched || !wordHeartStage) return;
    heartTouched = true;
    wordHeartStage.setAttribute("aria-pressed", "true");
    wordHeartStage.classList.add("word-heart-touched");

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const count = 200;
    const centerX = window.innerWidth * 0.5;
    const centerY = window.innerHeight * 0.48;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("i");
      particle.className = i % 9 === 0 ? "mini-heart-particle" : "spark-particle";
      particle.style.left = centerX + "px";
      particle.style.top = centerY + "px";
      heartParticleLayer.appendChild(particle);

      const angle = (Math.PI * 2 * i) / count + (Math.random() - .5) * .18;
      const radius = 80 + Math.random() * Math.min(170, window.innerWidth * .3);
      const dx = Math.cos(angle) * radius;
      const dy = Math.sin(angle) * radius;
      const delay = Math.random() * 260;
      particle.animate([
        { transform: "translate(-50%,-50%) scale(.2)", opacity: 0 },
        { transform: "translate(-50%,-50%) scale(1)", opacity: 1, offset: .18 },
        { transform: `translate(${dx}px,${dy}px) scale(.65) rotate(${Math.random() * 240}deg)`, opacity: .9, offset: .7 },
        { transform: "translate(-50%,-50%) scale(.1)", opacity: 0 }
      ], { duration: 1850, delay, easing: "cubic-bezier(.2,.65,.25,1)", fill: "forwards" });
      setTimeout(() => particle.remove(), 2250 + delay);
    }

    wordHeartStage.classList.add("word-heart-touched");
  }

  wordHeartStage.addEventListener("click", scatterHeartIntoLight);
  wordHeartStage.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      scatterHeartIntoLight();
    }
  });

  // Seven playful details are distributed throughout the experience, not saved only for the finale.
  const magicLayer = $("magicLayer");
  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function giftConfetti(anchor) {
    if (!magicLayer) return;
    const rect = anchor.getBoundingClientRect();
    ["♥", "♡", "✦", "🦋", "♥", "✧", "♡", "🦋"].forEach((symbol, i) => {
      const bit = document.createElement("span");
      bit.className = "gift-confetti";
      bit.textContent = symbol;
      bit.style.left = (rect.left + rect.width / 2) + "px";
      bit.style.top = (rect.top + 35) + "px";
      bit.style.setProperty("--burst-x", `${(Math.random() - .5) * 230}px`);
      bit.style.setProperty("--burst-y", `${-55 - Math.random() * 150}px`);
      bit.style.setProperty("--burst-delay", `${i * 35}ms`);
      magicLayer.appendChild(bit);
      setTimeout(() => bit.remove(), 1700);
    });
  }

  function makeHeartBubble(x, y) {
    const bubble = document.createElement("button");
    bubble.type = "button";
    bubble.className = "heart-bubble";
    bubble.setAttribute("aria-label", "حباب قلبی");
    bubble.textContent = "♡";
    bubble.style.left = x + "px";
    bubble.style.top = y + "px";
    magicLayer.appendChild(bubble);
    bubble.addEventListener("click", () => {
      const r = bubble.getBoundingClientRect();
      giftConfettiAt(r.left + r.width / 2, r.top + r.height / 2);
      bubble.classList.add("popped");
      setTimeout(() => bubble.remove(), 450);
    }, {once:true});
    setTimeout(() => bubble.remove(), 6500);
  }

  function giftConfettiAt(x, y) {
    ["♥", "✦", "♡", "✧", "♥"].forEach((symbol, i) => {
      const bit = document.createElement("span");
      bit.className = "gift-confetti";
      bit.textContent = symbol;
      bit.style.left = x + "px"; bit.style.top = y + "px";
      bit.style.setProperty("--burst-x", `${(Math.random() - .5) * 125}px`);
      bit.style.setProperty("--burst-y", `${(Math.random() - .5) * 125}px`);
      bit.style.setProperty("--burst-delay", `${i * 25}ms`);
      magicLayer.appendChild(bit); setTimeout(() => bit.remove(), 1400);
    });
  }

  function popMiniKitten() {
    if (!magicLayer || document.querySelector(".wandering-kitten")) return;
    const cat = document.createElement("span");
    cat.className = "wandering-kitten";
    cat.textContent = "🐱";
    cat.style.left = "-64px";
    cat.style.top = "auto";
    cat.style.bottom = "9%";
    magicLayer.appendChild(cat);
    cat.animate([
      { transform: "translate(0,0) scaleX(1)" },
      { transform: `translate(${Math.max(0, window.innerWidth * .43)}px,-9px) scaleX(1)` },
      { transform: `translate(${Math.max(0, window.innerWidth + 90)}px,0) scaleX(1)` }
    ], { duration: 3900, easing: "linear", fill: "forwards" });
    setTimeout(() => cat.remove(), 4050);
  }

  function sendChasingButterfly() {
    if (!magicLayer || document.querySelector(".chase-butterfly")) return;
    const butterfly = document.createElement("span");
    const cat = document.createElement("span");
    butterfly.className = "chase-butterfly";
    butterfly.textContent = "🦋";
    cat.className = "wandering-kitten";
    cat.textContent = "🐱";
    magicLayer.append(cat, butterfly);
    const width = window.innerWidth;
    const travel = width + 100;
    butterfly.animate([
      { transform: "translate(-20px,0) rotate(-12deg)" },
      { transform: `translate(${travel * .48}px,-44px) rotate(12deg)` },
      { transform: `translate(${travel}px,-8px) rotate(-8deg)` }
    ], { duration: 4200, easing: "ease-in-out", fill: "forwards" });
    cat.animate([
      { transform: "translate(-88px,0) scaleX(1)" },
      { transform: `translate(${travel * .48 - 76}px,-7px) scaleX(1)` },
      { transform: `translate(${travel - 65}px,0) scaleX(1)` }
    ], { duration: 4200, delay: 350, easing: "ease-in-out", fill: "forwards" });
    setTimeout(() => { butterfly.remove(); cat.remove(); }, 4700);
  }

  function drawMagicRibbon() {
    if (!magicLayer || document.querySelector(".magic-ribbon")) return;
    const ribbon = document.createElement("span");
    ribbon.className = "magic-ribbon";
    ribbon.textContent = "〰🎀〰";
    magicLayer.appendChild(ribbon);
    setTimeout(() => ribbon.remove(), 2500);
  }

  function twinkleMiniConstellation() {
    if (!magicLayer || document.querySelector(".mini-constellation")) return;
    const sky = document.createElement("div");
    sky.className = "mini-constellation";
    sky.innerHTML = '<i>✦</i><i>✧</i><i>✦</i><i>✧</i><i>✦</i>';
    magicLayer.appendChild(sky);
    setTimeout(() => sky.remove(), 3500);
  }

  function bouncingHearts(x, y) {
    if (!magicLayer) return;
    for (let i = 0; i < 4; i++) {
      const heart = document.createElement("span");
      heart.className = "spring-heart";
      heart.textContent = i % 2 ? "♡" : "♥";
      heart.style.left = x + "px"; heart.style.top = y + "px";
      heart.style.setProperty("--spring-x", `${(i - 1.5) * 28}px`);
      heart.style.setProperty("--spring-y", `${-38 - Math.random() * 38}px`);
      magicLayer.appendChild(heart);
      setTimeout(() => heart.remove(), 1250);
    }
  }

  // Little surprises recur gently between screens; nothing covers the original copy or controls.
  let surpriseCycle = 0;
  setInterval(() => {
    if (document.hidden || reducedMotion) return;
    const active = document.querySelector(".screen.active");
    if (!active || active.id === "ending" || active.id === "letter") return;
    surpriseCycle++;
    if (surpriseCycle % 4 === 0) sendChasingButterfly();
    else if (surpriseCycle % 3 === 0) twinkleMiniConstellation();
    else if (surpriseCycle % 2 === 0) drawMagicRibbon();
    else popMiniKitten();
  }, 9200);

  setInterval(() => {
    if (document.hidden || reducedMotion) return;
    const active = document.querySelector(".screen.active");
    if (!active || active.id === "ending" || active.id === "letter") return;
    const x = 24 + Math.random() * Math.max(80, window.innerWidth - 72);
    const y = 70 + Math.random() * Math.max(100, window.innerHeight - 190);
    makeHeartBubble(x, y);
  }, 5200);

  document.addEventListener("pointerdown", event => {
    if (event.target.closest("button, .word-heart-stage, .music-toggle, .sound")) return;
    bouncingHearts(event.clientX, event.clientY);
  }, {passive:true});

  const audio = $("backgroundMusic");
  let musicOn = false;

  async function startMusic() {
    if (!audio || musicOn) return;
    try {
      audio.volume = 0.48;
      await audio.play();
      musicOn = true;
      $("sound").classList.add("on");
      $("musicToggle").textContent = "♫ موسیقی روشنه";
    } catch (error) {
      musicOn = false;
      $("musicToggle").textContent = "♫ برای پخش موسیقی بزن";
    }
  }

  function stopMusic() {
    if (!audio) return;
    audio.pause();
    musicOn = false;
    $("sound").classList.remove("on");
    $("musicToggle").textContent = "♫ پخش موسیقی";
  }

  $("sound").addEventListener("click", () => musicOn ? stopMusic() : startMusic());
  $("musicToggle").addEventListener("click", () => musicOn ? stopMusic() : startMusic());
})();