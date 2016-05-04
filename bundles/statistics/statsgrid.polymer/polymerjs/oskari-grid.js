Polymer({
  "is": "oskari-grid",
  "properties": {
    "statsToggleClass": {
      "type": String,
      "notify": true,
      "value": "toggleCollapsed"
    },
    "unselectedToggleClass": {
      "type": String,
      "notify": true,
      "value": "toggleCollapsed"
    },
    "selectedToggleClass": {
      "type": String,
      "notify": true,
      "value": "toggleExpanded"
    },
    "indicatorToggleClass": {
      "type": String,
      "notify": true,
      "value": "toggleCollapsedBig"
    },
    "ie": {
      "type": Boolean,
      "notify": true,
      "value": false
    },
    "numIncluded": {
      "type": Number,
      "notify": true,
      "value": 0
    },
    "numExcluded": {
      "type": Number,
      "notify": true,
      "value": 0
    },
    "rows": {
      "type": Array,
      "notify": true
    },
    "selectedRows": {
      "type": Array,
      "notify": true,
      "value": function() { return [];}
    },
    "unselectedRows": {
      "type": Array,
      "notify": true,
      "value": function() { return [];}
    },
    "indicatorExpanded": {
      "type": Boolean,
      "notify": true
    },
    "headers": {
      "type": Array,
      "notify": true
    },
    "numcols": {
      "type": Number,
      "notify": true
    },
    "statsrows": {
      "type": Array,
      "notify": true
    },
    "allSelected": {
      "type": Boolean,
      "notify": true,
      "value": true
    },
    "selectedIndicators": {
      "type": Array,
      "notify": true
    },
    "ajaxUrl": {
      "type": String,
      "notify": true
    },
    "filtering": Boolean,
    "sorting": Boolean,
    "deleting": Boolean
  },
  "observers": [
    "headersChanged(headers)",
    "rowsChanged(rows)"
  ],
  "toggleStats": function() {
    this.$.statsCollapse.toggle();
    this.set('statsToggleClass', (this.$$('#statsCollapse').opened) ? 'toggleExpanded' : 'toggleCollapsed');
    this.resize();
  },
  "toggleUnselected": function() {
    this.$$('#unselectedCollapse').toggle();
    this.set('unselectedToggleClass', (this.$$('#unselectedCollapse').opened) ? 'toggleExpanded' : 'toggleCollapsed');
    this.resize();
  },
  "toggleSelected": function() {
    this.$$('#selectedCollapse').toggle();
    this.set('selectedToggleClass', (this.$$('#selectedCollapse').opened) ? 'toggleExpanded' : 'toggleCollapsed');
    this.resize();
  },
  "toggleIndicators": function() {
    this.indicatorExpanded = !this.indicatorExpanded;
    this.set('indicatorToggleClass', this.indicatorExpanded ? 'toggleExpandedBig' : 'toggleCollapsedBig');
    this.resize();
  },
  "allSelectedChanged": function() {
    var me = this;
    if (me.rows) {
      if (me.allSelected) {
        me.rows.forEach(function (row, index) {
          me.set("rows." + index + ".selected", true);
        });
      } else {
        me.rows.forEach(function (row, index) {
          me.set("rows." + index + ".selected", false);
        });
      }
    }
  },
  "splitRows": function() {
    var me = this;
    me.set("selectedRows", []);
    me.set("unselectedRows", []);
    me.rows.forEach(function (row, index) {
      if (row.selected) {
        me.push("selectedRows", row);
      } else {
        me.push("unselectedRows", row);
      }
    });
    me.numIncluded = me.selectedRows.length;
    me.numExcluded = me.unselectedRows.length;
  },
  "selectionsChanged": function() {
    var me = this;
    me.allSelected = true;
    me.rows.forEach(function (row, index) {
      if (!row.selected) {
        me.allSelected = false;
      }
    });
    // For updating the checkbox states.
    me.rows.forEach(function (row, index) {
      me.set("rows." + index + ".selected", row.selected);
    });
    me.splitRows();
    // $$ needed because these elements are dynamically created inside dom-if
    if (this.$$('#unselectedRowsTemplate')) {
      this.$$('#unselectedRowsTemplate').render();
    }
    // This line causes IE11 to crash.
    // Edge and all other major browsers work fine.
    // Related to this: https://github.com/Polymer/polymer/issues/2292
    // None of the suggested workarounds work.
    this.$.rowsTemplate.render();
    this.fire("onSelectionsChanged", {});
    setTimeout(this.resize.bind(this), 100);
  },
  "headersChanged": function() {
    this.numcols = this.headers.length + 2;
    setTimeout(this.resize.bind(this), 100);
  },
  "rowsChanged": function() {
    this.numcols = this.headers.length + 2;
    this.splitRows();
    setTimeout(this.resize.bind(this), 100);
  },
  /**
   * This is just used for sorting and filtering.
   */
  "refresh": function() {
    this.$.headersTemplate.render();
    this.$.rowsTemplate.render();
    // $$ needed because these elements are dynamically created inside dom-if
    if (this.$$('#unselectedRowsTemplate')) {
      this.$$('#unselectedRowsTemplate').render();
    }
    this.resize();
  },
  "onSort": function(event) {
    if (this.sorting) {
      this.fire("onSort", {index: event.target.index, header: event.target.header});
      this.splitRows();
    }
  },
  "onDelete": function(event) {
    if (this.deleting) {
      this.fire("onDelete", {index: event.target.index, header: event.target.header});
    }
  },
  "onFilter": function(event) {
    if (this.filtering) {
      this.fire("onFilter", {index: event.target.index, header: event.target.header});
    }
  },
  "resize": function() {
    // There is no clean and elegant way of making HTML5 table header float with x and y scrollbars.
    // The cleanest de facto solution is to define the table display as "block", breaking the standard
    // table layout, which makes sure that the table cells resize based on horizontal and vertical content
    // in neighboring cells.
    var statsHeight = jQuery('#statisticsContainer').height();
    if (this.$.statsCollapse.opened) {
      // We have to add this height manually, because it takes time for the statisticsContainer to expand.
      statsHeight += jQuery('#oskari-grid-statistics').height();
    }
    var unselectedHeight = jQuery('#unselectedContainer').height();
    if (this.$$('#unselectedCollapse') && this.$$('#unselectedCollapse').opened) {
      // We have to add this height manually, because it takes time for the statisticsContainer to expand.
      unselectedHeight += Math.min(jQuery('#oskari-grid-unselected').height(), 150);
    }
    var indicatorSelectorHeight = 0;
    if (this.indicatorExpanded) {
      indicatorSelectorHeight += jQuery('#indicatorSelectorDiv').height();
    }
    var headerHeight = jQuery('#oskari-grid-header').height();
    var regionSelectorHeight = jQuery('#region-category-selector').height();
    var totalHeight = jQuery('.statsgrid_100').height() - 10;
    var bodyWidth = jQuery('.statsgrid_100').width() - 10;
    var selectedHeight = jQuery('#selectedContainer').height();

    var gridHeight = totalHeight - indicatorSelectorHeight - regionSelectorHeight;
    var bodyHeight = gridHeight - statsHeight - unselectedHeight - headerHeight - selectedHeight - 20;
    jQuery('#oskariGrid').height(gridHeight);
    jQuery('#oskari-grid-body').height(bodyHeight);
    var colWidthNum = 120;
    var checkboxColWidthNum = 40;
    var colWidth = colWidthNum + 'px';
    var checkboxColWidth = checkboxColWidthNum + 'px';
    var gridWidthNum = 0;
    var lastColIndex = this.headers.length + 1;
    ['checkbox'].concat(this.headers).concat(['addIndicator']).forEach(function(header, headerIndex) {
      // The indexing starts at 1, and the first header column is actually nth-child(3) because of the template.
      var thisColWidthNum = colWidthNum;
      if (headerIndex == 0) {
        thisColWidthNum = checkboxColWidthNum;
      }
      var thisColWidth = thisColWidthNum + 'px';
      var paddingAndBorder = 12;
      gridWidthNum += thisColWidthNum + paddingAndBorder;
      var index = (headerIndex == 0)?(headerIndex + 1):(headerIndex + 2);
      var unselectedColumnIndex = headerIndex + 1;
      if (headerIndex == lastColIndex) {
        // The last column is static, and is preceded by the column repeating template element.
        unselectedColumnIndex++;
        index++;
      }

      jQuery('div#oskari-grid-header > div > div > div:nth-child(' + index + ')').css('max-width', thisColWidth);
      jQuery('div#oskari-grid-header > div > div > div:nth-child(' + index + ')').css('min-width', thisColWidth);
      jQuery('div#oskari-grid-header > div > div > div:nth-child(' + index + ')').css('width', thisColWidth);

      if (headerIndex == lastColIndex) {
        // We will only set a bit of flex for the last column to make space for the scrollbar.
        var lastColMinWidth = (thisColWidthNum - 20) + 'px';
        var lastColStdWidth = (thisColWidthNum - 15) + 'px';
        jQuery('div#oskari-grid-body > div > div:nth-child(' + index + ')').css('max-width', thisColWidth);
        jQuery('div#oskari-grid-body > div > div:nth-child(' + index + ')').css('min-width', lastColMinWidth);
        jQuery('div#oskari-grid-body > div > div:nth-child(' + index + ')').css('width', lastColStdWidth);
        jQuery('div#oskari-grid-unselected > div > div:nth-child(' + unselectedColumnIndex + ')').css('max-width', thisColWidth);
        jQuery('div#oskari-grid-unselected > div > div:nth-child(' + unselectedColumnIndex + ')').css('min-width', lastColMinWidth);
        jQuery('div#oskari-grid-unselected > div > div:nth-child(' + unselectedColumnIndex + ')').css('width', lastColStdWidth);
      } else {
        jQuery('div#oskari-grid-body > div > div:nth-child(' + index + ')').css('max-width', thisColWidth);
        jQuery('div#oskari-grid-body > div > div:nth-child(' + index + ')').css('min-width', thisColWidth);
        jQuery('div#oskari-grid-body > div > div:nth-child(' + index + ')').css('width', thisColWidth);
        jQuery('div#oskari-grid-unselected > div > div:nth-child(' + unselectedColumnIndex + ')').css('max-width', thisColWidth);
        jQuery('div#oskari-grid-unselected > div > div:nth-child(' + unselectedColumnIndex + ')').css('min-width', thisColWidth);
        jQuery('div#oskari-grid-unselected > div > div:nth-child(' + unselectedColumnIndex + ')').css('width', thisColWidth);
      }
    });
    var gridWidth = gridWidthNum + "px";
    jQuery('#statisticsContainer').css('max-width', gridWidth);
    jQuery('#statisticsContainer').css('min-width', gridWidth);
    jQuery('#statisticsContainer').css('width', gridWidth);
    jQuery('.oskari-grid-width').css('max-width', gridWidth);
    jQuery('.oskari-grid-width').css('min-width', gridWidth);
    jQuery('.oskari-grid-width').css('width', gridWidth);
    this.headers.concat('addIndicator').forEach(function(header, headerIndex) {
      // The indexing starts at 1.
      var index = headerIndex + 1;
      var statsColWidth = colWidth;
      // The first column should span the checkbox and the municipality columns.
      if (headerIndex == 0) {
        var paddingAndBorder = 12;
        statsColWidth = (colWidthNum + checkboxColWidthNum + paddingAndBorder) + 'px';
      }
      // There is one fewer columns in the statistics table.
      if (headerIndex == lastColIndex - 1) {
        // The last column is static, and is preceded by the column repeating template element.
        index++;
      }
      if (headerIndex == lastColIndex) {
        // We will only set a bit of flex for the last column to make space for the scrollbar.
        var lastColMinWidth = (statsColWidth - 20) + 'px';
        var lastColStdWidth = (statsColWidth - 15) + 'px';
        jQuery('#oskari-grid-statistics > div > div:nth-child(' + index + ')').css('max-width', statsColWidth);
        jQuery('#oskari-grid-statistics > div > div:nth-child(' + index + ')').css('min-width', lastColMinWidth);
        jQuery('#oskari-grid-statistics > div > div:nth-child(' + index + ')').css('width', lastColStdWidth);
      } else {
        jQuery('#oskari-grid-statistics > div > div:nth-child(' + index + ')').css('max-width', statsColWidth);
        jQuery('#oskari-grid-statistics > div > div:nth-child(' + index + ')').css('min-width', statsColWidth);
        jQuery('#oskari-grid-statistics > div > div:nth-child(' + index + ')').css('width', statsColWidth);
      }
    });
  },
  "ready": function() {
  },
  "attached": function() {
    var me = this;
    me.selectedRows = me.rows;
    this.resize();
    $(window).bind('resize', function(e) {
      me.resize();
    });
    var ua = window.navigator.userAgent;
    // We detect Internet Explorer lower than 12 (Edge) and disable checkboxes, because they cause the browser to crash.
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');
    if (msie > 0 || trident > 0) {
      // msie: IE 10 or older
      // trident: IE 11
      this.ie = true;
    }
  }
});
