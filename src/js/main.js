import { initActiveNavigation } from './modules/active-navigation.js?v=e45bca42';
import { initClipboard } from './modules/clipboard.js?v=e45bca42';
import { initMenu } from './modules/menu.js?v=e45bca42';
import { initOdometer } from './modules/odometer.js?v=e45bca42';
import { initParallax } from './modules/parallax.js?v=e45bca42';
import { initReadingProgress } from './modules/reading-progress.js?v=e45bca42';
import { initReveal } from './modules/reveal.js?v=e45bca42';
import { initTimeline } from './modules/timeline.js?v=e45bca42';
import { initTimelineDraw } from './modules/timeline-draw.js?v=e45bca42';
import { initVideoEmbed } from './modules/video-embed.js?v=e45bca42';

function initializeSite() {
  initMenu();
  initVideoEmbed();
  initReadingProgress();
  initTimeline();
  initClipboard();
  initActiveNavigation();
  // Движение: docs/MOTION.md
  initReveal();
  initOdometer();
  initParallax();
  initTimelineDraw();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSite, { once: true });
} else {
  initializeSite();
}
