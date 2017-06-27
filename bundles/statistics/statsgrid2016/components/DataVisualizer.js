/*
* Creates a flyout with accordion containing charts from Charts.js
*/
Oskari.clazz.define('Oskari.statistics.statsgrid.DataVisualizer', function(sandbox, loc) {
  this.sb = sandbox;
  this.loc = loc;
  this.__datachartFlyout = null;
  this.tabsContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer');
  this.container = null;
  this.service = this.sb.getService('Oskari.statistics.statsgrid.StatisticsService');
  this._isOpen = false;
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
    this.addTab("asd");
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
    // return this.__datachartFlyout;
  },
  getFlyout: function() {
    return this.__datachartFlyout;
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
          me._setPanelState(panel);
      });
      panel.on('close', function() {
          me._setPanelState(panel);
      });
      panel.setTitle(title);
      return panel;
  },
    createDropdown: function (title) {
    var dataOptions = {
        placeholder_text: "asd",
        allow_single_deselect : true,
        disable_search_threshold: 10,
        no_results_text: "locale.panels.newSearch.noResults",
        width: '80%'
    };
    var dataSelect = Oskari.clazz.create('Oskari.userinterface.component.SelectList');
    var dataDropdown = dataSelect.create(undefined, dataOptions);
    dataDropdown.css({width:'100%'});
    this._template.select.append(dataDropdown);
    dataSelect.adjustChosen();

    var clrOptions = {
        placeholder_text: "asd",
        allow_single_deselect : true,
        disable_search_threshold: 10,
        no_results_text: "locale.panels.newSearch.noResults",
        width: '100%'
    };
    var clrSelect = Oskari.clazz.create('Oskari.userinterface.component.SelectList');
    var clrDropdown = clrSelect.create(undefined, clrOptions);
    clrDropdown.css({width:'100%'});
    this._template.select.append(clrDropdown);
    clrSelect.adjustChosen();

    var title = jQuery('<div class="title">'+title+'</div>');
    this._template.tabControl.append(title);
    this._template.tabControl.append(clrDropdown);

    return this._template.tabControl;

    // this._template.container.append(this._template.select);
  },
  getActiveIndicator: function() {
    return this.service.getStateService().getActiveIndicator();
  },
  getRegionset() {
    return this.service.getStateService().getRegionset();
  },
  getIndicatorData: function() {
    var indicatorData = [];
    var regionsNames = [];
    var activeIndicator = this.getActiveIndicator();
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
      this.barchart = Oskari.clazz.create('Oskari.statistics.statsgrid.Charts', Oskari.getSandbox(), this.loc, data, this.getActiveIndicator());
      var barchart = this.barchart.createChart();
      this.tabsContainer.panels[0].getContainer().append(barchart);
    } else {
      var updated = this.barchart.updateChart(data);
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
              defaultPanel.getContainer().prepend(this.createDropdown(this.loc.datacharts.indicatorVar));
              defaultPanel.getContainer().prepend(this.createDropdown(this.loc.datacharts.descColor));
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
