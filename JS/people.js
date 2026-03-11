document.addEventListener("DOMContentLoaded", function () {
  const isTouchDevice = () => window.matchMedia("(max-width: 640px)").matches;

  // Create a single shared overlay
  const overlay = document.createElement("div");
  overlay.className = "pc-overlay";
  document.body.appendChild(overlay);

  const allWraps = document.querySelectorAll(".pc-wrap");

  function closeAll() {
    allWraps.forEach(w => w.classList.remove("active"));
    overlay.classList.remove("active");
  }

  allWraps.forEach(wrap => {
    // Mobile: tap front card to open popup
    const front = wrap.querySelector(".pc-front");
    if (front) {
      front.addEventListener("click", function (e) {
        if (!isTouchDevice()) return;
        e.stopPropagation();
        const isAlreadyOpen = wrap.classList.contains("active");
        closeAll();
        if (!isAlreadyOpen) {
          wrap.classList.add("active");
          overlay.classList.add("active");
        }
      });
    }

    // Desktop: check if popup would overflow top of viewport and flip it
    wrap.addEventListener("mouseenter", function () {
      if (isTouchDevice()) return;
      const rect = wrap.getBoundingClientRect();
      const popupH = 280; // approx popup height
      if (rect.top < popupH + 20) {
        wrap.classList.add("flip-down");
      } else {
        wrap.classList.remove("flip-down");
      }
    });
  });

  // Close on overlay click
  overlay.addEventListener("click", closeAll);

  // Close on Escape
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeAll();
  });
});
