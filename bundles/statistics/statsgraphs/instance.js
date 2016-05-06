/**
 * @class Oskari.statistics.statsgraphs.StatsGraphsBundleInstance
 *
 * Sample extension bundle definition which inherits most functionalty
 * from DefaultExtension class.
 *
 */
Oskari.clazz.define(
    'Oskari.statistics.statsgraphs.StatsGraphsBundleInstance',
    /**
     * @static constructor function
     */

    function () {
        // these will be used for this.conf if nothing else is specified (handled by DefaultExtension)
        this.defaultConf = {
            name: 'StatsGraph',
            sandbox: 'sandbox',
            stateful: true,
            tileClazz: 'Oskari.userinterface.extension.DefaultTile',
            flyoutClazz: 'Oskari.mapframework.statsgraphs.Flyout'
        };
    }, {
        afterStart: function (sandbox) {
            var me = this;
            /*
            // FOR DEBUGGING
            var sb = this.getSandbox();
            var events = Oskari.clazz.protocol('Oskari.mapframework.event.Event')
            for(var event in events) {
                var name = events[event]._class.prototype.getName();
                console.log(name);
                if(name != 'MouseHoverEvent') {
                    sb.registerForEventByName(me, name);
                }
            }
            */
        },
        eventHandlers: {
            /**
             * @method MapStats.StatsVisualizationChangeEvent
             */
            'StatsGrid.StatsDataChangedEvent': function (event) {
                this._handleDataChangeEvent(event);
            }
        },

        /**
         * @method registerMapClickHandler
         * Registers the map click handler so we can pass the clicks to flyout.
         */
        registerMapClickHandler: function () {
            if (this.eventHandlers.MapClickedEvent) {
                return;
            }
            this.eventHandlers.MapClickedEvent = function (event) {
                alert("map clicked");
                this.plugins['Oskari.userinterface.Flyout'].onMapClick(
                    event.getLonLat()
                );
            };
            this.sandbox.registerForEventByName(this, 'MapClickedEvent');
        },

        /**
         * @method unregisterMapClickHandler
         * Unregisters the map click handler
         */
        unregisterMapClickHandler: function () {
            delete this.eventHandlers.MapClickedEvent;
            this.sandbox.unregisterFromEventByName(this, 'MapClickedEvent');
        },

        /*
        // FOR DEBUGGING
        onEvent: function(event) {
            console.log(event.getName(), event);
        },
*/
        /**
         * Saves params to the state and sends them to the print service as well.
         *
         * @method _afterStatsVisualizationChangeEvent
         * @private
         * @param {Object} event
         */
        _handleDataChangeEvent: function (event) {
            var me = this,
                params = event.getParams(),
                layer = event.getLayer();
            this.getFlyout().updateUI(
                params.CUR_COL.field, params.VIS_CODES, params.COL_VALUES);
        }
    }, {
        extend: ['Oskari.userinterface.extension.DefaultExtension']
    }
);
