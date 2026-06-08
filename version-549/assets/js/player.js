(function () {
  function startPlayer(player) {
    var video = player.querySelector('video');
    var button = player.querySelector('.watch-cover');
    var streamUrl = player.getAttribute('data-video-url');

    if (!video || !streamUrl) {
      return;
    }

    function attachAndPlay() {
      player.classList.add('is-playing');

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        if (video.src !== streamUrl) {
          video.src = streamUrl;
        }
        video.play().catch(function () {});
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        if (!video._hlsInstance) {
          var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(streamUrl);
          hls.attachMedia(video);
          video._hlsInstance = hls;
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
        } else {
          video.play().catch(function () {});
        }
        return;
      }

      if (video.src !== streamUrl) {
        video.src = streamUrl;
      }
      video.play().catch(function () {});
    }

    if (button) {
      button.addEventListener('click', attachAndPlay);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        attachAndPlay();
      }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('.watch-player')).forEach(startPlayer);
})();
