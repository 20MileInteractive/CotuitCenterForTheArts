(function() {

  $(function() {
    var addPopUp, chosenProgramList, eventReadMore, event_categories, getMonthEvents, highlightDaysWithEvents, homeTabs, monthly_events, navMenu, removeEventsPopUp, renderDayEventsPopUp, today, togglePackage, _updateDatepicker_o;
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
    	----------------------
    	Program List drop down
    	----------------------
    */

    chosenProgramList = $("#program-list-select").chosen();
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
            event_id: e.event_id,
            target_url: e.target_url,
            ee_url: e.ee_url
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
            target_url = evt.ee_url === '' ? "<a target=\"_blank\" href=\"" + evt.target_url + "\">" + evt.title : "<a href=\"" + evt.ee_url + "\">" + evt.title;
            content.append(target_url);
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


/*
Chosen source: generate output using 'cake build'
Copyright (c) 2011 by Harvest
*/


(function() {
  var $, Chosen, get_side_border_padding, root,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  root = this;

  $ = jQuery;

  $.fn.extend({
    chosen: function(options) {
      if ($.browser.msie && ($.browser.version === "6.0" || ($.browser.version === "7.0" && document.documentMode === 7))) {
        return this;
      }
      return this.each(function(input_field) {
        var $this;
        $this = $(this);
        if (!$this.hasClass("chzn-done")) {
          return $this.data('chosen', new Chosen(this, options));
        }
      });
    }
  });

  Chosen = (function(_super) {

    __extends(Chosen, _super);

    function Chosen() {
      return Chosen.__super__.constructor.apply(this, arguments);
    }

    Chosen.prototype.setup = function() {
      this.form_field_jq = $(this.form_field);
      this.current_value = this.form_field_jq.val();
      return this.is_rtl = this.form_field_jq.hasClass("chzn-rtl");
    };

    Chosen.prototype.finish_setup = function() {
      return this.form_field_jq.addClass("chzn-done");
    };

    Chosen.prototype.set_up_html = function() {
      var container_classes, container_div, container_props, dd_top, dd_width, sf_width;
      this.container_id = this.form_field.id.length ? this.form_field.id.replace(/[^\w]/g, '_') : this.generate_field_id();
      this.container_id += "_chzn";
      container_classes = ["chzn-container"];
      container_classes.push("chzn-container-" + (this.is_multiple ? "multi" : "single"));
      if (this.inherit_select_classes && this.form_field.className) {
        container_classes.push(this.form_field.className);
      }
      if (this.is_rtl) {
        container_classes.push("chzn-rtl");
      }
      this.f_width = this.form_field_jq.outerWidth();
      container_props = {
        id: this.container_id,
        "class": container_classes.join(' '),
        style: 'width: ' + this.f_width + 'px;',
        title: this.form_field.title
      };
      container_div = $("<div />", container_props);
      if (this.is_multiple) {
        container_div.html('<ul class="chzn-choices"><li class="search-field"><input type="text" value="' + this.default_text + '" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chzn-drop" style="left:-9000px;"><ul class="chzn-results"></ul></div>');
      } else {
        container_div.html('<a href="javascript:void(0)" class="chzn-single chzn-default" tabindex="-1"><span>' + this.default_text + '</span><div><b></b></div></a><div class="chzn-drop" style="left:-9000px;"><div class="chzn-search"><input type="text" autocomplete="off" /></div><ul class="chzn-results"></ul></div>');
      }
      this.form_field_jq.hide().after(container_div);
      this.container = $('#' + this.container_id);
      this.dropdown = this.container.find('div.chzn-drop').first();
      dd_top = this.container.height();
      dd_width = this.f_width - get_side_border_padding(this.dropdown);
      this.dropdown.css({
        "width": dd_width + "px",
        "top": dd_top + "px"
      });
      this.search_field = this.container.find('input').first();
      this.search_results = this.container.find('ul.chzn-results').first();
      this.search_field_scale();
      this.search_no_results = this.container.find('li.no-results').first();
      if (this.is_multiple) {
        this.search_choices = this.container.find('ul.chzn-choices').first();
        this.search_container = this.container.find('li.search-field').first();
      } else {
        this.search_container = this.container.find('div.chzn-search').first();
        this.selected_item = this.container.find('.chzn-single').first();
        sf_width = dd_width - get_side_border_padding(this.search_container) - get_side_border_padding(this.search_field);
        this.search_field.css({
          "width": sf_width + "px"
        });
      }
      this.results_build();
      this.set_tab_index();
      return this.form_field_jq.trigger("liszt:ready", {
        chosen: this
      });
    };

    Chosen.prototype.register_observers = function() {
      var _this = this;
      this.container.mousedown(function(evt) {
        return _this.container_mousedown(evt);
      });
      this.container.mouseup(function(evt) {
        return _this.container_mouseup(evt);
      });
      this.container.mouseenter(function(evt) {
        return _this.mouse_enter(evt);
      });
      this.container.mouseleave(function(evt) {
        return _this.mouse_leave(evt);
      });
      this.search_results.mouseup(function(evt) {
        return _this.search_results_mouseup(evt);
      });
      this.search_results.mouseover(function(evt) {
        return _this.search_results_mouseover(evt);
      });
      this.search_results.mouseout(function(evt) {
        return _this.search_results_mouseout(evt);
      });
      this.form_field_jq.bind("liszt:updated", function(evt) {
        return _this.results_update_field(evt);
      });
      this.form_field_jq.bind("liszt:activate", function(evt) {
        return _this.activate_field(evt);
      });
      this.form_field_jq.bind("liszt:open", function(evt) {
        return _this.container_mousedown(evt);
      });
      this.search_field.blur(function(evt) {
        return _this.input_blur(evt);
      });
      this.search_field.keyup(function(evt) {
        return _this.keyup_checker(evt);
      });
      this.search_field.keydown(function(evt) {
        return _this.keydown_checker(evt);
      });
      this.search_field.focus(function(evt) {
        return _this.input_focus(evt);
      });
      if (this.is_multiple) {
        return this.search_choices.click(function(evt) {
          return _this.choices_click(evt);
        });
      } else {
        return this.container.click(function(evt) {
          return evt.preventDefault();
        });
      }
    };

    Chosen.prototype.search_field_disabled = function() {
      this.is_disabled = this.form_field_jq[0].disabled;
      if (this.is_disabled) {
        this.container.addClass('chzn-disabled');
        this.search_field[0].disabled = true;
        if (!this.is_multiple) {
          this.selected_item.unbind("focus", this.activate_action);
        }
        return this.close_field();
      } else {
        this.container.removeClass('chzn-disabled');
        this.search_field[0].disabled = false;
        if (!this.is_multiple) {
          return this.selected_item.bind("focus", this.activate_action);
        }
      }
    };

    Chosen.prototype.container_mousedown = function(evt) {
      var target_closelink;
      if (!this.is_disabled) {
        target_closelink = evt != null ? ($(evt.target)).hasClass("search-choice-close") : false;
        if (evt && evt.type === "mousedown" && !this.results_showing) {
          evt.preventDefault();
        }
        if (!this.pending_destroy_click && !target_closelink) {
          if (!this.active_field) {
            if (this.is_multiple) {
              this.search_field.val("");
            }
            $(document).click(this.click_test_action);
            this.results_show();
          } else if (!this.is_multiple && evt && (($(evt.target)[0] === this.selected_item[0]) || $(evt.target).parents("a.chzn-single").length)) {
            evt.preventDefault();
            this.results_toggle();
          }
          return this.activate_field();
        } else {
          return this.pending_destroy_click = false;
        }
      }
    };

    Chosen.prototype.container_mouseup = function(evt) {
      if (evt.target.nodeName === "ABBR" && !this.is_disabled) {
        return this.results_reset(evt);
      }
    };

    Chosen.prototype.blur_test = function(evt) {
      if (!this.active_field && this.container.hasClass("chzn-container-active")) {
        return this.close_field();
      }
    };

    Chosen.prototype.close_field = function() {
      $(document).unbind("click", this.click_test_action);
      this.active_field = false;
      this.results_hide();
      this.container.removeClass("chzn-container-active");
      this.winnow_results_clear();
      this.clear_backstroke();
      this.show_search_field_default();
      return this.search_field_scale();
    };

    Chosen.prototype.activate_field = function() {
      this.container.addClass("chzn-container-active");
      this.active_field = true;
      this.search_field.val(this.search_field.val());
      return this.search_field.focus();
    };

    Chosen.prototype.test_active_click = function(evt) {
      if ($(evt.target).parents('#' + this.container_id).length) {
        return this.active_field = true;
      } else {
        return this.close_field();
      }
    };

    Chosen.prototype.results_build = function() {
      var content, data, _i, _len, _ref;
      this.parsing = true;
      this.results_data = root.SelectParser.select_to_array(this.form_field);
      if (this.is_multiple && this.choices > 0) {
        this.search_choices.find("li.search-choice").remove();
        this.choices = 0;
      } else if (!this.is_multiple) {
        this.selected_item.addClass("chzn-default").find("span").text(this.default_text);
        if (this.disable_search || this.form_field.options.length <= this.disable_search_threshold) {
          this.container.addClass("chzn-container-single-nosearch");
        } else {
          this.container.removeClass("chzn-container-single-nosearch");
        }
      }
      content = '';
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        data = _ref[_i];
        if (data.group) {
          content += this.result_add_group(data);
        } else if (!data.empty) {
          content += this.result_add_option(data);
          if (data.selected && this.is_multiple) {
            this.choice_build(data);
          } else if (data.selected && !this.is_multiple) {
            this.selected_item.removeClass("chzn-default").find("span").text(data.text);
            if (this.allow_single_deselect) {
              this.single_deselect_control_build();
            }
          }
        }
      }
      this.search_field_disabled();
      this.show_search_field_default();
      this.search_field_scale();
      this.search_results.html(content);
      return this.parsing = false;
    };

    Chosen.prototype.result_add_group = function(group) {
      if (!group.disabled) {
        group.dom_id = this.container_id + "_g_" + group.array_index;
        return '<li id="' + group.dom_id + '" class="group-result">' + $("<div />").text(group.label).html() + '</li>';
      } else {
        return "";
      }
    };

    Chosen.prototype.result_do_highlight = function(el) {
      var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
      if (el.length) {
        this.result_clear_highlight();
        this.result_highlight = el;
        this.result_highlight.addClass("highlighted");
        maxHeight = parseInt(this.search_results.css("maxHeight"), 10);
        visible_top = this.search_results.scrollTop();
        visible_bottom = maxHeight + visible_top;
        high_top = this.result_highlight.position().top + this.search_results.scrollTop();
        high_bottom = high_top + this.result_highlight.outerHeight();
        if (high_bottom >= visible_bottom) {
          return this.search_results.scrollTop((high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0);
        } else if (high_top < visible_top) {
          return this.search_results.scrollTop(high_top);
        }
      }
    };

    Chosen.prototype.result_clear_highlight = function() {
      if (this.result_highlight) {
        this.result_highlight.removeClass("highlighted");
      }
      return this.result_highlight = null;
    };

    Chosen.prototype.results_show = function() {
      var dd_top;
      if (!this.is_multiple) {
        this.selected_item.addClass("chzn-single-with-drop");
        if (this.result_single_selected) {
          this.result_do_highlight(this.result_single_selected);
        }
      } else if (this.max_selected_options <= this.choices) {
        this.form_field_jq.trigger("liszt:maxselected", {
          chosen: this
        });
        return false;
      }
      dd_top = this.is_multiple ? this.container.height() : this.container.height() - 1;
      this.form_field_jq.trigger("liszt:showing_dropdown", {
        chosen: this
      });
      this.dropdown.css({
        "top": dd_top + "px",
        "left": 0
      });
      this.results_showing = true;
      this.search_field.focus();
      this.search_field.val(this.search_field.val());
      return this.winnow_results();
    };

    Chosen.prototype.results_hide = function() {
      if (!this.is_multiple) {
        this.selected_item.removeClass("chzn-single-with-drop");
      }
      this.result_clear_highlight();
      this.form_field_jq.trigger("liszt:hiding_dropdown", {
        chosen: this
      });
      this.dropdown.css({
        "left": "-9000px"
      });
      return this.results_showing = false;
    };

    Chosen.prototype.set_tab_index = function(el) {
      var ti;
      if (this.form_field_jq.attr("tabindex")) {
        ti = this.form_field_jq.attr("tabindex");
        this.form_field_jq.attr("tabindex", -1);
        return this.search_field.attr("tabindex", ti);
      }
    };

    Chosen.prototype.show_search_field_default = function() {
      if (this.is_multiple && this.choices < 1 && !this.active_field) {
        this.search_field.val(this.default_text);
        return this.search_field.addClass("default");
      } else {
        this.search_field.val("");
        return this.search_field.removeClass("default");
      }
    };

    Chosen.prototype.search_results_mouseup = function(evt) {
      var target;
      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target.length) {
        this.result_highlight = target;
        this.result_select(evt);
        return this.search_field.focus();
      }
    };

    Chosen.prototype.search_results_mouseover = function(evt) {
      var target;
      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target) {
        return this.result_do_highlight(target);
      }
    };

    Chosen.prototype.search_results_mouseout = function(evt) {
      if ($(evt.target).hasClass("active-result" || $(evt.target).parents('.active-result').first())) {
        return this.result_clear_highlight();
      }
    };

    Chosen.prototype.choices_click = function(evt) {
      evt.preventDefault();
      if (this.active_field && !($(evt.target).hasClass("search-choice" || $(evt.target).parents('.search-choice').first)) && !this.results_showing) {
        return this.results_show();
      }
    };

    Chosen.prototype.choice_build = function(item) {
      var choice_id, html, link,
        _this = this;
      if (this.is_multiple && this.max_selected_options <= this.choices) {
        this.form_field_jq.trigger("liszt:maxselected", {
          chosen: this
        });
        return false;
      }
      choice_id = this.container_id + "_c_" + item.array_index;
      this.choices += 1;
      if (item.disabled) {
        html = '<li class="search-choice search-choice-disabled" id="' + choice_id + '"><span>' + item.html + '</span></li>';
      } else {
        html = '<li class="search-choice" id="' + choice_id + '"><span>' + item.html + '</span><a href="javascript:void(0)" class="search-choice-close" rel="' + item.array_index + '"></a></li>';
      }
      this.search_container.before(html);
      link = $('#' + choice_id).find("a").first();
      return link.click(function(evt) {
        return _this.choice_destroy_link_click(evt);
      });
    };

    Chosen.prototype.choice_destroy_link_click = function(evt) {
      evt.preventDefault();
      if (!this.is_disabled) {
        this.pending_destroy_click = true;
        return this.choice_destroy($(evt.target));
      } else {
        return evt.stopPropagation;
      }
    };

    Chosen.prototype.choice_destroy = function(link) {
      if (this.result_deselect(link.attr("rel"))) {
        this.choices -= 1;
        this.show_search_field_default();
        if (this.is_multiple && this.choices > 0 && this.search_field.val().length < 1) {
          this.results_hide();
        }
        link.parents('li').first().remove();
        return this.search_field_scale();
      }
    };

    Chosen.prototype.results_reset = function() {
      this.form_field.options[0].selected = true;
      this.selected_item.find("span").text(this.default_text);
      if (!this.is_multiple) {
        this.selected_item.addClass("chzn-default");
      }
      this.show_search_field_default();
      this.results_reset_cleanup();
      this.form_field_jq.trigger("change");
      if (this.active_field) {
        return this.results_hide();
      }
    };

    Chosen.prototype.results_reset_cleanup = function() {
      this.current_value = this.form_field_jq.val();
      return this.selected_item.find("abbr").remove();
    };

    Chosen.prototype.result_select = function(evt) {
      var high, high_id, item, position;
      if (this.result_highlight) {
        high = this.result_highlight;
        high_id = high.attr("id");
        this.result_clear_highlight();
        if (this.is_multiple) {
          this.result_deactivate(high);
        } else {
          this.search_results.find(".result-selected").removeClass("result-selected");
          this.result_single_selected = high;
          this.selected_item.removeClass("chzn-default");
        }
        high.addClass("result-selected");
        position = high_id.substr(high_id.lastIndexOf("_") + 1);
        item = this.results_data[position];
        item.selected = true;
        this.form_field.options[item.options_index].selected = true;
        if (this.is_multiple) {
          this.choice_build(item);
        } else {
          this.selected_item.find("span").first().text(item.text);
          if (this.allow_single_deselect) {
            this.single_deselect_control_build();
          }
        }
        if (!((evt.metaKey || evt.ctrlKey) && this.is_multiple)) {
          this.results_hide();
        }
        this.search_field.val("");
        if (this.is_multiple || this.form_field_jq.val() !== this.current_value) {
          this.form_field_jq.trigger("change", {
            'selected': this.form_field.options[item.options_index].value
          });
        }
        this.current_value = this.form_field_jq.val();
        return this.search_field_scale();
      }
    };

    Chosen.prototype.result_activate = function(el) {
      return el.addClass("active-result");
    };

    Chosen.prototype.result_deactivate = function(el) {
      return el.removeClass("active-result");
    };

    Chosen.prototype.result_deselect = function(pos) {
      var result, result_data;
      result_data = this.results_data[pos];
      if (!this.form_field.options[result_data.options_index].disabled) {
        result_data.selected = false;
        this.form_field.options[result_data.options_index].selected = false;
        result = $("#" + this.container_id + "_o_" + pos);
        result.removeClass("result-selected").addClass("active-result").show();
        this.result_clear_highlight();
        this.winnow_results();
        this.form_field_jq.trigger("change", {
          deselected: this.form_field.options[result_data.options_index].value
        });
        this.search_field_scale();
        return true;
      } else {
        return false;
      }
    };

    Chosen.prototype.single_deselect_control_build = function() {
      if (this.allow_single_deselect && this.selected_item.find("abbr").length < 1) {
        return this.selected_item.find("span").first().after("<abbr class=\"search-choice-close\"></abbr>");
      }
    };

    Chosen.prototype.winnow_results = function() {
      var found, option, part, parts, regex, regexAnchor, result, result_id, results, searchText, startpos, text, zregex, _i, _j, _len, _len1, _ref;
      this.no_results_clear();
      results = 0;
      searchText = this.search_field.val() === this.default_text ? "" : $('<div/>').text($.trim(this.search_field.val())).html();
      regexAnchor = this.search_contains ? "" : "^";
      regex = new RegExp(regexAnchor + searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'i');
      zregex = new RegExp(searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'i');
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        if (!option.disabled && !option.empty) {
          if (option.group) {
            $('#' + option.dom_id).css('display', 'none');
          } else if (!(this.is_multiple && option.selected)) {
            found = false;
            result_id = option.dom_id;
            result = $("#" + result_id);
            if (regex.test(option.html)) {
              found = true;
              results += 1;
            } else if (this.enable_split_word_search && (option.html.indexOf(" ") >= 0 || option.html.indexOf("[") === 0)) {
              parts = option.html.replace(/\[|\]/g, "").split(" ");
              if (parts.length) {
                for (_j = 0, _len1 = parts.length; _j < _len1; _j++) {
                  part = parts[_j];
                  if (regex.test(part)) {
                    found = true;
                    results += 1;
                  }
                }
              }
            }
            if (found) {
              if (searchText.length) {
                startpos = option.html.search(zregex);
                text = option.html.substr(0, startpos + searchText.length) + '</em>' + option.html.substr(startpos + searchText.length);
                text = text.substr(0, startpos) + '<em>' + text.substr(startpos);
              } else {
                text = option.html;
              }
              result.html(text);
              this.result_activate(result);
              if (option.group_array_index != null) {
                $("#" + this.results_data[option.group_array_index].dom_id).css('display', 'list-item');
              }
            } else {
              if (this.result_highlight && result_id === this.result_highlight.attr('id')) {
                this.result_clear_highlight();
              }
              this.result_deactivate(result);
            }
          }
        }
      }
      if (results < 1 && searchText.length) {
        return this.no_results(searchText);
      } else {
        return this.winnow_results_set_highlight();
      }
    };

    Chosen.prototype.winnow_results_clear = function() {
      var li, lis, _i, _len, _results;
      this.search_field.val("");
      lis = this.search_results.find("li");
      _results = [];
      for (_i = 0, _len = lis.length; _i < _len; _i++) {
        li = lis[_i];
        li = $(li);
        if (li.hasClass("group-result")) {
          _results.push(li.css('display', 'auto'));
        } else if (!this.is_multiple || !li.hasClass("result-selected")) {
          _results.push(this.result_activate(li));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Chosen.prototype.winnow_results_set_highlight = function() {
      var do_high, selected_results;
      if (!this.result_highlight) {
        selected_results = !this.is_multiple ? this.search_results.find(".result-selected.active-result") : [];
        do_high = selected_results.length ? selected_results.first() : this.search_results.find(".active-result").first();
        if (do_high != null) {
          return this.result_do_highlight(do_high);
        }
      }
    };

    Chosen.prototype.no_results = function(terms) {
      var no_results_html;
      no_results_html = $('<li class="no-results">' + this.results_none_found + ' "<span></span>"</li>');
      no_results_html.find("span").first().html(terms);
      return this.search_results.append(no_results_html);
    };

    Chosen.prototype.no_results_clear = function() {
      return this.search_results.find(".no-results").remove();
    };

    Chosen.prototype.keydown_arrow = function() {
      var first_active, next_sib;
      if (!this.result_highlight) {
        first_active = this.search_results.find("li.active-result").first();
        if (first_active) {
          this.result_do_highlight($(first_active));
        }
      } else if (this.results_showing) {
        next_sib = this.result_highlight.nextAll("li.active-result").first();
        if (next_sib) {
          this.result_do_highlight(next_sib);
        }
      }
      if (!this.results_showing) {
        return this.results_show();
      }
    };

    Chosen.prototype.keyup_arrow = function() {
      var prev_sibs;
      if (!this.results_showing && !this.is_multiple) {
        return this.results_show();
      } else if (this.result_highlight) {
        prev_sibs = this.result_highlight.prevAll("li.active-result");
        if (prev_sibs.length) {
          return this.result_do_highlight(prev_sibs.first());
        } else {
          if (this.choices > 0) {
            this.results_hide();
          }
          return this.result_clear_highlight();
        }
      }
    };

    Chosen.prototype.keydown_backstroke = function() {
      var next_available_destroy;
      if (this.pending_backstroke) {
        this.choice_destroy(this.pending_backstroke.find("a").first());
        return this.clear_backstroke();
      } else {
        next_available_destroy = this.search_container.siblings("li.search-choice").last();
        if (next_available_destroy.length && !next_available_destroy.hasClass("search-choice-disabled")) {
          this.pending_backstroke = next_available_destroy;
          if (this.single_backstroke_delete) {
            return this.keydown_backstroke();
          } else {
            return this.pending_backstroke.addClass("search-choice-focus");
          }
        }
      }
    };

    Chosen.prototype.clear_backstroke = function() {
      if (this.pending_backstroke) {
        this.pending_backstroke.removeClass("search-choice-focus");
      }
      return this.pending_backstroke = null;
    };

    Chosen.prototype.keydown_checker = function(evt) {
      var stroke, _ref;
      stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
      this.search_field_scale();
      if (stroke !== 8 && this.pending_backstroke) {
        this.clear_backstroke();
      }
      switch (stroke) {
        case 8:
          this.backstroke_length = this.search_field.val().length;
          break;
        case 9:
          if (this.results_showing && !this.is_multiple) {
            this.result_select(evt);
          }
          this.mouse_on_container = false;
          break;
        case 13:
          evt.preventDefault();
          break;
        case 38:
          evt.preventDefault();
          this.keyup_arrow();
          break;
        case 40:
          this.keydown_arrow();
          break;
      }
    };

    Chosen.prototype.search_field_scale = function() {
      var dd_top, div, h, style, style_block, styles, w, _i, _len;
      if (this.is_multiple) {
        h = 0;
        w = 0;
        style_block = "position:absolute; left: -1000px; top: -1000px; display:none;";
        styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
        for (_i = 0, _len = styles.length; _i < _len; _i++) {
          style = styles[_i];
          style_block += style + ":" + this.search_field.css(style) + ";";
        }
        div = $('<div />', {
          'style': style_block
        });
        div.text(this.search_field.val());
        $('body').append(div);
        w = div.width() + 25;
        div.remove();
        if (w > this.f_width - 10) {
          w = this.f_width - 10;
        }
        this.search_field.css({
          'width': w + 'px'
        });
        dd_top = this.container.height();
        return this.dropdown.css({
          "top": dd_top + "px"
        });
      }
    };

    Chosen.prototype.generate_random_id = function() {
      var string;
      string = "sel" + this.generate_random_char() + this.generate_random_char() + this.generate_random_char();
      while ($("#" + string).length > 0) {
        string += this.generate_random_char();
      }
      return string;
    };

    return Chosen;

  })(AbstractChosen);

  root.Chosen = Chosen;

  get_side_border_padding = function(elmt) {
    var side_border_padding;
    return side_border_padding = elmt.outerWidth() - elmt.width();
  };

  root.get_side_border_padding = get_side_border_padding;

}).call(this);


/*
Chosen source: generate output using 'cake build'
Copyright (c) 2011 by Harvest
*/


(function() {
  var Chosen, get_side_border_padding, root,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  root = this;

  Chosen = (function(_super) {

    __extends(Chosen, _super);

    function Chosen() {
      return Chosen.__super__.constructor.apply(this, arguments);
    }

    Chosen.prototype.setup = function() {
      this.current_value = this.form_field.value;
      return this.is_rtl = this.form_field.hasClassName("chzn-rtl");
    };

    Chosen.prototype.finish_setup = function() {
      return this.form_field.addClassName("chzn-done");
    };

    Chosen.prototype.set_default_values = function() {
      Chosen.__super__.set_default_values.call(this);
      this.single_temp = new Template('<a href="javascript:void(0)" class="chzn-single chzn-default" tabindex="-1"><span>#{default}</span><div><b></b></div></a><div class="chzn-drop" style="left:-9000px;"><div class="chzn-search"><input type="text" autocomplete="off" /></div><ul class="chzn-results"></ul></div>');
      this.multi_temp = new Template('<ul class="chzn-choices"><li class="search-field"><input type="text" value="#{default}" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chzn-drop" style="left:-9000px;"><ul class="chzn-results"></ul></div>');
      this.choice_temp = new Template('<li class="search-choice" id="#{id}"><span>#{choice}</span><a href="javascript:void(0)" class="search-choice-close" rel="#{position}"></a></li>');
      this.choice_noclose_temp = new Template('<li class="search-choice search-choice-disabled" id="#{id}"><span>#{choice}</span></li>');
      return this.no_results_temp = new Template('<li class="no-results">' + this.results_none_found + ' "<span>#{terms}</span>"</li>');
    };

    Chosen.prototype.set_up_html = function() {
      var base_template, container_classes, container_props, dd_top, dd_width, sf_width;
      this.container_id = this.form_field.identify().replace(/[^\w]/g, '_') + "_chzn";
      container_classes = ["chzn-container"];
      container_classes.push("chzn-container-" + (this.is_multiple ? "multi" : "single"));
      if (this.inherit_select_classes && this.form_field.className) {
        container_classes.push(this.form_field.className);
      }
      if (this.is_rtl) {
        container_classes.push("chzn-rtl");
      }
      this.f_width = this.form_field.getStyle("width") ? parseInt(this.form_field.getStyle("width"), 10) : this.form_field.getWidth();
      container_props = {
        'id': this.container_id,
        'class': container_classes.join(' '),
        'style': 'width: ' + this.f_width + 'px',
        'title': this.form_field.title
      };
      base_template = this.is_multiple ? new Element('div', container_props).update(this.multi_temp.evaluate({
        "default": this.default_text
      })) : new Element('div', container_props).update(this.single_temp.evaluate({
        "default": this.default_text
      }));
      this.form_field.hide().insert({
        after: base_template
      });
      this.container = $(this.container_id);
      this.dropdown = this.container.down('div.chzn-drop');
      dd_top = this.container.getHeight();
      dd_width = this.f_width - get_side_border_padding(this.dropdown);
      this.dropdown.setStyle({
        "width": dd_width + "px",
        "top": dd_top + "px"
      });
      this.search_field = this.container.down('input');
      this.search_results = this.container.down('ul.chzn-results');
      this.search_field_scale();
      this.search_no_results = this.container.down('li.no-results');
      if (this.is_multiple) {
        this.search_choices = this.container.down('ul.chzn-choices');
        this.search_container = this.container.down('li.search-field');
      } else {
        this.search_container = this.container.down('div.chzn-search');
        this.selected_item = this.container.down('.chzn-single');
        sf_width = dd_width - get_side_border_padding(this.search_container) - get_side_border_padding(this.search_field);
        this.search_field.setStyle({
          "width": sf_width + "px"
        });
      }
      this.results_build();
      this.set_tab_index();
      return this.form_field.fire("liszt:ready", {
        chosen: this
      });
    };

    Chosen.prototype.register_observers = function() {
      var _this = this;
      this.container.observe("mousedown", function(evt) {
        return _this.container_mousedown(evt);
      });
      this.container.observe("mouseup", function(evt) {
        return _this.container_mouseup(evt);
      });
      this.container.observe("mouseenter", function(evt) {
        return _this.mouse_enter(evt);
      });
      this.container.observe("mouseleave", function(evt) {
        return _this.mouse_leave(evt);
      });
      this.search_results.observe("mouseup", function(evt) {
        return _this.search_results_mouseup(evt);
      });
      this.search_results.observe("mouseover", function(evt) {
        return _this.search_results_mouseover(evt);
      });
      this.search_results.observe("mouseout", function(evt) {
        return _this.search_results_mouseout(evt);
      });
      this.form_field.observe("liszt:updated", function(evt) {
        return _this.results_update_field(evt);
      });
      this.form_field.observe("liszt:activate", function(evt) {
        return _this.activate_field(evt);
      });
      this.form_field.observe("liszt:open", function(evt) {
        return _this.container_mousedown(evt);
      });
      this.search_field.observe("blur", function(evt) {
        return _this.input_blur(evt);
      });
      this.search_field.observe("keyup", function(evt) {
        return _this.keyup_checker(evt);
      });
      this.search_field.observe("keydown", function(evt) {
        return _this.keydown_checker(evt);
      });
      this.search_field.observe("focus", function(evt) {
        return _this.input_focus(evt);
      });
      if (this.is_multiple) {
        return this.search_choices.observe("click", function(evt) {
          return _this.choices_click(evt);
        });
      } else {
        return this.container.observe("click", function(evt) {
          return evt.preventDefault();
        });
      }
    };

    Chosen.prototype.search_field_disabled = function() {
      this.is_disabled = this.form_field.disabled;
      if (this.is_disabled) {
        this.container.addClassName('chzn-disabled');
        this.search_field.disabled = true;
        if (!this.is_multiple) {
          this.selected_item.stopObserving("focus", this.activate_action);
        }
        return this.close_field();
      } else {
        this.container.removeClassName('chzn-disabled');
        this.search_field.disabled = false;
        if (!this.is_multiple) {
          return this.selected_item.observe("focus", this.activate_action);
        }
      }
    };

    Chosen.prototype.container_mousedown = function(evt) {
      var target_closelink;
      if (!this.is_disabled) {
        target_closelink = evt != null ? evt.target.hasClassName("search-choice-close") : false;
        if (evt && evt.type === "mousedown" && !this.results_showing) {
          evt.stop();
        }
        if (!this.pending_destroy_click && !target_closelink) {
          if (!this.active_field) {
            if (this.is_multiple) {
              this.search_field.clear();
            }
            document.observe("click", this.click_test_action);
            this.results_show();
          } else if (!this.is_multiple && evt && (evt.target === this.selected_item || evt.target.up("a.chzn-single"))) {
            this.results_toggle();
          }
          return this.activate_field();
        } else {
          return this.pending_destroy_click = false;
        }
      }
    };

    Chosen.prototype.container_mouseup = function(evt) {
      if (evt.target.nodeName === "ABBR" && !this.is_disabled) {
        return this.results_reset(evt);
      }
    };

    Chosen.prototype.blur_test = function(evt) {
      if (!this.active_field && this.container.hasClassName("chzn-container-active")) {
        return this.close_field();
      }
    };

    Chosen.prototype.close_field = function() {
      document.stopObserving("click", this.click_test_action);
      this.active_field = false;
      this.results_hide();
      this.container.removeClassName("chzn-container-active");
      this.winnow_results_clear();
      this.clear_backstroke();
      this.show_search_field_default();
      return this.search_field_scale();
    };

    Chosen.prototype.activate_field = function() {
      this.container.addClassName("chzn-container-active");
      this.active_field = true;
      this.search_field.value = this.search_field.value;
      return this.search_field.focus();
    };

    Chosen.prototype.test_active_click = function(evt) {
      if (evt.target.up('#' + this.container_id)) {
        return this.active_field = true;
      } else {
        return this.close_field();
      }
    };

    Chosen.prototype.results_build = function() {
      var content, data, _i, _len, _ref;
      this.parsing = true;
      this.results_data = root.SelectParser.select_to_array(this.form_field);
      if (this.is_multiple && this.choices > 0) {
        this.search_choices.select("li.search-choice").invoke("remove");
        this.choices = 0;
      } else if (!this.is_multiple) {
        this.selected_item.addClassName("chzn-default").down("span").update(this.default_text);
        if (this.disable_search || this.form_field.options.length <= this.disable_search_threshold) {
          this.container.addClassName("chzn-container-single-nosearch");
        } else {
          this.container.removeClassName("chzn-container-single-nosearch");
        }
      }
      content = '';
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        data = _ref[_i];
        if (data.group) {
          content += this.result_add_group(data);
        } else if (!data.empty) {
          content += this.result_add_option(data);
          if (data.selected && this.is_multiple) {
            this.choice_build(data);
          } else if (data.selected && !this.is_multiple) {
            this.selected_item.removeClassName("chzn-default").down("span").update(data.html);
            if (this.allow_single_deselect) {
              this.single_deselect_control_build();
            }
          }
        }
      }
      this.search_field_disabled();
      this.show_search_field_default();
      this.search_field_scale();
      this.search_results.update(content);
      return this.parsing = false;
    };

    Chosen.prototype.result_add_group = function(group) {
      if (!group.disabled) {
        group.dom_id = this.container_id + "_g_" + group.array_index;
        return '<li id="' + group.dom_id + '" class="group-result">' + group.label.escapeHTML() + '</li>';
      } else {
        return "";
      }
    };

    Chosen.prototype.result_do_highlight = function(el) {
      var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
      this.result_clear_highlight();
      this.result_highlight = el;
      this.result_highlight.addClassName("highlighted");
      maxHeight = parseInt(this.search_results.getStyle('maxHeight'), 10);
      visible_top = this.search_results.scrollTop;
      visible_bottom = maxHeight + visible_top;
      high_top = this.result_highlight.positionedOffset().top;
      high_bottom = high_top + this.result_highlight.getHeight();
      if (high_bottom >= visible_bottom) {
        return this.search_results.scrollTop = (high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0;
      } else if (high_top < visible_top) {
        return this.search_results.scrollTop = high_top;
      }
    };

    Chosen.prototype.result_clear_highlight = function() {
      if (this.result_highlight) {
        this.result_highlight.removeClassName('highlighted');
      }
      return this.result_highlight = null;
    };

    Chosen.prototype.results_show = function() {
      var dd_top;
      if (!this.is_multiple) {
        this.selected_item.addClassName('chzn-single-with-drop');
        if (this.result_single_selected) {
          this.result_do_highlight(this.result_single_selected);
        }
      } else if (this.max_selected_options <= this.choices) {
        this.form_field.fire("liszt:maxselected", {
          chosen: this
        });
        return false;
      }
      dd_top = this.is_multiple ? this.container.getHeight() : this.container.getHeight() - 1;
      this.form_field.fire("liszt:showing_dropdown", {
        chosen: this
      });
      this.dropdown.setStyle({
        "top": dd_top + "px",
        "left": 0
      });
      this.results_showing = true;
      this.search_field.focus();
      this.search_field.value = this.search_field.value;
      return this.winnow_results();
    };

    Chosen.prototype.results_hide = function() {
      if (!this.is_multiple) {
        this.selected_item.removeClassName('chzn-single-with-drop');
      }
      this.result_clear_highlight();
      this.form_field.fire("liszt:hiding_dropdown", {
        chosen: this
      });
      this.dropdown.setStyle({
        "left": "-9000px"
      });
      return this.results_showing = false;
    };

    Chosen.prototype.set_tab_index = function(el) {
      var ti;
      if (this.form_field.tabIndex) {
        ti = this.form_field.tabIndex;
        this.form_field.tabIndex = -1;
        return this.search_field.tabIndex = ti;
      }
    };

    Chosen.prototype.show_search_field_default = function() {
      if (this.is_multiple && this.choices < 1 && !this.active_field) {
        this.search_field.value = this.default_text;
        return this.search_field.addClassName("default");
      } else {
        this.search_field.value = "";
        return this.search_field.removeClassName("default");
      }
    };

    Chosen.prototype.search_results_mouseup = function(evt) {
      var target;
      target = evt.target.hasClassName("active-result") ? evt.target : evt.target.up(".active-result");
      if (target) {
        this.result_highlight = target;
        this.result_select(evt);
        return this.search_field.focus();
      }
    };

    Chosen.prototype.search_results_mouseover = function(evt) {
      var target;
      target = evt.target.hasClassName("active-result") ? evt.target : evt.target.up(".active-result");
      if (target) {
        return this.result_do_highlight(target);
      }
    };

    Chosen.prototype.search_results_mouseout = function(evt) {
      if (evt.target.hasClassName('active-result') || evt.target.up('.active-result')) {
        return this.result_clear_highlight();
      }
    };

    Chosen.prototype.choices_click = function(evt) {
      evt.preventDefault();
      if (this.active_field && !(evt.target.hasClassName('search-choice') || evt.target.up('.search-choice')) && !this.results_showing) {
        return this.results_show();
      }
    };

    Chosen.prototype.choice_build = function(item) {
      var choice_id, link,
        _this = this;
      if (this.is_multiple && this.max_selected_options <= this.choices) {
        this.form_field.fire("liszt:maxselected", {
          chosen: this
        });
        return false;
      }
      choice_id = this.container_id + "_c_" + item.array_index;
      this.choices += 1;
      this.search_container.insert({
        before: (item.disabled ? this.choice_noclose_temp : this.choice_temp).evaluate({
          id: choice_id,
          choice: item.html,
          position: item.array_index
        })
      });
      if (!item.disabled) {
        link = $(choice_id).down('a');
        return link.observe("click", function(evt) {
          return _this.choice_destroy_link_click(evt);
        });
      }
    };

    Chosen.prototype.choice_destroy_link_click = function(evt) {
      evt.preventDefault();
      if (!this.is_disabled) {
        this.pending_destroy_click = true;
        return this.choice_destroy(evt.target);
      }
    };

    Chosen.prototype.choice_destroy = function(link) {
      if (this.result_deselect(link.readAttribute("rel"))) {
        this.choices -= 1;
        this.show_search_field_default();
        if (this.is_multiple && this.choices > 0 && this.search_field.value.length < 1) {
          this.results_hide();
        }
        link.up('li').remove();
        return this.search_field_scale();
      }
    };

    Chosen.prototype.results_reset = function() {
      this.form_field.options[0].selected = true;
      this.selected_item.down("span").update(this.default_text);
      if (!this.is_multiple) {
        this.selected_item.addClassName("chzn-default");
      }
      this.show_search_field_default();
      this.results_reset_cleanup();
      if (typeof Event.simulate === 'function') {
        this.form_field.simulate("change");
      }
      if (this.active_field) {
        return this.results_hide();
      }
    };

    Chosen.prototype.results_reset_cleanup = function() {
      var deselect_trigger;
      this.current_value = this.form_field.value;
      deselect_trigger = this.selected_item.down("abbr");
      if (deselect_trigger) {
        return deselect_trigger.remove();
      }
    };

    Chosen.prototype.result_select = function(evt) {
      var high, item, position;
      if (this.result_highlight) {
        high = this.result_highlight;
        this.result_clear_highlight();
        if (this.is_multiple) {
          this.result_deactivate(high);
        } else {
          this.search_results.descendants(".result-selected").invoke("removeClassName", "result-selected");
          this.selected_item.removeClassName("chzn-default");
          this.result_single_selected = high;
        }
        high.addClassName("result-selected");
        position = high.id.substr(high.id.lastIndexOf("_") + 1);
        item = this.results_data[position];
        item.selected = true;
        this.form_field.options[item.options_index].selected = true;
        if (this.is_multiple) {
          this.choice_build(item);
        } else {
          this.selected_item.down("span").update(item.html);
          if (this.allow_single_deselect) {
            this.single_deselect_control_build();
          }
        }
        if (!((evt.metaKey || evt.ctrlKey) && this.is_multiple)) {
          this.results_hide();
        }
        this.search_field.value = "";
        if (typeof Event.simulate === 'function' && (this.is_multiple || this.form_field.value !== this.current_value)) {
          this.form_field.simulate("change");
        }
        this.current_value = this.form_field.value;
        return this.search_field_scale();
      }
    };

    Chosen.prototype.result_activate = function(el) {
      return el.addClassName("active-result");
    };

    Chosen.prototype.result_deactivate = function(el) {
      return el.removeClassName("active-result");
    };

    Chosen.prototype.result_deselect = function(pos) {
      var result, result_data;
      result_data = this.results_data[pos];
      if (!this.form_field.options[result_data.options_index].disabled) {
        result_data.selected = false;
        this.form_field.options[result_data.options_index].selected = false;
        result = $(this.container_id + "_o_" + pos);
        result.removeClassName("result-selected").addClassName("active-result").show();
        this.result_clear_highlight();
        this.winnow_results();
        if (typeof Event.simulate === 'function') {
          this.form_field.simulate("change");
        }
        this.search_field_scale();
        return true;
      } else {
        return false;
      }
    };

    Chosen.prototype.single_deselect_control_build = function() {
      if (this.allow_single_deselect && !this.selected_item.down("abbr")) {
        return this.selected_item.down("span").insert({
          after: "<abbr class=\"search-choice-close\"></abbr>"
        });
      }
    };

    Chosen.prototype.winnow_results = function() {
      var found, option, part, parts, regex, regexAnchor, result_id, results, searchText, startpos, text, zregex, _i, _j, _len, _len1, _ref;
      this.no_results_clear();
      results = 0;
      searchText = this.search_field.value === this.default_text ? "" : this.search_field.value.strip().escapeHTML();
      regexAnchor = this.search_contains ? "" : "^";
      regex = new RegExp(regexAnchor + searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'i');
      zregex = new RegExp(searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'i');
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        if (!option.disabled && !option.empty) {
          if (option.group) {
            $(option.dom_id).hide();
          } else if (!(this.is_multiple && option.selected)) {
            found = false;
            result_id = option.dom_id;
            if (regex.test(option.html)) {
              found = true;
              results += 1;
            } else if (this.enable_split_word_search && (option.html.indexOf(" ") >= 0 || option.html.indexOf("[") === 0)) {
              parts = option.html.replace(/\[|\]/g, "").split(" ");
              if (parts.length) {
                for (_j = 0, _len1 = parts.length; _j < _len1; _j++) {
                  part = parts[_j];
                  if (regex.test(part)) {
                    found = true;
                    results += 1;
                  }
                }
              }
            }
            if (found) {
              if (searchText.length) {
                startpos = option.html.search(zregex);
                text = option.html.substr(0, startpos + searchText.length) + '</em>' + option.html.substr(startpos + searchText.length);
                text = text.substr(0, startpos) + '<em>' + text.substr(startpos);
              } else {
                text = option.html;
              }
              if ($(result_id).innerHTML !== text) {
                $(result_id).update(text);
              }
              this.result_activate($(result_id));
              if (option.group_array_index != null) {
                $(this.results_data[option.group_array_index].dom_id).setStyle({
                  display: 'list-item'
                });
              }
            } else {
              if ($(result_id) === this.result_highlight) {
                this.result_clear_highlight();
              }
              this.result_deactivate($(result_id));
            }
          }
        }
      }
      if (results < 1 && searchText.length) {
        return this.no_results(searchText);
      } else {
        return this.winnow_results_set_highlight();
      }
    };

    Chosen.prototype.winnow_results_clear = function() {
      var li, lis, _i, _len, _results;
      this.search_field.clear();
      lis = this.search_results.select("li");
      _results = [];
      for (_i = 0, _len = lis.length; _i < _len; _i++) {
        li = lis[_i];
        if (li.hasClassName("group-result")) {
          _results.push(li.show());
        } else if (!this.is_multiple || !li.hasClassName("result-selected")) {
          _results.push(this.result_activate(li));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Chosen.prototype.winnow_results_set_highlight = function() {
      var do_high;
      if (!this.result_highlight) {
        if (!this.is_multiple) {
          do_high = this.search_results.down(".result-selected.active-result");
        }
        if (!(do_high != null)) {
          do_high = this.search_results.down(".active-result");
        }
        if (do_high != null) {
          return this.result_do_highlight(do_high);
        }
      }
    };

    Chosen.prototype.no_results = function(terms) {
      return this.search_results.insert(this.no_results_temp.evaluate({
        terms: terms
      }));
    };

    Chosen.prototype.no_results_clear = function() {
      var nr, _results;
      nr = null;
      _results = [];
      while (nr = this.search_results.down(".no-results")) {
        _results.push(nr.remove());
      }
      return _results;
    };

    Chosen.prototype.keydown_arrow = function() {
      var actives, nexts, sibs;
      actives = this.search_results.select("li.active-result");
      if (actives.length) {
        if (!this.result_highlight) {
          this.result_do_highlight(actives.first());
        } else if (this.results_showing) {
          sibs = this.result_highlight.nextSiblings();
          nexts = sibs.intersect(actives);
          if (nexts.length) {
            this.result_do_highlight(nexts.first());
          }
        }
        if (!this.results_showing) {
          return this.results_show();
        }
      }
    };

    Chosen.prototype.keyup_arrow = function() {
      var actives, prevs, sibs;
      if (!this.results_showing && !this.is_multiple) {
        return this.results_show();
      } else if (this.result_highlight) {
        sibs = this.result_highlight.previousSiblings();
        actives = this.search_results.select("li.active-result");
        prevs = sibs.intersect(actives);
        if (prevs.length) {
          return this.result_do_highlight(prevs.first());
        } else {
          if (this.choices > 0) {
            this.results_hide();
          }
          return this.result_clear_highlight();
        }
      }
    };

    Chosen.prototype.keydown_backstroke = function() {
      var next_available_destroy;
      if (this.pending_backstroke) {
        this.choice_destroy(this.pending_backstroke.down("a"));
        return this.clear_backstroke();
      } else {
        next_available_destroy = this.search_container.siblings().last();
        if (next_available_destroy && next_available_destroy.hasClassName("search-choice") && !next_available_destroy.hasClassName("search-choice-disabled")) {
          this.pending_backstroke = next_available_destroy;
          if (this.pending_backstroke) {
            this.pending_backstroke.addClassName("search-choice-focus");
          }
          if (this.single_backstroke_delete) {
            return this.keydown_backstroke();
          } else {
            return this.pending_backstroke.addClassName("search-choice-focus");
          }
        }
      }
    };

    Chosen.prototype.clear_backstroke = function() {
      if (this.pending_backstroke) {
        this.pending_backstroke.removeClassName("search-choice-focus");
      }
      return this.pending_backstroke = null;
    };

    Chosen.prototype.keydown_checker = function(evt) {
      var stroke, _ref;
      stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
      this.search_field_scale();
      if (stroke !== 8 && this.pending_backstroke) {
        this.clear_backstroke();
      }
      switch (stroke) {
        case 8:
          this.backstroke_length = this.search_field.value.length;
          break;
        case 9:
          if (this.results_showing && !this.is_multiple) {
            this.result_select(evt);
          }
          this.mouse_on_container = false;
          break;
        case 13:
          evt.preventDefault();
          break;
        case 38:
          evt.preventDefault();
          this.keyup_arrow();
          break;
        case 40:
          this.keydown_arrow();
          break;
      }
    };

    Chosen.prototype.search_field_scale = function() {
      var dd_top, div, h, style, style_block, styles, w, _i, _len;
      if (this.is_multiple) {
        h = 0;
        w = 0;
        style_block = "position:absolute; left: -1000px; top: -1000px; display:none;";
        styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
        for (_i = 0, _len = styles.length; _i < _len; _i++) {
          style = styles[_i];
          style_block += style + ":" + this.search_field.getStyle(style) + ";";
        }
        div = new Element('div', {
          'style': style_block
        }).update(this.search_field.value.escapeHTML());
        document.body.appendChild(div);
        w = Element.measure(div, 'width') + 25;
        div.remove();
        if (w > this.f_width - 10) {
          w = this.f_width - 10;
        }
        this.search_field.setStyle({
          'width': w + 'px'
        });
        dd_top = this.container.getHeight();
        return this.dropdown.setStyle({
          "top": dd_top + "px"
        });
      }
    };

    return Chosen;

  })(AbstractChosen);

  root.Chosen = Chosen;

  if (Prototype.Browser.IE) {
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
      Prototype.BrowserFeatures['Version'] = new Number(RegExp.$1);
    }
  }

  get_side_border_padding = function(elmt) {
    var layout, side_border_padding;
    layout = new Element.Layout(elmt);
    return side_border_padding = layout.get("border-left") + layout.get("border-right") + layout.get("padding-left") + layout.get("padding-right");
  };

  root.get_side_border_padding = get_side_border_padding;

}).call(this);


/*
Chosen source: generate output using 'cake build'
Copyright (c) 2011 by Harvest
*/


(function() {
  var AbstractChosen, root;

  root = this;

  AbstractChosen = (function() {

    function AbstractChosen(form_field, options) {
      this.form_field = form_field;
      this.options = options != null ? options : {};
      this.is_multiple = this.form_field.multiple;
      this.set_default_text();
      this.set_default_values();
      this.setup();
      this.set_up_html();
      this.register_observers();
      this.finish_setup();
    }

    AbstractChosen.prototype.set_default_values = function() {
      var _this = this;
      this.click_test_action = function(evt) {
        return _this.test_active_click(evt);
      };
      this.activate_action = function(evt) {
        return _this.activate_field(evt);
      };
      this.active_field = false;
      this.mouse_on_container = false;
      this.results_showing = false;
      this.result_highlighted = null;
      this.result_single_selected = null;
      this.allow_single_deselect = (this.options.allow_single_deselect != null) && (this.form_field.options[0] != null) && this.form_field.options[0].text === "" ? this.options.allow_single_deselect : false;
      this.disable_search_threshold = this.options.disable_search_threshold || 0;
      this.disable_search = this.options.disable_search || false;
      this.enable_split_word_search = this.options.enable_split_word_search != null ? this.options.enable_split_word_search : true;
      this.search_contains = this.options.search_contains || false;
      this.choices = 0;
      this.single_backstroke_delete = this.options.single_backstroke_delete || false;
      this.max_selected_options = this.options.max_selected_options || Infinity;
      return this.inherit_select_classes = this.options.inherit_select_classes || false;
    };

    AbstractChosen.prototype.set_default_text = function() {
      if (this.form_field.getAttribute("data-placeholder")) {
        this.default_text = this.form_field.getAttribute("data-placeholder");
      } else if (this.is_multiple) {
        this.default_text = this.options.placeholder_text_multiple || this.options.placeholder_text || "Select Some Options";
      } else {
        this.default_text = this.options.placeholder_text_single || this.options.placeholder_text || "Select an Option";
      }
      return this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || "No results match";
    };

    AbstractChosen.prototype.mouse_enter = function() {
      return this.mouse_on_container = true;
    };

    AbstractChosen.prototype.mouse_leave = function() {
      return this.mouse_on_container = false;
    };

    AbstractChosen.prototype.input_focus = function(evt) {
      var _this = this;
      if (this.is_multiple) {
        if (!this.active_field) {
          return setTimeout((function() {
            return _this.container_mousedown();
          }), 50);
        }
      } else {
        if (!this.active_field) {
          return this.activate_field();
        }
      }
    };

    AbstractChosen.prototype.input_blur = function(evt) {
      var _this = this;
      if (!this.mouse_on_container) {
        this.active_field = false;
        return setTimeout((function() {
          return _this.blur_test();
        }), 100);
      }
    };

    AbstractChosen.prototype.result_add_option = function(option) {
      var classes, style;
      if (!option.disabled) {
        option.dom_id = this.container_id + "_o_" + option.array_index;
        classes = option.selected && this.is_multiple ? [] : ["active-result"];
        if (option.selected) {
          classes.push("result-selected");
        }
        if (option.group_array_index != null) {
          classes.push("group-option");
        }
        if (option.classes !== "") {
          classes.push(option.classes);
        }
        style = option.style.cssText !== "" ? " style=\"" + option.style + "\"" : "";
        return '<li id="' + option.dom_id + '" class="' + classes.join(' ') + '"' + style + '>' + option.html + '</li>';
      } else {
        return "";
      }
    };

    AbstractChosen.prototype.results_update_field = function() {
      if (!this.is_multiple) {
        this.results_reset_cleanup();
      }
      this.result_clear_highlight();
      this.result_single_selected = null;
      return this.results_build();
    };

    AbstractChosen.prototype.results_toggle = function() {
      if (this.results_showing) {
        return this.results_hide();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.results_search = function(evt) {
      if (this.results_showing) {
        return this.winnow_results();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.keyup_checker = function(evt) {
      var stroke, _ref;
      stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
      this.search_field_scale();
      switch (stroke) {
        case 8:
          if (this.is_multiple && this.backstroke_length < 1 && this.choices > 0) {
            return this.keydown_backstroke();
          } else if (!this.pending_backstroke) {
            this.result_clear_highlight();
            return this.results_search();
          }
          break;
        case 13:
          evt.preventDefault();
          if (this.results_showing) {
            return this.result_select(evt);
          }
          break;
        case 27:
          if (this.results_showing) {
            this.results_hide();
          }
          return true;
        case 9:
        case 38:
        case 40:
        case 16:
        case 91:
        case 17:
          break;
        default:
          return this.results_search();
      }
    };

    AbstractChosen.prototype.generate_field_id = function() {
      var new_id;
      new_id = this.generate_random_id();
      this.form_field.id = new_id;
      return new_id;
    };

    AbstractChosen.prototype.generate_random_char = function() {
      var chars, newchar, rand;
      chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      rand = Math.floor(Math.random() * chars.length);
      return newchar = chars.substring(rand, rand + 1);
    };

    return AbstractChosen;

  })();

  root.AbstractChosen = AbstractChosen;

}).call(this);

(function() {
  var SelectParser;

  SelectParser = (function() {

    function SelectParser() {
      this.options_index = 0;
      this.parsed = [];
    }

    SelectParser.prototype.add_node = function(child) {
      if (child.nodeName.toUpperCase() === "OPTGROUP") {
        return this.add_group(child);
      } else {
        return this.add_option(child);
      }
    };

    SelectParser.prototype.add_group = function(group) {
      var group_position, option, _i, _len, _ref, _results;
      group_position = this.parsed.length;
      this.parsed.push({
        array_index: group_position,
        group: true,
        label: group.label,
        children: 0,
        disabled: group.disabled
      });
      _ref = group.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        _results.push(this.add_option(option, group_position, group.disabled));
      }
      return _results;
    };

    SelectParser.prototype.add_option = function(option, group_position, group_disabled) {
      if (option.nodeName.toUpperCase() === "OPTION") {
        if (option.text !== "") {
          if (group_position != null) {
            this.parsed[group_position].children += 1;
          }
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            value: option.value,
            text: option.text,
            html: option.innerHTML,
            selected: option.selected,
            disabled: group_disabled === true ? group_disabled : option.disabled,
            group_array_index: group_position,
            classes: option.className,
            style: option.style.cssText
          });
        } else {
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            empty: true
          });
        }
        return this.options_index += 1;
      }
    };

    return SelectParser;

  })();

  SelectParser.select_to_array = function(select) {
    var child, parser, _i, _len, _ref;
    parser = new SelectParser();
    _ref = select.childNodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      parser.add_node(child);
    }
    return parser.parsed;
  };

  this.SelectParser = SelectParser;

}).call(this);
