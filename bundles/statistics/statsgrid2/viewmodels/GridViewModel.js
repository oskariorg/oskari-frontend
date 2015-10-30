/**
 * View model for the grid. This maintains the actual state of the grid content
 * and converts it into forms understood by different view components, such as the map and the grid.
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.viewmodels.GridViewModel',
    /**
     * @static constructor function
     */
    function (gridCtrl, regionHeader, layerId) {
        this.conf = jQuery.extend(true, {}, this.__defaults);
	    this.controller = gridCtrl;
	    this.indicators = {};
	    this.maxRank = 0;
        this.regionHeader = regionHeader;
        this.layerId = layerId;
    },
    {
        /**
         * Indicators are columns in the data grid.
         */
        "addIndicator": function(indicator, name) {
            var me = this;
            me.maxRank = me.maxRank + 1;
            me.indicators[indicator.getId()] = {
                indicator: indicator,
                // Defines the column order.
                rank: me.maxRank,
                name: name
            };
        },
        "getGridHeader": function() {
            return [me.regionHeader].concat(me.indicators.map(function (indicator) {
                return indicator.indicator.name;
            }));
        },
        "_getLayer": function(indicator) {
            var correctLayer = indicator.getLayers().filter(function(layer) {
                return layer.layerId.equals(me.layerId);
            });
            if (correctLayer.length == 1) {
                return correctLayer[0];
            } else {
                return undefined;
            }
        },
        "_getRegions": function() {
            // TODO: If this is too slow, it can be pre-calculated in adding indicators.
            me.indicators.forEach(function(indicator) {
                var correctLayer = indicator.getLayers().filter(function(layer) {
                    return layer.layerId.equals(me.layerId);
                });
            });
        },
        "getGridData": function() {
            // Transforming columns into rows.
            // First getting all the regions from all the indicators.
            var regions = me._getRegions();
            return me.indicators.map(function (indicator) {
                return indicator.indicator.name;
            });
        }
    });