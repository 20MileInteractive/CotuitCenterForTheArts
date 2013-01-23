# Cotuit Center for the Arts Javascript

$ ->

	# Extend Array class to add unique method
	Array::unique = ->
		output = {}
		output[@[key]] = @[key] for key in [0...@length]
		value for key, value of output

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

	if $(".slidetabs").length > 0
		$(".slidetabs").data("slideshow").play()

	

	### 
	-------------------------
	Navigation icon placement
	-------------------------
	###
	navMenu = $("header#site-header nav ul > li:has(ul)").find("a:first > span").addClass "arrow"



	### 
	----------------------
	Program List drop down
	----------------------
	###
	chosenProgramList = $("#program-list-select").chosen()




	### 
	-----------------------
	Event Listing Read More
	-----------------------
	###
	eventReadMore = $(".event-item .read-full").on "click", (event)->
		event.preventDefault()
		btn = $(@)
		event_item = btn.parent().parent().parent().parent(".event-item")
		event_item.find(".extended").slideToggle "fast", ()->
			if btn.text() == "Read Less"
				btn.text "Read More" 
			else
				btn.text "Read Less" 





	### 
	------------------------------
	Become a member toggle package
	------------------------------
	###

	togglePackage = $(".member-package header").on "click", ()->
		header = $(@)
		header.toggleClass("open")
		header.parent().children("div.content").slideToggle('fast')

	### 
	-------------------------
	Events Calendar functions
	-------------------------
	###

	# Because the the event `onChangeMonthYear` get's called before updating 
	# the items, the code is added after the elements get rebuilt. We will hook 
	# to the `_updateDatepicker` method in the `Datepicker`.

	# Saves the original function.
	_updateDatepicker_o = $.datepicker._updateDatepicker

	# Events array
	monthly_events = []

	# Events Categories Map
	event_categories = []

	event_categories["Black Box Theater"] = "Theater"
	event_categories["Theater"] = "Theater"
	event_categories["Exhibit"] = "Gallery"
	event_categories["Concert"] = "Concerts"
	event_categories["Gallery Concert"] = "Concerts"
	event_categories["Film"] = "Film"
	event_categories["Education"] = "Classes"
	event_categories["Special Events"] = "Special Events"
	event_categories["Special Event"] = "Special Events"
	event_categories["Rental"] = "Special Events"

	# Replaces the function
	$.datepicker._updateDatepicker = (instance) ->
		_updateDatepicker_o.apply this, [instance]
		addPopUp instance.drawYear, instance.drawMonth+1, instance.id

	# This will hook to ajax methods later
	getMonthEvents = (year, month) ->
		month  = 1 if month is 0
		$.getJSON window.location.origin + '/json/events/'+year+'/'+month, (data)->
			events = []
			for e in data
				evnt = 
					title: e.title
					category: event_categories[e.category]
					date: new Date(e.date)
					time: e.time
					event_id: e.event_id
					target_url: e.target_url
					ee_url: e.ee_url
				events.push evnt

			monthly_events = []
			monthly_events = events
			$( "div.calendar" ).datepicker( "refresh" )

	removeEventsPopUp = ->
		$(".pop-cal-container").remove() if $(".pop-cal-container").length

	renderDayEventsPopUp = (event_cell) ->
		
		removeEventsPopUp()

		event_data = event_cell.data("evnts")
		section = $('<section class="pop-cal-container"><i class="pop-cal-arrow"></i></section>')
		content = $('<div class="pop-cal-content"></div>')

		# console.log event_data

		groups = (evnt.category for evnt in event_data)

		groups = groups.unique()

		for group in groups
			content.append "<header><h1 class=\"color-#{group.toLowerCase()}\">#{group}</h1</header>"
			for evt in event_data
				if group == evt.category
					target_url = 
						if evt.ee_url == ''
							"<a target=\"_blank\" href=\"#{evt.target_url}\">#{evt.title}"
						else 
							"<a href=\"#{evt.ee_url}\">#{evt.title}"
					content.append target_url
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
			events = monthly_events
			matching = $.grep events, (event) ->
				d = new Date(event.date)
				parseInt(d.getDate().valueOf()) == parseInt($elem.children("a").text().valueOf())

			# Attach events to anchor
			$elem.children("a").data("evnts", matching)

			# bind click event
			$elem.children("a").on "click", (event) ->
				event.preventDefault()
				renderDayEventsPopUp $(@)

	highlightDaysWithEvents = (date)->
		result = [true, '', null]
		events = monthly_events
		matching = $.grep events, (event) ->
			d = new Date(event.date)
			d.valueOf() == date.valueOf()
		if matching.length
			result = [true, 'highlight', null]
		return result

	# Initialize with today
	today = new Date()
	getMonthEvents(today.getFullYear(), today.getMonth())


	$("div.calendar").datepicker
		inline: true
		showOtherMonths: true
		dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
		beforeShowDay: highlightDaysWithEvents
		onChangeMonthYear: getMonthEvents

	$("body").on "click", (event) ->
		removeEventsPopUp()