# Cotuit Center for the Arts Javascript

$ ->

	# Home Page Slideshow Tabs
	homeTabs = $(".slidetabs").tabs(".slides > .slide", {
		effect: 'fade',
		fadeOutSpeed: "slow",
		rotate: true,
		tabs: 'div.slidetab'
	}).slideshow()

	# $(".slidetabs").data("slideshow").play()

	$("div.calendar").fullCalendar
		header:
			left:   'prev'
			center: 'title'
			right:  'next'
		default: 'month'

