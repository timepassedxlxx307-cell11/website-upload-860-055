import { H as StreamEngine } from "./hls.js";

function playVideo(player) {
  var video = player.querySelector("video");
  var cover = player.querySelector(".player-cover");
  var streamUrl = player.getAttribute("data-stream-url");
  if (!video || !streamUrl) {
    return;
  }

  function startPlayback() {
    var promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {});
    }
  }

  if (cover) {
    cover.classList.add("is-hidden");
  }
  video.controls = true;

  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    if (video.src !== streamUrl) {
      video.src = streamUrl;
    }
    startPlayback();
    return;
  }

  if (StreamEngine && StreamEngine.isSupported()) {
    if (!player.engine) {
      var engine = new StreamEngine({ enableWorker: true });
      engine.loadSource(streamUrl);
      engine.attachMedia(video);
      engine.on(StreamEngine.Events.MANIFEST_PARSED, startPlayback);
      player.engine = engine;
    } else {
      startPlayback();
    }
    return;
  }

  if (video.src !== streamUrl) {
    video.src = streamUrl;
  }
  startPlayback();
}

function bindPlayers() {
  Array.prototype.slice.call(document.querySelectorAll(".player-shell")).forEach(function (player) {
    var cover = player.querySelector(".player-cover");
    var video = player.querySelector("video");
    if (cover) {
      cover.addEventListener("click", function () {
        playVideo(player);
      });
    }
    if (video) {
      video.addEventListener("click", function () {
        if (video.paused) {
          playVideo(player);
        }
      });
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bindPlayers);
} else {
  bindPlayers();
}
