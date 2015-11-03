/**
 * @class Oskari.statistics.bundle.statsgrid.view.Grid
 *
 * Controller for the grid component.
 *
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.controllers.GridController',
    /**
     * @static constructor function
     */
    function (localization, statisticsService, userSelections) {
        this.viewmodel = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.viewmodels.GridViewModel', this);
        this.view = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.view.Grid', this, localization, this.viewmodel);
        this._locale = localization;
        this.service = statisticsService;
        this.userSelections = userSelections;
        // start to register eventhandlers etc
        this.start();
    },
    {
        "name" : "statsgrid.controllers.GridController",
        "filterRegion" : function(region, blnFilter) {
            if(blnFilter) {
                this.userSelections.addFilteredRegion(region);
            }
            else {
                this.userSelections.removeRegionFilter(region);
            }
        },
        "changeLayer" : function(layerId) {
            var me = this;

            this.service.getRegions(layerId, function(regions) {
                // FIXME: Update map regions.
                me.viewmodel.setLayer(layerId);
                me.view.refresh();
            });

            this.userSelections.setActiveRegionCategory(layerId);
        },
        "getActiveRegionCategory" : function() {
            return this.userSelections.getActiveRegionCategory();
        },
        "selectIndicator" : function(indicatorKey) {
            // Don't do anything in case the clicked column is the one in the state.
            if (indicatorKey === this.getState().currentColumn) {
                return false;
            }
            if(this.viewmodel.hasColumn(indicatorKey)) {
                // just select it
                return;
            }
            
            var me = this,
                indicator = this.__indicatorCache[indicatorKey][me.getActiveRegionCategory()];
            me.viewmodel.addIndicator(indicator, me.view.constructLabel(indicator));
            me.view.refresh();
        },
        "removeIndicator": function (indicatorKey) {
            // TODO: maybe send an event?
            this.__indicatorCache[indicatorKey] = null;
            delete this.__indicatorCache[indicatorKey];
        },
        "__indicatorCache" : {
        },
        "eventHandlers": {
            "StatsGrid.IndicatorSelectedEvent" : function(e) {
                // TODO: check if indicator is already present on grid:
                // a) if not, add it
                // b) if present, activate it
                var me = this;
                if(me.__indicatorCache[e.getKey()] &&
                        me.__indicatorCache[e.getKey()][me.getActiveRegionCategory()]) {
                    // just select it
                    this.selectIndicator(e.getKey());
                }
                else {
                    // add indicator placeholder and get the data

                    this.service.getIndicatorValue(e.getDatasourceId(), e.getIndicatorId(), e.getSelectors(),
                            me.getActiveRegionCategory(),
                            function(data) {
                        me.__indicatorCache[e.getKey()] = {};
                        me.__indicatorCache[e.getKey()][me.getActiveRegionCategory()] = {
                            indicator: e.getIndicator(),
                            pluginId : e.getDatasourceId(),
                            indicatorId : e.getIndicatorId(),
                            selectors : e.getSelectors(),
                            regionId : me.getActiveRegionCategory(),
                            data : data,
                            key: e.getKey()
                        };
                        me.selectIndicator(e.getKey());
                    });

                }
            }
        },
        "handleContainerResized" : function() {
            this.getGrid().resizeCanvas();
        },
        "autosizeColumns" : function () {
            this.helper.autosizeColumns();
        }
    },
    {
        "extend" : ['Oskari.userinterface.extension.DefaultModule']
    }
);
