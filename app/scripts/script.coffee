# Cotuit Center for the Arts Javascript

events = [ 
    { Title: "Five K for charity", Date: new Date("12/13/2012") }, 
    { Title: "Dinner", Date: new Date("12/25/2012") }, 
    { Title: "Meeting with manager", Date: new Date("12/01/2012") },
    { Title: "Meeting with manager2", Date: new Date("12/01/2012") }
]

$ ->

	# Home Page Slideshow Tabs
	homeTabs = $(".slidetabs").tabs(".slides > .slide", {
		effect: 'fade',
		fadeOutSpeed: "slow",
		rotate: true,
		tabs: 'div.slidetab'
	}).slideshow()

	# $(".slidetabs").data("slideshow").play()


	# Events Calendar functions
	highlightDaysWithEvents = (date)->
		result = [true, '', null]
		matching = $.grep events, (event) ->
			event.Date.valueOf() == date.valueOf()
		result = [true, 'highlight', null] if matching.length
		return result

	$("div.calendar").datepicker
		inline: true
		showOtherMonths: true
		dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
		beforeShowDay: highlightDaysWithEvents


