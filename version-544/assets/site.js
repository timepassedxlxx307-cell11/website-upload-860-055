(function () {
    function pagePrefix() {
        var path = window.location.pathname.replace(/\\/g, "/");
        if (path.indexOf("/movies/") !== -1 || path.indexOf("/categories/") !== -1) {
            return "../";
        }
        return "./";
    }

    function resolvePath(path) {
        if (!path) {
            return "#";
        }
        if (/^(https?:)?\/\//.test(path) || path.indexOf("#") === 0) {
            return path;
        }
        if (path.indexOf("./") === 0 || path.indexOf("../") === 0) {
            return path;
        }
        return pagePrefix() + path;
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function matchMovie(movie, query) {
        var text = [
            movie.title,
            movie.year,
            movie.region,
            movie.type,
            movie.genre,
            movie.category,
            movie.oneLine,
            (movie.tags || []).join(" ")
        ].join(" ").toLowerCase();
        return text.indexOf(query.toLowerCase()) !== -1;
    }

    function movieResultHtml(movie) {
        return [
            "<a class=\"search-result\" href=\"" + escapeHtml(resolvePath(movie.url)) + "\">",
            "<span class=\"search-thumb\"><img src=\"" + escapeHtml(resolvePath(movie.cover)) + "\" alt=\"" + escapeHtml(movie.title) + "\" onerror=\"this.remove();\"></span>",
            "<span class=\"search-copy\"><strong>" + escapeHtml(movie.title) + "</strong>",
            "<small>" + escapeHtml(movie.year) + " · " + escapeHtml(movie.region) + " · " + escapeHtml(movie.type) + "</small>",
            "<em>" + escapeHtml(movie.oneLine) + "</em></span>",
            "</a>"
        ].join("");
    }

    function findMovies(query, limit) {
        var movies = window.MOVIE_INDEX || [];
        var normalized = String(query || "").trim();
        if (!normalized) {
            return [];
        }
        return movies.filter(function (movie) {
            return matchMovie(movie, normalized);
        }).slice(0, limit || 12);
    }

    function bindSearchForm(form) {
        var input = form.querySelector("[data-search-input]");
        var results = form.querySelector("[data-search-results]");
        if (!input || !results) {
            return;
        }

        function render(limit) {
            var query = input.value.trim();
            var matches = findMovies(query, limit || 8);
            if (!query) {
                results.innerHTML = "";
                results.classList.remove("is-open");
                return;
            }
            if (!matches.length) {
                results.innerHTML = "<div class=\"empty-result\">没有找到相关影片</div>";
                results.classList.add("is-open");
                return;
            }
            results.innerHTML = matches.map(movieResultHtml).join("");
            results.classList.add("is-open");
        }

        input.addEventListener("input", function () {
            render(form.hasAttribute("data-search-page") ? 36 : 8);
        });

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            var query = input.value.trim();
            if (!query) {
                return;
            }
            if (form.hasAttribute("data-search-page")) {
                render(60);
                return;
            }
            window.location.href = resolvePath("search.html") + "?q=" + encodeURIComponent(query);
        });
    }

    function initSearchPage() {
        var pageForm = document.querySelector("[data-search-page]");
        if (!pageForm) {
            return;
        }
        var input = pageForm.querySelector("[data-search-input]");
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q") || "";
        if (input && query) {
            input.value = query;
            input.dispatchEvent(new Event("input"));
        }
    }

    function initNavigation() {
        var toggle = document.querySelector("[data-nav-toggle]");
        var nav = document.querySelector("[data-main-nav]");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            nav.classList.toggle("is-open");
            toggle.classList.toggle("is-open");
        });
    }

    function initHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        if (!slides.length) {
            return;
        }
        var active = 0;

        function show(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === active);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === active);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
            });
        });

        show(0);
        window.setInterval(function () {
            show(active + 1);
        }, 6200);
    }

    function initFilters() {
        var bars = Array.prototype.slice.call(document.querySelectorAll("[data-filter-bar]"));
        bars.forEach(function (bar) {
            var buttons = Array.prototype.slice.call(bar.querySelectorAll("[data-filter-button]"));
            var grid = bar.parentElement.querySelector("[data-card-grid]");
            if (!grid) {
                return;
            }
            var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-card]"));
            buttons.forEach(function (button) {
                button.addEventListener("click", function () {
                    var value = button.getAttribute("data-filter-value") || "";
                    buttons.forEach(function (item) {
                        item.classList.toggle("is-active", item === button);
                    });
                    cards.forEach(function (card) {
                        var text = (card.getAttribute("data-filter") || "").toLowerCase();
                        var visible = !value || text.indexOf(value.toLowerCase()) !== -1;
                        card.classList.toggle("is-hidden", !visible);
                    });
                });
            });
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        initNavigation();
        initHero();
        initFilters();
        Array.prototype.slice.call(document.querySelectorAll("[data-search-form]")).forEach(bindSearchForm);
        initSearchPage();
    });
}());
