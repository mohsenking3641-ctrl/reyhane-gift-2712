(() => {
  const digits = [];
  const dotEls = [...document.querySelectorAll("#dots span")];
  const enter = document.getElementById("enter");
  const feedback = document.getElementById("feedback");
  const render = () => {
    dotEls.forEach((el, i) => {
      el.textContent = digits[i] ? "●" : "";
      el.classList.toggle("filled", !!digits[i]);
    });
    enter.disabled = digits.length !== 4;
  };
  document.getElementById("keypad").addEventListener("click", e => {
    const b = e.target.closest("[data-num]");
    if (b && digits.length < 4) { digits.push(b.dataset.num); feedback.textContent = ""; render(); }
  });
  document.getElementById("erase").addEventListener("click", () => { digits.pop(); feedback.textContent = ""; render(); });
  async function unlock() {
    if (digits.length !== 4) return;
    enter.disabled = true;
    feedback.textContent = "دارم قفل کوچولو رو باز می‌کنم…";
    try {
      const r = await fetch("/api/unlock", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pin:digits.join("")})});
      const data = await r.json();
      if (data.ok) location.href = "/surprise";
      else { feedback.textContent = data.message || "رمز درست نیست."; digits.length = 0; render(); }
    } catch { feedback.textContent = "اتصال برقرار نشد؛ دوباره امتحان کن."; }
    enter.disabled = digits.length !== 4;
  }
  enter.addEventListener("click", unlock);
  document.addEventListener("keydown", e => {
    if (/^\d$/.test(e.key) && digits.length < 4) { digits.push(e.key); render(); }
    if (e.key === "Backspace") { digits.pop(); render(); }
    if (e.key === "Enter") unlock();
  });
})();