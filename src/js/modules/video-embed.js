const SLOW_AFTER_MS = 8000;

export function initVideoEmbed() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-video-id]');
    if (!button) return;

    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(button.dataset.videoId)}?autoplay=1&rel=0`;
    frame.title = button.dataset.videoTitle || 'Видео';
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';

    // Плеер не ответил за 8 секунд — блок из content/network-notice.html объяснит посетителю, что делать.
    const slowTimer = setTimeout(() => {
      const detail = { kind: 'video', text: 'Видео загружается дольше обычного.' };
      document.dispatchEvent(new CustomEvent('network-slow', { detail }));
    }, SLOW_AFTER_MS);
    frame.addEventListener('load', () => clearTimeout(slowTimer), { once: true });

    button.replaceWith(frame);
    frame.focus();
  });
}
