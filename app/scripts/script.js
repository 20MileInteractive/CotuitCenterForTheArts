(function() {

  $(function() {
    /* 
    	------------------------
    	Home Page Slideshow Tabs
    	------------------------
    */

    var addPopUp, getMonthEvents, highlightDaysWithEvents, homeTabs, navMenu, removeEventsPopUp, renderDayEventsPopUp, togglePackage, _updateDatepicker_o;
    homeTabs = $(".slidetabs").tabs(".slides > .slide", {
      effect: 'fade',
      fadeOutSpeed: "slow",
      rotate: true,
      tabs: 'div.slidetab'
    }).slideshow();
    if ($(".slidetabs").length > 0) {
      $(".slidetabs").data("slideshow").play();
    }
    /* 
    	-------------------------
    	Navigation icon placement
    	-------------------------
    */

    navMenu = $("header#site-header nav ul > li:has(ul)").find("a:first > span").addClass("arrow");
    /* 
    	------------------------------
    	Become a member toggle package
    	------------------------------
    */

    togglePackage = $(".member-package header").on("click", function() {
      var header;
      header = $(this);
      header.toggleClass("open");
      return header.parent().children("div.content").slideToggle('fast');
    });
    /* 
    	-------------------------
    	Events Calendar functions
    	-------------------------
    */

    _updateDatepicker_o = $.datepicker._updateDatepicker;
    $.datepicker._updateDatepicker = function(instance) {
      _updateDatepicker_o.apply(this, [instance]);
      return addPopUp(instance.drawYear, instance.drawMonth + 1, instance.id);
    };
    getMonthEvents = function(year, month) {
      return [
        {
          title: "Blue Man Group",
          category: "Theater",
          date: new Date("12/13/2012"),
          time: "7PM"
        }, {
          title: "Dinner",
          category: "Gallery",
          date: new Date("12/13/2012"),
          time: "3PM - 6PM"
        }, {
          title: "Dinner 2",
          category: "Gallery",
          date: new Date("12/23/2012"),
          time: "5PM"
        }, {
          title: "Dinner 2",
          category: "Gallery",
          date: new Date("01/23/2013"),
          time: "5PM"
        }
      ];
    };
    removeEventsPopUp = function() {
      if ($(".pop-cal-container").length) {
        return $(".pop-cal-container").remove();
      }
    };
    renderDayEventsPopUp = function(event_cell) {
      var content, event_data, section;
      removeEventsPopUp();
      event_data = event_cell.data("evnts");
      section = $('<section class="pop-cal-container"><i class="pop-cal-arrow"></i></section>');
      content = $('<div class="pop-cal-content"></div>');
      $.each(event_data, function(index, evt) {
        console.log(evt);
        content.append("<header><h1>" + evt.category + "</h1</header>");
        content.append("<a href=\"\">" + evt.title + "</strong><br>");
        return content.append("<span>" + evt.time + "</span>");
      });
      section.append(content);
      $(".calendar").append(section);
      return section.position({
        my: "top+10",
        at: "bottom",
        of: event_cell,
        collision: "none"
      });
    };
    addPopUp = function(year, month, calendarId) {
      var cells;
      cells = $("#" + calendarId).find("td.highlight");
      return cells.each(function(index, elem) {
        var $elem, events, matching;
        $elem = $(elem);
        events = getMonthEvents($elem.data("year"), $elem.data("month"));
        matching = $.grep(events, function(event) {
          return parseInt(event.date.getDate().valueOf()) === parseInt($elem.children("a").text().valueOf());
        });
        $elem.children("a").data("evnts", matching);
        return $elem.children("a").on("click", function(event) {
          event.preventDefault();
          return renderDayEventsPopUp($(this));
        });
      });
    };
    highlightDaysWithEvents = function(date) {
      var events, matching, result;
      result = [true, '', null];
      events = getMonthEvents(date.getFullYear(), date.getMonth());
      matching = $.grep(events, function(event) {
        return event.date.valueOf() === date.valueOf();
      });
      if (matching.length) {
        result = [true, 'highlight', null];
      }
      return result;
    };
    $("div.calendar").datepicker({
      inline: true,
      showOtherMonths: true,
      dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      beforeShowDay: highlightDaysWithEvents
    });
    return $("body").on("click", function(event) {
      return removeEventsPopUp();
    });
  });

}).call(this);
