import { initActiveNavigation } from './modules/active-navigation.js?v=55d0e841';
import { initClipboard } from './modules/clipboard.js?v=55d0e841';
import { initMenu } from './modules/menu.js?v=55d0e841';
import { initOdometer } from './modules/odometer.js?v=55d0e841';
import { initParallax } from './modules/parallax.js?v=55d0e841';
import { initReadingProgress } from './modules/reading-progress.js?v=55d0e841';
import { initReveal } from './modules/reveal.js?v=55d0e841';
import { initTimeline } from './modules/timeline.js?v=55d0e841';
import { initTimelineDraw } from './modules/timeline-draw.js?v=55d0e841';
import { initVideoEmbed } from './modules/video-embed.js?v=55d0e841';

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
