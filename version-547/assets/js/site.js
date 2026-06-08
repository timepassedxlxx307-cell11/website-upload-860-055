(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function bindNavigation() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.querySelector(".mobile-nav");
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function bindHero() {
    var hero = document.querySelector(".hero");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var next = document.querySelector("[data-hero-next]");
    var prev = document.querySelector("[data-hero-prev]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle("active", itemIndex === index);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle("active", itemIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (!slides.length) {
      return;
    }
    show(0);
    start();

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }
    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }
    dots.forEach(function (dot, itemIndex) {
      dot.addEventListener("click", function () {
        show(itemIndex);
        start();
      });
    });
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
  }

  function bindFiltering() {
    var forms = Array.prototype.slice.call(document.querySelectorAll("[data-filter-form]"));
    forms.forEach(function (form) {
      var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card, .rank-card"));
      var queryInput = form.querySelector("[data-filter-query]");
      var yearSelect = form.querySelector("[data-filter-year]");
      var typeSelect = form.querySelector("[data-filter-type]");
      var empty = document.querySelector(".empty-result");

      function apply() {
        var query = normalize(queryInput ? queryInput.value : "");
        var year = yearSelect ? yearSelect.value : "";
        var type = typeSelect ? typeSelect.value : "";
        var visible = 0;

        cards.forEach(function (card) {
          var text = normalize(card.getAttribute("data-search"));
          var cardYear = card.getAttribute("data-year") || "";
          var cardType = card.getAttribute("data-type") || "";
          var matchQuery = !query || text.indexOf(query) !== -1;
          var matchYear = !year || cardYear === year;
          var matchType = !type || cardType === type;
          var matched = matchQuery && matchYear && matchType;
          card.style.display = matched ? "" : "none";
          if (matched) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle("show", visible === 0);
        }
      }

      [queryInput, yearSelect, typeSelect].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });

      var params = new URLSearchParams(window.location.search);
      var q = params.get("q");
      if (q && queryInput) {
        queryInput.value = q;
      }
      apply();
    });
  }

  ready(function () {
    bindNavigation();
    bindHero();
    bindFiltering();
  });
})();
