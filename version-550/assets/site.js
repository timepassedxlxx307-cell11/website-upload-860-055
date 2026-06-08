(function () {
    function onReady(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    onReady(function () {
        var menuButton = document.querySelector(".mobile-menu-button");
        var mobileNav = document.querySelector(".mobile-nav");
        if (menuButton && mobileNav) {
            menuButton.addEventListener("click", function () {
                mobileNav.classList.toggle("open");
            });
        }

        var hero = document.querySelector("[data-hero]");
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
            var index = 0;
            var show = function (next) {
                index = (next + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle("active", i === index);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle("active", i === index);
                });
            };
            dots.forEach(function (dot, i) {
                dot.addEventListener("click", function () {
                    show(i);
                });
            });
            if (slides.length > 1) {
                setInterval(function () {
                    show(index + 1);
                }, 5200);
            }
        }

        var grids = Array.prototype.slice.call(document.querySelectorAll("[data-filterable]"));
        grids.forEach(function (grid) {
            var section = grid.closest("section") || document;
            var input = section.querySelector(".filter-input");
            var sorter = section.querySelector(".sort-select");
            var empty = section.querySelector(".empty-state");
            var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-card]"));
            var applyFilter = function () {
                var keyword = input ? input.value.trim().toLowerCase() : "";
                var visible = 0;
                cards.forEach(function (card) {
                    var haystack = [
                        card.getAttribute("data-title"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-type"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-tags"),
                        card.getAttribute("data-year")
                    ].join(" ").toLowerCase();
                    var match = !keyword || haystack.indexOf(keyword) !== -1;
                    card.style.display = match ? "" : "none";
                    if (match) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle("show", visible === 0);
                }
            };
            var applySort = function () {
                if (!sorter) {
                    return;
                }
                var mode = sorter.value;
                var ordered = cards.slice();
                if (mode === "year-desc") {
                    ordered.sort(function (a, b) {
                        return Number(b.getAttribute("data-year")) - Number(a.getAttribute("data-year"));
                    });
                }
                if (mode === "title-asc") {
                    ordered.sort(function (a, b) {
                        return String(a.getAttribute("data-title")).localeCompare(String(b.getAttribute("data-title")), "zh-Hans-CN");
                    });
                }
                ordered.forEach(function (card) {
                    grid.appendChild(card);
                });
            };
            if (input) {
                var params = new URLSearchParams(window.location.search);
                var q = params.get("q");
                if (q && !input.value) {
                    input.value = q;
                }
                input.addEventListener("input", applyFilter);
            }
            if (sorter) {
                sorter.addEventListener("change", function () {
                    applySort();
                    applyFilter();
                });
            }
            applyFilter();
        });

        var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
        players.forEach(function (box) {
            var video = box.querySelector("video");
            var button = box.querySelector(".player-cover");
            if (!video || !button) {
                return;
            }
            var start = function () {
                var url = video.getAttribute("src");
                if (window.Hls && window.Hls.isSupported()) {
                    if (!video.hlsObject) {
                        var HlsClass = window.Hls;
                        var hls = new HlsClass({
                            enableWorker: true,
                            lowLatencyMode: true
                        });
                        video.removeAttribute("src");
                        hls.loadSource(url);
                        hls.attachMedia(video);
                        video.hlsObject = hls;
                    }
                } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.setAttribute("src", url);
                }
                video.controls = true;
                box.classList.add("is-playing");
                var played = video.play();
                if (played && played.catch) {
                    played.catch(function () {});
                }
            };
            button.addEventListener("click", start);
            video.addEventListener("click", function () {
                if (video.paused) {
                    start();
                }
            });
        });
    });
})();
