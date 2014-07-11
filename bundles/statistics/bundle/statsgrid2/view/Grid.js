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
        this.conf = jQuery.extend(true, {}, this.__defaults);
        this._locale = localization;
        this.service = service;
        // start to register eventhandlers etc
        this.start();
    },
    {
        "name" : "statsgrid.view.Grid",
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
        "__defaultRegionCategory" : 1, //'KUNTA',
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
                me.__grid = me.__createStatisticsGrid(container, category);
                me.selectRegionCategory(me.getActiveRegionCategory());

                // Hackhack, initially sort by region column (slickgrid doesn't have an easy way to do this...)
                jQuery('.slick-header-columns').children().eq(1).trigger('click');
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
                dataView.setItems(me.__transformRegionsToColumnData(category));
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
        __handleIndicatorSelected : function(indicatorKey) {
            // Don't do anything in case the clicked column is the one in the state.
            if (indicatorKey === this.getState().currentColumn) {
                return false;
            }
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
        __transformRegionsToColumnData : function(category) {
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
        /**
         * Create initial grid using just one column: region
         * @method __createStatisticsGrid
         * @param {Object} container element where grid component should be added
         */
        __createStatisticsGrid: function (container, category) {
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
                me.__handleIndicatorSelected(args.column.id);
            });

            // when headerRow cells are rendered
            // add placeholder
            grid.onHeaderRowCellRendered.subscribe(function (e, args) {
                jQuery(args.node).empty();
                jQuery(me.__templates.subHeader)
                    .appendTo(args.node);
            });

            grid.onColumnsReordered.subscribe(function (e, args) {
                me.dataView.refresh();
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
                item[me.__groupingProperty] = jQuery(e.target).is(':checked') ? me.__groupEnabled : me.__groupDisabled;
                data.updateItem(item.id, item);
                //me.__handleColumnDataChanged();
            });

            //if header checkbox is clicked, update map
            checkboxSelector.onSelectHeaderRowClicked.subscribe(function (e, args) {
                // disable/enable all rows - this is handled by Slick.CheckboxSelectColumn2
                //me.__handleColumnDataChanged();
            });

            grid.registerPlugin(me.__createHeaderPlugin(columns, grid));

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
        /**
         * A method to initialize header plugin
         * @private _initHeaderPlugin
         */
        __createHeaderPlugin: function (columns, grid) {
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
            this.service.getRegionCategories(function(availableCategories) {
                me.__addRegionColumnMenu(headerMenuPlugin, availableCategories);
            });
            // when command is given shos statistical variable as a new "row" in subheader
            headerMenuPlugin.onCommand.subscribe(function (e, args) {
                var i;
                if (args.command === 'selectRows') {
                    me.__setRowSelectorEnabled(jQuery(e.target).is(":checked"));
                } else if (/^category_/.test(args.command)) {
                    me.selectRegionCategory(_.last(args.command.split('_')));
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
                    activeCategory = me.getActiveRegionCategory(),
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
        },
        handleContainerResized : function() {
            this.getGrid().resizeCanvas();
        },

        /**
         * Get column by id
         *
         * @method _getColumnById
         * @private
         * @param column id
         */
        _getColumnById: function (columnId) {
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
        "eventHandlers": {
            "StatsGrid.IndicatorSelectedEvent" : function(e) {
                // TODO: check if indicator is already present on grid:
                // a) if not, add it
                // b) if present, activate it
                console.log(e);
            }
        }
    },
    {
        "extend" : ['Oskari.userinterface.extension.DefaultModule']
    }
);
