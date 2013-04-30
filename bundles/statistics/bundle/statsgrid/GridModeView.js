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
    showMode: function(isShown, blnFromExtensionEvent) {
        var sandbox = this.instance.getSandbox();
        this.toolbar.show(isShown);

        var mapModule = this.instance.getSandbox().findRegisteredModuleInstance('MainMapModule');
        var map = mapModule.getMap();

        /** Set zoom to min **/
        mapModule.zoomTo(0);
        
        if (isShown) {
            /** ENTER The Mode */

            /** set map to stats mode - map-ops -> statslayer tools should propably tell us where to zoom */
//            this._setMapStatsMode();

            /** show our mode view - view hacks */
            var elCenter = this.getCenterColumn();
            elCenter.removeClass('span12');
            elCenter.addClass('span5');

            var elLeft = this.getLeftColumn();
            elLeft.removeClass('oskari-closed');
            elLeft.addClass('span7');

            /** a hack to notify openlayers of map size change */
            map.updateSize();
       
        } else {
            /** EXIT The Mode */

            /** set map to stats mode */
//            this._setMapNormalMode();

            
            var elCenter = jQuery('.oskariui-center');
            elCenter.removeClass('span5');
            elCenter.addClass('span12');

            var elLeft = jQuery('.oskariui-left');
            elLeft.addClass('oskari-closed');
            elLeft.removeClass('span7');

            if(!blnFromExtensionEvent) {
                // reset tile state if not triggered by tile click
                sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this.instance, 'close']);
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