(function() {

  $(function() {
    var addPopUp, eventReadMore, event_categories, getMonthEvents, highlightDaysWithEvents, homeTabs, monthly_events, navMenu, removeEventsPopUp, renderDayEventsPopUp, today, togglePackage, _updateDatepicker_o;
    Array.prototype.unique = function() {
      var key, output, value, _i, _ref, _results;
      output = {};
      for (key = _i = 0, _ref = this.length; 0 <= _ref ? _i < _ref : _i > _ref; key = 0 <= _ref ? ++_i : --_i) {
        output[this[key]] = this[key];
      }
      _results = [];
      for (key in output) {
        value = output[key];
        _results.push(value);
      }
      return _results;
    };
    /* 
    	------------------------
    	Home Page Slideshow Tabs
    	------------------------
    */

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
    	-----------------------
    	Event Listing Read More
    	-----------------------
    */

    eventReadMore = $(".event-item .read-full").on("click", function(event) {
      var btn, event_item;
      event.preventDefault();
      btn = $(this);
      event_item = btn.parent().parent().parent().parent(".event-item");
      return event_item.find(".extended").slideToggle("fast", function() {
        if (btn.text() === "Read Less") {
          return btn.text("Read More");
        } else {
          return btn.text("Read Less");
        }
      });
    });
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
    monthly_events = [];
    event_categories = [];
    event_categories["Black Box Theater"] = "Theater";
    event_categories["Theater"] = "Theater";
    event_categories["Exhibit"] = "Gallery";
    event_categories["Concert"] = "Concerts";
    event_categories["Gallery Concert"] = "Concerts";
    event_categories["Film"] = "Film";
    event_categories["Education"] = "Classes";
    event_categories["Special Events"] = "Special Events";
    event_categories["Special Event"] = "Special Events";
    event_categories["Rental"] = "Special Events";
    $.datepicker._updateDatepicker = function(instance) {
      _updateDatepicker_o.apply(this, [instance]);
      return addPopUp(instance.drawYear, instance.drawMonth + 1, instance.id);
    };
    getMonthEvents = function(year, month) {
      if (month === 0) {
        month = 1;
      }
      return $.getJSON(window.location.origin + '/json/events/' + year + '/' + month, function(data) {
        var e, events, evnt, _i, _len;
        events = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          e = data[_i];
          evnt = {
            title: e.title,
            category: event_categories[e.category],
            date: new Date(e.date),
            time: e.time,
            event_id: e.event_id
          };
          events.push(evnt);
        }
        monthly_events = [];
        monthly_events = events;
        return $("div.calendar").datepicker("refresh");
      });
    };
    removeEventsPopUp = function() {
      if ($(".pop-cal-container").length) {
        return $(".pop-cal-container").remove();
      }
    };
    renderDayEventsPopUp = function(event_cell) {
      var content, event_data, evnt, evt, group, groups, section, target_url, _i, _j, _len, _len1;
      removeEventsPopUp();
      event_data = event_cell.data("evnts");
      section = $('<section class="pop-cal-container"><i class="pop-cal-arrow"></i></section>');
      content = $('<div class="pop-cal-content"></div>');
      groups = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = event_data.length; _i < _len; _i++) {
          evnt = event_data[_i];
          _results.push(evnt.category);
        }
        return _results;
      })();
      groups = groups.unique();
      for (_i = 0, _len = groups.length; _i < _len; _i++) {
        group = groups[_i];
        content.append("<header><h1 class=\"color-" + (group.toLowerCase()) + "\">" + group + "</h1</header>");
        for (_j = 0, _len1 = event_data.length; _j < _len1; _j++) {
          evt = event_data[_j];
          if (group === evt.category) {
            target_url = "https://webformsrig01bo3.blackbaudhosting.com/48291/page.aspx?pid=196&tab=2&txobjid=" + evt.event_id;
            content.append("<a target=\"_blank\" href=\"" + target_url + "\">" + evt.title);
            content.append("<span>" + evt.time + "</span>");
          }
        }
      }
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
        events = monthly_events;
        matching = $.grep(events, function(event) {
          var d;
          d = new Date(event.date);
          return parseInt(d.getDate().valueOf()) === parseInt($elem.children("a").text().valueOf());
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
      events = monthly_events;
      matching = $.grep(events, function(event) {
        var d;
        d = new Date(event.date);
        return d.valueOf() === date.valueOf();
      });
      if (matching.length) {
        result = [true, 'highlight', null];
      }
      return result;
    };
    today = new Date();
    getMonthEvents(today.getFullYear(), today.getMonth());
    $("div.calendar").datepicker({
      inline: true,
      showOtherMonths: true,
      dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      beforeShowDay: highlightDaysWithEvents,
      onChangeMonthYear: getMonthEvents
    });
    return $("body").on("click", function(event) {
      return removeEventsPopUp();
    });
  });

}).call(this);
