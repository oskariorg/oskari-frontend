/*
* Creates a flyout with tabs for different ways of visualizing data
*/
Oskari.clazz.define('Oskari.statistics.statsgrid.view.DiagramVisualizer', function (instance) {
  this.sb = instance.getSandbox();
  this.loc = instance.getLocalization();
  this.isEmbedded = instance.isEmbedded();
  this.instance = instance;
  this.container = null;
  this.service = instance.statsService;
  this._isOpen = false;
  this._chartInstance = Oskari.clazz.create('Oskari.userinterface.component.Chart');
  this._select = null;
  this._chart = null;
  this.events();
}, {
  _template: {
    error: _.template('<div class="datacharts-noactive">${ msg }</div>'),
    container: jQuery('<div class="oskari-datacharts" style=""></div>'),
    select: jQuery('<div class="dropdown"></div>'),
    chartControls: jQuery('<div class="chart-controls"></div>')
  },
  setElement: function ( el ) {
    this.container = el;
  },
  getElement: function () {
    return this.container;
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
  hasActiveIndicator: function () {
    return this.service.getStateService().getActiveIndicator();
  },
  createUi: function () {
    var el = this._template.container.clone();
    this.setElement(el);
    el.append( this.createIndicatorSelector( this.loc.datacharts.indicatorVar ) );
    //chartsContainer.append( this.createColorSelector( this.loc.datacharts.descColor ) );
    this.appendChartsToContainer( el );

  },
  getChartInstance: function () {
    return this._chartInstance;
  },
  clearChart: function () {
    this.getChartInstance().clear();
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
        if ( me.getChartInstance().chartIsInitialized() ) {
          me.redrawCharts();
        } else {
          var chartElement = me.createBarCharts();
          var container = me.getElement();
          if (container) {
            container.append( chartElement );
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
   * @method redrawCharts
   * redraws the charts
   */
  redrawCharts: function () {
    var data = this.getIndicatorData();
    this.getChartInstance().redraw( data, { colors:  this.getColorScale() } );
  },
  appendChartsToContainer: function ( element ) {
    this._chart = this.createBarCharts();
    if( this._chart !== null ) {
          element.append( this._chart );
    }
  },
  /**
   * @method createBarCharts
   * Creates the barchart component if chart is not initialized
   */
  createBarCharts: function () {
    var me = this;
    var data = this.getIndicatorData();
    if ( data === undefined || data.length === 0 ) {
      Oskari.log("statsgrid.DiagramVisualizer").debug("no indicator data");
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
  isVisible: function () {
    return this._isOpen;
  }
}, {
  extend: ['Oskari.userinterface.extension.DefaultView']
});
