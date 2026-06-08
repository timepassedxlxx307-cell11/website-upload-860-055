(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var video = document.getElementById('video-player');
    var overlay = document.getElementById('play-overlay');
    if (!video || !overlay) {
      return;
    }
    var source = video.getAttribute('data-play-src');
    var hls = null;
    var initialized = false;

    function bindSource() {
      if (initialized) {
        return;
      }
      initialized = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        return;
      }
      video.src = source;
    }

    function start() {
      bindSource();
      overlay.classList.add('is-hidden');
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }

    overlay.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
    video.addEventListener('play', function () {
      overlay.classList.add('is-hidden');
    });
    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  });
})();
