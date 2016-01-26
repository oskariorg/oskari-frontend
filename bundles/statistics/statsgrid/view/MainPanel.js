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
      getState: function() {
        var me = this;
        return {
          "version": 2,
          "selectedIndicators": me.element && me.element.selectedIndicators || [],
          "layerId": me.element && me.element.layerId || null
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
          if (me.embedded) {
            elementWrapper.selectedIndicators = me.state.selectedIndicators;
            elementWrapper.selectedLayer = me.statslayer._layerName; // For example: oskari:kunnat2013
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
