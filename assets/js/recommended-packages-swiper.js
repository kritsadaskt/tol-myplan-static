document.addEventListener("DOMContentLoaded", function () {
  if (typeof Swiper === "undefined") return;

  var sliderEl = document.querySelector(".recommended-packages-swiper");
  if (!sliderEl) return;

  // Recommended Packages slider
  new Swiper(sliderEl, {
    speed: 550,
    spaceBetween: 16,
    slidesPerView: 1.15,
    grabCursor: true,
    pagination: {
      el: ".recommended-packages-pagination",
      clickable: true,
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 16,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
    },
  });
});

