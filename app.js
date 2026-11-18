(() => {
  const $ = id => document.getElementById(id);
  const screens = [...document.querySelectorAll(".screen")];
  function show(id) {
    screens.forEach(s => s.classList.toggle("active", s.id === id));
    window.scrollTo({top:0,behavior:"smooth"});
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
    show("ending"); burstHearts(); startMusic();
  }));

  const layer=$("floatLayer");
  const symbols=["♡","✦","♥","✧"];
  function floatOne(){
    const el=document.createElement("span");el.className="floaty";
    el.textContent=symbols[Math.floor(Math.random()*symbols.length)];
    el.style.left=Math.random()*100+"%";
    el.style.fontSize=(13+Math.random()*15)+"px";
    el.style.animationDuration=(8+Math.random()*7)+"s";
    layer.appendChild(el);setTimeout(()=>el.remove(),16000);
  }
  setInterval(floatOne,950); for(let i=0;i<8;i++)setTimeout(floatOne,i*180);
  function burstHearts(){
    for(let i=0;i<32;i++)setTimeout(()=>{
      const el=document.createElement("span");el.className="floaty";el.textContent=["💗","💖","✨","♡"][i%4];
      el.style.left=(8+Math.random()*84)+"%";el.style.fontSize=(18+Math.random()*17)+"px";el.style.animationDuration=(3+Math.random()*3)+"s";layer.appendChild(el);setTimeout(()=>el.remove(),7000);
    },i*65);
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