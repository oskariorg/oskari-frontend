/**
 * @class Oskari.statistics.bundle.statsgrid.plugin.ManageStatsPlugin
 * Creates the indicator selection ui and the actual grid where the stats data will be displayed.
 * Handles sending the data out to create a visualization which then can be displayed on the map.
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.plugin.ManageStatsPlugin',
    /**
     * @method create called automatically on construction
     * @params {Object} config
     *  {
     *   'published': {Boolean}, // optional, defaults to false
     *   'state':     {Object},  // optional, defaults to an empty object
     *   'layer':     {Object}   // optional, can be set later with #setLayer
     *  }
     * @params {Object} locale   localization strings
     *
     * @static
     */

    function (config, locale) {
        this.mapModule = null;
        this.pluginName = null;
        this._sandbox = null;
        this._map = null;
        this._layer = null;
        this._state = null;
        this.element = undefined;
        this.statsService = null;
        this.userIndicatorsService = undefined;
        // indicators (meta data)
        this.indicators = [];
        this.stateIndicatorsLoaded = false;
        // object to hold the data for each indicators.
        // Used in case the user changes the region category.
        this.indicatorsData = {};
        // indicators meta for data sources
        this.indicatorsMeta = {};
        this.selectedMunicipalities = {};
        // Array of open popups so we can easily get rid of them when the UI is hidden.
        // stored as [{'name': 'somePopup', 'popup': popupObject, 'content', contentElement}]
        this.popups = [];
        //    this.conf = config || {};
        var defaults = {
            'statistics': [{
                'id': 'min',
                'visible': true
            }, {
                'id': 'max',
                'visible': true
            }, {
                'id': 'avg',
                'visible': true
            }, {
                'id': 'mde',
                'visible': true
            }, {
                'id': 'mdn',
                'visible': true
            }, {
                'id': 'std',
                'visible': true
            }, {
                'id': 'sum',
                'visible': true
            }]
        };
        this.conf = jQuery.extend(true, config, defaults);
        this._locale = locale || {};
        this.templates = {
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
        };

        this.regionCategories = {};
        this._selectedRegionCategory = undefined;
        this._defaultRegionCategory = 'KUNTA';
        this._dataSources = {};
    }, {
        /**
         * @property __name module name
         * @static
         */
        __name: 'ManageStatsPlugin',

        /**
         * @method getName
         * @return {String} plugin name
         */
        getName: function () {
            return this.pluginName;
        },

        /**
         * @method getMapModule
         * Returns reference to map module this plugin is registered to
         * @return {Oskari.mapframework.ui.module.common.MapModule}
         */
        getMapModule: function () {
            return this.mapModule;
        },

        /**
         * @method setMapModule
         * Sets reference to reference to map module
         * @param {Oskari.mapframework.ui.module.common.MapModule} mapModule
         */
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            if (mapModule) {
                this.pluginName = mapModule.getName() + this.__name;
            }
        },

        /**
         * @method register
         * Interface method for the module protocol
         */
        register: function () {},

        /**
         * @method unregister
         * Interface method for the module protocol
         */
        unregister: function () {},

        /**
         * @method init
         * Interface method for the module protocol. Initializes the request
         * handlers/templates.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function (sandbox) {},

        /**
         * @method startPlugin
         *
         * Interface method for the plugin protocol. Should registers requesthandlers and
         * eventlisteners.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        startPlugin: function (sandbox) {
            this._sandbox = sandbox;
            this._map = this.getMapModule().getMap();
            sandbox.register(this);
            var p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(this, p);
                }
            }

            this.statsService = sandbox
                .getService('Oskari.statistics.bundle.statsgrid.StatisticsService');
            this.userIndicatorsService = sandbox
                .getService('Oskari.statistics.bundle.statsgrid.UserIndicatorsService');
            this._published = (this.conf.published || false);
            this._state = (this.conf.state || {});
            this._layer = (this.conf.layer || null);
            this.selectMunicipalitiesMode = false;
        },

        /**
         * @method stopPlugin
         *
         * Interface method for the plugin protocol. Should unregisters requesthandlers and
         * eventlisteners.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stopPlugin: function (sandbox) {
            var p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            sandbox.unregister(this);

            // remove ui
            if (this.element) {
                this.element.remove();
                this.element = undefined;
                delete this.element;
            }
        },

        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            'MapStats.FeatureHighlightedEvent': function (event) {
                if (this.selectMunicipalitiesMode) {
                    this._featureSelectedEvent(event);
                } else {
                    this._featureHighlightedEvent(event);
                }
            }
        },

        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         */
        onEvent: function (event) {
            return this.eventHandlers[event.getName()].apply(this, [event]);
        },

        /**
         * @method getLayer
         * @return {Object} layer
         */
        getLayer: function (layer) {
            return this._layer;
        },

        /**
         * @method setLayer
         * @param {Object} layer
         */
        setLayer: function (layer) {
            this._layer = layer;
        },

        setState: function (state) {
            this._state = state;
        },
        getState: function () {
            return this._state;
        },

        /**
         * @method createStatsOut
         * Get data and show it in SlickGrid
         * @param {Object} container to where slick grid and pull downs will be appended
         */
        createStatsOut: function (container) {
            var layer = this.getLayer();
            if (layer === null || layer === undefined) {
                return;
            }

            this._acceptedRegionCategories = layer.getCategoryMappings().categories;
            // indicator params are select-elements
            // (indicator drop down select and year & gender selects)
            this.prepareIndicatorParams(container);

            // stop events so that they don't affect other parts of the site (i.e. map)
            container.on('keyup', function (e) {
                e.stopPropagation();
            });
            container.on('keydown', function (e) {
                e.stopPropagation();
            });

        },

        /**
         * @method prepareIndicatorParams
         * @param {Object} container element where indicator-selector should be added
         */
        prepareIndicatorParams: function (container) {
            // Do not load the indicators for a published map.
            if (!this._published) {
                container.append(this.createDataSourceSelect(container));
                //clear the selectors container
                container.find('.selectors-container').remove();
                //add selectors
                var selectors = jQuery('<div class="selectors-container"></div>');
                container.append(selectors);

                //Adding csv button
                var me = this;
                if (me.conf.csvDownload) {
                    var csvLink = jQuery(me.templates.csvButton);
                    //container.find('selectors-container')
                    selectors.append(csvLink);
                    csvLink.click(function () {
                        if (me.dataView) {
                            var items = me.dataView.getItems();
                            me.downloadJSON2CSV(items);
                        }
                    });
                }

                // Indicators
                // success -> createIndicators
                this.getStatsIndicators(container);

            }
            // Regions: success createMunicipalityGrid
            this.getStatsRegionData(container);
        },

        createDataSourceSelect: function (container) {
            var me = this,
                dsElement = jQuery('<div class="data-source-select clearfix">' +
                        '<div class="selector-cont">' +
                            '<label for="statsgrid-data-source-select"></label>' +
                            '<select id="statsgrid-data-source-select" class="indi">' +
                            '</select>' +
                        '</div>' +
                    '</div>'),
                sel = dsElement.find('select');

            dsElement.find('label').text(this._locale.tab.grid.organization);

            _.each(this._dataSources, function (dataSource, id) {
                me._renderDataSourcesToList(id, dataSource.name, false, sel);
            });

            sel.on('change', function (e) {
                me.changeDataSource(e.target.value, container);
            });
            sel.css({
                'width': '191px'
            });
            sel.chosen({
                no_results_text: this._locale.noDataSource,
                placeholder_text: this._locale.selectDataSource
            });

            return dsElement;
        },

        addDataSource: function (dataSourceId, dataSourceName, data, isSelected, elem) {
            this._dataSources[dataSourceId] = {
                data: data,
                name: dataSourceName
            };

            this._renderDataSourcesToList(dataSourceId, dataSourceName, isSelected, elem);
        },

        updateDataSource: function (dataSourceId, data) {
            var dataSource = this._dataSources[dataSourceId],
                select;

            if (dataSource) {
                dataSource.data.push(data);
                select = jQuery('#indi');
                select.trigger('liszt:update');
            }
        },

        _renderDataSourcesToList: function (dataSourceId, dataSourceName, isSelected, elem) {
            var select = elem || jQuery('#statsgrid-data-source-select'),
                option;

            if (select.length) {
                option = jQuery('<option></option>');
                option.val(dataSourceId).text(dataSourceName);
                if (isSelected === true) {
                    option.prop('selected', true);
                }
                select.append(option);
                select.trigger('liszt:updated');
            }
        },

        changeDataSource: function (value, container) {
            var data = this._dataSources[value];

            if (data !== undefined && data !== null)  {
                //clear the selectors container
                container.find('.selectors-container').empty();
                this.createIndicatorsSelect(container, data.data);
                this.createDemographicsSelects(container, null);
            }
        },

        /**
         * Fetch region data - we need to know all the regions / municipalities
         * @method getStatsRegionData
         * @param {Object} container element where indicator-selector should be added
         */
        getStatsRegionData: function (container) {
            var me = this;
            // call ajax function (params: url, successFallback, errorCallback)
            me.statsService.fetchStatsData(me._sandbox.getAjaxUrl() + 'action_route=GetSotkaData&action=regions&version=1.1',
                // success callback
                function (regionData) {
                    if (regionData) {
                        me.setRegionCategories(regionData);
                        // get the actual data
                        //me.createMunicipalitySlickGrid(container, indicator, genders, years, indicatorMeta, regionData);
                        me.createMunicipalitySlickGrid(container, regionData);

                        // Data loaded and grid created, now it's time to load the indicators from the state if any.
                        if (me._state) {
                            me.loadStateIndicators(me._state, container);
                        }
                    } else {
                        me.showMessage(me._locale.stats.errorTitle, me._locale.stats.regionDataError);
                    }
                },
                // error callback
                function (jqXHR, textStatus) {
                    me.showMessage(me._locale.stats.errorTitle, me._locale.stats.regionDataXHRError);
                });
        },

        setRegionCategories: function (regionData) {
            var me = this,
                lang = Oskari.getLang(),
                categories = me._acceptedRegionCategories;
            this.regionCategories = _.foldl(regionData, function (result, region) {
                if (_.contains(categories, region.category)) {
                    if (!result[region.category]) {
                        result[region.category] = [];
                    }

                    result[region.category].push({
                        id: region.id,
                        code: region.code,
                        title: region.title[lang],
                        municipality: region.title[lang],
                        memberOf: region.memberOf
                    });
                }
                return result;
            }, this.regionCategories || {});
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
                cssClass: 'slick-cell-checkboxsel'
            });
            this.checkboxSelector = checkboxSelector;

            // initial columns
            var columns = [me.checkboxSelector.getColumnDefinition(), {
                id: 'municipality',
                name: this._locale.regionCategories[this._selectedRegionCategory],
                field: 'municipality',
                sortable: true
            }];
            // options
            var options = {
                enableCellNavigation: true,
                enableColumnReorder: true,
                multiColumnSort: true,
                showHeaderRow: true,
                headerRowHeight: 152
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
                getter: 'sel',
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
                    var text = (g.groupingKey === 'checked' ?
                        me._locale.included :
                        me._locale.not_included) + ' (' + g.count + ')';
                    return '<span style="color:green">' + text + '</span>';
                },
                aggregateCollapsed: false
            });

            // Grid
            grid = new Slick.Grid(gridContainer, dataView, columns, options);

            var sortcol = 'json_number',
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

        /**
         * Sets the height of the grid container and handles resizing of the SlickGrid.
         *
         * @method setGridHeight
         */
        setGridHeight: function () {
            var gridDiv = jQuery('#municipalGrid'),
                parent = gridDiv.parent(),
                selectorsCont = parent.find('.selectors-container'),
                selectorsHeight = 0;
            if (selectorsCont.length > 0) {
                selectorsHeight = selectorsCont.outerHeight();
            }
            gridDiv.height(parent.height() - selectorsHeight);
            this.grid.resizeCanvas();
        },

        /**
         * Returns the index of the item with the code provided.
         *
         * @method getIdxByCode
         * @param {String} code
         */
        getIdxByCode: function (code) {
            var returnItem = this.getItemByCode(code);

            if (returnItem) {
                var row = this.dataView.getRowById(returnItem.id);
                return (row || -1);
            }
            return null;
        },

        getItemByCode: function (code) {
            var items = this.dataView ? this.dataView.getItems() : [];

            return _.find(items, function (item) {
                return code === item.code;
            });
        },

        /**
         * Fetch all Stats indicators
         *
         * @method getStatsIndicators
         * @param container element
         */
        getStatsIndicators: function (container) {
            var me = this,
                sandbox = me._sandbox;
            // make the AJAX call
            me.statsService.fetchStatsData(sandbox.getAjaxUrl() +
                'action_route=GetSotkaData&action=indicators&version=1.1',
                //success callback
                function (indicatorsdata) {
                    if (indicatorsdata) {
                        me.addDataSource('sotkanet', 'SOTKAnet', indicatorsdata, true);
                        //if fetch returned something we create drop down selector
                        me.createIndicatorsSelect(container, indicatorsdata);
                        me.createDemographicsSelects(container, null);
                    } else {
                        me.showMessage(me._locale.stats.errorTitle, me._locale.stats.indicatorsDataError);
                    }
                },
                // error callback
                function (jqXHR, textStatus) {
                    me.showMessage(me._locale.stats.errorTitle, me._locale.stats.indicatorsDataXHRError);
                });
        },

        /**
         * Create indicators drop down select
         *
         * @method createIndicatorsSelect
         * @param container parent element
         * @param data contains all the indicators
         */
        createIndicatorsSelect: function (container, data) {
            var me = this;
            // Indicators' select container etc.
            var indi = jQuery('<div class="indicator-cont"><div class="indisel selector-cont"><label for="indi">' + this._locale.indicators + '</label><select id="indi" name="indi" class="indi"><option value="" selected="selected"></option></select></div></div>'),
                sel = indi.find('select'),
                i,
                indicData,
                key,
                value,
                title,
                opt;
            for (i = 0; i < data.length; i++) {
                indicData = data[i];

                if (indicData.hasOwnProperty('id')) {
                    value = indicData.id;
                    title = indicData.title[Oskari.getLang()];
                    indicData.titlename = title;
                    opt = jQuery('<option value="' + value + '">' + title + '</option>');
                    opt.attr('data-isOwnIndicator', !!indicData.ownIndicator);
                    //append option
                    sel.append(opt);
                }
            }

            // if the value changes, fetch indicator meta data
            sel.change(function (e) {
                var option = sel.find('option:selected'),
                    indicatorId = option.val(),
                    isOwn = option.attr('data-isOwnIndicator');

                if (isOwn === 'true') {
                    me.getUserIndicator(indicatorId);
                } else {
                    me.deleteIndicatorInfoButton(container);
                    me.deleteDemographicsSelect(container);
                    me.getStatsIndicatorMeta(container, indicatorId);
                }
            });

            sel.css({
                'width': '205px'
            });

            var selectorsContainer = container.find('.selectors-container');
            selectorsContainer.append(indi).append('<div class="parameters-cont clearfix"></div>');

            var paramCont = selectorsContainer.find('.parameters-cont');
            // Place add new indicator button to the side of the data source select for now...
            me._addOwnIndicatorButton(container.find('.data-source-select'), container);

            // we use chosen to create autocomplete version of indicator select element.
            sel.chosen({
                no_results_text: this._locale.noMatch,
                placeholder_text: this._locale.selectIndicator
            });
            // this gives indicators more space to show title on dropdown
            jQuery('.chzn-drop').css('width', '298px');
            jQuery('.chzn-search input').css('width', '263px');
        },

        /**
         * Adds the add own indicator button in paramCont, removes old one if present.
         */
        _addOwnIndicatorButton: function (paramCont, container) {
            var me = this,
                button = jQuery(me.templates.addOwnIndicator);

            container.find('.new-indicator-cont').remove();

            button.find('input').val(me._locale.addDataButton);
            paramCont.append(button);
            button.find('input').click(function (e) {
                // Warn the user if they're not logged in
                if (!me._sandbox || !me._sandbox.getUser().isLoggedIn()) {
                    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                        okBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.OkButton');
                    okBtn.setPrimary(true);
                    okBtn.setHandler(function () {
                        dialog.close(true);
                        me.createIndicatorForm(container);
                    });
                    dialog.show(me._locale.addDataTitle, me._locale.loginToSaveIndicator, [okBtn]);
                } else {
                    me.createIndicatorForm(container);
                }
            });
        },

        getUserIndicator: function (indicatorId) {
            var me = this;

            this.userIndicatorsService
                .getUserIndicator(indicatorId, function (indicator) {
                    me.changeGridRegion(indicator.category);
                    me.addIndicatorDataToGrid(
                        null, indicator.id, indicator.gender,
                        indicator.year, indicator.data, indicator.meta
                    );
                    me.addIndicatorMeta(indicator);
                }, function () {
//                    console.log('FAIL!', console.log(arguments));
                });
        },

        createIndicatorForm: function (container) {
            var me = this,
                form = Oskari.clazz.create(
                    'Oskari.statistics.bundle.statsgrid.AddOwnIndicatorForm',
                    me._sandbox, me._locale, me.regionCategories,
                    me._layer.getWmsName(), me._layer.getId(),
                    me._selectedRegionCategory);

            container.find('.selectors-container').hide();
            container.find('.data-source-select').hide();
            container.find('#municipalGrid').hide();
            form.createUI(container, function (data) {
                me._addUserIndicatorToGrid(data, container, me);
            });
        },

        _addUserIndicatorToGrid: function (data, container, me) {
            var indicator = {};
            indicator.title = JSON.parse(data.title);
            indicator.organization = {
                'title': {
                    'fi': 'Käyttäjän tuomaa dataa'
                }
            };
            indicator.description = JSON.parse(data.title);
            // me.indicators.push(indicator);
            data.data = JSON.parse(data.data);

            var state = me.getState();
            var userIndicator = {
                id: data.indicatorId,
                gender: 'total',
                year: data.year,
                data: data.data,
                title: JSON.parse(data.title),
                description: JSON.parse(data.description),
                organization: {
                    'title': JSON.parse(data.source)
                },
                category: data.category,
                'public': data.published,
                ownIndicator: true
            };
            (state.indicators = state.indicators || []).push(userIndicator);
            this.updateDataSource('userIndicators', userIndicator);

            if (me._selectedRegionCategory !== data.category) {
                me.changeGridRegion(data.category);
            }

            // Show the data in the grid.
            me.addIndicatorDataToGrid(container, data.indicatorId, 'total', data.year, data.data, indicator);
        },

        /**
         * Get Stats indicator meta data
         *
         * @method getStatsIndicatorMeta
         * @param container parent element.
         * @param indicator id
         */
        getStatsIndicatorMeta: function (container, indicator) {
            var me = this,
                sandbox = me._sandbox;
            // fetch meta data for given indicator
            me.statsService.fetchStatsData(
                sandbox.getAjaxUrl() + 'action_route=GetSotkaData&action=indicator_metadata&indicator=' + indicator + '&version=1.1',
                // success callback
                function (indicatorMeta) {
                    if (indicatorMeta) {
                        //if fetch returned something we create drop down selector
                        me.createIndicatorInfoButton(container, indicatorMeta);

                        if (me._hasRegionCategoryValues(indicatorMeta)) {
                            me.createDemographicsSelects(container, indicatorMeta);
                        } else {
                            me._warnOfInvalidIndicator(container, indicatorMeta);
                        }
                    } else {
                        me.showMessage(me._locale.stats.errorTitle, me._locale.stats.indicatorMetaError);
                    }
                },
                // error callback
                function (jqXHR, textStatus) {
                    me.showMessage(me._locale.stats.errorTitle, me._locale.stats.indicatorMetaXHRError);
                });

        },

        /**
         * Checks if the indicator has values on the current category.
         * If it does not, we cannot display it in the grid at the moment.
         *
         * @method _hasRegionCategoryValues
         * @param  {Object} metadata indicator metadata
         * @return {Boolean}
         */
        _hasRegionCategoryValues: function (metadata) {
            var regions = metadata.classifications;
            regions = regions && regions.region;
            regions = regions && regions.values;
            regions = regions || [];
            var rLen = regions.length,
                currentCategory = this._selectedRegionCategory.toLowerCase(),
                i;

            for (i = 0; i < rLen; ++i) {
                if (regions[i].toLowerCase() === currentCategory) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Displays a warning of invalid indicator for the grid
         * if the indicator does not have values on the current category.
         *
         * @method _warnOfInvalidIndicator
         * @param  {jQuery} container
         * @param  {Object} metadata
         * @return {undefined}
         */
        _warnOfInvalidIndicator: function (container, metadata) {
            var regions = metadata.classifications,
                warnTxt = this._locale.cannotDisplayIndicator;
            regions = regions && regions.region;
            regions = regions && regions.title;
            regions = regions && regions[Oskari.getLang()];


            if (regions) {
                warnTxt += (this._locale.availableRegions + regions);
            }
            this.disableDemographicsSelect(container);
            this.showMessage(this._locale.indicators, warnTxt, null);
        },

        /**
         * Create indicator meta info button
         *
         * @method createIndicatorInfoButton
         * @param container parent element
         * @param indicator meta data
         */
        createIndicatorInfoButton: function (container, indicator) {
            var me = this,
                infoIcon = jQuery('<div class="icon-info"></div>'),
                indicatorCont = container.find('.indicator-cont');
            // clear previous indicator
            indicatorCont.find('.icon-info').remove();
            // append this indicator
            indicatorCont.append(infoIcon);
            // show meta data
            infoIcon.click(function (e) {
                var lang = Oskari.getLang(),
                    desc = '<h4 class="indicator-msg-popup">' + me._locale.stats.descriptionTitle + '</h4><p>' + indicator.description[lang] + '</p><br/><h4 class="indicator-msg-popup">' + me._locale.stats.sourceTitle + '</h4><p>' + indicator.organization.title[lang] + '</p>';
                me.showMessage(indicator.title[lang], desc);
            });
        },

        deleteIndicatorInfoButton: function (container) {
            container.find('.indicator-cont').find('.icon-info').remove();
        },

        /**
         * Create drop down selects for demographics (year & gender)
         *
         * @method createDemographicsSelects
         * @param container parent element
         * @param indicator meta data
         */
        createDemographicsSelects: function (container, indicator) {
            var me = this,
                selectors = container.find('.selectors-container');
            // year & gender are in a different container than indicator select
            var parameters = selectors.find('.parameters-cont'),
                year = null,
                gender = null,
                columnId,
                includedInGrid,
                fetchButton,
                removeButton;

            if (indicator) {
                // We have an indicator, create the selects with its data
                me.indicators.push(indicator);
                // if there is a range we can create year select
                if (indicator.range !== null && indicator.range !== undefined) {
                    me.updateYearSelectorValues(parameters.find('select.year'), indicator.range.start, indicator.range.end);
                    // by default the last value is selected in getYearSelectorHTML
                    year = indicator.range.end;
                }

                // if there is a classification.sex we can create gender select
                if (indicator.classifications && indicator.classifications.sex) {
                    me.updateGenderSelectorValues(parameters.find('select.gender'), indicator.classifications.sex.values);
                    // by default the last value is selected in getGenderSelectorHTML
                    gender = indicator.classifications.sex.values[indicator.classifications.sex.values.length - 1];
                }

                gender = gender !== null && gender !== undefined ? gender : 'total';

                // by default the last year and gender is selected
                columnId = me._getIndicatorColumnId(indicator.id, gender, year);
                includedInGrid = this.isIndicatorInGrid(columnId);
                fetchButton = parameters.find('button.fetch-data');
                fetchButton.prop('disabled', '');
                removeButton = parameters.find('button.remove-data');
                if (includedInGrid) {
                    fetchButton.addClass('hidden');
                    removeButton.removeClass('hidden');
                } else {
                    removeButton.addClass('hidden');
                    fetchButton.removeClass('hidden');
                }
            } else {
                // No indicator, create disabled mock selects
                includedInGrid = false;
                fetchButton = jQuery('<button class="fetch-data' + (includedInGrid ? ' hidden' : '') + ' selector-button primary">' + this._locale.addColumn + '</button>');
                removeButton = jQuery('<button class="remove-data' + (includedInGrid ? '' : ' hidden') + ' selector-button">' + this._locale.removeColumn + '</button>');
                parameters.prepend(removeButton);
                parameters.prepend(fetchButton);
                parameters.prepend(me.getGenderSelectorHTML([]));
                parameters.prepend(me.getYearSelectorHTML(0, -1));
                parameters.find('select.year').prop('disabled', 'disabled');
                parameters.find('select.gender').prop('disabled', 'disabled');
                selectors.find('.indicator-cont').after(parameters);
            }

            if (indicator) {
                // click listener
                fetchButton.unbind('click');
                fetchButton.click(function (e) {
                    var element = jQuery(e.currentTarget),
                        year = jQuery('.statsgrid').find('.yearsel').find('.year').val(),
                        gender = jQuery('.statsgrid').find('.gendersel').find('.gender').val();
                    gender = gender !== null && gender !== undefined ? gender : 'total';
                    // me.getStatsIndicatorData(container,indicator, gender, year);
                    var columnId = me._getIndicatorColumnId(indicator.id, gender, year);
                    me.getStatsIndicatorData(container, indicator.id, gender, year, function () {
                        me.addIndicatorMeta(indicator);
                    });
                });
                // click listener
                removeButton.unbind('click');
                removeButton.click(function (e) {
                    var year = jQuery('.statsgrid').find('.yearsel').find('.year').val(),
                        gender = jQuery('.statsgrid').find('.gendersel').find('.gender').val();
                    gender = gender !== null && gender !== undefined ? gender : 'total';
                    var columnId = me._getIndicatorColumnId(indicator.id, gender, year);
                    me.removeIndicatorDataFromGrid(indicator.id, gender, year);
                });
            } else {
                parameters.find('button.fetch-data').prop('disabled', 'disabled');
            }
        },

        disableDemographicsSelect: function (container) {
            var parameters = container.find('.parameters-cont');
            parameters.find('button.fetch-data').prop('disabled', 'disabled');
            parameters.find('select.year').prop('disabled', 'disabled');
            parameters.find('select.gender').prop('disabled', 'disabled');
        },

        deleteDemographicsSelect: function (container) {
            container.find('.parameters-cont').find('select.year').empty();
            container.find('.parameters-cont').find('.select.gender').empty();
            //container.find('.parameters-cont').find('.cannot-display-indicator').remove(); //?
        },

        /**
         * Update Demographics buttons
         *
         * @method updateDemographicsSelects
         * @param container parent element
         * @param indicator meta data
         */
        updateDemographicsButtons: function (indicatorId, gender, year) {
            indicatorId = indicatorId || jQuery('.statsgrid').find('.indisel ').find('option:selected').val();
            gender = gender || jQuery('.statsgrid').find('.gendersel').find('.gender').val();
            gender = gender !== null && gender !== undefined ? gender : 'total';
            year = year || jQuery('.statsgrid').find('.yearsel').find('.year').val();

            var columnId = 'indicator' + indicatorId + year + gender,
                includedInGrid = this.isIndicatorInGrid(columnId);

            // toggle fetch and remove buttons so that only one is visible and can only be selected once
            if (includedInGrid) {
                jQuery('.statsgrid').find('.fetch-data').addClass('hidden');
                jQuery('.statsgrid').find('.remove-data').removeClass('hidden');
            } else {
                jQuery('.statsgrid').find('.fetch-data').removeClass('hidden');
                jQuery('.statsgrid').find('.remove-data').addClass('hidden');
            }
        },

        /**
         * Checks if the given indicator id data is in the grid.
         *
         * @method isIndicatorInGrid
         * @param columnId unique column id
         */
        isIndicatorInGrid: function (columnId) {
            var columns = this.grid.getColumns(),
                found = false,
                i,
                ilen;

            for (i = 0, ilen = columns.length; i < ilen; i++) {
                if (columnId === columns[i].id) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Get data for one indicator
         *
         * @method getStatsIndicatorData
         * @param container parent element
         * @param indicatorId id
         * @param gender (male / female / total)
         * @param year selected year
         * @param {Function} cb optional callback which gets executed after a successful fetch
         */
        getStatsIndicatorData: function (container, indicatorId, gender, year, cb) {
            var me = this,
                gndrs = gender !== null && gender !== undefined ? gender : 'total';
            // ajax call
            me.statsService.fetchStatsData(
                // url
                me._sandbox.getAjaxUrl() + 'action_route=GetSotkaData&action=data&version=1.0&indicator=' + indicatorId + '&years=' + year + '&genders=' + gndrs,
                // success callback

                function (data) {
                    if (data) {
                        if (cb && typeof cb === 'function') {
                            cb();
                        }
                        // Add indicator to the state.
                        if (me._state.indicators === null || me._state.indicators === undefined) {
                            me._state.indicators = [];
                        }
                        me._state.indicators.push({
                            id: indicatorId,
                            year: year,
                            gender: gndrs
                        });
                        // Show the data in the grid.
                        me.addIndicatorDataToGrid(container, indicatorId, gndrs, year, data, me.indicators[me.indicators.length - 1]);
                    } else {
                        me.showMessage(me._locale.stats.errorTitle, me._locale.stats.indicatorDataError);
                    }
                },
                // error callback

                function (jqXHR, textStatus) {
                    me.showMessage(me._locale.stats.errorTitle, me._locale.stats.indicatorDataXHRError);
                }
            );
        },

        /**
         * Get indicator column id.
         *
         * @method _getIndicatorColumnId
         * @param indicatorId id
         * @param gender (male/female/total)
         * @param year selected year
         * @return columnId unique column id
         */
        _getIndicatorColumnId: function (indicatorId, gender, year) {
            var columnId = 'indicator' + indicatorId + year + gender;
            return columnId;
        },

        /**
         * Add indicator data to the grid.
         *
         * @method addIndicatorDataToGrid
         * @param container parent element
         * @param indicatorId id
         * @param gender (male/female/total)
         * @param year selected year
         * @param data related to the indicator
         */
        addIndicatorDataToGrid: function (container, indicatorId, gender, year, data, meta, silent) {
            var me = this,
                columnId = me._getIndicatorColumnId(indicatorId, gender, year),
                columns = me.grid.getColumns(),
                indicatorName = meta.title[Oskari.getLang()] || meta.title;

            if (me.isIndicatorInGrid(columnId)) {
                return false;
            }

            var headerButtons = [{
                cssClass: 'icon-close-dark statsgrid-remove-indicator',
                tooltip: me._locale.removeColumn,
                handler: function (e) {
                    me.removeIndicatorDataFromGrid(indicatorId, gender, year);
                }
            }];

            var name = indicatorName + '/' + year + '/' + gender;
            columns.push({
                id: columnId,
                name: name,
                field: columnId,
                toolTip: name,
                sortable: true,
                header: {
                    menu: {
                        items: [{
                            element: jQuery('<div></div>').text(me._locale.filter)
                        }, {
                            element: jQuery(me.templates.filterLink).text(me._locale.filterByValue),
                            command: 'filter',
                            actionType: 'link'
                        }, {
                            element: jQuery(me.templates.filterLink).text(me._locale.filterByRegion),
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

            me.indicatorsData[columnId] = data;

            me._updateIndicatorDataToGrid(columnId, data, columns);

            me.autosizeColumns();

            // TODO do we still need this stuff?

            if (silent) {
                // Show classification
                me.sendStatsData(columns[columns.length - 1]);
            }

            me.updateDemographicsButtons(indicatorId, gender, year);
            me.grid.setSortColumn(me._state.currentColumn, true);

        },

        _updateIndicatorDataToGrid: function (columnId, data, columns) {
            var me = this,
                hasNoData = true,
                column = me._getColumnById(columnId),
                i,
                silent,
                indicatorId,
                gender,
                year,
                numValue;

            data = data || me.indicatorsData[columnId];
            columns = columns || me.grid.getColumns();
            me.dataView.beginUpdate();

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
                    item = me.dataView.getItemById(regionId);
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
                        me.dataView.updateItem(item.id, item);
                    }
                }
            }
            column.decimals = maxDecimals;

            // Display a warning if cannot be displayed in the selected region category
            if (column.header && column.header.buttons) {
                me._addHeaderWarning(hasNoData, column.header.buttons);
                me.grid.setColumns(columns);
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
            me.dataView.setAggregators(aggregators, true);

            // Add callback function for totals / statistics
            me.dataView.setTotalsCallback(function (groups) {
                me._updateTotals(groups);
            });

            me.dataView.endUpdate();
            me.dataView.refresh();
            me.grid.invalidateAllRows();
            me.grid.render();

            if (!silent) {
                // Show classification
                me.sendStatsData(columns[columns.length - 1]);
            }

            me.updateDemographicsButtons(indicatorId, gender, year);
            me.grid.setSortColumn(me._state.currentColumn, true);
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
         * Remove indicator data to the grid.
         *
         * @method removeIndicatorDataFromGrid
         * @param indicatorId id
         * @param gender (male / female / total)
         * @param year selected year
         */
        removeIndicatorDataFromGrid: function (indicatorId, gender, year) {
            var columnId = this._getIndicatorColumnId(indicatorId, gender, year),
                columns = this.grid.getColumns(),
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
                this.grid.setColumns(allOtherColumns);
                this.grid.render();
                this.dataView.refresh();
                if (allOtherColumns.length !== 2) {
                    this.autosizeColumns();
                }
            }

            // remove indicator also from to the state!
            if (this._state.indicators) {
                for (i = 0, ilen = this._state.indicators.length; i < ilen; i++) {
                    var statedIndicator = this._state.indicators[i];
                    if ((indicatorId === statedIndicator.id) &&
                        (year === statedIndicator.year) &&
                        (gender === statedIndicator.gender)) {
                        this._state.indicators.splice(i, 1);
                        break;
                    }
                }
            }

            // remove from metadata hash as well
            this.removeIndicatorMeta(indicatorId);

            delete this.indicatorsData[columnId];

            this.updateDemographicsButtons(indicatorId, gender, year);


            this.sendStatsData(undefined);
            /*
            if (columnId === this._state.currentColumn) {
                // hide the layer, as we just removed the "selected"
                this._setLayerVisibility(false);
                this._state.currentColumn = null;
            }
*/
        },

        resetLayer: function () {
            if (!this.grid || this.grid.getColumns().length < 3) {
                this._sandbox.postRequestByName('RemoveMapLayerRequest', [this._layer.getId()]);
            }
        },

        autosizeColumns: function () {
            var grid = this.grid,
                columns = grid.getColumns();

            _.each(columns, function (column) {
                if (column.id !== '_checkbox_selector') {
                    column.width = 80;
                }
            });

            grid.autosizeColumns();
        },

        /**
         * Create HTML for year selector
         *
         * @method getYearSelectorHTML
         * @param startYear
         * @param endYear
         */
        getYearSelectorHTML: function (startYear, endYear) {
            var me = this;
            // Years
            var year = jQuery('<div class="yearsel selector-cont"><label for="year">' + this._locale.year + '</label><select name="year" class="year"></select></div>'),
                sel = year.find('select'),
                i,
                opt;

            me.updateYearSelectorValues(sel, startYear, endYear);
            sel.change(function (e) {
                me.updateDemographicsButtons(null, null, e.target.value);
            });
            return year;
        },
        /**
         * Update values for year selector
         *
         * @method updateYearSelectorValues
         * @param sel
         * @param startYear
         * @param endYear
         */
        updateYearSelectorValues: function (sel, startYear, endYear) {
            var i,
                opt;
            sel.empty();
            for (i = startYear; i <= endYear; i++) {
                opt = jQuery('<option value="' + i + '">' + i + '</option>');
                sel.append(opt);
            }
            sel.val(endYear);
            sel.prop('disabled', '');
        },
        /**
         * Create HTML for gender selector
         *
         * @method getGenderSelectorHTML
         * @param values for select element
         */
        getGenderSelectorHTML: function (values) {
            var me = this;
            //Gender
            var gender = jQuery('<div class="gendersel selector-cont"><label for="gender">' + this._locale.gender + '</label><select name="gender" class="gender"></select></div>'),
                sel = gender.find('select');

            if (values && values.length) {
                me.updateGenderSelectorValues(sel, values);
            }
            sel.change(function (e) {
                me.updateDemographicsButtons(null, e.target.value, null);
            });
            return gender;
        },
        /**
         * Update values for gender selector
         *
         * @method updateGenderSelectorValues
         * @param sel Select element
         * @param values Values for select element
         */
        updateGenderSelectorValues: function (sel, values) {
            var i,
                opt;
            sel.empty();
            for (i = 0; i < values.length; i++) {
                opt = jQuery('<option value="' + values[i] + '">' + this._locale.genders[values[i]] + '</option>');
                sel.append(opt);
            }
            sel.val(values[values.length - 1]);
            sel.prop('disabled', '');
        },
        /**
         * Sends the selected column's data from the grid
         * in order to create the visualization.
         *
         * @method sendStatsData
         * @param curCol  Selected indicator data column
         */
        sendStatsData: function (curCol) {
            if (curCol && curCol.field.indexOf('indicator') < 0) {
                // Not a valid current column nor a data value column
                return;
            }
            if (!this.stateIndicatorsLoaded) {
                // No use to be here without indicators
                return;
            }

            //Classify data
            var me = this,
                statArray = [],
                munArray = [],
                check = false,
                i,
                k,
                municipalities = me._state.municipalities = [];
            // Set current column to be stated
            me._state.currentColumn = curCol ? curCol.id : undefined;

            // Get values of selected column
            var data = this.dataView.getItems();
            if (curCol) {
                for (i = 0; i < data.length; i++) {
                    var row = data[i];
                    // Exclude null values
                    if (row.sel === 'checked') {
                        municipalities.push(row.id);
                        if (row[curCol.field] !== null && row[curCol.field] !== undefined) {
                            statArray.push(row[curCol.field]);
                            // Municipality codes (kuntakoodit)
                            munArray.push(row.code);
                        }
                    }
                }
            }

            // Send the data trough the stats service.
            me.statsService.sendStatsData(me._layer, {
                CHECKED_COUNT: this.getItemsByGroupingKey('checked').length, // how many municipalities there is checked
                CUR_COL: curCol,
                VIS_NAME: me._layer.getWmsName(), //"ows:kunnat2013",  
                VIS_ATTR: me._layer.getFilterPropertyName(), //"kuntakoodi",
                VIS_CODES: munArray,
                COL_VALUES: statArray
            });

            // Show the layer, if it happens to be invisible
            this._setLayerVisibility(true);
        },

        /**
         * Set layer visibility
         *
         * @method _setLayerVisibility
         * @param visibility for hiding by passing false, and revealing by passing true
         */
        _setLayerVisibility: function (visibility) {
            // show the layer, if not visible
            if (this._layer._visible !== visibility) {
                var sandbox = this._sandbox,
                    visibilityRequestBuilder = sandbox.getRequestBuilder('MapModulePlugin.MapLayerVisibilityRequest');
                if (visibilityRequestBuilder) {
                    var request = visibilityRequestBuilder(this._layer.getId(), visibility);
                    sandbox.request(this, request);
                }
            }
        },


        /**
         * Get metadata for given indicators
         *
         * @method getStatsIndicatorsMeta
         * @param indicators for which we fetch data
         * @param callback what to do after we have fetched metadata for all the indicators
         */
        getStatsIndicatorsMeta: function (container, indicators, callback) {

            var me = this,
                fetchedIndicators = 0,
                i;
            me.indicators = [];

            for (i = 0; i < indicators.length; i++) {
                var indicatorData = indicators[i],
                    indicator = indicatorData.id;
                if (indicator === null || indicator === undefined) {
                    indicator = indicatorData.indicator;
                }

                // ajax call
                me.statsService.fetchStatsData(
                    // url
                    me._sandbox.getAjaxUrl() + 'action_route=GetSotkaData&action=indicator_metadata&indicator=' + indicator + '&version=1.1',
                    // success callback
                    // FIXME create function outside loop

                    function (data) {
                        //keep track of returned ajax calls
                        fetchedIndicators++;

                        if (data) {
                            me.addIndicatorMeta(data);
                            var j;
                            for (j = 0; j < indicators.length; j++) {
                                if (indicators[j].id === null || indicators[j].id === undefined) {
                                    indicators[j].id = indicators[j].indicator;
                                }
                                if (indicators[j].id + '' === data.id + '') {
                                    me.indicators[j] = data;
                                }
                            }

                            // when all the indicators have been fetched
                            // fire callback
                            if (fetchedIndicators >= indicators.length) {
                                callback();
                            }

                        } else {
                            me.showMessage(me._locale.stats.errorTitle, me._locale.stats.indicatorDataError);
                        }
                    },
                    // error callback
                    // FIXME create function outside loop

                    function (jqXHR, textStatus) {
                        me.showMessage(me._locale.stats.errorTitle, me._locale.stats.indicatorDataXHRError);
                        //keep track of returned ajax calls
                        fetchedIndicators++;
                    }
                );
            }
        },

        /**
         * Get data for given indicators
         *
         * @method getStatsIndicatorsData
         * @param indicators for which we fetch data
         * @param callback what to do after we have fetched data for all the indicators
         */
        getStatsIndicatorsData: function (container, indicators, callback) {
            var me = this,
                fetchedIndicators = 0,
                indicatorsData = {},
                i;

            for (i = 0; i < indicators.length; i++) {
                var indicatorData = indicators[i],
                    indicator = indicatorData.id,
                    year = indicatorData.year,
                    gender = indicatorData.gender || 'total';

                if (indicator === null || indicator === undefined) {
                    indicator = indicatorData.indicator;
                }

                // ajax call
                me.statsService.fetchStatsData(
                    // url
                    me._sandbox.getAjaxUrl() + 'action_route=GetSotkaData&action=data&version=1.0&indicator=' + indicator + '&years=' + year + '&genders=' + gender,
                    // success callback
                    // FIXME create function outside loop

                    function (data) {
                        fetchedIndicators++;
                        if (data) {
                            var j,
                                ind,
                                indicatorColumnId;
                            //save the data to the right indicator for later use
                            for (j = 0; j < indicators.length; j++) {
                                ind = indicators[j];
                                if (ind.id === null || ind.id === undefined) {
                                    ind.id = ind.indicator;
                                }

                                // FIXME use ===
                                if (ind.id == data[0].indicator &&
                                    ind.year == data[0].year &&
                                    ind.gender === data[0].gender) {

                                    indicatorColumnId = me._getIndicatorColumnId(ind.id, ind.gender, ind.year);
                                    indicatorsData[indicatorColumnId] = data;
                                }
                            }
                            // when all the indicators have been fetched
                            // add them to the grid and fire callback
                            if (fetchedIndicators >= indicators.length) {
                                //add these to the grid!!
                                for (j = 0; j < indicators.length; j++) {
                                    ind = indicators[j];
                                    if (ind.id === null || ind.id === undefined) {
                                        ind.id = ind.indicator;
                                    }
                                    if (ind) {
                                        indicatorColumnId = me._getIndicatorColumnId(ind.id, ind.gender, ind.year);
                                        var indData = indicatorsData[indicatorColumnId];
                                        me.addIndicatorDataToGrid(container, ind.id, ind.gender, ind.year, indData, me.indicators[j], true);
                                    }
                                }
                                callback();
                            }
                        } else {
                            me.showMessage(me._locale.stats.errorTitle, me._locale.stats.indicatorDataError);
                        }
                    },
                    // error callback
                    // FIXME create function outside loop

                    function (jqXHR, textStatus) {
                        me.showMessage(me._locale.stats.errorTitle, me._locale.stats.indicatorDataXHRError);
                        fetchedIndicators++;
                    }
                );
            }
        },
        /**
         * Removes all indicator data from the grid
         *
         * @method clearDataFromGrid
         */
        clearDataFromGrid: function () {
            if (!this.grid) {
                return;
            }
            var columns = this.grid.getColumns(),
                newColumnDef = [],
                j = 0,
                i;
            for (i = 0; i < columns.length; i++) {
                var columnId = columns[i].id;
                if ((columnId === 'id' || columnId === 'municipality' || columnId === 'code' || columnId === '_checkbox_selector')) {
                    newColumnDef[j] = columns[i];
                    j++;
                }
            }
            this.grid.setColumns(newColumnDef);
            this.grid.render();
            this.dataView.refresh();
        },

        /**
         * @method showMessage
         * Shows user a message with ok button
         * @param {String} title popup title
         * @param {String} message popup message
         */
        showMessage: function (title, message, buttons) {
            // Oskari components aren't available in a published map.
            if (!this._published) {
                if (this.dialog) {
                    this.dialog.close(true);
                    this.dialog = null;
                    return;
                }

                var me = this,
                    loc = this._locale,
                    dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                if (buttons) {
                    dialog.show(title, message, buttons);
                } else {
                    var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                    okBtn.setTitle(loc.buttons.ok);
                    okBtn.addClass('primary');
                    okBtn.setHandler(function () {
                        dialog.close(true);
                        me.dialog = null;
                    });
                    dialog.show(title, message, [okBtn]);
                    me.dialog = dialog;
                }
            }
        },

        /**
         * @method loadStateIndicators
         */
        loadStateIndicators: function (state, container) {
            var me = this,
                classifyPlugin = this._sandbox.findRegisteredModuleInstance('MainMapModuleManageClassificationPlugin');
            // First, let's clear out the old data from the grid.
            me.clearDataFromGrid();

            // FIXME change sotka to something general
            var indicators = _.groupBy(state.indicators || [], function (indicator) {
                return (indicator.ownIndicator ? 'user' : 'sotka');
            });

            // Add user's own indicators to grid.
            _.each(indicators.user, function (indicator) {
                me.addIndicatorDataToGrid(null, indicator.id, indicator.gender, indicator.year, indicator.data, {
                    'title': indicator.title
                });
                me.addIndicatorMeta(indicator);
            });

            // FIXME change sotka to something general
            if (indicators.sotka && indicators.sotka.length > 0) {
                //send ajax calls and build the grid
                me.getStatsIndicatorsMeta(container, indicators.sotka, function () {
                    //send ajax calls and build the grid
                    me.getStatsIndicatorsData(container, indicators.sotka, function () {
                        me._afterStateIndicatorsLoaded(state);
                    });
                });
            } else {
                me._afterStateIndicatorsLoaded(state);
            }
        },

        _afterStateIndicatorsLoaded: function (state) {
            this.stateIndicatorsLoaded = true;

            if (state.currentColumn !== null && state.currentColumn !== undefined) {
                if (state.municipalities && state.municipalities.length) {
                    this._showSelectedAreas(state.municipalities);
                }

                // current column is needed for rendering map
                var column = this._getColumnById(state.currentColumn);
                // Filter
                if ((state.filterMethod !== null) && (typeof state.filterMethod !== 'undefined') &&
                    (state.filterInput !== null) && (typeof state.filterInput !== 'undefined') && (state.filterInput.length > 0)) {
                    this.filterColumn(column, state.filterMethod, state.filterInput);
                    state.filterInput = [];
                }

                // Area filter
                if ((state.filterRegion !== null) && (typeof state.filterRegion !== 'undefined') && (state.filterRegion.length > 0)) {
                    this.filterColumnByRegion(column, state.filterRegion);
                    state.filterRegion = [];
                }

                this.sendStatsData(column);
                this.grid.setSortColumn(state.currentColumn, true);
            }
        },
        /**
         * Loop through first group (municipalities) and create header row for
         * @private _updateTotals
         */
        _updateTotals: function (groups) {
            if (groups) {
                var columns = this.grid.getColumns(),
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
                        sub = jQuery(this.templates.subHeader),
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

                    var columnDiv = jQuery(this.grid.getHeaderRowColumn(column.id)).empty(),
                        opts = this.grid.getOptions();
                    // TODO: 12 = font-size, 7 = padding...
                    var fontSize = columnDiv.css('line-height');
                    fontSize = (fontSize) ? fontSize.split('px')[0] : 12;
                    opts.headerRowHeight = variableCount * fontSize + 7;
                    this.grid.setOptions(opts);

                    sub.appendTo(columnDiv);

                }
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
                decimals = this._getColumnById(columnId).decimals,
                indicatorId;
            //loop through different indicator columns
            for (indicatorId in result) {
                if (result.hasOwnProperty(indicatorId)) {
                    if (!value[indicatorId]) {
                        value[indicatorId] = {};
                    }
                    if (indicatorId.indexOf('indicator') >= 0 && indicatorId === columnId) {
                        value[indicatorId][type] = result[indicatorId];
                        totalsItem = jQuery(this.templates.statsgridTotalsVar);
                        var val = value[columnId][type];
                        if (!isNaN(val) && !this._isInt(val)) {
                            val = val.toFixed && decimals !== null && decimals !== undefined ? val.toFixed(decimals) : val;
                        }
                        if (_.isNaN(val)) {
                            val = '-';
                        }
                        totalsItem.addClass('statsgrid-' + type).text(val);
                        break;

                    } else if (columnId === 'municipality') {
                        totalsItem = jQuery(this.templates.statsgridTotalsVar);
                        totalsItem.attr('title', this._locale.statistic.tooltip[type]);
                        totalsItem.addClass('statsgrid-totals-label').text(this._locale.statistic[type]);
                        break;
                    }
                }
            }
            return totalsItem;
        },
        /**
         * A method to check if int is int instead of float
         * @private _isInt
         */
        _isInt: function (n) {
            return n % 1 === 0;
        },

        /**
         * A method to initialize header plugin
         * @private _initHeaderPlugin
         */
        _initHeaderPlugin: function (columns, grid) {
            var me = this,
                i;
            // lets create an empty container for menu items
            for (i = 0; i < columns.length; i++) {
                var column = columns[i];
                if (column.id === 'municipality') {
                    column.header = {
                        menu: {
                            items: []
                        }
                    };
                }
            }

            // new header menu plugin
            me.headerMenuPlugin = new Slick.Plugins.HeaderMenu2({});
            // lets create a menu when user clicks the button.
            me.headerMenuPlugin.onBeforeMenuShow.subscribe(function (e, args) {
                var menu = args.menu,
                    i,
                    input;
                if (args.column.id === 'municipality') {
                    menu.items = [];

                    menu.items.push({
                        element: '<div class="header-menu-subheading">' + me._locale.regionCategories.title + '</div>',
                        disabled: true
                    });
                    // Region category selects
                    _.each(me._acceptedRegionCategories, function (category) {
                        var categorySelector = jQuery('<li><input type="radio" name="categorySelector"></input><label></label></li>');
                        categorySelector.
                        find('input').
                        attr({
                            'id': 'category_' + category,
                            'checked': (category === me._selectedRegionCategory ? 'checked' : false)
                        }).
                        end().
                        find('label').
                        attr({
                            'for': 'category_' + category
                        }).
                        html(me._locale.regionCategories[category]);
                        menu.items.push({
                            element: categorySelector,
                            command: 'category_' + category
                        });
                    });

                    menu.items.push({
                        element: '<div class="header-menu-subheading subheading-middle">' + me._locale.statistic.title + '</div>',
                        disabled: true
                    });
                    // Statistical variables
                    for (i = 0; i < me.conf.statistics.length; i++) {
                        var statistic = me.conf.statistics[i],
                            elems = jQuery(me.templates.gridHeaderMenu).addClass('statsgrid-show-total-selects');

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

                    // check if select rows checkbox should be checked
                    // we need to do something with current state of MVC which is non-existent
                    var columns = args.grid.getColumns(),
                        selectRowsChecked = false;
                    for (i = 0; i < columns.length; i++) {
                        var column = columns[i];
                        if (column.field === 'sel') {
                            selectRowsChecked = true;
                        }
                    }
                    // create checkbox for selecting rows toggle
                    var showRows = jQuery(me.templates.gridHeaderMenu).addClass('statsgrid-show-row-selects');
                    // create input element with localization
                    input = showRows.find('input').attr({
                        'id': 'statsgrid-show-row-selects'
                    });
                    if (selectRowsChecked) {
                        input.attr('checked', 'checked');
                    }
                    // create label with localization
                    showRows.find('label').attr('for', 'statsgrid-show-row-selects').text(me._locale.selectRows);
                    menu.items.push({
                        element: showRows,
                        command: 'selectRows'
                    });
                }

            });
            // when command is given shos statistical variable as a new "row" in subheader
            me.headerMenuPlugin.onCommand.subscribe(function (e, args) {
                var i;
                if (args.command === 'selectRows') {
                    var columns = args.grid.getColumns(),
                        newColumns = [],
                        shouldAddSel = true;
                    for (i = 0; i < columns.length; i++) {
                        var column = columns[i];
                        if (column.field !== 'sel') {
                            newColumns.push(column);
                        }
                        if (column.field === 'sel' && !jQuery(e.target).is(':checked')) {
                            shouldAddSel = false;
                        }
                    }
                    if (shouldAddSel) {
                        newColumns.unshift(me.checkboxSelector.getColumnDefinition());
                    }

                    args.grid.setColumns(newColumns);
                } else if (/^category_/.test(args.command)) {
                    me.changeGridRegion(_.last(args.command.split('_')));
                } else if (args.command === 'filter') {
                    me._createFilterPopup(args.column, this);
                } else if (args.command === 'filterByRegion') {
                    me._createFilterByRegionPopup(args.column, this);
                } else {
                    for (i = 0; i < me.conf.statistics.length; i++) {
                        var statistic = me.conf.statistics[i];
                        // FIXME use ===
                        if (statistic.id == args.command) {
                            statistic.visible = !statistic.visible;
                            break;
                        }
                    }

                    //FIXME 
                    //TODO we need to create grouping for statistical variables 
                    // instead of using subheader!

                    //reduce the number of variables
                    me.dataView.refresh();
                    // setColumns fires slickgrid resizing (cssrules etc.) 
                    // => variables disappear
                    me.grid.setColumns(me.grid.getColumns());
                    // this prints variables again.
                    me.dataView.refresh();
                }
            });
            grid.registerPlugin(me.headerMenuPlugin);
        },

        /**
         * Changes the values of the region column in the grid
         * and updates each indicator column's values.
         *
         * @method changeGridRegion
         * @param  {String} category category name
         * @return {undefined}
         */
        changeGridRegion: function (category) {
            var me = this,
                dataView = this.dataView,
                grid = this.grid,
                regions = this.regionCategories[category],
                currColumn;

            _.each(regions, function (item) {
                item.sel = 'checked';
            });

            this._setSelectedRegionCategory(category);

            // notify dataview that we are starting to update data
            dataView.beginUpdate();
            // empty the data view
            dataView.setItems([]);
            grid.invalidateAllRows();
            // set municipality data
            dataView.setItems(regions);
            // notify data view that we have updated data
            dataView.endUpdate();
            // invalidate() -> the values in the grid are not correct -> invalidate
            grid.invalidate();
            // render the grid
            grid.render();

            // update the data according to the current region category
            _.each(grid.getColumns(), function (column) {
                if (column.id.indexOf('indicator') >= 0) {
                    me._updateIndicatorDataToGrid(column.id);
                }
            });

            me._setLayerToCategory(category);

            // send the stats parameters for the visualization
            if (me._state.currentColumn) {
                currColumn = me._getColumnById(me._state.currentColumn);
            }

            me.sendStatsData(currColumn);
        },

        _setLayerToCategory: function (category) {
            var layer = this.getLayer(),
                categoryMappings = layer.getCategoryMappings();

            layer.setWmsName(categoryMappings.wmsNames[category]);
            layer.setFilterPropertyName(categoryMappings.filterProperties[category]);
        },

        /**
         * Sets the selected region category to the one given
         * and changes the name of the region column.
         *
         * @method _setSelectedRegionCategory
         * @param {String} category category name
         */
        _setSelectedRegionCategory: function (category) {
            var column = this._getColumnById('municipality'),
                columns = this.grid.getColumns(),
                categoryName = this._locale.regionCategories[category];

            this._state.regionCategory = category;
            this._selectedRegionCategory = category;
            column.name = categoryName;
            this.grid.setColumns(columns);
        },

        /**
         * Creates filter popup
         * @private _createFilterPopup
         */
        _createFilterPopup: function (column, headerMenuPlugin) {
            var me = this,
                popup = jQuery(me.templates.filterPopup);
            // destroy possible open instance
            me._destroyPopup('filterPopup');
            popup.find('.filter-desc').text(me._locale.indicatorFilterDesc);

            //labels for condition
            var labels = jQuery(me.templates.filterRow);
            labels.find('.filter-label').text(me._locale.filterIndicator);
            labels.find('.filter-value').text(column.name);
            popup.find('.filter-container').append(labels);

            // condition (dropdown list of different types of filters + value)
            var condition = jQuery(me.templates.filterRow);
            condition.find('.filter-label').text(me._locale.filterCondition);
            var selectCont = jQuery(me.templates.filterSelect),
                select = selectCont.find('.filter-select');
            select.append(jQuery(me.templates.filterOption).val('')
                .text(me._locale.filterSelectCondition));
            select.append(jQuery(me.templates.filterOption).val('>')
                .text(me._locale.filterGT));
            select.append(jQuery(me.templates.filterOption).val('>=')
                .text(me._locale.filterGTOE));
            select.append(jQuery(me.templates.filterOption).val('=')
                .text(me._locale.filterE));
            select.append(jQuery(me.templates.filterOption).val('<=')
                .text(me._locale.filterLTOE));
            select.append(jQuery(me.templates.filterOption).val('<')
                .text(me._locale.filterLT));
            select.append(jQuery(me.templates.filterOption).val('...')
                .text(me._locale.filterBetween));
            condition.find('.filter-value').append(selectCont);

            // changing condition should show more input options
            select.change(function (e) {
                var element = jQuery(e.target),
                    selected = element.val(),
                    filterValue = element.parents('.filter-value');
                if (selected === '...') {
                    filterValue.find('.filter-between').css('display', 'block');
                    filterValue.find('.filter-input2').css('display', 'block');
                } else {
                    filterValue.find('.filter-input2').css('display', 'none');
                    filterValue.find('.filter-between').css('display', 'none');
                }
            });

            popup.find('.filter-container').append(condition);
            var filterInputs = jQuery(me.templates.filterInputs);
            popup.find('.filter-inputs-container').append(filterInputs);

            // dialog with cancel and filter buttons
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');

            // cancel
            var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelBtn.setTitle(me._locale.buttons.cancel);
            cancelBtn.setHandler(function () {
                headerMenuPlugin.hide();
                me._destroyPopup('filterPopup');
            });

            // filter
            var filterBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            filterBtn.setTitle(me._locale.buttons.filter);
            filterBtn.addClass('primary');
            filterBtn.setHandler(function (e) {
                var inputArray = [];
                var divmanazerpopup = jQuery(e.target)
                    .parents('.divmanazerpopup');

                var input1 = divmanazerpopup.find('.filter-input1');
                inputArray.push(input1.val());

                if (select.val() === '...') {
                    var input2 = divmanazerpopup.find('.filter-input2');
                    inputArray.push(input2.val());
                }

                // me._state.filterMethod = select.val();
                // me._state.filterInput = inputArray;

                me.filterColumn(column, select.val(), inputArray);
                headerMenuPlugin.hide();
                me._destroyPopup('filterPopup');
            });

            // show the dialog
            dialog.show(me._locale.filterTitle, popup, [cancelBtn, filterBtn]);
            // keydown
            popup.on('keydown', function (e) {
                e.stopPropagation();
            });
            me.popups.push({
                name: 'filterPopup',
                popup: dialog,
                content: popup
            });
        },

        _getPopupIndex: function (name) {
            var ret = null,
                i;
            for (i = 0; i < this.popups.length; i++) {
                if (this.popups[i].name === name) {
                    ret = i;
                    break;
                }
            }
            return ret;
        },

        _destroyPopup: function (name) {
            var i = this._getPopupIndex(name),
                popup = i === null ? null : this.popups[i];
            if (popup) {
                popup.content.off();
                popup.popup.close(true);
                this.popups.splice(i, 1);
            }
        },

        /**
         * Creates a popup to filter municipalities according to region groups.
         *
         * @method _createFilterByRegionPopup
         * @param  {Object} column
         * @param  {Object} headerMenuPlugin
         * @return {undefined}
         */
        _createFilterByRegionPopup: function (column, headerMenuPlugin) {
            var me = this,
                dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                dialogTitle = me._locale.filterTitle,
                cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                cancelLoc = me._locale.buttons.cancel,
                filterBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                filterLoc = me._locale.buttons.filter,
                content = jQuery(me.templates.filterByRegion).clone(),
                regionCatCont = jQuery(me.templates.filterRow).clone(),
                regionCat = jQuery(me.templates.regionCatSelect).clone(),
                labelsCont = jQuery(me.templates.filterRow).clone(),
                regionIds,
                key,
                regionCatOption,
                regionCatLoc;

            // destroy possible open instance
            me._destroyPopup('filterByRegionPopup');

            cancelBtn.setTitle(cancelLoc);
            cancelBtn.setHandler(function () {
                headerMenuPlugin.hide();
                me._destroyPopup('filterByRegionPopup');
            });

            filterBtn.setTitle(filterLoc);
            filterBtn.addClass('primary');
            filterBtn.setHandler(function (e) {
                regionIds = content.find('div.filter-region-select select').val();
                // me._state.filterRegion = regionIds;
                me.filterColumnByRegion(column, regionIds);
                headerMenuPlugin.hide();
                me._destroyPopup('filterByRegionPopup');
            });

            // Description text
            content.find('.filter-desc').text(me._locale.indicatorFilterDesc);

            // Show the column name
            labelsCont.find('.filter-label').text(me._locale.filterIndicator);
            labelsCont.find('.filter-value').text(column.name);
            content.find('.filter-container').append(labelsCont);

            // Show the region category select
            // Create an empty option first
            regionCatOption = jQuery(me.templates.filterOption).clone();
            regionCatLoc = me._locale.regionCatPlaceholder;
            regionCatOption.val('').text(regionCatLoc);
            regionCat.find('select').append(regionCatOption);

            for (key in me.regionCategories) {
                if (me.regionCategories.hasOwnProperty(key)) {
                    regionCatOption = jQuery(me.templates.filterOption).clone();
                    regionCatLoc = me._locale.regionCategories[key];
                    regionCatOption.val(key).text(regionCatLoc);
                    regionCat.find('select').append(regionCatOption);
                }
            }
            regionCatCont.find('.filter-label').text(me._locale.selectRegionCategory);
            regionCatCont.find('.filter-value').append(regionCat);
            content.find('.filter-container').append(regionCatCont);
            regionCat.change(function (e) {
                me._createFilterByRegionSelect(content, e.target.value);
            });

            dialog.show(dialogTitle, content, [cancelBtn, filterBtn]);
            me.popups.push({
                name: 'filterByRegionPopup',
                popup: dialog,
                content: content
            });
        },

        destroyPopups: function () {
            // destroy header popups
            if (this.headerMenuPlugin) {
                this.headerMenuPlugin.hide();
            }
            // destroy filter popups created by _createFilterByRegionPopup and _createFilterPopup
            var i,
                popup;
            for (i = 0; i < this.popups.length; i++) {
                popup = this.popups[i];
                popup.content.off();
                popup.popup.close(true);
            }
            this.popups = [];
        },

        /**
         * Creates an element to select regions from a region category.
         *
         * @method _createFilterByRegionSelect
         * @private
         * @param  {jQuery} container      The container of the popup's content
         * @param  {String} regionCategory the region category id
         * @return {undefined}
         */
        _createFilterByRegionSelect: function (container, regionCategory) {
            container.find('.filter-region-container').remove();

            if (!regionCategory) {
                return null;
            }

            var regionCont = jQuery(this.templates.filterRow).clone(),
                regionSelect = jQuery(this.templates.regionSelect).clone(),
                regions = this.regionCategories[regionCategory],
                rLen = regions.length,
                regionOption,
                region,
                i;

            regionCont.addClass('filter-region-container');

            for (i = 0; i < rLen; ++i) {
                region = regions[i];
                regionOption = jQuery(this.templates.filterOption).clone();
                regionOption.val(region.id).text(region.title);
                regionSelect.find('select').append(regionOption);
            }

            regionCont.find('.filter-label').text(this._locale.selectRegion);
            regionCont.find('.filter-value').append(regionSelect);
            container.find('.filter-container').append(regionCont);
            container.find('div.filter-region-select select').chosen({
                width: '90%',
                no_results_text: this._locale.noRegionFound,
                placeholder_text: this._locale.chosenRegionText
            });
        },

        /**
         * Filters municipalities according to method and constraints (i.e. inputArray)
         * @param column Apply this filter to column
         * @method of filtering
         * @inputArray constraints
         */
        filterColumn: function (column, method, inputArray) {
            var data = this.grid.getData(),
                items = data.getItems(),
                item, itemVal,
                i;

            inputArray = _.map(inputArray, this._numerizeValue);

            for (i = 0; i < items.length; i++) {
                item = items[i];

                if (item.sel === 'checked') {
                    itemVal = item[column.id];
                    if (itemVal === null || itemVal === undefined) {
                        item.sel = 'empty';
                    } else {

                        switch (method) {
                        case '>':
                            if (itemVal <= inputArray[0]) {
                                item.sel = 'empty';
                            }
                            break;
                        case '>=':
                            if (itemVal < inputArray[0]) {
                                item.sel = 'empty';
                            }
                            break;
                        case '=':
                            if (itemVal !== inputArray[0]) {
                                item.sel = 'empty';
                            }
                            break;
                        case '<=':
                            if (itemVal > inputArray[0]) {
                                item.sel = 'empty';
                            }
                            break;
                        case '<':
                            if (itemVal >= inputArray[0]) {
                                item.sel = 'empty';
                            }
                            break;
                        case '...':
                            if (inputArray[0] >= itemVal || itemVal >= inputArray[1]) {
                                item.sel = 'empty';
                            }
                            break;
                        }
                    }
                    data.updateItem(item.id, item);
                }

            }
            this.dataView.refresh();
            data.collapseGroup('empty');
            // sendstats ...update map
            this.sendStatsData(column);
            this.grid.updateRowCount();
            this.grid.resizeCanvas();
            this.grid.scrollRowToTop(0);
        },

        /**
         * Filters municipalities whether they belong to any of the
         * regions provided and updates the grid view accordingly.
         *
         * @method filterColumnByRegion
         * @param  {Object} column
         * @param  {Array} regionIds
         * @return {undefined}
         */
        filterColumnByRegion: function (column, regionIds) {
            if (!regionIds || regionIds.length === 0) {
                return;
            }

            var me = this,
                data = me.grid.getData(),
                items = data.getItems(),
                item,
                i;

            for (i = 0; i < items.length; i++) {
                item = items[i];

                if (item.sel === 'checked') {
                    if (item[column.id] === null || item[column.id] === undefined) {
                        item.sel = 'empty';
                    } else {
                        if (!this._itemBelongsToAnyRegions(item, regionIds)) {
                            item.sel = 'empty';
                        }
                    }
                    data.updateItem(item.id, item);
                }

            }
            me.dataView.refresh();
            data.collapseGroup('empty');
            // sendstats ...update map
            me.sendStatsData(column);
            me.grid.updateRowCount();
            me.grid.resizeCanvas();
            me.grid.scrollRowToTop(0);
        },

        /**
         * Returns true if the item belongs to any of the regions, false otherwise.
         *
         * @method _itemBelongsToAnyRegions
         * @param  {Object} item
         * @param  {Array} regionIds
         * @return {Boolean}
         */
        _itemBelongsToAnyRegions: function (item, regionIds) {
            var i,
                regionId;
            for (i = 0; i < regionIds.length; ++i) {
                regionId = Number(regionIds[i]);
                if (item.memberOf.indexOf(regionId) > -1) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Simple objectArray to csv
         * http://stackoverflow.com/questions/4130849/convert-json-format-to-csv-format-for-ms-excel
         *
         */
        downloadJSON2CSV: function (objArray) {
            var array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray,
                str = '',
                line,
                i,
                index;

            for (i = 0; i < array.length; i++) {
                line = '';

                for (index in array[i]) {
                    if (array[i].hasOwnProperty(index)) {
                        line += array[i][index] + ',';
                    }
                }

                // Here is an example where you would wrap the values in double quotes
                // for (var index in array[i]) {
                //    line += '"' + array[i][index] + '",';
                // }

                line.slice(0, line.Length - 1);

                str += line + '\r\n';
            }
            // FIXME The escape() function was deprecated in JavaScript version 1.5. Use encodeURI() or encodeURIComponent() instead.
            window.open('data:text/csv;charset=utf-8,' + escape(str));
        },

        /**
         * Highlights a municipality given by the event and scrolls to it in the grid
         *
         * @method _featureHighlightedEvent
         * @private
         * @param {Oskari.mapframework.bundle.mapstats.event.FeatureHighlightedEvent} event
         */
        _featureHighlightedEvent: function (event) {
            var featureAtts = event.getFeature().attributes,
                isHighlighted = event.isHighlighted(),
                property = this._getHilightPropertyName(),
                idx = this.getIdxByCode(featureAtts[property]),
                cssKey = 'highlight-row-' + featureAtts[property],
                cssHash = {};
            // if we have grid and idx => remembe selected area
            if (this.grid && idx) {
                // if we there are no checked areas => do nothing
                if (this.getItemsByGroupingKey('checked').length > 0) {
                    this.selectedMunicipalities[featureAtts[property]] = isHighlighted;

                    if (isHighlighted) {
                        //if a row is found => highlight it
                        if (idx !== -1) {
                            this.grid.scrollRowToTop(idx);
                            cssHash[idx] = {
                                'municipality': 'statsgrid-highlight-row'
                            };
                            this.grid.addCellCssStyles(cssKey, cssHash);
                            this.dataView.syncGridCellCssStyles(this.grid, cssKey);
                        }
                    } else {
                        this.grid.removeCellCssStyles(cssKey);
                        this.dataView.syncGridCellCssStyles(this.grid, cssKey);
                    }
                }
            }
        },

        /**
         * Highlights a municipality given by the event and shows only highlighted municipalities in the grid
         *
         * @method _featureSelectedEvent
         * @private
         * @param {Oskari.mapframework.bundle.mapstats.event.FeatureHighlightedEvent} event
         */
        _featureSelectedEvent: function (event) {
            var featureAtts = event.getFeature().attributes,
                isHighlighted = event.isHighlighted(),
                property = this._getHilightPropertyName(),
                item = this.getItemByCode(featureAtts[property]);

            if (this.grid && item) {
                //if area is highlighted => remember it and change grid item to 'checked' state
                this.selectedMunicipalities[featureAtts[property]] = isHighlighted;
                if (isHighlighted) {
                    item.sel = 'checked';
                } else {
                    item.sel = 'empty';
                }
                var data = this.grid.getData();
                data.updateItem(item.id, item);

                // sendstats ...update map
                var column = this._getColumnById(this._state.currentColumn);
                this.sendStatsData(column);
            }
        },

        _getHilightPropertyName: function () {
            var layer = this.getLayer(),
                categoryMappings = layer.getCategoryMappings() || {},
                propertyMappings = categoryMappings.filterProperties || {},
                property = propertyMappings[this._selectedRegionCategory || 'KUNTA'];

            return (property || 'kuntakoodi');
        },

        /**
         * Get items by GroupingKey
         *
         * @method getItemsByGroupingKey
         * @param grouping key (e.g. 'checked', 'empty')
         */
        getItemsByGroupingKey: function (sel) {
            var items = this.grid.getData().getItems(),
                itemsByGrouping = [],
                item,
                i;
            for (i = 0; i < items.length; i++) {
                item = items[i];
                if (item.sel === sel) {
                    itemsByGrouping.push(sel);
                }
            }
            return itemsByGrouping;
        },

        /**
         * Show only selected areas
         *
         * @method _showSelectedAreas
         * @private
         * @param array of ids
         */
        _showSelectedAreas: function (idArray) {
            var data = this.grid.getData(),
                items = data.getItems(),
                item,
                i,
                j,
                id;
            for (i = 0; i < items.length; i++) {
                item = items[i];
                item.sel = 'empty';
                for (j = 0; j < idArray.length; j++) {
                    id = idArray[j];
                    if (item.id == id) {
                        item.sel = 'checked';
                    }

                }
                data.updateItem(item.id, item);
            }
            data.collapseGroup('empty');
            data.refresh();
        },

        /**
         * Unselect all areas
         *
         * @method unselectAllAreas
         * @param leave hilighted areas to be selected in the grid
         */
        unselectAllAreas: function (leaveHilighted) {
            var _grid = this.grid,
                _data = _grid.getData(),
                items = _grid.getData().getItems(),
                item,
                i;
            for (i = 0; i < items.length; i++) {
                item = items[i];
                if (leaveHilighted && this.selectedMunicipalities[item.code]) {
                    item.sel = 'checked';
                } else {
                    item.sel = 'empty';
                }
            }

            _data.collapseGroup('empty');

            // sendstats
            var column = this._getColumnById(this._state.currentColumn);
            this.sendStatsData(column);


            //update data
            _data.setItems(items);
            _data.refresh();
            //render all the rows (and checkboxes) again
            _grid.invalidateAllRows();
            _grid.render();
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
            var columns = this.grid.getColumns(),
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
         * Sends an event with HTML for tooltips as data.
         *
         * @method sendTooltipData
         * @param {OpenLayers.Feature} feature
         */
        sendTooltipData: function (feature) {
            var featAtts = feature.attributes,
                eventBuilder = this._sandbox.getEventBuilder('MapStats.HoverTooltipContentEvent'),
                currColumn = this._state.currentColumn,
                property = this._getHilightPropertyName(),
                item = this.getItemByCode(featAtts[property]),
                content;

            if (item === null || item === undefined) {
                this._sandbox.printWarn('sendTooltipData: item not found for', featAtts[property], 'in', this.dataView.getItems());

            }

            content = '<p>' + item.municipality;
            content += ((currColumn && item[currColumn] !== null && item[currColumn] !== undefined) ? '<br />' + item[currColumn] : '');
            content += '</p>';

            if (eventBuilder) {
                var event = eventBuilder(content);
                this._sandbox.notifyAll(event);
            }
        },

        /**
         * Toggle select municipalities mode
         *
         * @method toggleSelectMunicipalitiesMode
         * @return true if mode is on
         */
        toggleSelectMunicipalitiesMode: function () {
            this.selectMunicipalitiesMode = !this.selectMunicipalitiesMode;
            return this.selectMunicipalitiesMode;
        },

        /**
         * Adds indicator title and organization info to the metadata hash
         * for data sources listing.
         *
         * @method addIndicatorMeta
         * @param {Object} indicator
         */
        addIndicatorMeta: function (indicator) {
            // push the indicator title and organization to the meta data hash
            var me = this,
                lang = Oskari.getLang(),
                indiId = indicator.id,
                indiMeta = me.indicatorsMeta[indiId];

            if (indiMeta) {
                indiMeta.count += 1;
            } else {
                me.indicatorsMeta[indiId] = {
                    count: 1,
                    title: indicator.title[lang],
                    organization: indicator.organization.title[lang]
                };
            }
        },

        /**
         * Removes the indicator from the metadata hash if it's the last
         * one from the same id.
         *
         * @method removeIndicatorMeta
         * @param  {Number} indicatorId
         * @return {undefined}
         */
        removeIndicatorMeta: function (indicatorId) {
            var indiMeta = this.indicatorsMeta[indicatorId];
            if (indiMeta) {
                indiMeta.count -= 1;
                if (indiMeta.count === 0) {
                    delete this.indicatorsMeta[indicatorId];
                }
            }
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
            //var numVal = Number((val || 'NaN').replace(',', '.'));
            //if (_.isNaN(numVal)) return val;
            //return numVal;
        }

    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
