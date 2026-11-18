(() => {
  'use strict';
  const rail = document.getElementById('photo-gallery');
  if (!rail?.classList.contains('apartment-interior-rail')) return;
  const controls = document.getElementById('interior-controls');
  const previous = document.getElementById('interior-previous');
  const next = document.getElementById('interior-next');
  const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const refresh = () => {
    const maximum = Math.max(0, rail.scrollWidth - rail.clientWidth);
    controls.hidden = maximum < 2;
    previous.disabled = rail.scrollLeft <= 2;
    next.disabled = rail.scrollLeft >= maximum - 2;
  };
  const move = direction => {
    const frames = rail.querySelectorAll('.interior-photo');
    const step = frames.length > 1 ? frames[1].offsetLeft - frames[0].offsetLeft : rail.clientWidth;
    rail.scrollBy({ left: direction * (step || rail.clientWidth * .85), behavior: reducedMotion() ? 'auto' : 'smooth' });
  };
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  rail.addEventListener('scroll', refresh, { passive: true });
  rail.addEventListener('keydown', event => {
    if (event.target !== rail) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      rail.scrollTo({ left: event.key === 'Home' ? 0 : rail.scrollWidth, behavior: reducedMotion() ? 'auto' : 'smooth' });
    }
  });
  window.addEventListener('resize', refresh);
  refresh();
})();
