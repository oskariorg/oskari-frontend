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
    },
    {
    	"__templates" : {
            'wrapper' : '<oskari-statsview></oskari-statsview>',
    	},
	    render : function(container, instance) {
            // FIXME: this is called each time mode is activated?
            this.container = container;
            var gridContainer = jQuery(this.__templates.wrapper);
            container.empty().append(gridContainer);

            //window resize!
            // TODO: mapfull already checks resizing, maybe add an oskari event for it that can be used here?
            var me = this,
                resizeGridTimer;
            jQuery(window).resize(function () {
                clearTimeout(resizeGridTimer);
                resizeGridTimer = setTimeout(function () {
                    me.__fixGridHeight(container);
                    me.grid.handleContainerResized();
                }, 100);
            });
	    },
        getContainer : function() {
            return this.container;
        },
        handleSizeChanged : function() {
            // TODO
        }
    }
);
