document.addEventListener("DOMContentLoaded", function () {
  const track = document.querySelector(".carousel");
  if (!track) return;

  const container = document.querySelector(".carousel-container");
  const prevBtn   = document.getElementById("prev");
  const nextBtn   = document.getElementById("next");
  const dotsWrap  = document.getElementById("carousel-dots");

  // ── collect original items ──────────────────────────────────────
  const origItems  = Array.from(track.querySelectorAll(".carousel-item"));
  const total      = origItems.length;
  if (total === 0) return;

  function getVisible() {
    return window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  }

  // ── build infinite clone ring ───────────────────────────────────
  // Prepend (total) clones + Append (total) clones so we always have
  // room to slide in both directions before the silent jump.
  function buildTrack() {
    // clear previous clones
    track.querySelectorAll(".carousel-clone").forEach(el => el.remove());

    const vis   = getVisible();
    const cloneCount = Math.max(total, vis * 2);   // enough clones

    // prepend clones (in reverse so order is maintained)
    for (let i = cloneCount - 1; i >= 0; i--) {
      const clone = origItems[i % total].cloneNode(true);
      clone.classList.add("carousel-clone");
      track.prepend(clone);
    }
    // append clones
    for (let i = 0; i < cloneCount; i++) {
      const clone = origItems[i % total].cloneNode(true);
      clone.classList.add("carousel-clone");
      track.appendChild(clone);
    }
    return cloneCount;
  }

  // ── state ────────────────────────────────────────────────────────
  let vis        = getVisible();
  let cloneCount = buildTrack();
  let pos        = cloneCount;          // index of first *real* item
  let isAnimating = false;
  let autoTimer;

  // ── item width helper ────────────────────────────────────────────
  function itemWidth() {
    const allItems = track.querySelectorAll(".carousel-item, .carousel-clone");
    if (!allItems.length) return 0;
    return allItems[0].getBoundingClientRect().width;
  }

  // ── jump without animation (for wrapping) ───────────────────────
  function jumpTo(idx) {
    track.style.transition = "none";
    pos = idx;
    track.style.transform = `translateX(-${pos * itemWidth()}px)`;
    // force reflow
    track.getBoundingClientRect();
  }

  // ── animated slide ───────────────────────────────────────────────
  function slideTo(idx, animate = true) {
    if (animate) {
      track.style.transition = "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)";
    }
    pos = idx;
    track.style.transform = `translateX(-${pos * itemWidth()}px)`;
  }

  // ── initial position (no animation) ─────────────────────────────
  function init() {
    vis        = getVisible();
    cloneCount = buildTrack();
    pos        = cloneCount;             // first real item
    track.style.transition = "none";
    track.style.transform  = `translateX(-${pos * itemWidth()}px)`;
    updateDots();
  }

  // ── real index (0-based within origItems) ───────────────────────
  function realIndex() {
    return ((pos - cloneCount) % total + total) % total;
  }

  // ── dots ─────────────────────────────────────────────────────────
  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";
    for (let i = 0; i < total; i++) {
      const dot = document.createElement("button");
      dot.className = "carousel-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.addEventListener("click", () => {
        if (isAnimating) return;
        const target = cloneCount + i;
        slideTo(target);
        resetAuto();
      });
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsWrap) return;
    const ri = realIndex();
    dotsWrap.querySelectorAll(".carousel-dot").forEach((d, i) => {
      d.classList.toggle("active", i === ri);
    });
  }

  // ── move ─────────────────────────────────────────────────────────
  function move(step) {
    if (isAnimating) return;
    isAnimating = true;
    slideTo(pos + step);
  }

  // ── after transition: silent wrap ────────────────────────────────
  track.addEventListener("transitionend", () => {
    const allCount = track.querySelectorAll(".carousel-item, .carousel-clone").length;

    if (pos >= allCount - cloneCount) {
      // slid too far right → jump back to real start
      jumpTo(cloneCount + (realIndex()));
    } else if (pos < cloneCount) {
      // slid too far left → jump forward to real end
      jumpTo(cloneCount + (realIndex() + total) % total);
    }

    updateDots();
    isAnimating = false;
  });

  // ── auto-play ────────────────────────────────────────────────────
  function startAuto() {
    autoTimer = setInterval(() => move(1), 3500);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  // ── resize ───────────────────────────────────────────────────────
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const oldReal = realIndex();
      init();
      // restore position at same real index
      pos = cloneCount + oldReal;
      track.style.transform = `translateX(-${pos * itemWidth()}px)`;
      buildDots();
      updateDots();
    }, 150);
  });

  // ── buttons ──────────────────────────────────────────────────────
  if (prevBtn) prevBtn.addEventListener("click", () => { move(-1); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener("click", () => { move(1);  resetAuto(); });

  // ── touch / swipe ────────────────────────────────────────────────
  let touchStartX = 0;
  container.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  container.addEventListener("touchend", e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      move(diff > 0 ? 1 : -1);
      resetAuto();
    }
  });

  // ── keyboard ─────────────────────────────────────────────────────
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft")  { move(-1); resetAuto(); }
    if (e.key === "ArrowRight") { move(1);  resetAuto(); }
  });

  // ── boot ─────────────────────────────────────────────────────────
  init();
  buildDots();
  startAuto();
});
