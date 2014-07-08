/**
 * @class Oskari.statistics.bundle.statsgrid.view.MainPanel
 *
 * Creates indicator selector and grid
 *
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.view.MainPanel',
    /**
     * @static constructor function
     */
    function (instance) {
		this.indicatorSelector = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.view.IndicatorSelector', instance.getLocalization(), instance.getService());
		this.grid = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.view.Grid');
    },
    {
    	"__templates" : {
    	},
	    render : function(container, instance) {
	    	this.indicatorSelector.render(container);
	    }

    }
);
