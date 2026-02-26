document.addEventListener("DOMContentLoaded", function () {
  if (typeof Swiper === "undefined") return;

  /* ── Helper: compute left offset so first card aligns with container edge ── */
  function getContainerOffset(sectionId) {
    var heading = document.querySelector("#" + sectionId + " .max-w-\\[1128px\\]");
    if (!heading) return 16;
    var rect = heading.getBoundingClientRect();
    return Math.max(rect.left, 16);
  }

  /* ── Shared Swiper config factory ── */
  function createSwiperConfig(sectionId, paginationSelector) {
    return {
      speed: 550,
      spaceBetween: 14,
      slidesPerView: "auto",
      grabCursor: true,
      centeredSlides: false,
      slidesOffsetBefore: getContainerOffset(sectionId),
      slidesOffsetAfter: 80,
      pagination: {
        el: paginationSelector,
        clickable: true,
        renderBullet: function (index, className) {
          return '<span class="' + className + ' rec-pkg-dot"></span>';
        },
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
    };
  }

  /* ── Init: Special Packages Swiper (gradient bg) ── */
  var specialEl = document.querySelector(".special-packages-swiper");
  var specialSwiper = null;
  if (specialEl) {
    specialSwiper = new Swiper(
      specialEl,
      createSwiperConfig("specialPackages", ".special-packages-pagination")
    );
  }

  /* ── Init: Recommended Packages Swiper ── */
  var recEl = document.querySelector(".recommended-packages-swiper");
  var recSwiper = null;
  if (recEl) {
    recSwiper = new Swiper(
      recEl,
      createSwiperConfig("recommendedPackages", ".recommended-packages-pagination")
    );
  }

  /* ── Keep offsets in sync on resize ── */
  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (specialSwiper) {
        specialSwiper.params.slidesOffsetBefore = getContainerOffset("specialPackages");
        specialSwiper.update();
      }
      if (recSwiper) {
        recSwiper.params.slidesOffsetBefore = getContainerOffset("recommendedPackages");
        recSwiper.update();
      }
    }, 100);
  });
});
