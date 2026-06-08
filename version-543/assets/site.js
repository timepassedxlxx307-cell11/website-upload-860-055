const Hls = window.Hls;

const mobileToggle = document.querySelector("[data-mobile-toggle]");
const mobilePanel = document.querySelector("[data-mobile-panel]");

if (mobileToggle && mobilePanel) {
    mobileToggle.addEventListener("click", () => {
        mobilePanel.classList.toggle("is-open");
    });
}

const slides = Array.from(document.querySelectorAll("[data-hero-slide]"));
const dots = Array.from(document.querySelectorAll("[data-hero-dot]"));
let activeSlide = 0;
let slideTimer = null;

function showSlide(index) {
    if (!slides.length) {
        return;
    }

    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === activeSlide);
    });
    dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === activeSlide);
    });
}

function startHero() {
    if (slides.length < 2) {
        return;
    }

    slideTimer = window.setInterval(() => {
        showSlide(activeSlide + 1);
    }, 5200);
}

dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        showSlide(index);
        if (slideTimer) {
            window.clearInterval(slideTimer);
            startHero();
        }
    });
});

startHero();

function normalize(text) {
    return (text || "").toString().trim().toLowerCase();
}

function applySearchFilter() {
    const form = document.querySelector("[data-filter-form]");
    const cards = Array.from(document.querySelectorAll("[data-search-card]"));
    const emptyState = document.querySelector("[data-empty-state]");

    if (!form || !cards.length) {
        return;
    }

    const keywordInput = form.querySelector("[data-filter-keyword]");
    const categorySelect = form.querySelector("[data-filter-category]");
    const params = new URLSearchParams(window.location.search);
    const initialKeyword = params.get("q") || "";

    if (keywordInput && initialKeyword && !keywordInput.value) {
        keywordInput.value = initialKeyword;
    }

    const update = () => {
        const keyword = normalize(keywordInput ? keywordInput.value : "");
        const category = categorySelect ? categorySelect.value : "";
        let visible = 0;

        cards.forEach((card) => {
            const haystack = normalize(card.getAttribute("data-title") + " " + card.getAttribute("data-tags") + " " + card.getAttribute("data-summary"));
            const cardCategory = card.getAttribute("data-category") || "";
            const keywordMatch = !keyword || haystack.includes(keyword);
            const categoryMatch = !category || cardCategory === category;
            const shouldShow = keywordMatch && categoryMatch;

            card.style.display = shouldShow ? "" : "none";
            if (shouldShow) {
                visible += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle("is-visible", visible === 0);
        }
    };

    form.addEventListener("input", update);
    form.addEventListener("change", update);
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        update();
    });

    update();
}

applySearchFilter();

function preparePlayer(container) {
    const video = container.querySelector("video");
    const button = container.querySelector(".player-start");
    const stream = container.getAttribute("data-stream");
    let hls = null;

    if (!video || !stream) {
        return;
    }

    const attach = () => {
        if (video.dataset.ready === "1") {
            return;
        }

        if (Hls && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(stream);
            hls.attachMedia(video);
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = stream;
        }

        video.dataset.ready = "1";
    };

    const play = () => {
        attach();
        container.classList.add("is-playing");
        video.play().catch(() => {
            container.classList.remove("is-playing");
        });
    };

    if (button) {
        button.addEventListener("click", play);
    }

    video.addEventListener("click", () => {
        attach();
        if (video.paused) {
            play();
        } else {
            video.pause();
        }
    });

    video.addEventListener("play", () => {
        container.classList.add("is-playing");
    });

    video.addEventListener("pause", () => {
        if (!video.ended) {
            container.classList.remove("is-playing");
        }
    });

    video.addEventListener("ended", () => {
        container.classList.remove("is-playing");
    });

    window.addEventListener("pagehide", () => {
        if (hls) {
            hls.destroy();
        }
    });
}

document.querySelectorAll(".watch-player").forEach(preparePlayer);
