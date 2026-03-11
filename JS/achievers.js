// achievers.js — filter tabs for Battalion Achievers page

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.af-tab');
  const sections = document.querySelectorAll('.achiever-section');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;

      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show/hide sections
      sections.forEach(section => {
        if (filter === 'all' || section.dataset.category === filter) {
          section.classList.remove('hidden');
        } else {
          section.classList.add('hidden');
        }
      });
    });
  });
});
