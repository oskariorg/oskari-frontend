/**
 * @class Oskari.statistics.statsgrid.StatsGridBundleInstance
 *
 * Sample extension bundle definition which inherits most functionalty
 * from DefaultExtension class.
 *
 */
Oskari.clazz.define(
    'Oskari.statistics.statsgrid.StatsGridBundleInstance',
    /**
     * @static constructor function
     */

    function () {
        // these will be used for this.conf if nothing else is specified (handled by DefaultExtension)
        this.defaultConf = {
            name: 'StatsGrid',
            sandbox: 'sandbox',
            stateful: true,
            tileClazz: 'Oskari.userinterface.extension.DefaultTile',
            viewClazz: 'Oskari.statistics.statsgrid.StatsView'
        };
    }, {
        afterStart: function (sandbox) {
            var me = this;
            // create the StatisticsService for handling ajax calls and common functionality.
            var statsService = Oskari.clazz.create('Oskari.statistics.statsgrid.StatisticsService', sandbox);
            sandbox.registerService(statsService);
            me.statsService = statsService;

            var conf = this.getConfiguration() || {};
            statsService.addDatasource(conf.sources);

            this.getTile().setEnabled(this.hasData());
        },
        eventHandlers: {
            'StatsGrid.IndicatorEvent' : function(evt) {
                this.statsService.notifyOskariEvent(evt);
            },
            'StatsGrid.RegionsetChangedEvent' : function(evt) {
                this.statsService.notifyOskariEvent(evt);
            },
            'StatsGrid.RegionSelectedEvent' : function(evt) {
                this.statsService.notifyOskariEvent(evt);
            },
            'StatsGrid.ActiveIndicatorChangedEvent' : function(evt) {
                this.statsService.notifyOskariEvent(evt);
            },
            'UIChangeEvent' : function() {
                // tear down when receiving the event
                this.getView().prepareMode(false, this.getConfiguration());
            },
            /**
             * @method userinterface.ExtensionUpdatedEvent
             */
            'userinterface.ExtensionUpdatedEvent': function (event) {

                if (event.getExtension().getName() !== this.getName() || !this.hasData()) {
                    // not me/no data -> do nothing
                    return;
                }

                var isShown = event.getViewState() !== 'close';

                this.getView().prepareMode(isShown, this.getConfiguration());
            },
            /**
             * @method MapLayerEvent
             * @param {Oskari.mapframework.event.common.MapLayerEvent} event
             *
             */
            MapLayerEvent: function (event) {
                // Enable tile when stats layer is available
                this.getTile().setEnabled(this.hasData());
            }
        },
        hasData: function () {
            return this.statsService.getDatasource().length
                && this.statsService.getRegionsets().length;
        },

        /**
         * Sets the map state to one specified in the parameter. State is bundle specific, check the
         * bundle documentation for details.
         *
         * @method setState
         * @param {Object} state bundle state as JSON
         */
        setState: function (state) {
            state = state || {};
            var service = this.statsService.getStateService();
            service.reset();
            if(state.regionset) {
                service.setRegionset(state.regionset);
            }
            if(state.indicators) {
                state.indicators.forEach(function(ind) {
                    service.addIndicator(ind.ds, ind.id, ind.selections);
                });
            }
            if(state.active) {
                service.setActiveIndicator(state.active);
            }
        },

            /*
            indicators : [{
             ds: 1,
             id : 2,
             selections : {
                sex : male,
                year : 1991
             }
            }],
            active : "1_2_{sex:male,year:1991}"
            regionset : 6
            */
        getState: function () {
            var service = this.statsService.getStateService();
            var state = {
                indicators : [],
                regionset : service.getRegionset()
            };
            service.getIndicators().forEach(function(ind) {
                state.indicators.push({
                    ds : ind.datasource,
                    id : ind.indicator,
                    selections : ind.selections
                });
            });
            var active = service.getActiveIndicator();
            if(active) {
                state.active = active.hash
            }
            return state;
        }

    }, {
        extend: ['Oskari.userinterface.extension.DefaultExtension']
    }
);
