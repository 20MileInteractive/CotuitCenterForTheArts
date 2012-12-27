# Cotuit Center for the Arts Javascript

$ ->

	### 
	------------------------
	Home Page Slideshow Tabs
	------------------------
	###
	homeTabs = $(".slidetabs").tabs(".slides > .slide", {
		effect: 'fade',
		fadeOutSpeed: "slow",
		rotate: true,
		tabs: 'div.slidetab'
	}).slideshow()

	$(".slidetabs").data("slideshow").play()

	

	### 
	-------------------------
	Navigation icon placement
	-------------------------
	###
	navMenu = $("header#site-header nav ul > li:has(ul)").find("a:first > span").addClass "arrow"



	### 
	-------------------------
	Events Calendar functions
	-------------------------
	###

	# Because the the event `onChangeMonthYear` get's called before updating 
	# the items, I'll add my code after the elements get rebuilt. We will hook 
	# to the `_updateDatepicker` method in the `Datepicker`.

	# Saves the original function.
	_updateDatepicker_o = $.datepicker._updateDatepicker

	# Replaces the function
	$.datepicker._updateDatepicker = (instance) ->
		_updateDatepicker_o.apply this, [instance]
		addPopUp instance.drawYear, instance.drawMonth+1, instance.id

	# This will hook to ajax methods later
	getMonthEvents = (year, month) ->
		[ 
			{ title: "Blue Man Group", category: "Theater", date: new Date("12/13/2012"), time: "7PM" }, 
			{ title: "Dinner", category: "Gallery", date: new Date("12/13/2012"), time: "3PM - 6PM" }, 
			{ title: "Dinner 2", category: "Gallery", date: new Date("12/23/2012"), time: "5PM" }, 
			{ title: "Dinner 2", category: "Gallery", date: new Date("01/23/2013"), time: "5PM" }, 
		]

	removeEventsPopUp = ->
		$(".pop-cal-container").remove() if $(".pop-cal-container").length

	renderDayEventsPopUp = (event_cell) ->
		
		removeEventsPopUp()

		event_data = event_cell.data("evnts")
		section = $('<section class="pop-cal-container"><i class="pop-cal-arrow"></i></section>')
		content = $('<div class="pop-cal-content"></div>')

		$.each event_data, (index, evt) ->
			console.log evt
			content.append "<header><h1>#{evt.category}</h1</header>"
			content.append "<a href=\"\">#{evt.title}</strong><br>"
			content.append "<span>#{evt.time}</span>"

		section.append content

		$(".calendar").append section
		section.position
			my: "top+10",
			at: "bottom",
			of: event_cell,
			collision: "none"

	# Attach event data to it
	addPopUp = (year, month, calendarId)->	

		cells = $("#"+calendarId).find "td.highlight"

		cells.each (index, elem) ->
			$elem = $(elem)
			events = getMonthEvents($elem.data("year"), $elem.data("month"))
			matching = $.grep events, (event) ->
				parseInt(event.date.getDate().valueOf()) == parseInt($elem.children("a").text().valueOf())

			# Attach events to anchor
			$elem.children("a").data("evnts", matching)

			# bind click event
			$elem.children("a").on "click", (event) ->
				event.preventDefault()
				renderDayEventsPopUp $(@)

	highlightDaysWithEvents = (date)->
		result = [true, '', null]
		events = getMonthEvents(date.getFullYear(), date.getMonth())
		matching = $.grep events, (event) ->
			event.date.valueOf() == date.valueOf()
		if matching.length
			result = [true, 'highlight', null]
		return result


	$("div.calendar").datepicker
		inline: true
		showOtherMonths: true
		dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
		beforeShowDay: highlightDaysWithEvents

	$("body").on "click", (event) ->
		removeEventsPopUp()