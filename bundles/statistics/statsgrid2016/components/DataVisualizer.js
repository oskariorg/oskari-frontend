Oskari.clazz.define('Oskari.statistics.statsgrid.DataVisualizer', function(sandbox, loc) {
  this.sb = sandbox;
  this.loc = loc;
  this.__datachartFlyout = null;
  this.tabsContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer');
  this.container = null;
  this.service = this.sb.getService('Oskari.statistics.statsgrid.StatisticsService');
  this.isOpen = false;
}, {
  _template: {
    error: _.template('<div class="datacharts-noactive">${ msg }</div>'),
    container: jQuery('<div class="oskari-datacharts" style="padding:20px"></div>'),
    charts: jQuery('<div class="oskari-datacharts" style="padding:20px"></div>')
  },
  createUi: function () {
    var el = this._template.container;
    if(this.__datachartFlyout) {
        return this.__datachartFlyout;
    }
    var accordion = Oskari.clazz.create(
            'Oskari.userinterface.component.Accordion'
        );
    var panel = this._getPanels();
    panel.open();
    accordion.addPanel(panel);
    accordion.insertTo(el);
    this.addTab("asd");
    var flyout = Oskari.clazz.create('Oskari.userinterface.extension.ExtraFlyout', this.loc.DataDescriptor.flyout, {
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
    this.isOpen = true;
    return this.__datachartFlyout;
  },
  _getPanels: function() {
    return this._createChartsPanel(this.loc.DataDescriptor.desc);
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
  getActiveIndicator: function() {
    return this.service.getStateService().getActiveIndicator();
  },
  getRegionset() {
    return this.service.getStateService().getRegionset();
  },
  getIndicatorData: function() {
    var indicatorData = [];
    var activeIndicator = this.getActiveIndicator();
    if( activeIndicator === null ) {
      this._template.container.append(this._template.error({msg : this.locale.legend.noActive}));
      return;
    }
    var regionSet = this.getRegionset();
    this.service.getIndicatorData(activeIndicator.datasource, activeIndicator.indicator, activeIndicator.selections, regionSet, function(err, data) {
      for (var dataset in data) {
          indicatorData.push( { name: dataset, value: data[dataset] } );
      }
    });
    return indicatorData;
  },
  createBarCharts: function () {
    var data = this.getIndicatorData();
    if(data === undefined) {
      Oskari.log("no indicator data");
      return;
    }
    var barchart = Oskari.clazz.create('Oskari.statistics.statsgrid.Charts', Oskari.getSandbox(), this.loc, data);
    return barchart.createChart();
  },
  addTab: function (item) {

      var me = this,
          flyout = jQuery(me.container);
      // Change into tab mode if not already
      if (me.tabsContainer.panels.length === 0) {
          me.tabsContainer.insertTo(flyout);

              var defaultPanel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
              defaultPanel.setTitle(
                  this.loc.DataDescriptor.barchart,
                  'oskari_datachart_tabpanel_header'
              );
              defaultPanel.setContent(this.createBarCharts());
              defaultPanel.setId('oskari_search_tabpanel_header');
              defaultPanel.setPriority(1.0);
              me.tabsContainer.addPanel(defaultPanel);
      }
      var panel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
      panel.setTitle(this.loc.DataDescriptor.linechart, 'oskari_datachart_tabpanel_header');
      panel.setId('oskari_datachart_tabpanel_header');
      panel.setContent("");
      panel.setPriority(1.0);
      me.tabsContainer.addPanel(panel);
      this._template.charts.append(me.tabsContainer.ui);
  },
  isVisible: function() {
    return this.isOpen;
  }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
     protocol: ['Oskari.userinterface.Flyout'],
     "extend": ["Oskari.userinterface.extension.DefaultFlyout"]
  });
