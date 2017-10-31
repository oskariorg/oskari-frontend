/*
* Creates a flyout with tabs for different ways of visualizing data
*/
Oskari.clazz.define('Oskari.statistics.statsgrid.view.DataVisualizer', function (instance) {
  this.sb = instance.getSandbox();
  this.loc = instance.getLocalization();
  this.isEmbedded = instance.isEmbedded();
  this.instance = instance;
  this.tabsContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer');
  this.container = null;
  this.service = instance.statsService;
  this._isOpen = false;
  this._barchart = Oskari.clazz.create('Oskari.userinterface.component.Chart', Oskari.getSandbox(), this.loc);
  this._select = null;
  this._grid = null;
  this._chart = null;
  this.events();
}, {
  _template: {
    error: _.template('<div class="datacharts-noactive">${ msg }</div>'),
    container: jQuery('<div class="oskari-datacharts" style=""></div>'),
    charts: jQuery('<div class="oskari-datacharts" style=""></div>'),
    select: jQuery('<div class="dropdown"></div>'),
    chartControls: jQuery('<div class="chart-controls"></div>')
  },
  setElement: function ( el ) {
    this.container = el;
  },
  getElement: function () {
    return this.container;
  },
  getPanel: function ( id ) {
    var foundPanel;
    this.tabsContainer.panels.forEach( function ( panel ) {
       if( panel.id === id) {
          foundPanel = panel;
       }
    });
    return foundPanel.getContainer();
  },
  clearUi: function () {
    this.container = null;
  },
  createUi: function () {
    var el = this._template.container;
    this.clearUi();
    this.addTab();
    var accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
    var panels = this._getPanels();
    for (var i = 0; i < panels.length; i++ ) {
      accordion.addPanel(panels[i]);
    }

    accordion.insertTo(el);
    this.setElement(el);
  },
  hasActiveIndicator: function () {
    return this.service.getStateService().getActiveIndicator();
  },
  getCharts: function () {
    return this._barchart;
  },
  _getPanels: function () {
    var visualizerPanel = this._createDataVisualizerPanel( this.loc.datacharts.desc );
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
  _createGrid: function () {
    var gridPoint = jQuery('<div></div>');
    var grid = Oskari.clazz.create('Oskari.statistics.statsgrid.Datatable',this.sb, this.instance.getLocalization());
    grid.showRegionsetSelector(!this.isEmbedded);
    grid.showIndicatorRemoval(!this.isEmbedded);
    grid.render(gridPoint);
    this._grid = grid;
    return gridPoint;
  },
  getIndicatorUILabels: function ( option ) {
      var indicatorData;
      var label = function ( data ) {
        indicatorData = data;
      }
      this.service.getUILabels( option, label );
      return indicatorData;
  },
  createIndicatorSelector: function (title) {
    var me = this;
    var options = this.service.getStateService().getIndicators();
      var selections = [];
      options.forEach( function ( option ) {
        var indicatorData;
        var label = function ( data ) {
          indicatorData = data;
        }
        var label = me.getIndicatorUILabels( option );
          var valObject = {
              id: option.indicator,
              title: label.full
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
        // FIXME select active indicator
        select.selectFirstValue();
        me._select = select;

        me._template.chartControls.on('change', { self: me, select: select }, function (event) {
          var select = event.data.select;
          var activeIndicator;
          var ind = me.service.getStateService().getIndicators();
          // not sure if optimal way to get indicator
          ind.forEach( function (indicator) {
            if( indicator.indicator === select.getValue() ) {
              activeIndicator = indicator;
            }
          });
          var data = event.data.self.getIndicatorData(activeIndicator.hash);
          var container = event.data.self.tabsContainer.panels[0].getContainer();
          var updated = event.data.self._barchart.redraw(data);
          // container.append(updated);
        });

        var titleHolder = jQuery('<div class="title">' + title + '</div>');
        me._template.chartControls.append( titleHolder );
        me._template.chartControls.append( dropdown );

    return this._template.chartControls;
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
    select.setValue("mapClr");

    //update color based on selection
    dropdown.on("change", { select: select }, function (evt) {
        evt.stopPropagation();
        if ( evt.data.select.getValue() === "mapClr") {
          me._barchart.redraw(null);
        } else {
          me._barchart.redraw(null, { color: ["#DC143C"] } );
        }
    });

    var titleEl = jQuery('<div class="title">' + title + '</div>');
    me._template.chartControls.append( titleEl );
    me._template.chartControls.append(dropdown );

    return this._template.chartControls;
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
    this.service.on('StatsGrid.ActiveIndicatorChangedEvent', function (event) {
      var current = event.getCurrent();
      if( me._select != null ) {
        me._select.setValue( current.indicator );
      }
      if (current) {
        if (me.getCharts().svg !== null) {
          me._barchart.redraw( me.getIndicatorData() );
        } else {
          var el = me.createBarCharts();
          me.getPanel("oskari-chart-statsgrid").append( el );
        }
      }
    });
    this.service.on('StatsGrid.IndicatorEvent', function (event) {
      if( me.getCharts.svg === null ) {
        return;
      }
        if( !event.isRemoved() ) {
          var label = me.getIndicatorUILabels( event );
          var dataObject = {
            id: event.indicator,
            title: label.full
          };
          me._select.addOption( dataObject );
        } else {
          me._select.removeOption( event.indicator );
        }
    });
    this.service.on('StatsGrid.Filter', function(event) {
      var filterOptions = event.getFilter();
    });
  },
  createBarCharts: function () {
    var me = this;
    var data = this.getIndicatorData();
    if ( data === undefined || data.length === 0 ) {
      Oskari.log("no indicator data");
      return null;
    }
    if ( !this._barchart.chartIsInitialized() ) {
      var barchart = this._barchart.createBarChart(data, { activeIndicator: this.getIndicator() });
      var el = jQuery(barchart);
      el.css({
        "width": "100%"
      })
      return el;
    } else {
      this._barchart.redraw( data );
    }
  },
  gridTab: function () {
    var gridPanel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
    gridPanel.setTitle(this.loc.datacharts.table);

    gridPanel.getContainer().prepend(this._createGrid());
    gridPanel.setId('oskari-grid-statsgrid');
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
    chartPanel.getContainer().append( me.createIndicatorSelector( this.loc.datacharts.indicatorVar ) );
    chartPanel.getContainer().append( me.createColorSelector( this.loc.datacharts.descColor ) );
    this._chart = me.createBarCharts();
    if( this._chart != null ) {
          chartPanel.getContainer().append( this._chart );
    }
    chartPanel.setId('oskari-chart-statsgrid');
    this.tabsContainer.addPanel( chartPanel );
  },
  addTab: function () {
    var me = this,
        flyout = jQuery(me.container);
    // Change into tab mode if not already
    if (me.tabsContainer.panels.length === 0) {
      me.tabsContainer.insertTo(flyout);
    }
    me.tabsContainer.addTabChangeListener(function(previousTab, newTab) {
        if(newTab.getId() === 'oskari-grid-statsgrid') {
            me.checkGridVisibility();
        }
    });
    this.gridTab();
    this.chartsTab();
    this._template.charts.append(me.tabsContainer.ui);
  },
  isVisible: function () {
    return this._isOpen;
  },
  checkGridVisibility: function(){
      var me = this;
      me._grid._updateHeaderHeight();

      // Check also need hide no result texts
      me._grid.showResults();
  }
}, {
  extend: ['Oskari.userinterface.extension.DefaultView']
});
