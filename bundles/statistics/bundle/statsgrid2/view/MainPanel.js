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
		this.indicatorSelector = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.view.IndicatorSelector', instance.getLocalization(), instance.getService(), instance.getUserSelections());
		this.grid = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.view.Grid', instance.getLocalization(), instance.getService(), instance.getUserSelections());
    },
    {
    	"__templates" : {
            'gridWrapper' : '<div id="municipalGrid" class="municipal-grid"></div>',
    	},
	    render : function(container, instance) {
            // FIXME: this is called each time mode is activated?
            this.container = container;
	    	this.indicatorSelector.render(container);

            var gridContainer = jQuery(this.__templates.gridWrapper);
            this.grid.render(gridContainer);
            container.append(gridContainer);

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
            this.grid.handleContainerResized();
        },
        resetColumnSizes : function() {
            this.grid.autosizeColumns();
        },
        /**
         * Sets the height of the grid container and notifies grid of it
         * @method __fixGridHeight
         */
        __fixGridHeight: function (container) {
            // FIXME: maybe get references for sub-containers instead of find() 
            var container = this.getContainer(),
                gridDiv = container.find('#municipalGrid'),
                selectorsCont = container.find('.selectors-container'),
                selectorsHeight = 0;
            if (selectorsCont.length > 0) {
                selectorsHeight = selectorsCont.outerHeight();
            }
            gridDiv.height(container.height() - selectorsHeight);
        }

    }
);
