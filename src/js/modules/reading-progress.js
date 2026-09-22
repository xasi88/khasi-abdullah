export function initReadingProgress() {
  const progress = document.querySelector('.reading-progress span');
  if (!progress) return;

  const updateProgress = () => {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = available > 0 ? Math.min(window.scrollY / available, 1) : 0;
    progress.style.width = `${ratio * 100}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
}
