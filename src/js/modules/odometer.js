// Цифры раздела «Цифры» крутятся барабаном и встают на место. Стили: src/styles/components/odometer.css
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const ROLL_TIME = 1600;
const STEP = 90;
const START = 200;

const isInView = (element) => {
  const rect = element.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight;
};

// Правая цифра делает лишний оборот, как у настоящего счётчика
function build(element, text) {
  let left = [...text].filter((char) => /\d/.test(char)).length;
  let column = 0;
  const visual = document.createElement('span');
  visual.setAttribute('aria-hidden', 'true');

  for (const char of text) {
    if (!/\d/.test(char)) {
      visual.append(char);
      continue;
    }
    left -= 1;
    const target = (left === 0 ? 20 : 10) + Number(char);
    const col = document.createElement('span');
    const sizer = document.createElement('span');
    const strip = document.createElement('span');
    col.className = 'odo-col';
    sizer.className = 'odo-sizer';
    strip.className = 'odo-strip';
    sizer.textContent = char;
    strip.textContent = Array.from({ length: target + 1 }, (_, index) => index % 10).join('\n');
    strip.dataset.target = target;
    strip.style.setProperty('--odo-delay', `${START + column * STEP}ms`);
    col.append(sizer, strip);
    visual.append(col);
    column += 1;
  }

  const label = document.createElement('span');
  label.className = 'sr-only';
  label.textContent = text;
  element.replaceChildren(label, visual);
  return column;
}

function roll(element, text, columns) {
  const strips = element.querySelectorAll('.odo-strip');
  element.getBoundingClientRect();
  strips.forEach((strip) => { strip.style.translate = `0 -${strip.dataset.target}em`; });
  setTimeout(() => { element.textContent = text; }, START + ROLL_TIME + columns * STEP + 100);
}

export function initOdometer() {
  if (reduceMotion.matches || !('IntersectionObserver' in window)) return;

  const columns = new Map();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const { text, count } = columns.get(entry.target);
      roll(entry.target, text, count);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.big-number').forEach((element) => {
    const text = element.textContent;
    if (!/\d/.test(text) || isInView(element)) return;
    columns.set(element, { text, count: build(element, text) });
    observer.observe(element);
  });
}
