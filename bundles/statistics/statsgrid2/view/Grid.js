
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.view.Grid',
    /**
     * @static constructor function
     */
    function (gridCtrl, locale, viewmodel) {
        this.conf = jQuery.extend(true, {}, this.__defaults);
	    this.controller = gridCtrl;
	    this._locale = locale;
	    this.viewmodel = viewmodel;
    },
    {
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
        "_templates": {
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
            'headerCategoryItem' : '<li><input type="radio" name="categorySelector"></input><label></label></li>',
            'grid': '<div class="clusterize"><table><thead><tr name="gridHeader"></tr></thead></table><div id="scrollArea" class="clusterize-scroll">' +
                '<table><tbody id="contentArea" class="clusterize-content"><tr class="clusterize-no-data"><td></td></tr></tbody>' +
                '</table></div></div>'
        },
        /**
         * Refreshes the grid to be in sync with the viewmodel.
         */
        "render" : function(container) {
            var me = this,
                indicators = me.viewmodel.getIndicators(),
                layers = me.viewmodel.getLayers();

            this.container = container;
            // clear container and start building the grid
            container.empty();
            
            var SelectCell = Backgrid.HeaderCell.extend({
                tagName: "td",
                events: {
                    "change input[type=checkbox]": "onChange"
                },
                initialize: function (options) {
                    var hc = this;
                    this.listenTo(options.column, "change:renderable", function (column, renderable) {
                        hc.$el.toggleClass("renderable", renderable);
                    });

                    if (Backgrid.callByNeed(options.column.renderable(), options.column, hc.model)) {
                        hc.$el.addClass("renderable");
                    }

                    this.listenTo(this.model, "backgrid:select", function (model, selected) {
                        hc.$el.find("input[type=checkbox]").prop("checked", selected).change();
                    });
                },
                onChange: function () {
                    var checked = this.checkbox().prop("checked");
                    this.$el.parent().toggleClass("selected", checked);
                    this.model.trigger("backgrid:selected", this.model, checked);
                },
                render: function () {
                    this.$el.empty().append('<input type="checkbox" />');
                    this.delegateEvents();
                    return this;
                }
            });
            var SelectAllHeaderCell = Backgrid.HeaderCell.extend({
                tagName: "th",
                events: {
                    "change input[type=checkbox]": "onChange"
                },
                initialize: function (options) {
                    var hc = this;
                    this.listenTo(options.column, "change:renderable", function (column, renderable) {
                        hc.$el.toggleClass("renderable", renderable);
                    });

                    if (Backgrid.callByNeed(options.column.renderable(), options.column, hc.collection)) {
                        hc.$el.addClass("renderable");
                    }
                },
                checkbox: function () {
                    return this.$el.find("input[type=checkbox]");
                },
                onChange: function () {
                    var checked = this.checkbox().prop("checked");
                    this.$el.parent().toggleClass("selected", checked);
                },
                render: function () {
                    this.$el.empty().append('<input type="checkbox" />');
                    this.delegateEvents();
                    return this;
                }
            });
            var RegionsHeaderCell = Backgrid.HeaderCell.extend({
                tagName: "th",
                initialize: function (options) {
                    var hc = this;
                    hc.selectedLayer = "Kunta";
                    this.listenTo(options.column, "change:renderable", function (column, renderable) {
                        hc.$el.toggleClass("renderable", renderable);
                    });

                    if (Backgrid.callByNeed(options.column.renderable(), options.column, hc.model)) {
                        hc.$el.addClass("renderable");
                    }
                },
                render: function () {
                    this.$el.empty().append('<span>' + me._locale.regionCategories[this.selectedLayer] + '</span>');
                    this.$el.append('<div class="grid-header-menubutton"></div>');
                    return this;
                }
            });
            var columns = [{
                name: "selected",
                label: "",
                cell: "boolean",
                headerCell: SelectAllHeaderCell,
                sortable: false
              }, {
                name: "region",
                headerCell: RegionsHeaderCell,
                cell: "string"
              }];
            
            Object.keys(indicators).forEach(function (indicatorKey) {
                var indicatorLabel = me.constructLabel(indicators[indicatorKey].indicator);
                var indicatorHeaderCell = Backgrid.HeaderCell.extend({
                    // FIXME: Implement indicator header logic here.
                    
                });
                columns.push({
                    name: indicatorKey,
                    label: indicatorLabel
                });
            });
            var RowModel = Backbone.Model.extend({
                defaults: {
                    selected: true,
                    regionId: "",
                    indicatorValues: []
                }
            });

            var CollectionModel = Backbone.Collection.extend({
                model: RowModel
            });
            var collection = new CollectionModel();
            // Initialize a new Grid instance
            var grid = new Backgrid.Grid({
              columns: columns,
              collection: collection
            });

            // Render the grid
            container.append(grid.render().el);
            // Statistical variables
            for (i = 0; i < me.conf.statistics.length; i++) {
                var statistic = me.conf.statistics[i],
                    elems = jQuery(me._templates.gridHeaderMenu).addClass('statsgrid-show-total-selects');

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
            }
        },
        "refresh": function() {
            this.render(this.container);
        },
        "getLocalizationFrom": function(localizedNames, fallback, lang) {
            var name = localizedNames.getLocalization(lang);
            if (!name) {
                name = localizedNames.getLocalization("fi");
            }
            if (!name) {
                name = localizedNames.getLocalization("en");
            }
            if (!name) {
                if (Object.keys(localizedNames) > 0) {
                    // Taking the first one.
                    name = localizedNames[localizedNames.getLocalizationKeys()[0]];
                } else {
                    name = indicatorId;
                }
            }
            return name;
        },
        "constructLabel" : function(indicator) {
            var lang = Oskari.getLang(),
                name = this.getLocalizationFrom(indicator.indicator.getName(), indicator.key, lang),
                opts = indicator.selections;
            
            _.each(opts, function(value, key) {
                name = name + '/' + value;
            });
            return name;
        },
        /**
         * Displays a warning in the header if the indicator data
         * cannot be displayed in the selected region category.
         *
         * @method _addHeaderWarning
         * @param {Boolean} noData
         * @param {Array[Object]} buttons
         */
        "_addHeaderWarning" : function (noData, buttons) {
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
        "_updateTotals" : function (groups) {
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
                    sub = jQuery(me._templates.subHeader),
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
        "_getStatistic" : function (gridTotals, columnId, type) {
            var me = this,
                value = {},
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
                        totalsItem = jQuery(me._templates.statsgridTotalsVar);
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
                        totalsItem = jQuery(me._templates.statsgridTotalsVar);
                        totalsItem.attr('title', this._locale.statistic.tooltip[type]);
                        totalsItem.addClass('statsgrid-totals-label').text(this._locale.statistic[type]);
                        break;
                    }
                }
            }
            return totalsItem;
        },
        "autosizeColumns" : function () {
            var grid = this.getGrid(),
                columns = grid.getColumns();

            _.each(columns, function (column) {
                if (column.id !== '_checkbox_selector') {
                    column.width = 80;
                }
            });

            grid.autosizeColumns();
        },
        "__handleColumnDataChanged" : function() {
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
        "_numerizeValue" : function (val) {
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
        "createStatisticsGrid" : function (container, category, regionCategories) {
            var me = this,
                lang = Oskari.getLang(),
                //selectedRegionCategory = this.getActiveRegionCategory(),
                checkboxSelector = new Slick.CheckboxSelectColumn2({
                    cssClass: "slick-cell-checkboxsel"
                });

            // initial columns
            var columns = [checkboxSelector.getColumnDefinition(), {
                id: me.__columnIdRegion,
                name: me._locale.regionCategories[selectedRegionCategory],
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
                jQuery(me._templates.subHeader)
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
        "__createGridDataView" : function() {
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
        "getEnabledRegions" : function() {
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
        "__createHeaderPlugin" : function (columns, grid, regionCategories) {
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
            // when command is given shows the statistical variable as a new "row" in subheader
            headerMenuPlugin.onCommand.subscribe(function (e, args) {
                var i;
                if (args.command === 'selectRows') {
                    // FIXME: Select all rows here.
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
        "__addRegionColumnMenu" : function(headerMenuPlugin, availableCategories) {
            var me = this;
            // lets create a menu when user clicks the button.
            headerMenuPlugin.onBeforeMenuShow.subscribe(function (e, args) {
                var menu = args.menu,
                    activeCategory = me.viewmodel.layerId,
                    i,
                    input;
                if (args.column.id !== me.__columnIdRegion) {
                    return;
                }
                menu.items = [];

                menu.items.push({
                    element: '<div class="header-menu-subheading">' + me._locale.regionCategoriesTitle + '</div>',
                    disabled: true
                });
                // Region category selects
                _.each(availableCategories, function (category) {
                    var categoryId = category.getId();
                    var categorySelector = jQuery(me._templates.headerCategoryItem);
                    categorySelector.find('input').attr({
                        'id': 'category_' + categoryId,
                        'checked': (categoryId === activeCategory ? 'checked' : false)
                    });
                    var label = categorySelector.find('label');
                    label.attr('for', 'category_' + categoryId);
                    label.html(me._locale.regionCategories[category]);

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
                        elems = jQuery(me._templates.gridHeaderMenu).addClass('statsgrid-show-total-selects');

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
                var showRows = jQuery(me._templates.gridHeaderMenu).addClass('statsgrid-show-row-selects');
                // create input element with localization
                input = showRows.find('input').attr({
                    'id': 'statsgrid-show-row-selects'
                });
                // FIXME: check if select rows checkbox should be checked
                input.attr('checked', 'checked');
                // create label with localization
                showRows.find('label').attr('for', 'statsgrid-show-row-selects').text(me._locale.selectRows);
                menu.items.push({
                    element: showRows,
                    command: 'selectRows'
                });

            });
        }
    });