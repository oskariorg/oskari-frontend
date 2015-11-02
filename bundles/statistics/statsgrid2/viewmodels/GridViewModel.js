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
            me.indicators[indicator.key] = {
                indicator: indicator,
                // Defines the column order.
                rank: me.maxRank,
                name: name
            };
        },
        "getIndicators": function() {
            return this.indicators;
        },
        "getLayers": function() {
            var me = this,
                layers = {};
            Object.keys(me.indicators).forEach(function(indicatorKey) {
                me.indicators[indicatorKey].indicator.indicator.getLayers().forEach(function(layer) {
                    // layer = {"layerVersion":"1","type":"FLOAT","layerId":"Kunta"}
                    layers[layer.layerId] = layer;
                });
            });
            return layers;
        },
        "getGridData": function() {
            // Transforming columns into rows.
            // First getting all the regions from all the indicators.
            var regions = me._getRegions();
            return me.indicators.map(function (indicator) {
                return indicator.indicator.name;
            });
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
        "transformRegionsToColumnData" : function(category) {
            var me = this,
                lang = Oskari.getLang();

            var data = _.foldl(category.getRegions(), function (result, region) {
                var row = {
                    id: region.id,
                    //code: indicator.code,
                    title : region.locale[lang],
                    // TODO: handle member of somehow, backend needs to provide it
                    memberOf: [], //indicator.memberOf
                };
                //row[me.__columnIdRegion] = region.locale[lang];
                // default to enabled group
                row[me.__groupingProperty] = me.__groupEnabled;
                result.push(row);
                return result;
            }, []);
            return data;
        },
        "hasColumn" : function(columnId) {
            return (this.getColumnById(columnId) != null);
        },
        /**
         * Get column by key where the indicator ids are concatenated with options.
         *
         * @method getColumnById
         * @param indicatorKey
         */
        "getColumnById" : function (indicatorKey) {
            return this.indicators[indicatorKey];
        },
        /**
         * Add indicator data to the grid.
         *
         * @method addIndicatorDataToGrid
         * @param indicatorId id
         * @param gender (male/female/total)
         * @param year selected year
         * @param data related to the indicator
         */
        "addIndicatorDataToGrid": function (indicatorKey, title, data) {
            var me = this,
                columnId = indicatorKey,
                columns = me.getGrid().getColumns();

            var headerButtons = [{
                cssClass: 'icon-close-dark statsgrid-remove-indicator',
                tooltip: me._locale.removeColumn,
                handler: function (e) {
                    // TODO: fix
                    me.removeIndicatorDataFromGrid(indicatorKey);
                }
            }];

            columns.push({
                id: columnId,
                name: title,
                field: columnId,
                toolTip: title,
                sortable: true,
                header: {
                    menu: {
                        items: [{
                            element: jQuery('<div></div>').text(me._locale.filter)
                        }, {
                            element: jQuery(me._templates.filterLink).text(me._locale.filterByValue),
                            command: 'filter',
                            actionType: 'link'
                        }, {
                            element: jQuery(me._templates.filterLink).text(me._locale.filterByRegion),
                            command: 'filterByRegion',
                            actionType: 'link'
                        }]
                    },
                    icon: 'icon-funnel',
                    buttons: ((this.conf && this.conf.published) ? null : headerButtons)
                },

                formatter: function (row, cell, value, columnDef, dataContext) {
                    var numValue = Number(value),
                        ret;
                    if (isNaN(numValue) || columnDef.decimals === null || columnDef.decimals === undefined) {
                        ret = value;
                    } else {
                        ret = numValue.toFixed(columnDef.decimals);
                    }
                    return ret;
                },

                groupTotalsFormatter: function (totals, columnDef) {
                    var text = '';
                    // create grouping footer texts. => how many values there is in different colums
                    var valueCount = 0,
                        rows = totals.group.rows,
                        row,
                        i;
                    for (i = 0; i < rows.length; i++) {
                        row = rows[i];
                        if (row[columnDef.field] !== null && row[columnDef.field] !== undefined) {
                            valueCount++;
                        }
                    }
                    text = valueCount + ' ' + me._locale.values;
                    return text;
                }
            });
            me.grid.setColumns(columns);

            me._updateIndicatorDataToGrid(columnId, data, columns);

            me.autosizeColumns();

            me.grid.setSortColumn(columnId, true);

        },
        /**
         * Remove indicator data to the grid.
         *
         * @method removeIndicatorDataFromGrid
         * @param indicatorId id
         * @param gender (male / female / total)
         * @param year selected year
         */
        "removeIndicatorDataFromGrid" : function (indicatorKey) {
            var columnId = indicatorKey,
                grid = this.getGrid(),
                dataView = grid.getData(),
                columns = grid.getColumns(),
                allOtherColumns = [],
                found = false,
                i = 0,
                ilen = 0,
                j = 0;

            for (i = 0, ilen = columns.length, j = 0; i < ilen; i++) {
                if (columnId === columns[i].id) {
                    // Skip the column that is to be deleted
                    found = true;
                } else {
                    allOtherColumns[j] = columns[i];
                    j++;
                }
            }

            // replace the columns with the columns without the column that was found
            if (found) {
                if (allOtherColumns.length === 2) {
                    // Only checkbox and municipality columns left, resize municipality column to ~50%
                    allOtherColumns[1].width = 318;
                }
                grid.setColumns(allOtherColumns);
                grid.render();
                dataView.refresh();
                if (allOtherColumns.length !== 2) {
                    this.autosizeColumns();
                }
            }
            this.controller.removeIndicator(indicatorKey);
        },
        "_updateIndicatorDataToGrid" : function (columnId, data, columns) {
            var me = this,
                hasNoData = true,
                column = me.getColumnById(columnId),
                grid = me.getGrid(),
                dataView = grid.getData(),
                i,
                indicatorId,
                gender,
                year,
                numValue;

            //data = data || me.indicatorsData[columnId];
            //columns = columns || me.grid.getColumns();
            dataView.beginUpdate();

            // loop through data and get the values
            var indicData,
                regionId,
                value,
                item,
                maxDecimals = 0,
                getDecimalCount = function (val) {
                    var match = ('' + val).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/),
                        ret = 0;
                    if (match) {
                        ret = Math.max(
                            0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
                    }
                    return ret;
                };
            for (i = 0; i < data.length; i++) {
                indicData = data[i];
                regionId = indicData.region;
                value = indicData['primary value'].replace(',', '.');

                if (regionId !== null && regionId !== undefined) {
                    // find region
                    item = dataView.getItemById(regionId);
                    if (item) {
                        hasNoData = false;
                        // update row
                        numValue = Number(value);
                        if (isNaN(numValue)) {
                            item[columnId] = value;
                        } else {
                            // get number's decimal count
                            maxDecimals = Math.max(maxDecimals, getDecimalCount(numValue));
                            item[columnId] = numValue;
                        }
                        dataView.updateItem(item.id, item);
                    }
                }
            }
            column.decimals = maxDecimals;

            // Display a warning if cannot be displayed in the selected region category
            if (column.header && column.header.buttons) {
                me._addHeaderWarning(hasNoData, column.header.buttons);
                grid.setColumns(columns);
            }

            // create all the aggregators we need
            var aggregators = [];

            for (i = 0; i < columns.length; i++) {
                var id = columns[i].id;
                aggregators.push(new Slick.Data.Aggregators.Avg(id));
                aggregators.push(new Slick.Data.Aggregators.Std(id));
                aggregators.push(new Slick.Data.Aggregators.Mdn(id));
                aggregators.push(new Slick.Data.Aggregators.Mde(id));
                aggregators.push(new Slick.Data.Aggregators.Sum(id));
                aggregators.push(new Slick.Data.Aggregators.Max(id));
                aggregators.push(new Slick.Data.Aggregators.Min(id));
            }
            dataView.setAggregators(aggregators, true);

            // Add callback function for totals / statistics
            dataView.setTotalsCallback(function (groups) {
                me._updateTotals(groups);
            });

            dataView.endUpdate();
            dataView.refresh();
            grid.invalidateAllRows();
            grid.render();
            grid.setSortColumn(columnId, true);
        },
    });