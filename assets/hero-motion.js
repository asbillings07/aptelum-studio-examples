// Optional still-image study. Static first paint; no storage, network or video claim.
(() => {
  'use strict';
  const hero = document.querySelector('[data-motion-hero]');
  const control = hero?.querySelector('[data-motion]');
  if (!hero || !control) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const stop = () => {
    hero.classList.remove('playing');
    control.setAttribute('aria-pressed', 'false');
    control.setAttribute('aria-label', 'Play still-image motion study');
  };
  control.hidden = reduced.matches;
  control.addEventListener('click', () => {
    if (reduced.matches || document.hidden) { stop(); return; }
    const playing = !hero.classList.contains('playing');
    hero.classList.toggle('playing', playing);
    control.setAttribute('aria-pressed', String(playing));
    control.setAttribute('aria-label', (playing ? 'Pause' : 'Play') + ' still-image motion study');
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  window.addEventListener('pagehide', stop);
  reduced.addEventListener('change', () => { stop(); control.hidden = reduced.matches; });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) stop();
    });
    observer.observe(hero);
  }
})();
