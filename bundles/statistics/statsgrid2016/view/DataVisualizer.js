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
  this._chartInstance = Oskari.clazz.create('Oskari.userinterface.component.Chart', Oskari.getSandbox(), this.loc);
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
    if( this.tabsContainer.panels.length === 0 ) {
      return;
    }
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
    this.createTabs();
    var accordion = this.createAccordion();
    accordion.insertTo(el);
    this.setElement(el);
  },
  hasActiveIndicator: function () {
    return this.service.getStateService().getActiveIndicator();
  },
  getChartInstance: function () {
    return this._chartInstance;
  },
  clearChart: function () {
    this.getChartInstance().clear();
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
      };
      this.service.getUILabels( option, label );
      return indicatorData;
  },
  createIndicatorSelector: function (title) {
      var me = this;
      var options = this.service.getStateService().getIndicators();
      var selections = [];
      options.forEach( function ( option ) {
          var indicatorData;
          var label = me.getIndicatorUILabels( option );
          var valObject = {
              id: option.indicator,
              title: label.full
          };
          selections.push(valObject);
      });
        var dropdownOptions = {
          placeholder_text: "",
          allow_single_deselect: true,
          disable_search_threshold: 10,
          no_results_text: "locale.panels.newSearch.noResults",
          width: '100%'
        };
        var select = Oskari.clazz.create('Oskari.userinterface.component.SelectList');
        var dropdown = select.create(selections, dropdownOptions);
        dropdown.css({ width: '100%' });
        me._template.select.append(dropdown);
        select.adjustChosen();
        select.selectFirstValue();
        me._select = select;

        me._template.chartControls.on('change', { select: select }, function (event) {
          var select = event.data.select;
          var activeIndicator;
          var ind = me.service.getStateService().getIndicators();
          // not sure if optimal way to get indicator
          ind.forEach( function ( indicator ) {
            if( indicator.indicator === select.getValue() ) {
              activeIndicator = indicator;
            }
          });
          me.service.getStateService().setActiveIndicator( activeIndicator.hash );
        });

        var titleHolder = jQuery('<div class="title">' + title + '</div>');
        me._template.chartControls.append( titleHolder );
        me._template.chartControls.append( dropdown );

    return this._template.chartControls;
  },

  createColorSelector: function ( title ) {
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
        if ( evt.data.select.getValue() === 'mapClr') {
          me.getChartInstance().redraw( null, { colors: me.getColorScale() } );
        } else {
          me.getChartInstance().redraw( null, { colors: '#DC143C' } );
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
      if (current) {
        if ( me._select ) {
          me._select.setValue( current.indicator );
        }
        if ( me.getChartInstance().svg !== null ) {
          me.redrawCharts();
        } else {
          var chartElement = me.createBarCharts();
          if( me.getPanel( "oskari-chart-statsgrid" ) ) {
            me.getPanel("oskari-chart-statsgrid").append( chartElement );
          }
        }
      }
    });
    this.service.on('StatsGrid.IndicatorEvent', function (event) {
        if( !event.isRemoved() ) {
          var label = me.getIndicatorUILabels( event );
          var dataObject = {
            id: event.indicator,
            title: label.full
          };
          me._select.addOption( dataObject );
        } else {
          me._select.removeOption( event.indicator );
          if ( me.service.getStateService().getIndicators().length === 0 ) {
              me.clearChart();
          }
        }
    });
    this.service.on('StatsGrid.Filter', function(event) {
      var filterOptions = event.getFilter();
    });
  },
  /**
   * @method getColorScale
   * gets the color scale of the mapselection
   * @return colors[] containing colors
   */
  getColorScale: function () {
      var stateService = this.service.getStateService();
      var activeIndicator = stateService.getActiveIndicator();
      var classificationOpts = stateService.getClassificationOpts(activeIndicator.hash);
      var colors = this.service.getColorService().getColorsForClassification(classificationOpts, true);
      return colors;
  },
  /**
   * @method createBarCharts
   * Creates the barchart component if chart is not initialized
   */
  createBarCharts: function () {
    var me = this;
    var data = this.getIndicatorData();
    if ( data === undefined || data.length === 0 ) {
      Oskari.log("no indicator data");
      return null;
    }

    if ( !this.getChartInstance().chartIsInitialized() ) {
      var barchart = this.getChartInstance().createBarChart( data, { colors:  me.getColorScale() } );
      var el = jQuery(barchart);
      el.css({
        "width": "100%"
      });
      el.attr('id', 'graphic');
      return el;
    } 
  },
  /**
   * @method redrawCharts
   * redraws the charts
   */
  redrawCharts: function () {
    var data = this.getIndicatorData();
    this.getChartInstance().redraw( data, { colors:  this.getColorScale() } );
  },
  /**
   * @method createGridTab
   * Creates the tab containing the grid
   */
  createGridTab: function () {
    var gridPanel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
    gridPanel.setTitle(this.loc.datacharts.table);

    gridPanel.getContainer().prepend(this._createGrid());
    gridPanel.setId('oskari-grid-statsgrid');
    this.tabsContainer.addPanel(gridPanel);

    return gridPanel;
  },
  appendChartsToContainer: function ( element ) {
    this._chart = this.createBarCharts();
    if( this._chart != null ) {
          element.getContainer().append( this._chart );
    }
  },
  /**
   * @method createChartsTab
   * Creates the tab containing the charts
   */
  createChartsTab: function () {
    var me = this;
    var chartPanel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
    chartPanel.setTitle(
      this.loc.datacharts.barchart,
      'oskari_datachart_tabpanel_header'
    );
    chartPanel.getContainer().append( me.createIndicatorSelector( this.loc.datacharts.indicatorVar ) );
    // chartPanel.getContainer().append( me.createColorSelector( this.loc.datacharts.descColor ) );
    this.appendChartsToContainer( chartPanel );
    chartPanel.setId('oskari-chart-statsgrid');
    this.tabsContainer.addPanel( chartPanel );
  },
  /**
   * @method createTabs
   * Creates tabs for the ui
   * @return {Oskari.userinterface.component.AccordionPanel} panel without content
   */
  createTabs: function () {
    var me = this,
        flyout = jQuery(me.container);
    if (me.tabsContainer.panels.length === 0) {
      me.tabsContainer.insertTo(flyout);
    }
    me.tabsContainer.addTabChangeListener( function( previousTab, newTab ) {
        if ( newTab.getId() === 'oskari-grid-statsgrid' ) {
            me.checkGridVisibility();
        } if ( newTab.getId() === 'oskari-chart-statsgrid' ) {
            if ( !me.getChartInstance().chartIsInitialized() ) {
                  me.appendChartsToContainer( newTab );
            } else {
              me.redrawCharts();
            }
        }
    });
    this.createGridTab();
    this.createChartsTab();
    this._template.charts.append(me.tabsContainer.ui);
  },
  /**
   * @method createAccordion
   * Creates accordion for the ui
   * @return {Oskari.userinterface.component.AccordionPanel} panel without content
   */
  createAccordion: function () {
    var accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
    var panels = this._getPanels();
    for (var i = 0; i < panels.length; i++ ) {
      accordion.addPanel(panels[i]);
    }
    return accordion;
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
