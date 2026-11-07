/* Local appearance preference only; no script-initiated network calls or identifiers. */
(() => {
  'use strict';
  const key = 'aptelum-studio-tech-appearance';
  const choices = new Set(['system', 'light', 'dark']);
  let choice = 'system';
  try {
    const saved = localStorage.getItem(key);
    if (choices.has(saved)) choice = saved;
  } catch (_) { /* Storage is optional; the current page still works. */ }
  document.documentElement.dataset.colorMode = choice;
  document.addEventListener('DOMContentLoaded', () => {
    const control = document.querySelector('.appearance');
    if (!control) return;
    const summary = control.querySelector('summary');
    const buttons = control.querySelectorAll('button[data-mode]');
    const render = () => {
      document.documentElement.dataset.colorMode = choice;
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === choice)));
      if (summary) {
        summary.setAttribute('aria-label', 'Appearance: ' + choice[0].toUpperCase() + choice.slice(1));
        summary.querySelectorAll('[data-mode-icon]').forEach(icon => { icon.hidden = icon.dataset.modeIcon !== choice; });
      }
    };
    buttons.forEach(button => button.addEventListener('click', () => {
      if (!choices.has(button.dataset.mode)) return;
      choice = button.dataset.mode;
      render();
      try {
        if (choice === 'system') localStorage.removeItem(key);
        else localStorage.setItem(key, choice);
      } catch (_) { /* A blocked store must not block changing appearance. */ }
      if (summary) { control.open = false; summary.focus(); }
    }));
    if (summary) {
      control.addEventListener('keydown', event => {
        if (event.key === 'Escape' && control.open) {
          control.open = false;
          summary.focus();
          event.preventDefault();
        }
      });
      document.addEventListener('click', event => {
        if (!control.contains(event.target)) control.open = false;
      });
      control.addEventListener('focusout', event => {
        if (!control.contains(event.relatedTarget)) control.open = false;
      });
    }
    render();
    control.hidden = false;
  });
})();
