/**
 * @class Oskari.statistics.bundle.statsgrid.view.MainPanel
 *
 * Creates indicator selector and grid
 *
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.view.MainPanel',
    /**
     * @static constructor function
     * The parameters embedded, state and statslayer are used to set initial state when showing a saved embedded map.
     */
    function (instance, localization, sandbox, embedded, state, statslayer) {
        this.localization = localization;
        this.sandbox = sandbox;
        this.embedded = embedded;
        this.state = state;
        this.statslayer = statslayer;
    },
    {
      startPlugin: function(sandbox) {
      },
      stopPlugin: function() {
      },
      getName: function() {
        return "Oskari.statistics.bundle.statsgrid.view.MainPanel";
      },
      unregister: function() {
      },
      setMapModule: function(mapModule) {
      },
      getSandbox: function() {
        return this.sandbox;
      },
      // Named like this to prevent the state from going to mapfull state.
      _getState: function() {
        var me = this;
        var selectedIndicators = me.element && me.element.selectedIndicators || [];
        var selectedColumn = "";
        if (me.element && me.element.selectedIndicatorKey) {
          selectedColumn = selectedIndicators.indexOf(me.element.selectedIndicatorKey);
        }
        if (selectedColumn < 0) {
          // - characters are poison for the URL parsing...
          selectedColumn = "";
        }
        return {
          "version": 2,
          "selectedIndicators": selectedIndicators,
          "layerId": me.element && me.element.selectedLayer || null,
          "currentColumn": selectedColumn
        };
      },
      render: function(container, instance) {
	      var me = this;
        var doRender = function() {
          var elementWrapper = new StatsView(), // oskari-statsview
          rawUrl = Oskari.getSandbox().getAjaxUrl(),
          // Removing the tailing question mark.
          url = rawUrl.substring(0, rawUrl.length - 1);
          me.container = container;
          me.element = elementWrapper;
          container.empty();
          elementWrapper.locale = me.localization;
          elementWrapper.language = Oskari.getLang();
          elementWrapper.user = me.sandbox.getUser();
          elementWrapper.sandbox = me.sandbox;
          elementWrapper.embedded = me.embedded; // True when in embedded mode. Hides the indicator selector.
          elementWrapper.ajaxUrl = url;
          if (me.state && me.state.indicators && !me.state.selectedIndicators) {
            // These come from parsing the link parameters.
            // They are indicator keys of the form:
            // fi.nls.oskari.control.statistics.plugins.sotka.SotkaStatisticalDatasourcePlugin:74:11:{"year":"1992"}
            me.state.selectedIndicators = me.state.indicators.map(function(key) {
              var selectorSeparation = key.indicator.split(":{");
              var indicatorSeparation = selectorSeparation[0].split(":");
              var datasourceId = indicatorSeparation[0];
              var indicatorId = indicatorSeparation[1];
              var layerId = indicatorSeparation[2];
              var selectorStr = "{" + selectorSeparation[1];
              var selector = JSON.parse(selectorStr);
              return {
                datasourceId: datasourceId,
                indicatorId: indicatorId,
                selectors: Object.keys(selector).map(function (selectorId) {
                  return {selectorId: selectorId, value: selector[selectorId]};
                })
              };
            });
          }
          if (me.state && me.state.selectedIndicators) {
            elementWrapper.selectedIndicators = me.state.selectedIndicators;
            elementWrapper.selectedIndicator = me.state.selectedIndicators[me.state.currentColumn];
            elementWrapper.selectedLayer = me.state.layerId; // For example: 9
            // Not used at least yet, the layer is fetched based on the name.
            elementWrapper.layerId = me.state.layerId; // For example: 9
            elementWrapper.showGrid = true;
          }
          Polymer.dom(container[0]).appendChild(elementWrapper);
        };
        // The next does not work, because the load might have been fired already.
        //  var link = document.querySelector('link[rel=import]');
        //  jQuery(link).load(doRender);
        // For cross-browser compatibility, we must poll...
        var pollIfImportLoaded = function() {
         if (typeof(StatsView) != "undefined") {
           doRender();
         } else {
           // Waiting for the HTML imports to resolve properly first.
           setTimeout(pollIfImportLoaded, 500);
         }
       };
       pollIfImportLoaded();
	    },
        getContainer : function() {
            return this.container;
        },
        "sendTooltipData": function(feature) {
            return this.element.sendTooltipData(feature);
        },
        handleSizeChanged : function() {
            // TODO
        }
    }
);
