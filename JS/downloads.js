document.addEventListener("DOMContentLoaded", function () {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const sections = document.querySelectorAll(".dl-section");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      // Update active btn
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Show/hide sections
      sections.forEach((section) => {
        const category = section.dataset.category;
        if (filter === "all" || filter === category) {
          section.style.display = "";
          section.style.opacity = "0";
          section.style.transform = "translateY(16px)";
          requestAnimationFrame(() => {
            section.style.transition = "opacity 0.4s ease, transform 0.4s ease";
            section.style.opacity = "1";
            section.style.transform = "translateY(0)";
          });
        } else {
          section.style.display = "none";
        }
      });
    });
  });
});
