export function initTimeline() {
  const timeline = document.querySelector('[data-timeline]');
  const button = document.querySelector('[data-timeline-button]');
  if (!timeline || !button) return;

  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    timeline.classList.toggle('is-expanded', !expanded);
    button.innerHTML = expanded
      ? 'Показать все этапы <span aria-hidden="true">↓</span>'
      : 'Скрыть дополнительные этапы <span aria-hidden="true">↑</span>';
  });
}
