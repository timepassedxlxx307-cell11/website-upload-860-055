function initVideoPlayer(videoUrl) {
    var video = document.getElementById('video-player');
    var button = document.querySelector('[data-player-button]');
    var hls = null;
    var ready = false;
    var requestedPlay = false;

    if (!video || !videoUrl) {
        return;
    }

    function hideButton() {
        if (button) {
            button.classList.add('is-hidden');
        }
    }

    function attach() {
        if (ready) {
            return;
        }

        ready = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });

            hls.loadSource(videoUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                if (requestedPlay) {
                    video.play().catch(function () {});
                }
            });

            hls.on(Hls.Events.ERROR, function (event, data) {
                if (!data || !data.fatal) {
                    return;
                }

                if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                    hls.startLoad();
                } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                    hls.recoverMediaError();
                } else {
                    hls.destroy();
                    hls = null;
                }
            });
        } else {
            video.src = videoUrl;
        }
    }

    function play() {
        requestedPlay = true;
        attach();
        hideButton();
        video.play().catch(function () {});
    }

    if (button) {
        button.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
        if (video.paused) {
            play();
        }
    });

    video.addEventListener('play', hideButton);
    video.addEventListener('loadedmetadata', function () {
        if (requestedPlay) {
            video.play().catch(function () {});
        }
    });

    window.addEventListener('beforeunload', function () {
        if (hls) {
            hls.destroy();
        }
    });
}
