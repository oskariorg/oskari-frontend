
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.view.GridHelper',
    /**
     * @static constructor function
     */
    function (gridCtrl, locale) {
        this.conf = jQuery.extend(true, {}, this.__defaults);
	    this.controller = gridCtrl;
	    this._locale = locale;
    },
    {
    	"__templates" : {
            'csvButton': '<button class="statsgrid-csv-button">csv</button>',
            'statsgridTotalsVar': '<span class="statsgrid-variable"></span>',
            'subHeader': '<span class="statsgrid-grid-subheader"></span>',
            'gridHeaderMenu': '<li><input type="checkbox" /><label></label></li>',
            'groupingHeader': '<span style="color:green"></span>',
            'toolbarButton': '<button class="statsgrid-select-municipalities"></button>',
            'filterPopup': '<div class="indicator-filter-popup"><p class="filter-desc"></p><div class="filter-container"></div></div>',
            'filterRow': '<div class="filter-row"><div class="filter-label"></div><div class="filter-value"></div></div>',
            'filterSelect': '<div><select class="filter-select"></select><div class="filter-inputs-container"></div></div>',
            'filterOption': '<option></option>',
            'filterInputs': '<input type="text" class="filter-input filter-input1" /><span class="filter-between" style="display:none;">-</span><input type="text" class="filter-input filter-input2" style="display:none;" />',
            'filterLink': '<a href="javascript:void(0);"></a>',
            'filterByRegion': '<div id="statsgrid-filter-by-region"><p class="filter-desc"></p><div class="filter-container"></div></div>',
            'regionCatSelect': '<div class="filter-region-category-select"><select></select></div>',
            'regionSelect': '<div class="filter-region-select"><select class="filter-region-select" multiple tabindex="3"></select></div>',
            'addOwnIndicator': '<div class="new-indicator-cont"><input type="button"/></div>',
            'cannotDisplayIndicator': '<p class="cannot-display-indicator"></p>',
            'headerCategoryItem' : '<li><input type="radio" name="categorySelector"></input><label></label></li>'
    	},
        "__columnIdRegion" : "region",
        "__groupingProperty" : "sel", // 'sel' is hardcoded in Slick.CheckboxSelectColumn2...
        "__groupDisabled" : "empty", // 'empty' is hardcoded in Slick.CheckboxSelectColumn2...
        "__groupEnabled" : "checked", // 'checked' is hardcoded in Slick.CheckboxSelectColumn2...
        "__defaults" : {
            "statistics": [{
                "id": "min",
                "visible": true
            }, {
                "id": "max",
                "visible": true
            }, {
                "id": "avg",
                "visible": true
            }, {
                "id": "mde",
                "visible": true
            }, {
                "id": "mdn",
                "visible": true
            }, {
                "id": "std",
                "visible": true
            }, {
                "id": "sum",
                "visible": true
            }]
        },
        getGrid : function() {
        	return this.grid;
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
        addIndicatorDataToGrid: function (indicatorKey, title, data) {
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
                            element: jQuery(me.__templates.filterLink).text(me._locale.filterByValue),
                            command: 'filter',
                            actionType: 'link'
                        }, {
                            element: jQuery(me.__templates.filterLink).text(me._locale.filterByRegion),
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
        removeIndicatorDataFromGrid: function (indicatorKey) {
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
        hasColumn : function(columnId) {
        	return (this.getColumnById(columnId) != null);
        },
        /**
         * Get column by id
         *
         * @method getColumnById
         * @param column id
         */
        getColumnById: function (columnId) {
            // sendstats
            var columns = this.getGrid().getColumns(),
                column,
                i;
            for (i = 0; i < columns.length; i++) {
                column = columns[i];
                if (column.id === columnId) {
                    return column;
                }
            }
            return null;
        },
        _updateIndicatorDataToGrid: function (columnId, data, columns) {
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
        /**
         * Displays a warning in the header if the indicator data
         * cannot be displayed in the selected region category.
         *
         * @method _addHeaderWarning
         * @param {Boolean} noData
         * @param {Array[Object]} buttons
         */
        _addHeaderWarning: function (noData, buttons) {
            var addedAlready = _.any(buttons, function (item) {
                return item.id === 'no-data-warning';
            });

            if (noData && !addedAlready) {
                // If no data for current category and not yet displayed
                buttons.push({
                    id: 'no-data-warning',
                    cssClass: 'statsgrid-no-indicator-data backendstatus-maintenance-pending',
                    tooltip: this._locale.noIndicatorData
                });
            } else if (addedAlready) {
                // Remove if warning is there
                for (var i = 0, bLen = buttons.length; i < bLen; ++i) {
                    if (buttons[i].id === 'no-data-warning') {
                        buttons.splice(i, 1);
                        break;
                    }
                }
            }
        },
        /**
         * Loop through first group (municipalities) and create header row for
         * @private _updateTotals
         */
        _updateTotals: function (groups) {
            if (!groups) {
            	return;
            }
            var grid = this.getGrid(),
            	columns = grid.getColumns(),
                column,
                i;
            // loop through columns
            for (i = 0; i < columns.length; i++) {
                column = columns[i];

                // group totals (statistical variables) should be calculated only for the checked/selected items
                var group = groups[0],
                    key,
                    g;
                for (key in groups) {
                    if (groups.hasOwnProperty(key)) {
                        g = groups[key];
                        if (g.groupingKey === 'checked') {
                            group = g;
                        }
                    }
                }

                var gridTotals = group.totals,
                    sub = jQuery(this.__templates.subHeader),
                    variableCount = 0,
                    j,
                    statistic;
                // loop through statistical variables
                for (j = 0; j < this.conf.statistics.length; j++) {
                    statistic = this.conf.statistics[j];
                    if (statistic.visible) {
                        sub.append(this._getStatistic(gridTotals, column.id, statistic.id));
                        variableCount++;
                    }
                }

                var columnDiv = jQuery(grid.getHeaderRowColumn(column.id)).empty(),
                    opts = grid.getOptions();
                // TODO: 12 = font-size, 7 = padding...
                var fontSize = columnDiv.css('line-height');
                fontSize = (fontSize) ? fontSize.split('px')[0] : 12;
                opts.headerRowHeight = variableCount * fontSize + 7;
                grid.setOptions(opts);
                sub.appendTo(columnDiv);

            }
        },
        /**
         * A method to get statistical variables
         * @private _getStatistic
         */
        _getStatistic: function (gridTotals, columnId, type) {
            var value = {},
                totalsItem = null,
                result = gridTotals[type],
                decimals = this.getColumnById(columnId).decimals,
                indicatorId;
            //loop through different indicator columns
            for (indicatorId in result) {
                if (result.hasOwnProperty(indicatorId)) {
                    if (!value[indicatorId]) {
                        value[indicatorId] = {};
                    }
                    if (indicatorId.indexOf('indicator') >= 0 && indicatorId === columnId) {
                        value[indicatorId][type] = result[indicatorId];
                        totalsItem = jQuery(this.__templates.statsgridTotalsVar);
                        var val = value[columnId][type];
                        if (!isNaN(val) && !this._isInt(val)) {
                            val = val.toFixed && decimals !== null && decimals !== undefined ? val.toFixed(decimals) : val;
                        }
                        if (_.isNaN(val)) {
                            val = '-';
                        }
                        totalsItem.addClass('statsgrid-' + type).text(val);
                        break;

                    } else if (columnId === this.__columnIdRegion) { // 'municipality'
                        totalsItem = jQuery(this.__templates.statsgridTotalsVar);
                        totalsItem.attr('title', this._locale.statistic.tooltip[type]);
                        totalsItem.addClass('statsgrid-totals-label').text(this._locale.statistic[type]);
                        break;
                    }
                }
            }
            return totalsItem;
        },
        autosizeColumns: function () {
            var grid = this.getGrid(),
                columns = grid.getColumns();

            _.each(columns, function (column) {
                if (column.id !== '_checkbox_selector') {
                    column.width = 80;
                }
            });

            grid.autosizeColumns();
        },
        transformRegionsToColumnData : function(category) {
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
        __handleColumnDataChanged : function() {
            // NOTE!!! user removed/added some regions so indicator values needs to be refreshed for visualization
            // collapse group empty if it is created for the first time
            var grid = this.getGrid(),
                data = grid.getData(),
                groups = data.getGroups(),
                groupsBeforeUpdate = groups.length;
            if (groups.length > 1) {
                var i,
                    group;
                for (i = 0; i < groups.length; i++) {
                    group = groups[i];
                    if (group.groupingKey === this.__groupDisabled && group.count < 2 && groupsBeforeUpdate === 1) {
                        data.collapseGroup(this.__groupDisabled);
                    }
                }
            }
            // resize grid (content/rows does not show extra rows otherwise. i.e. group headers & footers)
            grid.setColumns(grid.getColumns());
            data.refresh();
            // maybe needed? 
            grid.render();
        },
        /**
         * Returns the provided value as a number if it can be
         * casted to such. Otherwise just returns the given string.
         *
         * @method _numerizeValue
         * @private
         * @param  {String} val
         * @return {Number/String}
         */
        _numerizeValue: function (val) {
            var ret = val;
            if (val !== null && val !== undefined) {
                if (val.replace) {
                    ret = val.replace(',', '.');
                }
                ret = Number(ret);
            }
            if (isNaN(ret)) {
                ret = val;
            }
            return ret;
        },
        /**
         * Create initial grid using just one column: region
         * @method createStatisticsGrid
         * @param {Object} container element where grid component should be added
         */
        createStatisticsGrid: function (container, category, regionCategories) {
            var me = this,
                lang = Oskari.getLang(),
                //selectedRegionCategory = this.getActiveRegionCategory(),
                checkboxSelector = new Slick.CheckboxSelectColumn2({
                    cssClass: "slick-cell-checkboxsel"
                });

            // initial columns
            var columns = [checkboxSelector.getColumnDefinition(), {
                id: me.__columnIdRegion,
                name: category.getName(lang), // this._locale.regionCategories[selectedRegionCategory]
                field: "title",
                sortable: true,
                width : 318
            }];

            var dataView = this.__createGridDataView();
            // Grid
            // options
            var options = {
                enableCellNavigation: true,
                enableColumnReorder: true,
                multiColumnSort: true,
                showHeaderRow: true,
                headerRowHeight: 97
            };

            var grid = new Slick.Grid(container, dataView, columns, options);
            this.grid = grid;

            // when the row changes re-render that row
            dataView.onRowsChanged.subscribe(function (e, args) {
                grid.invalidateRows(args.rows);
                grid.render();
                grid.updateRowCount();
                grid.resizeCanvas();
            });

            var sortcol = "json_number",
                sortdir = 1;
            // when user sorts this grid according to selected column
            // we need to provide sort-function
            grid.onSort.subscribe(function (e, args) {
                var target = jQuery(e.target);
                // Don't sort if the clicked spot was a menu button.
                if (target.hasClass('slick-header-menubutton') ||
                    target.parent().hasClass('slick-header-menubutton')) {
                    return false;
                }

                var cols = args.sortCols;
                dataView.sort(function (dataRow1, dataRow2) {
                    var i,
                        field,
                        sign,
                        value1,
                        value2,
                        l;
                    for (i = 0, l = cols.length; i < l; i++) {
                        field = cols[i].sortCol.field;
                        sign = cols[i].sortAsc ? 1 : -1;
                        value1 = me._numerizeValue(dataRow1[field]);
                        value2 = me._numerizeValue(dataRow2[field]);
                        if (value1 === null || value1 === undefined) {
                            return 1;
                        }
                        if (value2 === null || value2 === undefined) {
                            return -1;
                        }
                        var result = (value1 === value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
                        if (result !== 0) {
                            return result;
                        }
                    }
                    return 0;
                });
                grid.invalidate();
                grid.render();
            });

            grid.onHeaderClick.subscribe(function (e, args) {
                me.controller.selectIndicator(args.column.id);
            });

            // when headerRow cells are rendered
            // add placeholder
            grid.onHeaderRowCellRendered.subscribe(function (e, args) {
                jQuery(args.node).empty();
                jQuery(me.__templates.subHeader)
                    .appendTo(args.node);
            });

            grid.onColumnsReordered.subscribe(function (e, args) {
                dataView.refresh();
            });

            // register groupItemMetadataProvider plugin (if not registered group toggles won't work)
            grid.registerPlugin(dataView.__OSKARI_EXT["groupItemMetadataProvider"]);

            // register checboxSelector plugin
            grid.registerPlugin(checkboxSelector);
            dataView.__OSKARI_EXT["checkboxSelector"] = checkboxSelector;
            // Our new event to subscripe - this is called when checkbox is clicked
            // FIXME: row selection is most propably broken regarding visualization!!
            // PROBLEM: me.__handleColumnDataChanged() messes up the header checkbox state for Slick.CheckboxSelectColumn2
            // TODO: inform visualization about data changes some other way
            checkboxSelector.onSelectRowClicked.subscribe(function (e, args) {
                var data = args.grid.getData(),
                    item = data.getItem(args.row);

                //update item values (groupingkey is created from these)
                var isSelected = jQuery(e.target).is(':checked');
                item[me.__groupingProperty] = isSelected ? me.__groupEnabled : me.__groupDisabled;
                data.updateItem(item.id, item);
                me.controller.filterRegion(item.id, !isSelected);
                //me.__handleColumnDataChanged();
            });

            //if header checkbox is clicked, update map
            checkboxSelector.onSelectHeaderRowClicked.subscribe(function (e, args) {
                // disable/enable all rows - this is handled by Slick.CheckboxSelectColumn2
                //me.__handleColumnDataChanged();
                var isSelected = jQuery(e.target).is(':checked');
                var regions = null;
                if(!isSelected) {
                	// move all enabled regions to filter list (they become disabled only after this)
	                regions = me.getEnabledRegions();
                }
                me.controller.filterRegion(regions, !isSelected);
            });

            grid.registerPlugin(me.__createHeaderPlugin(columns, grid, regionCategories));

            // register header buttons plugin
            var headerButtonsPlugin = new Slick.Plugins.HeaderButtons();
            grid.registerPlugin(headerButtonsPlugin);

            // AH-885, we want the municipality column to fill 50% or so of the available space if it's the only column.
            //me.autosizeColumns();
            //columns = grid.getColumns();
            //columns[1].width = 318;

            return grid;
        },
        __createGridDataView : function() {
            var me = this;
            // metadata provider for data view
            var groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
            // dataview for the grid
            var dataView = new Slick.Data.DataView({
                groupItemMetadataProvider: groupItemMetadataProvider,
                inlineFilters: true
            });
            // __OSKARI_EXT is used to keep references to related objects
            dataView.__OSKARI_EXT = {
                "groupItemMetadataProvider" : groupItemMetadataProvider
            }

            // To use aggregators we need to define a group
            dataView.setGrouping({
                getter: me.__groupingProperty,
                comparer: function (a, b) {
                    //checkbox columns values are me.__groupEnabled and me.__groupDisabled
                    var ret = -1;
                    if (a.groupingKey === me.__groupEnabled && a.groupingKey === b.groupingKey) {
                        ret = 0;
                    } else if (a.groupingKey < b.groupingKey) {
                        // me.__groupDisabled is the first group
                        ret = 1;
                    }
                    return ret;
                },
                formatter: function (g) {
                    //a hack to name the groups
                    var text = (g.groupingKey === me.__groupEnabled ?
                        me._locale.included :
                        me._locale.not_included) + " (" + g.count + ")";
                    return "<span style='color:green'>" + text + "</span>";
                },
                aggregateCollapsed: false
            });
            return dataView;
        },
        getEnabledRegions : function() {
            // Get values of selected column
            var data = this.getGrid().getData().getItems();
            var regions = _.reduce(data, function(regions, item) {
                if (item[this.__groupingProperty] === this.__groupEnabled) {
                    regions.push(item.id);
                }
            	return regions;
            }, []);
            return regions;
        },
        /**
         * A method to initialize header plugin
         * @private _initHeaderPlugin
         */
        __createHeaderPlugin: function (columns, grid, regionCategories) {
            var me = this,
                i;
            // lets create an empty container for menu items
            for (i = 0; i < columns.length; i++) {
                var column = columns[i];
                if (column.id === me.__columnIdRegion) {
                    column.header = {
                        menu: {
                            items: []
                        }
                    };
                }
            }

            // new header menu plugin
            var headerMenuPlugin = new Slick.Plugins.HeaderMenu2({});
            me.__addRegionColumnMenu(headerMenuPlugin, regionCategories);
            // when command is given shos statistical variable as a new "row" in subheader
            headerMenuPlugin.onCommand.subscribe(function (e, args) {
                var i;
                if (args.command === 'selectRows') {
                    me.__setRowSelectorEnabled(jQuery(e.target).is(":checked"));
                } else if (/^category_/.test(args.command)) {
                    me.controller.selectRegionCategory(_.last(args.command.split('_')));
                } else if (args.command == 'filter') {
                    me._createFilterPopup(args.column, this);
                } else if (args.command === 'filterByRegion') {
                    me._createFilterByRegionPopup(args.column, this);
                } else {
                    for (i = 0; i < me.conf.statistics.length; i++) {
                        var statistic = me.conf.statistics[i];
                        if (statistic.id == args.command) {
                            statistic.visible = !statistic.visible;
                            break;
                        }
                    }
                    //TODO we need to create grouping for statistical variables 
                    // instead of using subheader!

                    //reduce the number of variables
                    grid.getData().refresh();
                    // setColumns fires slickgrid resizing (cssrules etc.) 
                    // => variables disappear
                    grid.setColumns(grid.getColumns());
                    // this prints variables again.
                    grid.getData().refresh();
                }
            });
            return headerMenuPlugin;
        },
        __addRegionColumnMenu : function(headerMenuPlugin, availableCategories) {
            var me = this;
            // lets create a menu when user clicks the button.
            headerMenuPlugin.onBeforeMenuShow.subscribe(function (e, args) {
                var menu = args.menu,
                    activeCategory = me.controller.getActiveRegionCategory(),
                    i,
                    input;
                if (args.column.id !== me.__columnIdRegion) {
                    return;
                }
                menu.items = [];

                menu.items.push({
                    element: '<div class="header-menu-subheading">' + me._locale.regionCategories.title + '</div>',
                    disabled: true
                });
                // Region category selects
                _.each(availableCategories, function (category) {
                    var categoryId = category.getId();
                    var categorySelector = jQuery(me.__templates.headerCategoryItem);
                    categorySelector.find('input').attr({
                        'id': 'category_' + categoryId,
                        'checked': (categoryId === activeCategory ? 'checked' : false)
                    });
                    var label = categorySelector.find('label');
                    label.attr('for', 'category_' + categoryId);
                    label.html(category.getName()); //me._locale.regionCategories[category]

                    menu.items.push({
                        element: categorySelector,
                        command: 'category_' + categoryId
                    });
                });

                menu.items.push({
                    element: '<div class="header-menu-subheading subheading-middle">' + me._locale.statistic.title + '</div>',
                    disabled: true
                });
                // Statistical variables
                for (i = 0; i < me.conf.statistics.length; i++) {
                    var statistic = me.conf.statistics[i],
                        elems = jQuery(me.__templates.gridHeaderMenu).addClass('statsgrid-show-total-selects');

                    // create input element with localization
                    input = elems.find('input').attr({
                        'id': 'statistics_' + statistic.id
                    });
                    // if variable is visible => check the checkbox
                    if (statistic.visible) {
                        input.attr({
                            'checked': 'checked'
                        });
                    }
                    // create label with localization
                    elems.find('label').attr('for', 'statistics_' + statistic.id).text(me._locale.statistic[statistic.id]);
                    // add item to menu
                    menu.items.push({
                        element: elems,
                        command: statistic.id
                    });
                }

                // create checkbox for selecting rows toggle
                var showRows = jQuery(me.__templates.gridHeaderMenu).addClass('statsgrid-show-row-selects');
                // create input element with localization
                input = showRows.find('input').attr({
                    'id': 'statsgrid-show-row-selects'
                });
                // check if select rows checkbox should be checked
                if (me.__isRowSelectorActive()) {
                    input.attr('checked', 'checked');
                }
                // create label with localization
                showRows.find('label').attr('for', 'statsgrid-show-row-selects').text(me._locale.selectRows);
                menu.items.push({
                    element: showRows,
                    command: 'selectRows'
                });

            });
        },
        __setRowSelectorEnabled : function(blnEnable) {
            var grid = this.getGrid(),
            	columns = grid.getColumns(),
                columnDef = grid.getData().__OSKARI_EXT["checkboxSelector"].getColumnDefinition();
            // should always be first column if on grid
            var isPresent = this.__isRowSelectorActive();
            if(isPresent && !blnEnable) {
                // drop the first column
                columns.shift();
            }
            else if(!isPresent && blnEnable) {
                // add as first column
                columns.unshift(columnDef);
            }
            grid.setColumns(columns);
        },
        __isRowSelectorActive : function() {
            var columns = this.getGrid().getColumns(),
                columnDef = this.getGrid().getData().__OSKARI_EXT["checkboxSelector"].getColumnDefinition();
            // should always be first column if on grid
            var isPresent = (columns[0].field === columnDef.field); // 'sel'
            return isPresent;
        }

    });