(function () {
    window.initMoviePlayer = function (streamUrl) {
        var player = document.querySelector("[data-player]");
        if (!player) {
            return;
        }

        var video = player.querySelector("video");
        var overlay = player.querySelector("[data-player-overlay]");
        var trigger = player.querySelector("[data-player-trigger]");
        var ready = false;
        var hls = null;

        function attachStream() {
            if (ready || !video) {
                return;
            }
            ready = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
        }

        function startPlayback() {
            attachStream();
            player.classList.add("is-playing");
            video.controls = true;
            var attempt = video.play();
            if (attempt && typeof attempt.catch === "function") {
                attempt.catch(function () {
                    video.controls = true;
                });
            }
        }

        if (trigger) {
            trigger.addEventListener("click", startPlayback);
        }
        if (overlay) {
            overlay.addEventListener("click", startPlayback);
        }
        if (video) {
            video.addEventListener("click", function () {
                if (video.paused) {
                    startPlayback();
                }
            });
            video.addEventListener("ended", function () {
                player.classList.remove("is-playing");
            });
        }
        window.addEventListener("pagehide", function () {
            if (hls) {
                hls.destroy();
            }
        });
    };
})();
