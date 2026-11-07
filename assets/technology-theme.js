/* Local appearance preference only; no network, analytics or visitor identifiers. */
(() => {
  'use strict';
  const key = 'aptelum-studio-tech-appearance';
  const choices = new Set(['system', 'light', 'dark']);
  let choice = 'system';
  try {
    const saved = localStorage.getItem(key);
    if (choices.has(saved)) choice = saved;
  } catch (_) { /* A blocked preference store must not block the website. */ }
  document.documentElement.dataset.colorMode = choice;
  document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('color-mode');
    if (!select) return;
    select.value = choice;
    select.closest('.appearance').hidden = false;
    select.addEventListener('change', () => {
      if (!choices.has(select.value)) return;
      document.documentElement.dataset.colorMode = select.value;
      try {
        if (select.value === 'system') localStorage.removeItem(key);
        else localStorage.setItem(key, select.value);
      } catch (_) { /* The selected theme still works for this page. */ }
    });
  });
})();
