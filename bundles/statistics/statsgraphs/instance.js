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
            this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
        },
        eventHandlers: {
            'StatsGrid.IndicatorEvent' : function(evt) {
                // TODO: react to event
                this._handleDataChangeEvent();
            },
            'StatsGrid.RegionsetChangedEvent' : function(evt) {
                this._handleDataChangeEvent();
            },
            'StatsGrid.RegionSelectedEvent' : function(evt) {
                this.getFlyout().regionSelected(evt.getRegion(), evt.getRegionset());
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

        _handleDataChangeEvent: function () {

            var me = this;
            this.service.getCurrentDataset(function(err, data) {
                if(err) {
                    return;
                }
                me.getFlyout().chartDataChanged(data);
            });
        }
    }, {
        extend: ['Oskari.userinterface.extension.DefaultExtension']
    }
);
