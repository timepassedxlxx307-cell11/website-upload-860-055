(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  function setupMenu() {
    var button = document.querySelector('.menu-toggle');
    if (!button) {
      return;
    }
    button.addEventListener('click', function () {
      document.body.classList.toggle('menu-open');
    });
  }

  function setupHero() {
    var root = document.querySelector('[data-hero-carousel]');
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('.hero-dot'));
    var prev = root.querySelector('[data-hero-prev]');
    var next = root.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function restart() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-slide')) || 0);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        restart();
      });
    }

    restart();
  }

  function isSeries(typeText) {
    return /剧|Series|TV|短剧/i.test(typeText || '');
  }

  function isMovie(typeText) {
    return /电影|Movie|动画电影|网络电影/i.test(typeText || '') && !isSeries(typeText);
  }

  function setupFilters() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));
    scopes.forEach(function (scope) {
      var buttons = Array.prototype.slice.call(scope.querySelectorAll('.filter-button'));
      var container = scope.parentElement.querySelector('.filter-target');
      if (!container) {
        return;
      }
      var cards = Array.prototype.slice.call(container.querySelectorAll('.movie-card'));
      buttons.forEach(function (button) {
        button.addEventListener('click', function () {
          var filter = button.getAttribute('data-filter');
          buttons.forEach(function (item) {
            item.classList.toggle('is-active', item === button);
          });
          cards.forEach(function (card) {
            var typeText = card.getAttribute('data-type') || '';
            var yearNumber = parseInt(card.getAttribute('data-year') || '0', 10);
            var region = card.getAttribute('data-region') || '';
            var visible = true;
            if (filter === 'movie') {
              visible = isMovie(typeText);
            } else if (filter === 'series') {
              visible = isSeries(typeText);
            } else if (filter === 'latest') {
              visible = yearNumber >= 2022;
            } else if (filter === 'cn') {
              visible = /中国|国产|香港|台湾/.test(region);
            }
            card.classList.toggle('is-hidden', !visible);
          });
        });
      });
    });
  }

  function createResultCard(item) {
    var tags = (item.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    return [
      '<article class="movie-card">',
      '  <a href="' + escapeAttribute(item.url) + '" class="card-cover">',
      '    <img src="' + escapeAttribute(item.cover) + '" alt="' + escapeAttribute(item.title) + '" loading="lazy">',
      '    <span class="card-year">' + escapeHtml(item.year) + '</span>',
      '  </a>',
      '  <div class="card-body">',
      '    <a href="' + escapeAttribute(item.url) + '"><h3>' + escapeHtml(item.title) + '</h3></a>',
      '    <p>' + escapeHtml(item.oneLine || '') + '</p>',
      '    <div class="card-meta"><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.type) + '</span></div>',
      '    <div class="tag-row">' + tags + '</div>',
      '  </div>',
      '</article>'
    ].join('\n');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, '&#96;');
  }

  function setupSearchPage() {
    var results = document.getElementById('search-results');
    if (!results || typeof SITE_SEARCH_INDEX === 'undefined') {
      return;
    }
    var input = document.getElementById('site-search-page-input');
    var status = document.getElementById('search-status');
    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim();

    if (input) {
      input.value = query;
      input.addEventListener('input', function () {
        render(input.value.trim());
      });
    }

    function render(keyword) {
      var words = keyword.toLowerCase().split(/\s+/).filter(Boolean);
      var matches = SITE_SEARCH_INDEX.filter(function (item) {
        if (!words.length) {
          return false;
        }
        var haystack = [
          item.title,
          item.region,
          item.type,
          item.year,
          item.genre,
          (item.tags || []).join(' '),
          item.oneLine
        ].join(' ').toLowerCase();
        return words.every(function (word) {
          return haystack.indexOf(word) !== -1;
        });
      }).slice(0, 120);

      if (!keyword) {
        results.innerHTML = '';
        if (status) {
          status.textContent = '请输入关键词';
        }
        return;
      }

      results.innerHTML = matches.map(createResultCard).join('\n');
      if (status) {
        status.textContent = matches.length ? '找到 ' + matches.length + ' 部相关作品' : '未找到相关作品';
      }
    }

    render(query);
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
    setupSearchPage();
  });
})();
