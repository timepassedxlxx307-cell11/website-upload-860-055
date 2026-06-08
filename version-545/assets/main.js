(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
            menuButton.textContent = mobileNav.classList.contains('is-open') ? '×' : '☰';
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                start();
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                start();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]')).forEach(function (panel) {
        var input = panel.querySelector('[data-filter-input]');
        var year = panel.querySelector('[data-year-filter]');
        var region = panel.querySelector('[data-region-filter]');
        var result = panel.querySelector('[data-filter-result]');
        var grid = document.querySelector('[data-movie-grid]');
        var urlQueryEnabled = panel.hasAttribute('data-url-query');

        if (!grid) {
            return;
        }

        var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-card], .ranking-row'));

        if (urlQueryEnabled && input) {
            var params = new URLSearchParams(window.location.search);
            var query = params.get('q') || '';
            input.value = query;
        }

        function textOf(card) {
            var source = card.matches('[data-card]') ? card : card.querySelector('[data-card]');
            if (!source) {
                return card.textContent.toLowerCase();
            }

            return [
                source.getAttribute('data-title') || '',
                source.getAttribute('data-year') || '',
                source.getAttribute('data-region') || '',
                source.getAttribute('data-tags') || '',
                source.textContent || ''
            ].join(' ').toLowerCase();
        }

        function attrOf(card, name) {
            var source = card.matches('[data-card]') ? card : card.querySelector('[data-card]');
            return source ? source.getAttribute(name) || '' : '';
        }

        function apply() {
            var keyword = input ? input.value.trim().toLowerCase() : '';
            var selectedYear = year ? year.value : '';
            var selectedRegion = region ? region.value : '';
            var shown = 0;

            cards.forEach(function (card) {
                var text = textOf(card);
                var matchesKeyword = !keyword || text.indexOf(keyword) !== -1;
                var matchesYear = !selectedYear || attrOf(card, 'data-year') === selectedYear;
                var matchesRegion = !selectedRegion || attrOf(card, 'data-region') === selectedRegion;
                var visible = matchesKeyword && matchesYear && matchesRegion;

                card.classList.toggle('is-hidden', !visible);

                if (visible) {
                    shown += 1;
                }
            });

            if (result) {
                result.textContent = shown ? '匹配 ' + shown + ' 部' : '暂无匹配';
            }
        }

        [input, year, region].forEach(function (control) {
            if (control) {
                control.addEventListener('input', apply);
                control.addEventListener('change', apply);
            }
        });

        apply();
    });
})();
