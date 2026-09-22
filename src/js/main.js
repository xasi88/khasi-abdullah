import { initActiveNavigation } from './modules/active-navigation.js';
import { initClipboard } from './modules/clipboard.js';
import { initMenu } from './modules/menu.js';
import { initReadingProgress } from './modules/reading-progress.js';
import { initTimeline } from './modules/timeline.js';
import { initVideoEmbed } from './modules/video-embed.js';

function initializeSite() {
  initMenu();
  initVideoEmbed();
  initReadingProgress();
  initTimeline();
  initClipboard();
  initActiveNavigation();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSite, { once: true });
} else {
  initializeSite();
}
