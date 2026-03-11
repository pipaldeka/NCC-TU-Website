document.addEventListener("DOMContentLoaded", function () {
  const faqs = document.querySelectorAll(".faq");

  faqs.forEach((faq) => {
    faq.querySelector(".faq-question").addEventListener("click", function () {
      const isActive = faq.classList.contains("active");

      // Close all
      faqs.forEach((f) => {
        f.classList.remove("active");
        const ans = f.querySelector(".faq-answer");
        if (ans) ans.style.maxHeight = "0";
        const icon = f.querySelector(".faq-icon");
        if (icon) icon.textContent = "+";
      });

      // Open clicked one
      if (!isActive) {
        faq.classList.add("active");
        const ans = faq.querySelector(".faq-answer");
        if (ans) ans.style.maxHeight = ans.scrollHeight + "px";
        const icon = faq.querySelector(".faq-icon");
        if (icon) icon.textContent = "+";
      }
    });
  });
});
