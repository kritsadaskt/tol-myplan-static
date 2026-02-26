document.addEventListener("DOMContentLoaded", function () {
  if (typeof Swiper === "undefined") return;

  var sliderEl = document.querySelector(".recommended-packages-swiper");
  if (!sliderEl) return;

  // Calculate left offset so first card aligns with the container's left edge
  function getContainerOffset() {
    var heading = document.querySelector("#recommendedPackages .max-w-\\[1128px\\]");
    if (!heading) return 16;
    var rect = heading.getBoundingClientRect();
    return Math.max(rect.left, 16);
  }

  var swiper = new Swiper(sliderEl, {
    speed: 550,
    spaceBetween: 14,
    slidesPerView: "auto",
    grabCursor: true,
    centeredSlides: false,
    slidesOffsetBefore: getContainerOffset(),
    slidesOffsetAfter: 0,
    pagination: {
      el: ".recommended-packages-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        return '<span class="' + className + ' rec-pkg-dot"></span>';
      },
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
  });

  // Update offset on resize to stay aligned with container
  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      swiper.params.slidesOffsetBefore = getContainerOffset();
      swiper.update();
    }, 100);
  });
});
