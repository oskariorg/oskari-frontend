/**
 * @class Oskari.statistics.bundle.statsgrid.GridModeView
 *
 * Sample extension bundle definition which inherits most functionalty
 * from DefaultView class.
 *
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.GridModeView',
/**
 * @static constructor function
 */
function() {
}, {

    /**
     * @method startPlugin
     * called by host to start view operations
     */
    startPlugin: function() {
        var me = this;
        var sandbox = me.instance.getSandbox();

        this.toolbar = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.StatsToolbar', {
            title: me.getTitle()
        }, this.instance);


        this.requestHandler = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.request.StatsGridRequestHandler', me);
        sandbox.addRequestHandler('StatsGrid.StatsGridRequest', this.requestHandler);

        var el = me.getEl();
        el.addClass("statsgrid");
    },

    /**
     * Updates the layer, enters/exits the mode and creates the UI
     * to display the indicators selection and the grid.
     *
     * @method prepareMode
     * @param {Boolean} isShown True to enter the mode, false to exit the mode
     * @param {Object} layer The layer visualizations should be applied to
     * @param {Boolean} blnFromExtensionEvent
     */
    prepareMode: function(isShown, layer, blnFromExtensionEvent) {
        // Do not enter the mode if it's already on.
        if (!this.isVisible || !isShown) {
            this.isVisible = (isShown == true);

            // Update the layer if current layer is null or if the layer has changed.
            if (this._layer == null || (layer != null && this._layer.getId() != layer.getId())) {
                this._layer = layer;
                // Notify the grid plugin of the changed layer.
                this.instance.gridPlugin.setLayer(layer);
                // Save the changed layer to the state.
                this.instance.state.layerId = this._layer.getId();
                this.toolbar.changeName(this._layer.getName());
            }

            // Enter/exit the mode.
            this.showMode(isShown, blnFromExtensionEvent);
            // Show/hide the content.
            this.showContent(isShown);

            if (isShown) {
                // Create the indicators selection and the grid.
                this.instance.gridPlugin.createStatsOut(this.getEl());
            }
        }
    },

    /**
     * Sets the DOM to the mode and updates the map size.
     *
     * @method showMode
     * @param {Boolean} isShown Entering/exiting the mode.
     * @param {Boolean} blnFromExtensionEvent
     */
    showMode: function(isShown, blnFromExtensionEvent) {
        var me = this;
        var sandbox = this.instance.getSandbox();
        this.toolbar.show(isShown);

        var mapModule = this.instance.getSandbox().findRegisteredModuleInstance('MainMapModule');
        var map = mapModule.getMap();
        
        if (isShown) {
            /** ENTER The Mode */

            /** Set zoom to min **/
             mapModule.zoomTo(0);

            jQuery('#contentMap').addClass('statsgrid-contentMap');
            jQuery('.oskariui-mode-content').addClass('statsgrid-mode');
            // TODO we are going to create a handle for grid vs. map separator
            var leftWidth = 40;

            /** show our mode view - view hacks */
            var elCenter = this.getCenterColumn();
            elCenter.removeClass('span12');
            elCenter.width((100 - leftWidth) + '%');
            // remove toolbar's height
            jQuery('#mapdiv').height(jQuery(window).height() - jQuery('#contentMap').find('.oskariui-menutoolbar').height());
            //window resize is handled in mapfull - instance.js

            var elLeft = this.getLeftColumn();
            elLeft.empty();
            elLeft.removeClass('oskari-closed');
            elLeft.width(leftWidth + '%');
            elLeft.resizable({
                minWidth: 450,
                handles: "e",
                resize: function(event, ui) {
                    elCenter.width( jQuery('.row-fluid').width() - elLeft.width() );
                    map.updateSize();
                    me.instance.gridPlugin.grid.resizeCanvas();
                }
            });

            /** a hack to notify openlayers of map size change */
            map.updateSize();
       
        } else {
            /** EXIT The Mode */

            jQuery('#contentMap').removeClass('statsgrid-contentMap');
            jQuery('.oskariui-mode-content').removeClass('statsgrid-mode');
            
            var elCenter = jQuery('.oskariui-center');
            // remove width from center-div
            elCenter.width('').addClass('span12');
            jQuery('#mapdiv').height(jQuery(window).height());

            var elLeft = jQuery('.oskariui-left');
            elLeft.addClass('oskari-closed');
            // remove width from left-div
            elLeft.width('');//removeClass('span7');

            if(!blnFromExtensionEvent) {
                // reset tile state if not triggered by tile click
                // postRequestbyName is banned! sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this.instance, 'close']);
                var request = sandbox.getRequestBuilder('userinterface.UpdateExtensionRequest')(this.instance, 'close', this.instance.getName());
                sandbox.request(this.instance.getName(), request);
            }

            /** a hack to notify openlayers of map size change */
            map.updateSize();
        }
    },
    getLeftColumn : function() {
        return jQuery('.oskariui-left');
    },
    getCenterColumn : function() {
        return jQuery('.oskariui-center');
    },
    getRightColumn : function() {
        return jQuery('.oskariui-right');
    },
    /**
     * @method stopPlugin
     * called by host to stop view operations
     */
    stopPlugin: function() {
        this.toolbar.destroy();
        sandbox.removeRequestHandler('StatsGrid.StatsGridRequest', this.requestHandler);
    }
}, {
    "protocol": ["Oskari.userinterface.View"],
    "extend": ["Oskari.userinterface.extension.DefaultView"]
});