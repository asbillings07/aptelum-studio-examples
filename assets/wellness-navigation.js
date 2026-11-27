// Native details remain usable without JavaScript. No requests or saved state.
(() => {
  const menus = [...document.querySelectorAll('.forma .menu, .morrow .menu, .vale-story .mobile-menu')];
  for (const menu of menus) {
    const trigger = menu.querySelector('summary');
    const close = (restoreFocus = false) => {
      if (!menu.open) return;
      menu.open = false;
      if (restoreFocus) trigger.focus();
    };
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.open) {
        event.preventDefault();
        close(menu.contains(document.activeElement));
      }
    });
    document.addEventListener('click', event => {
      if (!menu.contains(event.target)) close();
    });
    menu.addEventListener('focusout', event => {
      if (event.relatedTarget && !menu.contains(event.relatedTarget)) close();
    });
    const wide = matchMedia('(min-width: 1081px)');
    wide.addEventListener('change', event => {
      if (event.matches) close();
    });
  }
})();
