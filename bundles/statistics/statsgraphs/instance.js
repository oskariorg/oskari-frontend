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
            'StatsGrid.IndicatorEvent' : function(evt) {
                // TODO: react to event
                this._handleDataChangeEvent();
            },
            'StatsGrid.RegionsetChangedEvent' : function(evt) {
                this._handleDataChangeEvent();
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
        _handleDataChangeEvent: function () {

            var me = this;

            this.service.getCurrentDataset(function(err, data) {
                if(err) {
                    console.warn(err);
                    return;
                }
                me.getFlyout().chartDataChanged(data);
            });

/*
            var regionSetId = this.service.getStateService().getRegionset();
            //var regionset = this.service.getRegionsets(regionSetId);
            var selectedList = this.service.getStateService().getIndicators();
            if(!selectedList.length) {
                // TODO: teardown any existing charts
                return;
            }
            // latest indicator
            var ind = selectedList[selectedList.length -1];
            this.service.getRegions(regionSetId, function(err, regions) {
                me.service.getIndicatorData(ind.datasource, ind.indicator, ind.selections, regionSetId, function(err, indicatorData) {
                    var values = [];
                    regions.forEach(function(reg) {
                        values.push(indicatorData[reg.id]);
                    });

                    me.service.getIndicatorMetadata(ind.datasource, ind.indicator, function(err, indicator) {
                        var ds = me.service.getDatasource(ind.datasource).name;
                        var name = ds + ' - ' + Oskari.getLocalized(indicator.name);
                        me.getFlyout().updateUI(name, regions, values);
                    });
                });
            });
*/
        }
    }, {
        extend: ['Oskari.userinterface.extension.DefaultExtension']
    }
);
