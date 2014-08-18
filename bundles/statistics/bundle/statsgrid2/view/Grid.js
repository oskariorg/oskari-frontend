/**
 * @class Oskari.statistics.bundle.statsgrid.view.Grid
 *
 * Creates indicator grid
 *
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.view.Grid',
    /**
     * @static constructor function
     */
    function (localization, service) {
        this.helper = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.view.GridHelper', service, this, localization);
        this._locale = localization;
        this.service = service;
        // start to register eventhandlers etc
        this.start();
    },
    {
        "name" : "statsgrid.view.Grid",
        "__defaultRegionCategory" : 1, //'KUNTA',
        render : function(container) {
            var me = this;
            this.container = container;
            // clear container and start building the grid
            container.empty();
            var selectedCategory = this.getActiveRegionCategory();
            this.service.getRegionCategories(function(categories) {
                var category = _.find(categories, function(cat) {
                    return '' + cat.getId() === '' + selectedCategory;
                });
                if(!category) {
                    me.getSandbox().printWarn('Default region category not found!');
                    return;
                }
                me.__grid = me.helper.createStatisticsGrid(container, category);
                me.selectRegionCategory(me.getActiveRegionCategory());

                // initially sort by region column
                me.__grid.setSortColumn(me.helper.__columnIdRegion, true);
            });

        },
        selectRegionCategory : function(categoryId) {
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

            // setup state - TODO: maybe use constant for "activeCategory"?
            this.getState().regionCategory = categoryId;
        },
        getGrid : function() {
            return this.__grid;
        },
        getActiveRegionCategory : function() {
            return this.getState().regionCategory || this.__defaultRegionCategory;
        },
        selectIndicator : function(indicatorKey) {
            // Don't do anything in case the clicked column is the one in the state.
            if (indicatorKey === this.getState().currentColumn) {
                return false;
            }
            if(this.helper.hasColumn(indicatorKey)) {
                // just select it
                return;
            }
            var me = this,
                data = this.__indicatorCache[indicatorKey];

            this.service.getIndicatorMetadata(data.datasrc, data.id, function(indicator) {
                me.helper.addIndicatorDataToGrid(indicatorKey, me.__constructLabel(indicator, data.opts), data.data);
            });
        },
        __constructLabel : function(indicator, opts) {
            var name =  indicator.getName();
            _.each(opts, function(value, key) {
                name = name + '/' + value;
            });
            return name;
        },
        removeIndicator: function (indicatorKey) {
            // TODO: maybe send an event?
            this.__indicatorCache[indicatorKey] = null;
            delete this.__indicatorCache[indicatorKey];
        },
        __indicatorCache : {
        },
        "eventHandlers": {
            "StatsGrid.IndicatorSelectedEvent" : function(e) {
                // TODO: check if indicator is already present on grid:
                // a) if not, add it
                // b) if present, activate it
                console.log(e);
                var me = this;
                if(this.__indicatorCache[e.getKey()]) {
                    // just select it
                    this.selectIndicator(e.getKey());
                }
                else {
                    // add indicator placeholder and get the data
                    
                    this.service.getIndicatorValue(e.getDatasourceId(), e.getIndicatorId(), e.getOptions(), function(data) {
                        me.__indicatorCache[e.getKey()] = {
                            datasrc : e.getDatasourceId(),
                            id : e.getIndicatorId(),
                            opts : e.getOptions(),
                            data : data
                        };
                        me.selectIndicator(e.getKey());
                    });

                }
            }
        },
        handleContainerResized : function() {
            this.getGrid().resizeCanvas();
        },
        autosizeColumns: function () {
            this.helper.autosizeColumns();
        }
    },
    {
        "extend" : ['Oskari.userinterface.extension.DefaultModule']
    }
);
