import { initActiveNavigation } from './modules/active-navigation.js';
import { initClipboard } from './modules/clipboard.js';
import { initMenu } from './modules/menu.js';
import { initOdometer } from './modules/odometer.js';
import { initParallax } from './modules/parallax.js';
import { initReadingProgress } from './modules/reading-progress.js';
import { initReveal } from './modules/reveal.js';
import { initTimeline } from './modules/timeline.js';
import { initTimelineDraw } from './modules/timeline-draw.js';
import { initVideoEmbed } from './modules/video-embed.js';

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
