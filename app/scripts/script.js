
$(function() {
  var homeTabs;
  homeTabs = $(".slidetabs").tabs(".slides > .slide", {
    effect: 'fade',
    fadeOutSpeed: "slow",
    rotate: true,
    tabs: 'div.slidetab'
  }).slideshow();
  return $(".slidetabs").data("slideshow").play();
});
