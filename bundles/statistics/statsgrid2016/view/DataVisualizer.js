/*
* Creates a flyout with accordion containing charts from Charts.js
*/
Oskari.clazz.define('Oskari.statistics.statsgrid.view.DataVisualizer', function (instance) {
  this.sb = instance.getSandbox();
  this.loc = instance.getLocalization();
  this.isEmbedded = instance.isEmbedded();
  this.instance = instance;
  this.__datachartFlyout = null;
  this.tabsContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer');
  // this.filter = Oskari.clazz.create('Oskari.statistics.statsgrid.Filter', this.instance);
  this.container = null;
  this.service = instance.statsService;
  this._isOpen = false;
  this._barchart = Oskari.clazz.create('Oskari.userinterface.component.Chart', Oskari.getSandbox(), this.loc);
  this.shouldUpdate = false;
  this._select = null;
  this._grid = null;
  this.events();
}, {
  _template: {
    error: _.template('<div class="datacharts-noactive">${ msg }</div>'),
    container: jQuery('<div class="oskari-datacharts" style="padding:20px"></div>'),
    charts: jQuery('<div class="oskari-datacharts" style="padding:20px"></div>'),
    select: jQuery('<div class="dropdown"></div>'),
    tabControl: jQuery('<div class="tab-material-controls"></div>')
  },
  setElement: function ( el ) {
    this.container = el;
  },
  getElement: function () {
    return this.container;
  },
  clearUi: function () {
    this.container = null;
  },
  createUi: function () {
    var el = this._template.container;
    this.clearUi();
    if (this.__datachartFlyout) {
      return this.__datachartFlyout;
    }
    this.addTab();
    var accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
    var panels = this._getPanels();
    for (var i = 0; i < panels.length; i++ ) {
      accordion.addPanel(panels[i]);
    }

    accordion.insertTo(el);
    this.setElement(el);
  },
  getFlyout: function () {
    return this.__datachartFlyout;
  },
  hasActiveIndicator: function () {
    return this.service.getStateService().getActiveIndicator();
  },
  getCharts: function () {
    return this._barchart;
  },
  _getPanels: function () {
    var visualizerPanel = this._createDataVisualizerPanel(this.loc.datacharts.desc);
    // var filterPanel = this._createFilterPanel();
    return [ visualizerPanel ];
  },
  /**
   * Creates an accordion panel for legend and classification edit with eventlisteners on open/close
   * @param  {String} title UI label
   * @return {Oskari.userinterface.component.AccordionPanel} panel without content
   */
   _createDataVisualizerPanel: function (title) {
    var me = this;
    var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
    var container = panel.getContainer();
    container.append(this._template.charts);
    panel.setTitle(title);
    panel.open();
    return panel;
  },
  _createFilterPanel: function () {
    this.filter.setContent(this.createIndicatorSelector(this.loc.datacharts.indicatorVar));
    var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
    var container = panel.getContainer();
    container.append(this.filter.getElement());
    panel.setTitle(this.loc.filter.title);
    return panel;
  },
  _createGrid: function () {
    var gridPoint = jQuery('<div></div>');
    var grid = Oskari.clazz.create('Oskari.statistics.statsgrid.Datatable', this.service, this.sb, this.instance.getLocalization());
    grid.showRegionsetSelector(!this.isEmbedded);
    grid.showIndicatorRemoval(!this.isEmbedded);
    grid.render(gridPoint);
    this._grid = grid;
    return gridPoint;
  },
  createIndicatorSelector: function (title) {
    var me = this;
    var datasources = this.service.getDatasource();
    var panelLoc = this.loc.panels.newSearch;
    if (this.getIndicator() === null) {
      this.shouldUpdate = true;
      return;
    }
    var keyValue = {};

    this.service.getIndicatorMetadata(this.getIndicator().datasource, this.getIndicator().indicator, function (err, indicator) {

      indicator.selectors.forEach(function (selector, index) {
        var selections = [];
        var self = me;
        selector.allowedValues.forEach(function (val) {
          val.selections = {};
          var name = val.name || val.id || val;
          val.title = val.name;
          var optName = (panelLoc.selectionValues[selector.id] && panelLoc.selectionValues[selector.id][name]) ? panelLoc.selectionValues[selector.id][name] : name;
          // ALERT HACK
          // FIXME  Remove this, not needed or get different way
          val.selections.Tiedot = val.id;
          // HACK END

          // save the id as a key in an object and put the selections as value, in the select on change event we can then compare the value we get to the key and get the value
          keyValue[val.id] = val.selections;
          var valObject = {
            id: val.id || val,
            title: optName
          };
          selections.push(valObject);
        });

        var options = {
          placeholder_text: "",
          allow_single_deselect: true,
          disable_search_threshold: 10,
          no_results_text: "locale.panels.newSearch.noResults",
          width: '100%'
        };
        var select = Oskari.clazz.create('Oskari.userinterface.component.SelectList');
        var dropdown = select.create(selections, options);
        dropdown.css({ width: '100%' });
        me._template.select.append(dropdown);
        select.adjustChosen();
        select.selectFirstValue();
        me._select = select;

        var titleHolder = jQuery('<div class="title">' + title + '</div>');
        me._template.tabControl.append(titleHolder);
        me._template.tabControl.append(dropdown);
      });
    });

    me._template.tabControl.on('change', { self: me, keyValue: keyValue }, function (event) {
      // hackish way of setting selected value as and new indicator and then getting the new indicator
      var hash = event.data.self.service.getStateService().getHash(
        event.data.self.getIndicator().datasource,
        event.data.self.getIndicator().indicator,
        event.data.keyValue[event.data.self.getSelect().getValue()]
      );

      event.data.self.service.getStateService().addIndicator(event.data.self.getIndicator().datasource,
        event.data.self.getIndicator().indicator,
        event.data.keyValue[event.data.self.getSelect().getValue()],
        event.data.self.getIndicator().classification);

      var data = event.data.self.getIndicatorData(hash);

      var updated = event.data.self._barchart.redraw(data);
      event.data.self.tabsContainer.panels[0].getContainer().append(updated);
    });

    return this._template.tabControl;
  },

  createColorSelector: function (title) {
    var me = this;
    var selections = [{
      id: "singleColor",
      title: this.loc.datacharts.selectClr
    }, {
      id: "mapClr",
      title: this.loc.datacharts.clrFromMap
    }];

    var options = {
      placeholder_text: this.loc.datacharts.chooseColor,
      allow_single_deselect: true,
      disable_search_threshold: 10,
      no_results_text: "locale.panels.newSearch.noResults",
      width: '100%'
    };
    var select = Oskari.clazz.create('Oskari.userinterface.component.SelectList');
    var dropdown = select.create(selections, options);
    dropdown.css({ width: '100%' });
    me._template.select.append(dropdown);
    select.adjustChosen();

    //update color based on selection
    dropdown.on("change", function (evt) {
        evt.stopPropagation();
        var barchart = me._barchart.createBarChart(me.getIndicatorData(), { activeIndicator: me.getIndicator() });
        me.tabsContainer.panels[1].getContainer().append(barchart);
        me._barchart.redraw();
    });

    var titleEl = jQuery('<div class="title">' + title + '</div>');
    me._template.tabControl.append(titleEl);
    me._template.tabControl.append(dropdown);

    return this._template.tabControl;
  },
  getIndicator: function (hash) {
    if (!hash) {
      return this.service.getStateService().getActiveIndicator();
    } else {
      return this.service.getStateService().getIndicator(hash);
    }
  },
  getRegionset: function () {
    return this.service.getStateService().getRegionset();
  },
  getSelect: function () {
    return this._select;
  },
  getIndicatorData: function (hash) {
    var indicatorData = [];
    var regionsNames = [];
    var activeIndicator = this.getIndicator(hash);
    if (activeIndicator === null) {
      this._template.container.append(this._template.error({ msg: this.loc.legend.noActive }));
      return;
    }
    var regionSet = this.getRegionset();
    this.service.getRegions(regionSet, function (err, regions) {
      regions.forEach(function (reg) {
        regionsNames.push(reg);
      });
    });
    this.service.getIndicatorData(activeIndicator.datasource, activeIndicator.indicator, activeIndicator.selections, regionSet, function (err, data) {
      regionsNames = regionsNames;
      for (var dataset in data) {
        var name = '';
        for (var region in regionsNames) {
          if (regionsNames[region].id === dataset) {
            name = regionsNames[region].name;
          }
        }
        indicatorData.push({ name: name, value: data[dataset] });
      }
    });
    return indicatorData;
  },
  events: function () {
    var me = this;
    // not handele events right now
    return;
    this.service.on('StatsGrid.ActiveIndicatorChangedEvent', function (event) {

      var current = event.getCurrent();
      if (current) {
        if (me.getCharts() !== null) {
          me.createBarCharts();
        }
      }
    });
    this.service.on('StatsGrid.Filter', function(event) {
      var filterOptions = event.getFilter();
    });
  },
  createBarCharts: function () {
    var data = this.getIndicatorData();
    if (data === undefined) {
      Oskari.log("no indicator data");
      return;
    }
    if (!this._barchart.chartIsInitialized()) {
      var barchart = this._barchart.createBarChart(data, { activeIndicator: this.getIndicator() });
      var bEl = jQuery(barchart);
      bEl.css({
        'max-width':'400px',
        'max-height':'400px',
        'overflow':'auto'
      });
      this.tabsContainer.panels[0].getContainer().append(bEl);
    } else {
      var updated = this._barchart.redraw(data);
      this.tabsContainer.panels[0].getContainer().append(updated);
    }
  },
  gridTab: function () {
    var gridPanel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
    gridPanel.setTitle(this.loc.datacharts.table);

    gridPanel.getContainer().prepend(this._createGrid());
    gridPanel.setId('oskari_search_tabpanel_header');
    gridPanel.setPriority(1.0);
    this.tabsContainer.addPanel(gridPanel);

    return gridPanel;
  },
  chartsTab: function () {
    var me = this;
    var chartPanel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
    chartPanel.setTitle(
      this.loc.datacharts.barchart,
      'oskari_datachart_tabpanel_header'
      );
    chartPanel.getContainer().prepend(me.createIndicatorSelector(this.loc.datacharts.indicatorVar));
    chartPanel.getContainer().prepend(me.createColorSelector(this.loc.datacharts.descColor));
    chartPanel.getContainer().prepend(me.createBarCharts());
    chartPanel.setId('oskari_search_tabpanel_header');
    chartPanel.setPriority(1.0);
    this.tabsContainer.addPanel(chartPanel);
  },
  addTab: function () {
    var me = this,
    flyout = jQuery(me.container);
    // Change into tab mode if not already
    if (me.tabsContainer.panels.length === 0) {
      me.tabsContainer.insertTo(flyout);
    }
    this.gridTab();
    this.chartsTab();
    this._template.charts.append(me.tabsContainer.ui);
  },
  isVisible: function () {
    return this._isOpen;
  }
}, {
  extend: ['Oskari.userinterface.extension.DefaultView']
});
