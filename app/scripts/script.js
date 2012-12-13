
$(function() {
  var homeTabs;
  return homeTabs = $(".slidetabs").tabs(".slides > .slide", {
    effect: 'fade',
    fadeOutSpeed: "slow",
    rotate: true,
    tabs: 'div.slidetab'
  }).slideshow();
});
