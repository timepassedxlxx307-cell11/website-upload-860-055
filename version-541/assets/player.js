function initializePlayer(videoUrl, posterUrl) {
  var video = document.getElementById("movie-video");
  var shell = document.getElementById("movie-player");
  var button = document.getElementById("movie-play");
  var message = document.getElementById("movie-message");
  var hlsInstance = null;

  if (!video || !shell || !button) {
    return;
  }

  if (posterUrl) {
    video.setAttribute("poster", posterUrl);
  }

  function showMessage(text) {
    if (!message) {
      return;
    }
    message.textContent = text;
    message.hidden = !text;
  }

  function bindVideo() {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(videoUrl);
      hlsInstance.attachMedia(video);
      hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
        if (!data || !data.fatal) {
          return;
        }
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
          hlsInstance.startLoad();
          return;
        }
        if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          hlsInstance.recoverMediaError();
          return;
        }
        showMessage("播放暂时不可用");
        hlsInstance.destroy();
      });
      return;
    }

    showMessage("播放暂时不可用");
  }

  function playVideo() {
    var playPromise = video.play();
    shell.classList.add("playing");
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {
        shell.classList.remove("playing");
      });
    }
  }

  button.addEventListener("click", playVideo);
  video.addEventListener("click", function () {
    if (video.paused) {
      playVideo();
    } else {
      video.pause();
    }
  });
  video.addEventListener("play", function () {
    shell.classList.add("playing");
  });
  video.addEventListener("pause", function () {
    shell.classList.remove("playing");
  });
  window.addEventListener("pagehide", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });

  bindVideo();
}
