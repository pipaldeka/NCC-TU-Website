document.addEventListener("DOMContentLoaded", function () {
  // ── MOBILE MENU ──
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      menuToggle.innerHTML = navMenu.classList.contains("open") ? "✕" : "&#9776;";
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove("open");
        menuToggle.innerHTML = "&#9776;";
      }
    });
  }

  // ── STICKY HEADER ──
  const header = document.getElementById("site-header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 50);
    });
  }

  // ── FADE-IN ON SCROLL ──
  const fadeEls = document.querySelectorAll(".fade-in");
  if (fadeEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, i * 80);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    fadeEls.forEach((el) => observer.observe(el));
  }

  // ── CONTACT FORM ──
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      let name = document.getElementById("name")?.value.trim();
      let email = document.getElementById("email")?.value.trim();
      let message = document.getElementById("message")?.value.trim();

      if (!name || !email || !message) {
        alert("Please fill in all fields.");
      } else {
        alert("Thank you for contacting us! We'll get back to you soon.");
        form.reset();
      }
    });
  }
});
