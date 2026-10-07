export function initVideoEmbed() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-video-id]');
    if (!button) return;

    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(button.dataset.videoId)}?autoplay=1&rel=0`;
    frame.title = button.dataset.videoTitle || 'Видео';
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';

    button.replaceWith(frame);
    frame.focus();
  });
}
