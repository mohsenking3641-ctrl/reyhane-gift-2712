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
    setTimeout(() => show("letter"), 950);
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

  // Ten rows, ten phrases in each row: exactly 100 visible I LOVE YOU phrases.
  function buildHundredWordHeart() {
    const group = $("wordHeartRows");
    if (!group || group.childElementCount) return;
    const rows = [
      { y: 82, width: 270 },
      { y: 116, width: 390 },
      { y: 150, width: 445 },
      { y: 184, width: 455 },
      { y: 218, width: 430 },
      { y: 252, width: 385 },
      { y: 286, width: 330 },
      { y: 320, width: 270 },
      { y: 354, width: 200 },
      { y: 386, width: 112 }
    ];
    const phrase = "I LOVE YOU";
    rows.forEach((row, rowIndex) => {
      const text = document.createElementNS(svgNS, "text");
      text.setAttribute("x", "250");
      text.setAttribute("y", String(row.y));
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("textLength", String(row.width));
      text.setAttribute("lengthAdjust", "spacingAndGlyphs");
      text.setAttribute("class", "word-heart-line");
      text.setAttribute("style", `--row-delay:${rowIndex * 110}ms`);
      text.textContent = Array(10).fill(phrase).join("  ");
      group.appendChild(text);
    });
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
    wordHeartStage.classList.add("word-heart-scattering");

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealNestedHearts();
      return;
    }

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

    setTimeout(revealNestedHearts, 1750);
  }

  function revealNestedHearts() {
    wordHeartStage.classList.remove("word-heart-visible");
    wordHeartStage.classList.add("word-heart-hidden");
    nestedHeartStage.classList.add("nested-heart-visible");
    nestedHeartStage.setAttribute("aria-hidden", "false");
    $("finaleScene").classList.add("nested-phase");

    // The kitten's tail draws a tiny heart; its tip becomes a star in the constellation.
    setTimeout(() => $("finaleScene").classList.add("kitten-arrives"), 5550);
    setTimeout(() => $("finaleScene").classList.add("constellation-arrives"), 7900);
    setTimeout(() => $("finaleScene").classList.add("bow-arrives"), 1200);
  }

  wordHeartStage.addEventListener("click", scatterHeartIntoLight);
  wordHeartStage.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      scatterHeartIntoLight();
    }
  });

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