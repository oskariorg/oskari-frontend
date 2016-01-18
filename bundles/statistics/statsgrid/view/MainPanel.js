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
	    render: function(container, instance) {
	      var me = this;
        // Waiting for the HTML imports to resolve properly first.
	      var link = document.querySelector('link[rel=import]');
	      jQuery(link).load(
	        function() {
          var elementWrapper = new StatsView(), // oskari-statsview
          rawUrl = Oskari.getSandbox().getAjaxUrl(),
          // Removing the tailing question mark.
          url = rawUrl.substring(0, rawUrl.length - 1);
          me.container = container;
          me.element = elementWrapper;
          container.empty();
          elementWrapper.ajaxUrl = url;
          elementWrapper.locale = me.localization;
          elementWrapper.language = Oskari.getLang();
          elementWrapper.user = me.sandbox.getUser();
          elementWrapper.sandbox = me.sandbox;
          // FIXME: Handle these in the element.
          // FIXME: Where can we get the indicators?
          elementWrapper.embedded = me.embedded; // True when in embedded mode. Hides the indicator selector.
          if (me.embedded) {
            elementWrapper.selectedLayer = me.statslayer._layerName; // For example: oskari:kunnat2013
            // Not used yet, the layer is fetched based on the name.
            elementWrapper.layerId = me.state.layerId; // For example: 9
          }
          Polymer.dom(container[0]).appendChild(elementWrapper);
	      });
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
