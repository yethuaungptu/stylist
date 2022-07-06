// navbar toggler

$(".navbar-toggler").click(function () {
  let result = $(".navbar-toggler").hasClass("collapsed");
  console.log(result);

  if (result) {
    $(".menu-icon").removeClass("ri-close-line");
    $(".menu-icon").addClass("ri-menu-3-line");
  } else {
    $(".menu-icon").removeClass("ri-menu-3-line");
    $(".menu-icon").addClass("ri-close-line");
  }
});

$(".icon-heart").click(function () {
  if ($(this).hasClass("ri-heart-3-line")) {
    $(this).removeClass("ri-heart-3-line");
    $(this).addClass("ri-heart-3-fill");
  } else {
    $(this).removeClass("ri-heart-3-fill");
    $(this).addClass("ri-heart-3-line");
  }
});
$(".icon-save").click(function () {
  if ($(this).hasClass("ri-bookmark-line")) {
    $(this).removeClass("ri-bookmark-line");
    $(this).addClass("ri-bookmark-fill");
  } else {
    $(this).removeClass("ri-bookmark-fill");
    $(this).addClass("ri-bookmark-line");
  }
});

// scroll header

let screenHeight = $(window).height();
console.log(screenHeight);
$(window).scroll(function () {
  let currentPosition = $(this).scrollTop();
  if (currentPosition > screenHeight - 100) {
    $(".site-nav").addClass("site-nav-scroll");
  } else {
    $(".site-nav").removeClass("site-nav-scroll");
  }
});

// scroll up
$(window).scroll(function () {
  let scrollUp = $(".scroll-up");
  if ($(this).scrollTop() >= 400) {
    scrollUp.addClass("show-scroll");
    // console.log("scroll");
  } else {
    scrollUp.removeClass("show-scroll");
  }
});

// user profile

$(".toggle").click(function () {
  $(this).toggleClass("toggled");
  let hasResult = $(this).hasClass("toggled");
  console.log(hasResult);
  if (hasResult) {
    $(".user-menu-icon").removeClass("ri-menu-2-fill");
    $(".user-menu-icon").addClass("ri-close-fill");
    $(".user-sidebar").toggleClass("toggler");
  } else {
    $(".user-menu-icon").removeClass("ri-close-fill");
    $(".user-menu-icon").addClass("ri-menu-2-fill");
    $(".user-sidebar").toggleClass("toggler");
  }
  if ($(".user-sidebar").hasClass("toggler")) {
    $(".user-sidebar").removeClass("d-md-none");
    $(".user-sidebar").removeClass("d-none");
    $(".user-content").removeClass("col-md-12");
    $(".user-sidebar").addClass("d-md-block");
    $(".user-content").addClass("col-md-8");
  } else {
    $(".user-sidebar").addClass("d-md-none");
    $(".user-content").addClass("col-md-12");
    $(".user-sidebar").addClass("d-none");
    $(".user-sidebar").removeClass("d-md-block");
    $(".user-content").removeClass("col-md-8");
  }
});

$(".toggle-coll").click(function () {
  $(this).toggleClass("toggled");
  let hasResult = $(this).hasClass("toggled");
  console.log(hasResult);

  if (hasResult) {
    $(".user-menu-icon").removeClass("ri-menu-2-fill");
    $(".user-menu-icon").addClass("ri-close-fill");
    $(".user-sidebar").toggleClass("toggler");
  } else {
    $(".user-menu-icon").removeClass("ri-close-fill");
    $(".user-menu-icon").addClass("ri-menu-2-fill");
    $(".user-sidebar").toggleClass("toggler");
  }
  if ($(".user-sidebar").hasClass("toggler")) {
    $(".user-sidebar").removeClass("d-md-none");
    $(".user-sidebar").removeClass("d-none");
    $(".user-content").removeClass("col-md-12");
    $(".user-sidebar").addClass("d-md-block");
    $(".user-content").addClass("col-md-8");
  } else {
    $(".user-sidebar").addClass("d-md-none");
    $(".user-content").addClass("col-md-12");
    $(".user-sidebar").addClass("d-none");
    $(".user-sidebar").removeClass("d-md-block");
    $(".user-content").removeClass("col-md-8");
  }
});

// to detail

$(".details").delegate(".to-detail", "click", function () {});

// collections

let collTab = document.querySelector(".coll-tab");
collTab.addEventListener("click", function (e) {
  if (
    e.target.classList.contains("coll-tab-item") &&
    !e.target.classList.contains("active")
  ) {
    let target = e.target.getAttribute("data-target");
    collTab.querySelector(".active").classList.remove("active");
    e.target.classList.add("active");
    const collSection = document.querySelector(".coll-section");
    collSection
      .querySelector(".coll-tab-content.active")
      .classList.remove("active");
    collSection.querySelector(target).classList.add("active");
  }
});

//trending slick in for you of user profile

$(".user-trending-slick").slick({
  dots: true,
  arrows: false,
  // centerMode: true,
  // centerPadding: '60px',
  slidesToShow: 4,
  slidesToScroll: 3,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: "10px",
        slidesToShow: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: "40px",
        slidesToShow: 1,
      },
    },
  ],
});

$(".trending-slick").slick({
  dots: true,
  arrows: true,
  // centerMode: true,
  centerPadding: "60px",
  slidesToShow: 3,
  slidesToScroll: 3,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        arrows: true,
        centerMode: true,
        centerPadding: "10px",
        slidesToShow: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        arrows: true,
        centerMode: true,
        centerPadding: "40px",
        slidesToShow: 1,
      },
    },
  ],
});

$(".popular-slick").slick({
  dots: true,
  arrows: false,
  centerMode: true,
  centerPadding: "60px",
  slidesToShow: 2,
  slidesToScroll: 3,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        arrows: false,
        // centerMode: true,
        centerPadding: "10px",
        slidesToShow: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: "40px",
        slidesToShow: 1,
      },
    },
  ],
});

// wow js
wow = new WOW({
  boxClass: "wow", // default
  animateClass: "animate__animated ", // default
  offset: 0, // default
  mobile: true, // default
  live: true, // default
});
wow.init();
