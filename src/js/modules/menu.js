export function initMenu() {
  const menu = document.querySelector('[data-menu]');
  const menuButton = document.querySelector('[data-menu-button]');
  const menuLabel = menuButton?.querySelector('.sr-only');

  if (!menu || !menuButton) return;

  const setMenu = (open) => {
    menu.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    if (menuLabel) menuLabel.textContent = open ? 'Закрыть меню' : 'Открыть меню';
  };

  menuButton.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  document.addEventListener('click', (event) => {
    if (menu.classList.contains('is-open') && !event.target.closest('.site-header')) setMenu(false);
  });
}
