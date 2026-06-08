(function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");

    if (menuButton && mobilePanel) {
        menuButton.addEventListener("click", function () {
            mobilePanel.classList.toggle("open");
        });
    }

    document.querySelectorAll("[data-site-search]").forEach(function (form) {
        form.addEventListener("submit", function (event) {
            var input = form.querySelector("input[name='q']");
            if (input && input.value.trim()) {
                event.preventDefault();
                window.location.href = "./search.html?q=" + encodeURIComponent(input.value.trim());
            }
        });
    });

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var prev = document.querySelector("[data-hero-prev]");
    var next = document.querySelector("[data-hero-next]");
    var heroIndex = 0;
    var heroTimer = null;

    function showHero(index) {
        if (!slides.length) {
            return;
        }
        heroIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, position) {
            slide.classList.toggle("active", position === heroIndex);
        });
        dots.forEach(function (dot, position) {
            dot.classList.toggle("active", position === heroIndex);
        });
    }

    function restartHero() {
        if (heroTimer) {
            clearInterval(heroTimer);
        }
        if (slides.length > 1) {
            heroTimer = setInterval(function () {
                showHero(heroIndex + 1);
            }, 5000);
        }
    }

    if (slides.length) {
        showHero(0);
        restartHero();
        if (prev) {
            prev.addEventListener("click", function () {
                showHero(heroIndex - 1);
                restartHero();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                showHero(heroIndex + 1);
                restartHero();
            });
        }
        dots.forEach(function (dot, position) {
            dot.addEventListener("click", function () {
                showHero(position);
                restartHero();
            });
        });
    }

    var filterInput = document.querySelector("[data-filter-input]");
    var filterYear = document.querySelector("[data-filter-year]");
    var filterType = document.querySelector("[data-filter-type]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
    var emptyState = document.querySelector("[data-empty-state]");

    function applyUrlQuery() {
        if (!filterInput) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q");
        if (query) {
            filterInput.value = query;
        }
    }

    function runFilter() {
        if (!cards.length) {
            return;
        }
        var keyword = filterInput ? filterInput.value.trim().toLowerCase() : "";
        var year = filterYear ? filterYear.value : "";
        var type = filterType ? filterType.value : "";
        var visible = 0;

        cards.forEach(function (card) {
            var haystack = (card.getAttribute("data-search") || "").toLowerCase();
            var cardYear = card.getAttribute("data-year") || "";
            var cardType = card.getAttribute("data-type") || "";
            var matched = (!keyword || haystack.indexOf(keyword) !== -1) && (!year || cardYear === year) && (!type || cardType === type);
            card.style.display = matched ? "" : "none";
            if (matched) {
                visible += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle("show", visible === 0);
        }
    }

    if (filterInput || filterYear || filterType) {
        applyUrlQuery();
        [filterInput, filterYear, filterType].forEach(function (control) {
            if (control) {
                control.addEventListener("input", runFilter);
                control.addEventListener("change", runFilter);
            }
        });
        runFilter();
    }
})();
