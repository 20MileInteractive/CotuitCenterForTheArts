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

	# Events Calendar functions

	# This will hook to ajax methods later
	getMonthEvents = (year, month) ->
		[ 
			{ Title: "Blue Man Group", category: "Theater", Date: new Date("12/13/2012") }, 
			{ Title: "Dinner", category: "Gallery", Date: new Date("12/13/2012") }, 
			{ Title: "Dinner 2", category: "Gallery", Date: new Date("12/23/2012") }, 
		]
	# Because the the event `onChangeMonthYear` get's called before updating 
	# the items, I'll add my code after the elements get rebuilt. We will hook 
	# to the `_updateDatepicker` method in the `Datepicker`.

	# Saves the original function.
	_updateDatepicker_o = $.datepicker._updateDatepicker

	# Replaces the function
	$.datepicker._updateDatepicker = (instance) ->
		_updateDatepicker_o.apply this, [instance]
		addPopUp instance.drawYear, instance.drawMonth+1, instance.id

	# Attach event data to it
	addPopUp = (year, month, calendarId)->	

		cells = $("#"+calendarId).find "td.highlight"

		cells.each (index, elem) ->
			$elem = $(elem)
			events = getMonthEvents($elem.data("year"), $elem.data("month"))
			matching = $.grep events, (event) ->
				parseInt(event.Date.getDate().valueOf()) == parseInt($elem.children("a").text().valueOf())

			# Attach events to anchor
			$elem.children("a").data("evnts", matching)

			# bind click event
			$elem.children("a").on "click", (event) ->
				event.preventDefault()
				console.log $(@).data("evnts")

	highlightDaysWithEvents = (date)->
		result = [true, '', null]
		events = getMonthEvents(date.getFullYear(), date.getMonth())
		matching = $.grep events, (event) ->
			event.Date.valueOf() == date.valueOf()
		if matching.length
			result = [true, 'highlight', null]
		return result

	showDayEvents = (dateText) ->
		date = new Date(dateText)
		console.log date

		#trigger pop here

	$("div.calendar").datepicker
		inline: true
		showOtherMonths: true
		dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
		beforeShowDay: highlightDaysWithEvents
		onSelect: showDayEvents