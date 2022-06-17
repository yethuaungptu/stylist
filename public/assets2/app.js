
// navbar toggler

$(".navbar-toggler").click(function () {
    let result = $(".navbar-toggler").hasClass("collapsed");
    console.log(result);
    
    if (result) {
        $(".menu-icon").removeClass("feather-x");
        $(".menu-icon").addClass("feather-menu");
    } else {
        $(".menu-icon").removeClass("feather-menu");
        $(".menu-icon").addClass("feather-x");
    }
})

// collections

let collTab = document.querySelector(".coll-tab");
collTab.addEventListener("click",function(e){
    if(e.target.classList.contains("coll-tab-item") && !e.target.classList.contains("active")){
        let target = e.target.getAttribute("data-target");
        collTab.querySelector(".active").classList.remove('active');
        e.target.classList.add("active");
        const collSection = document.querySelector(".coll-section");
        collSection.querySelector(".coll-tab-content.active").classList.remove("active");
        collSection.querySelector(target).classList.add("active");
    }
})

//trending slick in for you of user profile

$('.trending-slick').slick({
    dots: true,
    arrows:false,
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
                centerPadding: '10px',
                slidesToShow: 1
            }
        },
        {
            breakpoint: 480,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 1
            }
        }
    ]
});
