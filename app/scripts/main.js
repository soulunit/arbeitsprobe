$(document).ready(function () {
  'use strict';
  $('.carousel-full').owlCarousel({
    navigation: true,
    navigationText: false,
    paginationSpeed: 800,
    singleItem: true,
    slideSpeed: 400,
    //fade, backSlide, goDown, fadeUp
    transitionStyle: 'backSlide'
  });
  $('.carousel-small').owlCarousel({
    navigation: true,
    navigationText: false,
    paginationSpeed: 800,
    singleItem: true,
    slideSpeed: 400,
    transitionStyle: 'backSlide'
  });
});
