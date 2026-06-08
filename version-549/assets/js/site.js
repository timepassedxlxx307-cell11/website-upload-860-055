(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var activeIndex = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === activeIndex);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === activeIndex);
      });
    }

    function schedule() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(activeIndex + 1);
      }, 5200);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
        schedule();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(activeIndex - 1);
        schedule();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(activeIndex + 1);
        schedule();
      });
    }

    schedule();
  }

  var filterScope = document.querySelector('[data-filter-scope]');
  if (filterScope) {
    var searchInput = filterScope.querySelector('[data-local-search]');
    var filters = Array.prototype.slice.call(filterScope.querySelectorAll('[data-filter]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card-container] .movie-card'));

    function normalize(value) {
      return (value || '').toString().trim().toLowerCase();
    }

    function applyFilters() {
      var query = normalize(searchInput ? searchInput.value : '');
      var selected = {};
      filters.forEach(function (filter) {
        selected[filter.getAttribute('data-filter')] = normalize(filter.value);
      });

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' '));
        var matchesQuery = !query || haystack.indexOf(query) !== -1;
        var matchesType = !selected.type || normalize(card.getAttribute('data-type')).indexOf(selected.type) !== -1;
        var matchesYear = !selected.year || normalize(card.getAttribute('data-year')) === selected.year;
        card.classList.toggle('is-hidden', !(matchesQuery && matchesType && matchesYear));
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }
    filters.forEach(function (filter) {
      filter.addEventListener('change', applyFilters);
    });
  }
})();
