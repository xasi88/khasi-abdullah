// Хронология: линия растёт вслед за прокруткой, точка года загорается, когда линия до неё дошла.
// Стили: src/styles/sections/timeline-motion.css
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const MARK = 0.7; // линия дотягивается до 70 % высоты экрана
const DOT_CENTER = 14; // центр точки от верха пункта, timeline.css

export function initTimelineDraw() {
  const timeline = document.querySelector('[data-timeline]');
  if (!timeline || reduceMotion.matches) return;

  const items = [...timeline.children];
  let frame = 0;

  const update = () => {
    frame = 0;
    const mark = window.innerHeight * MARK;
    const rect = timeline.getBoundingClientRect();
    const progress = rect.height ? Math.min(Math.max((mark - rect.top) / rect.height, 0), 1) : 0;
    const tops = items.map((item) => (item.offsetHeight ? item.getBoundingClientRect().top : Infinity));
    timeline.style.setProperty('--line', progress.toFixed(4));
    items.forEach((item, index) => item.classList.toggle('is-lit', tops[index] + DOT_CENTER <= mark));
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  timeline.classList.add('is-drawing');
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  document.querySelector('[data-timeline-button]')?.addEventListener('click', schedule);
  update();
}
