// Local decorative video; no storage, tracking, embedded player or third-party request.
(() => {
  'use strict';
  const hero = document.querySelector('[data-motion-hero]');
  const control = hero?.querySelector('[data-motion]');
  const video = hero?.querySelector('video');
  if (!hero || !control || !video) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  let wanted = true, visible = !('IntersectionObserver' in window);
  let failed = false, blocked = false, pending = false, revision = 0;
  const restricted = () => reduced.matches || connection?.saveData === true;
  const permitted = () => wanted && visible && !document.hidden && !restricted() && !failed && !blocked;
  const label = playing => {
    control.setAttribute('aria-pressed', String(playing));
    control.setAttribute('aria-label', (playing ? 'Pause' : 'Play') + ' background video');
    control.querySelector('span').textContent = playing ? 'Pause video' : 'Play video';
  };
  const pause = () => {
    revision += 1;
    pending = false;
    video.pause();
    label(false);
  };
  const sync = () => {
    control.hidden = restricted() || failed;
    if (!permitted()) { pause(); return; }
    if (pending || !video.paused) return;
    if (!video.getAttribute('src')) video.src = video.dataset.videoSrc;
    video.muted = true;
    const attempt = ++revision;
    pending = true;
    video.play().then(() => {
      if (attempt !== revision) return;
      pending = false;
      if (!permitted()) pause();
    }).catch(() => {
      if (attempt !== revision) return;
      // Autoplay denial is a still-image fallback, not a retry loop.
      pending = false;
      blocked = true;
      hero.classList.remove('video-ready');
      pause();
    });
  };
  video.addEventListener('playing', () => {
    if (!permitted()) { pause(); return; }
    hero.classList.add('video-ready');
    label(true);
  });
  video.addEventListener('pause', () => label(false));
  video.addEventListener('error', () => {
    failed = true;
    hero.classList.remove('video-ready');
    sync();
  });
  control.addEventListener('click', () => {
    if (restricted() || failed) return;
    if (blocked) { blocked = false; wanted = true; }
    else wanted = !(pending || !video.paused);
    sync();
  });
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', () => { wanted = false; pause(); });
  const preferenceChanged = () => {
    wanted = false;
    hero.classList.remove('video-ready');
    sync();
  };
  reduced.addEventListener('change', preferenceChanged);
  connection?.addEventListener?.('change', preferenceChanged);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      sync();
    });
    observer.observe(hero);
  }
  label(false);
  sync();
})();
