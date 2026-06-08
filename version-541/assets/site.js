(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function setupMenu() {
    var toggle = document.querySelector(".menu-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      var open = panel.hasAttribute("hidden");
      if (open) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
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
      }
    }

    dots.forEach(function (dot, itemIndex) {
      dot.addEventListener("click", function () {
        show(itemIndex);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function filterCards(input) {
    var section = input.closest(".filter-section") || document;
    var cards = Array.prototype.slice.call(section.querySelectorAll("[data-movie-card]"));
    var query = normalize(input.value);
    cards.forEach(function (card) {
      var text = normalize(card.getAttribute("data-search"));
      card.classList.toggle("is-hidden", query && text.indexOf(query) === -1);
    });
  }

  function setupFilters() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-filter-input]"));
    inputs.forEach(function (input) {
      input.addEventListener("input", function () {
        filterCards(input);
      });
    });

    var chips = Array.prototype.slice.call(document.querySelectorAll("[data-filter-chip]"));
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var panel = chip.closest(".filter-panel");
        var input = panel ? panel.querySelector("[data-filter-input]") : null;
        var value = chip.getAttribute("data-filter-chip") || "";
        if (panel) {
          Array.prototype.slice.call(panel.querySelectorAll("[data-filter-chip]")).forEach(function (item) {
            item.classList.toggle("active", item === chip);
          });
        }
        if (input) {
          input.value = value;
          filterCards(input);
        }
      });
    });
  }

  function setupSearchPage() {
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    if (!query) {
      return;
    }
    var mainInput = document.querySelector("[data-global-search]");
    var filterInput = document.querySelector("[data-filter-input]");
    if (mainInput) {
      mainInput.value = query;
    }
    if (filterInput) {
      filterInput.value = query;
      filterCards(filterInput);
    }
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
    setupSearchPage();
  });
})();
