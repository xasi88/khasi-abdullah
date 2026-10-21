// Глубина: светящиеся точки, лучи и портрет сдвигаются при прокрутке с разной скоростью.
// На компьютере первый экран ещё следует за мышью. docs/MOTION.md
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const SCROLL_SHIFT = 40;
const POINTER_SHIFT = 14;

// Глубина больше нуля: слой ближе текста и обгоняет его. Меньше нуля: слой дальше и отстаёт
function collectLayers() {
  return [...document.querySelectorAll('main .section')].map((section) => {
    const items = [...section.querySelectorAll('.decor .dot')].map((dot) => ({
      element: dot,
      depth: (parseFloat(dot.style.getPropertyValue('--d')) || 8) / 8
    }));
    if (section.classList.contains('hero')) {
      const rays = section.querySelector('.decor-rays');
      const photo = section.querySelector('.hero-photo');
      if (rays) items.push({ element: rays, depth: -0.4 });
      if (photo) items.push({ element: photo, depth: -0.5 });
    }
    return { section, items, visible: false, hero: section.classList.contains('hero') };
  }).filter((layer) => layer.items.length);
}

export function initParallax() {
  if (reduceMotion.matches || !('IntersectionObserver' in window)) return;

  const layers = collectLayers();
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let frame = 0;

  const update = () => {
    frame = 0;
    pointer.x += (pointer.targetX - pointer.x) * 0.08;
    pointer.y += (pointer.targetY - pointer.y) * 0.08;
    const viewport = window.innerHeight;
    const visible = layers.filter((layer) => layer.visible);
    const progress = visible.map(({ section }) => {
      const rect = section.getBoundingClientRect();
      // Предел: пока наблюдатель не заметил уход раздела, сдвиг не улетает
      return Math.max(-1.5, Math.min(1.5, (rect.top + rect.height / 2 - viewport / 2) / viewport));
    });

    visible.forEach((layer, index) => {
      const px = layer.hero ? pointer.x : 0;
      const py = layer.hero ? pointer.y : 0;
      layer.items.forEach(({ element, depth }) => {
        const x = px * POINTER_SHIFT * depth;
        const y = (progress[index] * SCROLL_SHIFT + py * POINTER_SHIFT) * depth;
        element.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
      });
    });

    const moving = Math.abs(pointer.targetX - pointer.x) + Math.abs(pointer.targetY - pointer.y) > 0.002;
    if (moving) schedule();
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const layer = layers.find((item) => item.section === entry.target);
      layer.visible = entry.isIntersecting;
      if (layer.hero) layer.section.classList.toggle('is-offscreen', !entry.isIntersecting);
    });
    schedule();
  }, { rootMargin: '10% 0px' });

  layers.forEach((layer) => observer.observe(layer.section));
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);

  if (finePointer.matches) {
    window.addEventListener('pointermove', (event) => {
      pointer.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.targetY = (event.clientY / window.innerHeight) * 2 - 1;
      schedule();
    }, { passive: true });
  }
}
