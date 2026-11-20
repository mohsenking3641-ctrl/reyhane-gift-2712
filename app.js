(() => {
  const $ = id => document.getElementById(id);
  const screens = [...document.querySelectorAll(".screen")];
  function show(id) {
    screens.forEach(s => s.classList.toggle("active", s.id === id));
    window.scrollTo({top:0,behavior:"smooth"});
    sprinklePaws(id);
  }

  // Tiny paw prints briefly decorate the edges during every stage transition.
  // They never cover buttons or the letter text and clean themselves up.
  function sprinklePaws(screenId) {
    const positions = {
      welcome: [[7, 25], [88, 68]],
      story: [[9, 20], [86, 73]],
      gift: [[8, 28], [89, 70]],
      letter: [[4, 18], [94, 78]],
      question: [[7, 22], [90, 72]],
      ending: [[8, 20], [88, 72]]
    };
    (positions[screenId] || []).forEach(([left, top], index) => {
      setTimeout(() => {
        const paw = document.createElement("span");
        paw.className = "paw";
        paw.textContent = "🐾";
        paw.style.left = left + "%";
        paw.style.top = top + "%";
        paw.style.fontSize = (16 + index * 2) + "px";
        document.body.appendChild(paw);
        setTimeout(() => paw.remove(), 7200);
      }, index * 420);
    });
  }
  const story = [
    ["یه چیزایی هست…","که دلم می‌خواد خودت از زبونم بشنوی."],
    ["مثلاً اینکه…","بودنت چقدر می‌تونه یه روز معمولی رو قشنگ کنه."],
    ["و اینکه…","برای گفتن یه حرف خیلی مهم، کلی ذوق دارم."]
  ];
  let storyIndex = 0;
  $("begin").addEventListener("click", () => { startMusic(); storyIndex=0; updateStory(); show("story"); });
  function updateStory(){
    $("storyTitle").textContent=story[storyIndex][0];
    $("storyLine").textContent=story[storyIndex][1];
    $("progress").style.width=((storyIndex+1)/story.length*100)+"%";
    $("nextStory").textContent=storyIndex===story.length-1?"یه سورپرایز دارم ♡":"بعدی ♡";
  }
  $("nextStory").addEventListener("click",()=>{
    if(storyIndex<story.length-1){storyIndex++;updateStory();}
    else show("gift");
  });
  $("openGift").addEventListener("click",()=>{
    $("openGift").classList.add("open");
    $("giftHint").textContent="یه عالمه عشق توشه… 💗";
    setTimeout(()=>show("letter"),950);
  });
  $("showQuestion").addEventListener("click",()=>show("question"));
  document.querySelectorAll(".answer").forEach(btn=>btn.addEventListener("click",()=>{
    show("ending"); startFinale(); burstHearts(); startMusic();
  }));

  const layer=$("floatLayer");
  const symbols=["♡","♥","✧","✦"];
  function floatOne(){
    const el=document.createElement("span");el.className="floaty";
    el.textContent=symbols[Math.floor(Math.random()*symbols.length)];
    el.style.left=Math.random()*100+"%";
    el.style.fontSize=(13+Math.random()*15)+"px";
    el.style.animationDuration=(8+Math.random()*7)+"s";
    layer.appendChild(el);setTimeout(()=>el.remove(),16000);
  }
  setInterval(floatOne,1450); for(let i=0;i<5;i++)setTimeout(floatOne,i*260);
  function burstHearts(){
    const layer = $("heartParticleLayer");
    if (!layer || layer.dataset.started === "yes") return;
    layer.dataset.started = "yes";
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const count = 52;
    const heartBox = layer.parentElement.getBoundingClientRect();
    const centerX = heartBox.left + heartBox.width * 0.5;
    const centerY = heartBox.top + heartBox.height * 0.49;
    const curveScale = Math.min(9.4, heartBox.width / 42);
    for (let i = 0; i < count; i++) {
      const t = (Math.PI * 2 * i) / count;
      // Classic parametric heart curve: particles converge into a recognizable silhouette.
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
      const targetX = hx * curveScale;
      const targetY = -hy * curveScale;
      const edge = i % 4;
      const fromX = edge === 0 ? -centerX - 40 : edge === 1 ? window.innerWidth - centerX + 40 : (Math.random() - .5) * window.innerWidth;
      const fromY = edge === 2 ? -centerY - 40 : edge === 3 ? window.innerHeight - centerY + 40 : (Math.random() - .5) * window.innerHeight;
      const el = document.createElement("span");
      el.className = "gloss-particle";
      el.style.left = "50%";
      el.style.top = "47%";
      layer.appendChild(el);
      const delay = i * 22;
      el.animate([
        { transform: `translate(${fromX}px,${fromY}px) rotate(${(Math.random()*100)-50}deg) scale(.35)`, opacity: 0 },
        { transform: `translate(${fromX*.42}px,${fromY*.42}px) rotate(35deg) scale(.8)`, opacity: 1, offset: .55 },
        { transform: `translate(${targetX}px,${targetY}px) rotate(0deg) scale(1)`, opacity: 1, offset: .82 },
        { transform: `translate(${targetX}px,${targetY}px) rotate(0deg) scale(.2)`, opacity: 0 }
      ], { duration: 2850, delay, easing: "cubic-bezier(.18,.72,.24,1)", fill: "forwards" });
      setTimeout(() => el.remove(), delay + 3000);
    }
    // Fade the assembled heart away smoothly, then clear all particle nodes.
    setTimeout(() => {
      layer.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 700, easing: "ease-out", fill: "forwards"
      });
    }, 2550);
    setTimeout(() => {
      layer.replaceChildren();
      layer.style.opacity = "";
    }, 3400);
  }

  function startFinale(){
    const ending = $("ending");
    ending.classList.add("finale-active");
    // A few translucent bubbles drift upward behind the content.
    for(let i=0;i<13;i++) setTimeout(()=>{
      const b=document.createElement("i"); b.className="bubble";
      const size=10+Math.random()*24;
      b.style.width=size+"px"; b.style.height=size+"px";
      b.style.left=(4+Math.random()*92)+"%";
      b.style.animationDuration=(6+Math.random()*5)+"s";
      document.body.appendChild(b); setTimeout(()=>b.remove(),12000);
    },i*170);
  }

  const audio = $("backgroundMusic");
  let musicOn = false;
  async function startMusic(){
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
  function stopMusic(){
    if (!audio) return;
    audio.pause();
    musicOn = false;
    $("sound").classList.remove("on");
    $("musicToggle").textContent = "♫ پخش موسیقی";
  }

  $("sound").addEventListener("click",()=>musicOn?stopMusic():startMusic());
  $("musicToggle").addEventListener("click",()=>musicOn?stopMusic():startMusic());
})();