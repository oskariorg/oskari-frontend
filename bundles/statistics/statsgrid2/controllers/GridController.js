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
        this.view = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.view.Grid', this, localization);
        this.render = this.view.render;
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
        "selectRegionCategory" : function(categoryId) {
            var me = this,
                grid = this.getGrid(),
                dataView = grid.getData();

            this.service.getRegions(categoryId, function(category) {
                // setup regions
                // notify dataview that we are starting to update data
                dataView.beginUpdate();
                // empty the data view
                //dataView.setItems([]);
                //grid.invalidateAllRows();
                // set municipality data
                dataView.setItems(me.helper.transformRegionsToColumnData(category));
                //-------------------------------------------
                // TODO: setup any indicator values
                // see changeGridRegion in statsgrid.ManageStatsPlugin
                //-------------------------------------------
                // notify data view that we have updated data
                dataView.endUpdate();
                // invalidate() -> the values in the grid are not correct -> invalidate
                grid.invalidate();
                // render the grid
                grid.render();
                // TODO: change statslayer on map that presents this region category
                //this._setLayerToCategory(this._selectedRegionCategory);
            });

            this.userSelections.setActiveRegionCategory(categoryId);
        },
        "getGrid" : function() {
            return this.__grid;
        },
        "getActiveRegionCategory" : function() {
            return this.userSelections.getActiveRegionCategory();
        },
        "selectIndicator" : function(indicatorKey) {
            // Don't do anything in case the clicked column is the one in the state.
            if (indicatorKey === this.getState().currentColumn) {
                return false;
            }
            if(this.helper.hasColumn(indicatorKey)) {
                // just select it
                return;
            }
            var me = this,
                data = this.__indicatorCache[indicatorKey][me.getActiveRegionCategory()];
            me.helper.addIndicatorDataToGrid(indicatorKey, me.__constructLabel(indicator, data.opts), data.data);
        },
        "__constructLabel" : function(indicator, opts) {
            var name =  indicator.getName();
            _.each(opts, function(value, key) {
                name = name + '/' + value;
            });
            return name;
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
                            pluginId : e.getDatasourceId(),
                            indicatorId : e.getIndicatorId(),
                            selectors : e.getSelectors(),
                            regionId : me.getActiveRegionCategory(),
                            data : data
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
