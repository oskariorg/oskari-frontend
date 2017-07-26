/*
* Creates a flyout with accordion containing charts from Charts.js
*/
Oskari.clazz.define('Oskari.statistics.statsgrid.DataVisualizer', function(instance, loc) {
  this.sb = instance.getSandbox();
  this.loc = loc;
  this.instance = instance;
  this.__datachartFlyout = null;
  this.tabsContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer');
  this.container = null;
  this.service = this.sb.getService('Oskari.statistics.statsgrid.StatisticsService');
  this._isOpen = false;
  this._barchart = null;
  this.shouldUpdate = false;
  this._select = null;
  this.events();
}, {
  _template: {
    error: _.template('<div class="datacharts-noactive">${ msg }</div>'),
    container: jQuery('<div class="oskari-datacharts" style="padding:20px"></div>'),
    charts: jQuery('<div class="oskari-datacharts" style="padding:20px"></div>'),
    select: jQuery('<div class="dropdown"></div>'),
    tabControl: jQuery('<div class="tab-material-controls"></div>')
  },
  createUi: function () {
    var el = this._template.container;
    if( this.__datachartFlyout ) {
        return this.__datachartFlyout;
    }
    this.addTab("");
    var accordion = Oskari.clazz.create(
          'Oskari.userinterface.component.Accordion'
        );
    var panel = this._getPanels();
    panel.open();
    accordion.addPanel(panel);
    accordion.insertTo(el);
    var flyout = Oskari.clazz.create('Oskari.userinterface.extension.ExtraFlyout', this.loc.datacharts.flyout, {
        width: 'auto',
        height: 'auto',
        cls: 'statsgrid-chart-flyout'
    });
    flyout.makeDraggable({
        handle : '.oskari-flyouttoolbar, .statsgrid-chart-container > .header',
        scroll : false
    });

    flyout.setContent(el);
    this.__datachartFlyout = flyout;
    this._isOpen = true;
  },
  getFlyout: function() {
    return this.__datachartFlyout;
  },
  getCharts: function() {
    return this._barchart;
  },
  _getPanels: function() {
    return this._createChartsPanel(this.loc.datacharts.desc);
  },
  /**
   * Creates an accordion panel for legend and classification edit with eventlisteners on open/close
   * @param  {String} title UI label
   * @return {Oskari.userinterface.component.AccordionPanel} panel without content
   */
  _createChartsPanel : function(title) {
      var me = this;
      var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
      var container = panel.getContainer();
      container.append(this._template.charts);

      panel.on('open', function() {
      });
      panel.on('close', function() {
      });
      panel.setTitle(title);
      return panel;
  },
    createIndicatorSelector: function (title) {
      var me = this;
      var datasources = this.service.getDatasource();
      var panelLoc = this.loc.panels.newSearch;
      if( this.getIndicator() === null ) {
        this.shouldUpdate = true;
        return;
      }
      var keyValue = {};

    this.service.getIndicatorMetadata(this.getIndicator().datasource, this.getIndicator().indicator, function(err, indicator) {

      indicator.selectors.forEach(function(selector, index) {
        var selections = [];
        var self = me;
        selector.allowedValues.forEach(function(val) {
          val.selections = {};
            var name = val.name || val.id || val;
            val.title = val.name;
            var optName = (panelLoc.selectionValues[selector.id] && panelLoc.selectionValues[selector.id][name]) ? panelLoc.selectionValues[selector.id][name] : name;

            //ALERT HACK
            val.selections.Tiedot = val.id;
            //HACK END

            //save the id as a key in an object and put the selections as value, in the select on change event we can then compare the value we get to the key and get the value
            keyValue[val.id] = val.selections;

            var valObject = {
                    id : val.id || val,
                    title : optName
            };
            selections.push(valObject);
        });

        var options = {
            placeholder_text: "dasd",
            allow_single_deselect : true,
            disable_search_threshold: 10,
            no_results_text: "locale.panels.newSearch.noResults",
            width: '100%'
        };
        var select = Oskari.clazz.create('Oskari.userinterface.component.SelectList');
        var dropdown = select.create(selections, options);
        dropdown.css({width:'100%'});
        me._template.select.append(dropdown);
        select.adjustChosen();
        select.selectFirstValue();
        me._select = select;

        var titleHolder = jQuery('<div class="title">'+title+'</div>');
        me._template.tabControl.append(titleHolder);
        me._template.tabControl.append(dropdown);
    });
  });

        me._template.tabControl.on('change', { self: me, keyValue: keyValue }, function( event ) {
            //hackish way of setting selected value as and new indicator and then getting the new indicator
            var hash = event.data.self.service.getStateService().getHash( event.data.self.getIndicator().datasource, event.data.self.getIndicator().indicator, event.data.keyValue[ event.data.self.getSelect().getValue() ]);
            
            event.data.self.service.getStateService().addIndicator( event.data.self.getIndicator().datasource, event.data.self.getIndicator().indicator, event.data.keyValue[ event.data.self.getSelect().getValue() ]
            ,event.data.self.getIndicator().classification );

            var data = event.data.self.getIndicatorData( hash );

            var updated = event.data.self._barchart.updateChart(data);
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
            placeholder_text: "Select color",
            allow_single_deselect : true,
            disable_search_threshold: 10,
            no_results_text: "locale.panels.newSearch.noResults",
            width: '100%'
        };
        var select = Oskari.clazz.create('Oskari.userinterface.component.SelectList');
        var dropdown = select.create(selections, options);
        dropdown.css({width:'100%'});
        me._template.select.append(dropdown);
        select.adjustChosen();

        //update color based on selection
        dropdown.on("change", function(evt) {
          if( evt.target.selectedIndex === 1 ) {
            me._barchart.updateColor("#DC143C");
          } else {
            me._barchart.createChart();
          }
        });

        var title = jQuery('<div class="title">'+title+'</div>');
        me._template.tabControl.append(title);
        me._template.tabControl.append(dropdown);

    return this._template.tabControl;
  },
  getIndicator: function (hash) {
    if( !hash ) {
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
  getIndicatorData: function(hash) {
    var indicatorData = [];
    var regionsNames = [];
    var activeIndicator = this.getIndicator(hash);
    if( activeIndicator === null ) {
      this._template.container.append(this._template.error({msg : this.locale.legend.noActive}));
      return;
    }
    var regionSet = this.getRegionset();
    this.service.getRegions( regionSet, function(err, regions) {
    regions.forEach(function(reg) {
        regionsNames.push(reg);
    });
 });
    this.service.getIndicatorData(activeIndicator.datasource, activeIndicator.indicator, activeIndicator.selections, regionSet, function(err, data) {
      regionsNames = regionsNames;
      for (var dataset in data) {
        for(var region in regionsNames) {
	        if( regionsNames[region].id === dataset ) {
	         var name = regionsNames[region].name;    
          } 
        }
          indicatorData.push( { name: name, value: data[dataset] } );
      }
    });
    return indicatorData;
  },
  events: function() {
    var me = this;
        this.service.on('StatsGrid.ActiveIndicatorChangedEvent', function(event) {
            var current = event.getCurrent();
            if(current) {
                me.createBarCharts();
            }
        });
  },
  createBarCharts: function () {
    if( this.getFlyout() === null ) {
      this.createUi();
    }
    var data = this.getIndicatorData();
    if( data === undefined ) {
      Oskari.log("no indicator data");
      return;
    }
    if( !this.barchart ) {
      this._barchart = Oskari.clazz.create('Oskari.statistics.statsgrid.Charts', Oskari.getSandbox(), this.loc, data, this.getIndicator());
      var barchart = this._barchart.createChart();
      this.tabsContainer.panels[0].getContainer().append(barchart);
    } else {
      var updated = this._barchart.updateChart(data);
      this.tabsContainer.panels[0].getContainer().append(updated);
    }
  },
  addTab: function (item) {
      var me = this,
      flyout = jQuery(me.container);
      // Change into tab mode if not already
      if (me.tabsContainer.panels.length === 0) {
          me.tabsContainer.insertTo(flyout);

              var defaultPanel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
              defaultPanel.setTitle(
                  this.loc.datacharts.barchart,
                  'oskari_datachart_tabpanel_header'
              );
              // defaultPanel.setContent(this.createBarCharts());
              defaultPanel.getContainer().prepend(this.createIndicatorSelector(this.loc.datacharts.indicatorVar));
              defaultPanel.getContainer().prepend(this.createColorSelector(this.loc.datacharts.descColor));
              defaultPanel.setId('oskari_search_tabpanel_header');
              defaultPanel.setPriority(1.0);
              me.tabsContainer.addPanel(defaultPanel);
      }
      var panel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
      panel.setTitle(this.loc.datacharts.linechart, 'oskari_datachart_tabpanel_header');
      panel.setId('oskari_datachart_tabpanel_header');
      panel.setContent("");
      panel.setPriority(1.0);
      me.tabsContainer.addPanel(panel);
      this._template.charts.append(me.tabsContainer.ui);
  },
  isVisible: function() {
    return this._isOpen;
  }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
     protocol: ['Oskari.userinterface.Flyout'],
     "extend": ["Oskari.userinterface.extension.DefaultFlyout"]
  });
