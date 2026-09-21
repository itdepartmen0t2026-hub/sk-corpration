document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.product-item');
  const g = window.gsap;

  buttons.forEach(btn => btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    const shown = [];
    items.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('d-none', !match);
      if (match) shown.push(item);
    });

    if (g) {
      g.killTweensOf(shown);
      g.fromTo(shown,
        { opacity: 0, y: 26, scale: .96 },
        { opacity: 1, y: 0, scale: 1, duration: .55, ease: 'power3.out', stagger: .045, clearProps: 'transform' }
      );
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }
  }));
});
