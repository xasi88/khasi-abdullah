// Появление блоков при прокрутке: docs/MOTION.md. Стили: src/styles/components/reveal.css
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Порядок важен: блок получает вид первой подходящей строки
const KINDS = [
  ['h2, .worldview-quote p', 'words'],
  ['.photo', 'photo'],
  ['.timeline > li', 'left'],
  ['.contact-seal', 'stamp'],
  ['.eyebrow, .lead, .prose > *, .card, .direction-grid > li, .clip, .disclosure, .clip-heading, .sub-heading, .sport-number, .now-date, .now-list > li, .now-goal, .contact-text, .contact-link, .button-row, .text-button, .fine-print', 'up']
];

const STAGGER = 90;
const WORD_STEP = 70;
const MOTTO_STEP = 220;

const isInView = (element) => {
  const rect = element.getBoundingClientRect();
  return (rect.width || rect.height) && rect.bottom > 0 && rect.top < window.innerHeight;
};

function splitWords(element, step) {
  let index = 0;
  const wrap = (content) => {
    const outer = document.createElement('span');
    const inner = document.createElement('span');
    outer.className = 'reveal-word';
    inner.style.setProperty('--word-delay', `${index * step}ms`);
    index += 1;
    inner.append(content);
    outer.append(inner);
    return outer;
  };

  [...element.childNodes].forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const parts = node.textContent.split(/(\s+)/).filter(Boolean);
      node.replaceWith(...parts.map((part) => (/^\s+$/.test(part) ? part : wrap(part))));
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
      const placeholder = document.createComment('');
      node.replaceWith(placeholder);
      placeholder.replaceWith(wrap(node));
    }
  });

  return index;
}

function finish(element) {
  element.removeAttribute('data-reveal');
  element.classList.remove('is-revealed');
  element.style.removeProperty('--reveal-delay');
  if (!element.getAttribute('style')) element.removeAttribute('style');
  if (!element.getAttribute('class')) element.removeAttribute('class');
}

export function initReveal() {
  if (reduceMotion.matches || !('IntersectionObserver' in window)) return;

  const words = new Map();
  const observer = new IntersectionObserver((entries) => {
    let order = 0;
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const delay = Math.min(order, 6) * STAGGER;
      order += 1;
      observer.unobserve(element);
      element.style.setProperty('--reveal-delay', `${delay}ms`);
      element.classList.add('is-revealed');
      setTimeout(() => finish(element), delay + 1800 + (words.get(element) || 0));
    });
  }, { rootMargin: '0px 0px -8% 0px' });

  const selector = KINDS.map(([targets]) => targets).join(', ');
  document.querySelectorAll(`main ${selector.replaceAll(', ', ', main ')}`).forEach((element) => {
    if (element.closest('.hero') || element.parentElement.closest('[data-reveal]') || isInView(element)) return;
    const [, kind] = KINDS.find(([targets]) => element.matches(targets));
    if (kind === 'words') {
      const step = element.closest('.worldview-quote') ? MOTTO_STEP : WORD_STEP;
      words.set(element, splitWords(element, step) * step);
    }
    element.dataset.reveal = kind;
    observer.observe(element);
  });
}
