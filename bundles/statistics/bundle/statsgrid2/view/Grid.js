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
            'cannotDisplayIndicator': '<p class="cannot-display-indicator"></p>'
    	},
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

        },
        afterStart : function(sandbox) {

        },
        /**
         * Create initial grid using just one column: municipality
         * @method createMunicipalitySlickGrid
         * @param {Object} container element where indicator-selector should be added
         */
        createMunicipalitySlickGrid: function (container, regiondata) {
            var me = this,
                grid,
                gridContainer = jQuery('<div id="municipalGrid" class="municipal-grid"></div>'),
                checkboxSelector;
            // clear and append municipal-grid container
            container.find('.municipal-grid').remove();
            container.append(gridContainer);
            // set initially selected region category
            this._selectedRegionCategory = this._state.regionCategory || this._defaultRegionCategory;
            this._setLayerToCategory(this._selectedRegionCategory);
            // add initial columns

            //This modified plugin adds checkboxes to grid
            checkboxSelector = new Slick.CheckboxSelectColumn2({
                cssClass: "slick-cell-checkboxsel"
            });
            this.checkboxSelector = checkboxSelector;

            // initial columns
            var columns = [me.checkboxSelector.getColumnDefinition(), {
                id: "municipality",
                name: this._locale.regionCategories[this._selectedRegionCategory],
                field: "municipality",
                sortable: true
            }];
            // options
            var options = {
                enableCellNavigation: true,
                enableColumnReorder: true,
                multiColumnSort: true,
                showHeaderRow: true,
                headerRowHeight: 97
            };

            var data = _.foldl(regiondata, function (result, indicator) {
                if (indicator.category === me._selectedRegionCategory) {
                    result.push({
                        id: indicator.id,
                        code: indicator.code,
                        municipality: indicator.title[Oskari.getLang()],
                        memberOf: indicator.memberOf,
                        sel: 'checked'
                    });
                }
                return result;
            }, []);
            // metadata provider for data view

            // metadata provider for data view
            var groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
            // dataview for the grid
            var dataView = new Slick.Data.DataView({
                groupItemMetadataProvider: groupItemMetadataProvider,
                inlineFilters: true
            });
            // when the row changes re-render that row
            dataView.onRowsChanged.subscribe(function (e, args) {
                grid.invalidateRows(args.rows);
                grid.render();
                grid.updateRowCount();
                grid.resizeCanvas();
            });

            // To use aggregators we need to define a group
            dataView.setGrouping({
                getter: "sel",
                comparer: function (a, b) {
                    //checkbox columns values are 'checked' and 'empty'
                    var ret = -1;
                    if (a.groupingKey === 'checked' && a.groupingKey === b.groupingKey) {
                        ret = 0;
                    } else if (a.groupingKey < b.groupingKey) {
                        // 'empty' is the first group
                        ret = 1;
                    }
                    return ret;
                },
                formatter: function (g) {
                    //a hack to name the groups
                    var text = (g.groupingKey === "checked" ?
                        me._locale.included :
                        me._locale.not_included) + " (" + g.count + ")";
                    return "<span style='color:green'>" + text + "</span>";
                },
                aggregateCollapsed: false
            });

            // Grid
            grid = new Slick.Grid(gridContainer, dataView, columns, options);

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
                // Don't do anything in case the clicked column is the one in the state.
                if (args.column.id === me._state.currentColumn) {
                    return false;
                }
                me.sendStatsData(args.column);
            });

            // when headerRow cells are rendered
            // add placeholder
            grid.onHeaderRowCellRendered.subscribe(function (e, args) {
                jQuery(args.node).empty();
                jQuery(me.templates.subHeader)
                    .appendTo(args.node);
            });

            grid.onColumnsReordered.subscribe(function (e, args) {
                me.dataView.refresh();
            });

            // register checboxSelector plugin
            grid.registerPlugin(checkboxSelector);
            // register groupItemMetadataProvider plugin (if not registered group toggles won't work)
            grid.registerPlugin(groupItemMetadataProvider);
            // Our new event to subscripe - this is called when checkbox is clicked
            checkboxSelector.onSelectRowClicked.subscribe(function (e, args) {
                var data = args.grid.getData(),
                    item = data.getItem(args.row),
                    groupsBeforeUpdate = data.getGroups().length;

                //update item values (groupingkey is created from these)
                item.sel = jQuery(e.target).is(':checked') ? 'checked' : 'empty';
                data.updateItem(item.id, item);

                // collapse group empty if it is created for the first time
                var groups = data.getGroups();
                if (groups.length > 1) {
                    var i,
                        group;
                    for (i = 0; i < groups.length; i++) {
                        group = groups[i];
                        if (group.groupingKey === 'empty' && group.count < 2 && groupsBeforeUpdate === 1) {
                            data.collapseGroup('empty');
                        }
                    }
                }
                // sendstats
                var column = me._getColumnById(me._state.currentColumn);
                me.sendStatsData(column);
                /* 
                //TODO find a way to tell openlayers that some area should be hilighted without clicking them
                me.selectedMunicipalities[column.code] = (item.sel == "checked");
                */

                // resize grid (content/rows does not show extra rows otherwise. i.e. group headers & footers)
                args.grid.setColumns(args.grid.getColumns());
                data.refresh();

            });

            //if header checkbox is clicked, update map
            checkboxSelector.onSelectHeaderRowClicked.subscribe(function (e, args) {

                // sendstats
                var column = me._getColumnById(me._state.currentColumn);
                me.sendStatsData(column);

            });

            me._initHeaderPlugin(columns, grid);

            // register header buttons plugin
            var headerButtonsPlugin = new Slick.Plugins.HeaderButtons();
            grid.registerPlugin(headerButtonsPlugin);

            // notify dataview that we are starting to update data
            dataView.beginUpdate();
            // set municipality data
            dataView.setItems(data);
            // notify data view that we have updated data
            dataView.endUpdate();
            // invalidate() -> the values in the grid are not correct -> invalidate
            grid.invalidate();
            // render the grid
            grid.render();
            // remember the grid object.
            me.grid = grid;
            me.dataView = dataView;

            // AH-885, we want the municipality column to fill 50% or so of the available space if it's the only column.
            //me.autosizeColumns();
            columns = grid.getColumns();
            columns[1].width = 318;
            me.setGridHeight();

            //window resize!
            var resizeGridTimer;
            jQuery(window).resize(function () {
                clearTimeout(resizeGridTimer);
                resizeGridTimer = setTimeout(function () {
                    me.setGridHeight();
                }, 100);
            });
            // Hackhack, initialoly sort by municipality column (slickgrid doesn't have an easy way to do this...)
            jQuery('.slick-header-columns').children().eq(1).trigger('click');
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
