
$(function() {
  var homeTabs;
  homeTabs = $(".slidetabs").tabs(".slides > .slide", {
    effect: 'fade',
    fadeOutSpeed: "slow",
    rotate: true,
    tabs: 'div.slidetab'
  }).slideshow();
  return $("div.calendar").fullCalendar({
    header: {
      left: 'prev',
      center: 'title',
      right: 'next'
    },
    "default": 'month'
  });
});
