export function initActiveNavigation() {
  if (!('IntersectionObserver' in window)) return;

  const sections = [...document.querySelectorAll('.site-nav a[href^="#"]')]
    .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
    .filter(({ section }) => section);

  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    sections.forEach(({ link, section }) => {
      if (section === visible.target) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-20% 0px -65% 0px', threshold: [0.05, 0.3, 0.6] });

  sections.forEach(({ section }) => observer.observe(section));
}
