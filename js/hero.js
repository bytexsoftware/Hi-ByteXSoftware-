/**
 * hero.js
 * HLS video background for ByteXSoftware.
 *
 * Strategy:
 *  - Always attempt to load unless the browser has zero HLS API support.
 *  - Hardware / mobile width gates removed: a looping muted video is light
 *    on any modern device; the error handler + 8s timeout cover real failures.
 *  - enableWorker: false keeps hls.js stable in file:// and CSP contexts.
 */

(function () {
  'use strict';

  const VIDEO_SRC = 'https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8';

  const videoBg  = document.getElementById('hero-video-bg');
  const videoEl  = document.getElementById('hero-video');
  const fallback = document.getElementById('hero-video-fallback');

  function showFallback() {
    if (videoBg)  videoBg.style.display  = 'none';
    if (fallback) fallback.style.display = 'block';
  }

  function initVideo() {
    if (!videoEl) return;

    videoEl.muted      = true;
    videoEl.autoplay   = true;
    videoEl.loop       = true;
    videoEl.playsInline = true;

    // 8s safety net — gradient orbs show if stream never delivers frames
    const timer = setTimeout(showFallback, 8000);
    const done  = () => clearTimeout(timer);
    videoEl.addEventListener('canplay', done, { once: true });
    videoEl.addEventListener('playing', done, { once: true });

    // ── Safari / iOS — native HLS ──────────────────────────────────────────
    if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.src = VIDEO_SRC;
      videoEl.load();
      videoEl.play().catch(showFallback);
      return;
    }

    // ── Chrome / Firefox / Edge — hls.js ──────────────────────────────────
    if (typeof Hls !== 'undefined' && Hls.isSupported()) {
      const hls = new Hls({ enableWorker: false, startLevel: -1 });
      hls.loadSource(VIDEO_SRC);
      hls.attachMedia(videoEl);
      hls.on(Hls.Events.MANIFEST_PARSED, () => videoEl.play().catch(showFallback));
      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (data.fatal) { clearTimeout(timer); showFallback(); hls.destroy(); }
      });
      return;
    }

    // ── No HLS API available ───────────────────────────────────────────────
    clearTimeout(timer);
    showFallback();
  }

  // Run immediately — no mobile/hardware gate (video is lightweight)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVideo);
  } else {
    initVideo();
  }

})();
