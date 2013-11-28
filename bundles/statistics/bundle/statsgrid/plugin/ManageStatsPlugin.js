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
function(config, locale) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._layer = null;
    this._state = null;
    this.element = undefined;
    this.statsService = null;
    // indicators (meta data)
    this.indicators = [];
    // indicators meta for data sources
    this.indicatorsMeta = {};
    this.selectedMunicipalities = {};
//    this.conf = config || {};
    defaults = {"statistics" : [
        {"id" : "avg", "visible": true},
        {"id" : "max", "visible": true},
        {"id" : "min", "visible": true},
        {"id" : "mde", "visible": true},
        {"id" : "mdn", "visible": true},
        {"id" : "std", "visible": true},
        {"id" : "sum", "visible": true}
        ]
    };
    this.conf = jQuery.extend(true, config, defaults);
    this._locale = locale || {};
    this.templates = {
        'csvButton'         : '<button class="statsgrid-csv-button">csv</button>',
        'statsgridTotalsVar': '<span class="statsgrid-variable"></span>',
        'subHeader'         : '<span class="statsgrid-grid-subheader"></span>',
        'gridHeaderMenu'    : '<li><input type="checkbox" /><label></label></li>',
        'groupingHeader'    : '<span style="color:green"></span>',
        'toolbarButton'     : '<button class="statsgrid-select-municipalities"></button>',
        'filterPopup'       : '<div class="indicator-filter-popup"><p class="filter-desc"></p><div class="filter-container"></div></div>',
        'filterRow'         : '<div class="filter-row"><div class="filter-label"></div><div class="filter-value"></div></div>',
        'filterSelect'      : '<div><select class="filter-select"></select><div class="filter-inputs-container"></div></div>',
        'filterOption'      : '<option></option>',
        'filterInputs'      : '<input type="text" class="filter-input filter-input1" /><span class="filter-between" style="display:none;">-</span><input type="text" class="filter-input filter-input2" style="display:none;" />',
        'filterLink'        : '<a href="javascript:void(0);"></a>',
        'filterByRegion'    : '<div id="statsgrid-filter-by-region"><p class="filter-desc"></p><div class="filter-container"></div></div>',
        'regionCatSelect'   : '<div class="filter-region-category-select"><select></select></div>',
        'regionSelect'      : '<div class="filter-region-select"><select class="filter-region-select" multiple tabindex="3"></select></div>',
        'addOwnIndicator'   : '<div class="new-indicator-cont"><input type="button"/></div>'
    };

    this.regionCategories = {};
    this._acceptedRegionCategories = [
        'ALUEHALLINTOVIRASTO',
        'MAAKUNTA',
        'NUTS1',
        'SAIRAANHOITOPIIRI',
        'SEUTUKUNTA',
        'SUURALUE'
    ];
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
    getName : function() {
        return this.pluginName;
    },

    /**
     * @method getMapModule
     * Returns reference to map module this plugin is registered to
     * @return {Oskari.mapframework.ui.module.common.MapModule}
     */
    getMapModule : function() {
        return this.mapModule;
    },

    /**
     * @method setMapModule
     * Sets reference to reference to map module
     * @param {Oskari.mapframework.ui.module.common.MapModule} mapModule 
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        if (mapModule) {
            this.pluginName = mapModule.getName() + this.__name;
        }
    },

    /**
     * @method register
     * Interface method for the module protocol
     */
    register : function() {
    },

    /**
     * @method unregister
     * Interface method for the module protocol
     */
    unregister : function() {
    },

    /**
     * @method init
     * Interface method for the module protocol. Initializes the request
     * handlers/templates.
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    init : function(sandbox) {
    },

    /**
     * @method startPlugin
     *
     * Interface method for the plugin protocol. Should registers requesthandlers and
     * eventlisteners.
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();
        sandbox.register(this);
        for (p in this.eventHandlers) {
            sandbox.registerForEventByName(this, p);
        }

        this.statsService = sandbox.getService('Oskari.statistics.bundle.statsgrid.StatisticsService');
        this._published = ( this.conf.published || false );
        this._state = ( this.conf.state || {} );
        this._layer = ( this.conf.layer || null );
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
    stopPlugin : function(sandbox) {
        for (p in this.eventHandlers) {
            sandbox.unregisterFromEventByName(this, p);
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
    eventHandlers : {
        'MapStats.FeatureHighlightedEvent': function(event) {
            if(this.selectMunicipalitiesMode) {
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
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },

    /**
     * @method getLayer
     * @return {Object} layer
     */
    getLayer : function(layer) {
        return this._layer;
    },

    /**
     * @method setLayer
     * @param {Object} layer
     */
    setLayer : function(layer) {
        this._layer = layer;
    },

    setState: function(state) {
        this._state = state;
    },

    /**
     * @method createStatsOut
     * Get Sotka data and show it in SlickGrid
     * @param {Object} container to where slick grid and pull downs will be appended
     */
    createStatsOut : function(container) {
        // indicator params are select-elements
        // (indicator drop down select and year & gender selects)
        this.prepareIndicatorParams(container);

        // stop events so that they don't affect other parts of the site (i.e. map)
        container.on("keyup", function(e) {
            e.stopPropagation();
        });
        container.on("keydown", function(e) {
            e.stopPropagation();
        });

    },
    /**
     * @method prepareIndicatorParams
     * @param {Object} container element where indicator-selector should be added
     */
    prepareIndicatorParams : function(container) {
        // Do not load the indicators for a published map.
        if (!this._published) {
            //clear the selectors container
            container.find('selectors-container').remove();
            //add selectors
            var selectors = jQuery('<div class="selectors-container"></div>');
            container.append(selectors);

            //Adding csv button
            var me = this;
            if(me.conf.csvDownload) {
                var csvLink = jQuery(me.templates.csvButton);
                //container.find('selectors-container')
                selectors.append(csvLink);
                csvLink.click(function() {
                    if(me.dataView){
                        var items = me.dataView.getItems();
                        me.downloadJSON2CSV(items);
                    }
                });                
            }

            // Indicators
            // success -> createIndicators
            this.getSotkaIndicators(container);

        }
        // Regions: success createMunicipalityGrid
        this.getSotkaRegionData(container);
    },
    /**
     * Fetch region data - we need to know all the regions / municipalities
     * @method getSotkaRegionData
     * @param {Object} container element where indicator-selector should be added
     */
    getSotkaRegionData : function(container) {
        var me = this;
        // call ajax function (params: url, successFallback, errorCallback)
        me.statsService.fetchStatsData(me._sandbox.getAjaxUrl() + 'action_route=GetSotkaData&action=regions&version=1.1',
        // success callback
        function(regionData) {
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
                me.showMessage(me._locale['sotka'].errorTitle, me._locale['sotka'].regionDataError);
            }
        },
        // error callback
        function(jqXHR, textStatus) {
            me.showMessage(me._locale['sotka'].errorTitle, me._locale['sotka'].regionDataXHRError);
        });
    },

    setRegionCategories: function(regionData) {
        var rLen = regionData.length,
            i, region;

        for (i = 0; i < rLen; ++i) {
            region = regionData[i];
            if (this._isAcceptedRegionCategory(region)) {
                if (!this.regionCategories[region.category]) {
                    this.regionCategories[region.category] = [];
                }
                this.regionCategories[region.category].push({
                    id: region.id,
                    code: region.code,
                    title: region.title[Oskari.getLang()]
                });
            }
        }
    },

    _isAcceptedRegionCategory: function(region) {
        var catLen = this._acceptedRegionCategories.length,
            i, category;

        for (i = 0; i < catLen; ++i) {
            category = this._acceptedRegionCategories[i];
            if (category === region.category) return true;
        }
        return false;
    },

    /**
     * Create initial grid using just one column: municipality
     * @method createMunicipalitySlickGrid
     * @param {Object} container element where indicator-selector should be added
     */
    createMunicipalitySlickGrid : function(container, regiondata) {
        var me = this;
        var grid;
        var gridContainer = jQuery('<div id="municipalGrid" class="municipal-grid"></div>');
        // clear and append municipal-grid container
        container.find('.municipal-grid').remove();
        container.append(gridContainer);
        // add initial columns

        //This modified plugin adds checkboxes to grid
        var checkboxSelector = new Slick.CheckboxSelectColumn2({
            cssClass: "slick-cell-checkboxsel"
        });
        this.checkboxSelector = checkboxSelector;

        // initial columns
        var columns = [me.checkboxSelector.getColumnDefinition(),
        {
            id : "municipality",
            name : this._locale['sotka'].municipality,
            field : "municipality",
            sortable : true
        }
        /*, {
            id : "code",
            name : this._locale['sotka'].code,
            field : "code"
        }*/];
        // options
        var options = {
            enableCellNavigation : true,
            enableColumnReorder : true,
            multiColumnSort : true,
            showHeaderRow: true,
            headerRowHeight: 97
        };
        var data = [];
        var rowId = 0;
        // loop through regiondata and find all the municipalities
        for (var i = 0; i < regiondata.length; i++) {
            var indicData = regiondata[i];

            if (indicData["category"] == 'KUNTA') {
                // add new row with id and name of municipality
                data[rowId] = {
                    id : indicData.id,
                    code : indicData.code,
                    municipality : indicData.title[Oskari.getLang()],
                    memberOf: indicData.memberOf,
                    sel : 'checked'
                }
                rowId++;
            }

        }
        // metadata provider for data view
        var groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
        // dataview for the grid
        dataView = new Slick.Data.DataView({
            groupItemMetadataProvider : groupItemMetadataProvider,
            inlineFilters : true
        });
        // when the row changes re-render that row
        dataView.onRowsChanged.subscribe(function(e, args) {
            grid.invalidateRows(args.rows);
            grid.render();
        });

        // To use aggregators we need to define a group
        dataView.setGrouping({
            getter : "sel",
            comparer: function (a, b) {
                //checkbox columns values are 'checked' and 'empty'
                if(a.groupingKey == 'checked' && a.groupingKey == b.groupingKey){
                    return 0;
                } else if(a.groupingKey < b.groupingKey) {
                    // 'empty' is the first group
                    return 1;
                } else {
                    return -1;
                }
            },
            formatter: function (g) {
                //a hack to name the groups
                var text = (g.groupingKey == "checked" ? 
                    me._locale['municipality'] : 
                    me._locale['not_included']) + " (" + g.count + ")";
                return "<span style='color:green'>" + text + "</span>";
            },
            aggregateCollapsed: false
        });

        // Grid
        grid = new Slick.Grid(gridContainer, dataView, columns, options);

        var sortcol = "json_number";
        var sortdir = 1;
        // when user sorts this grid according to selected column
        // we need to provide sort-function
        grid.onSort.subscribe(function(e, args) {
            var target = jQuery(e.target);
            // Don't sort if the clicked spot was a menu button.
            if (target.hasClass('slick-header-menubutton') ||
                target.parent().hasClass('slick-header-menubutton')) {
                return false;
            }

            var cols = args.sortCols;
            dataView.sort(function(dataRow1, dataRow2) {
                for (var i = 0, l = cols.length; i < l; i++) {
                    var field = cols[i].sortCol.field;
                    var sign = cols[i].sortAsc ? 1 : -1;
                    var value1 = dataRow1[field], value2 = dataRow2[field];
                    if(value1 == null) {
                        return 1;
                    }
                    if(value2 == null) {
                        return -1;
                    }
                    var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
                    if (result != 0) {
                        return result;
                    }
                }
                return 0;
            });
            grid.invalidate();
            grid.render();
        });

        grid.onHeaderClick.subscribe(function(e, args) {
            // Don't do anything in case the clicked column is the one in the state.
            if (args.column.id === me._state.currentColumn) {
                return false;
            }
            me.sendStatsData(args.column);
        });

        // when headerRow cells are rendered
        // add placeholder
        grid.onHeaderRowCellRendered.subscribe(function(e, args) {
            jQuery(args.node).empty();
            jQuery(me.templates.subHeader)
                .appendTo(args.node);
        });

        grid.onColumnsReordered.subscribe(function(e, args){
            me.dataView.refresh();
        });

        // register checboxSelector plugin
        grid.registerPlugin(checkboxSelector);
        // register groupItemMetadataProvider plugin (if not registered group toggles won't work)
        grid.registerPlugin(groupItemMetadataProvider);
        // Our new event to subscripe - this is called when checkbox is clicked
        checkboxSelector.onSelectRowClicked.subscribe(function(e, args){
            var data = args.grid.getData();
            var item = data.getItem(args.row);
            var groupsBeforeUpdate = data.getGroups().length;

            //update item values (groupingkey is created from these)
            item.sel = jQuery(e.target).is(':checked') ? 'checked' : 'empty';
            data.updateItem(item.id, item);

            // collapse group empty if it is created for the first time
            groups = data.getGroups();
            if(groups.length > 1) {
                for (var i = 0; i < groups.length; i++) {
                    var group = groups[i];
                    if(group.groupingKey == 'empty' && group.count < 2 && groupsBeforeUpdate == 1) {
                        data.collapseGroup('empty');
                    }
                };
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
        checkboxSelector.onSelectHeaderRowClicked.subscribe(function(e, args){

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

        me.setGridHeight();

        //window resize!
        var resizeGridTimer;
        jQuery(window).resize(function () {
            clearTimeout(resizeGridTimer);
            resizeGridTimer = setTimeout(function() {
                me.setGridHeight();                   
            }, 100);
        });
    },

    /**
     * Sets the height of the grid container and handles resizing of the SlickGrid.
     * 
     * @method setGridHeight
     */
    setGridHeight: function() {
        var gridDiv = jQuery("#municipalGrid");
        var parent = gridDiv.parent();
        var selectorsCont = parent.find('.selectors-container');
        var selectorsHeight = 0;
        if(selectorsCont.length > 0){
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
    getIdxByCode: function(code) {
        var items = this.dataView ? this.dataView.getItems() : [],
            returnItem = null,
            i;

        for (i = 0; i < items.length; ++i) {
            if (items[i].code === code) {
                returnItem = items[i];
                break;
            }
        }
        if (returnItem) {
            var row = this.dataView.getRowById(returnItem.id);
            if(row){
                return row;
            } else {
                return -1;
            }
        } else {
            return null;
        }
    },

    getItemByCode: function(code) {
        var items = this.dataView ? this.dataView.getItems() : [],
            returnItem = null,
            i;

        for (i = 0; i < items.length; ++i) {
            if (items[i].code === code) {
                returnItem = items[i];
                break;
            }
        }
        if (returnItem) {
            return this.dataView.getItemById(returnItem.id);
        } else {
            return null;
        }
    },

    /**
     * Fetch all Sotka indicators
     *
     * @method getSotkaIndicators
     * @param container element
     */
    getSotkaIndicators : function(container) {
        var me = this;
        var sandbox = me._sandbox;
        // make the AJAX call
        me.statsService.fetchStatsData(sandbox.getAjaxUrl() + 'action_route=GetSotkaData&action=indicators&version=1.1',
        //success callback
        function(indicatorsdata) {
            if (indicatorsdata) {
                //if fetch returned something we create drop down selector
                me.createIndicatorsSelect(container, indicatorsdata);
            } else {
                me.showMessage(me._locale['sotka'].errorTitle, me._locale['sotka'].indicatorsDataError);
            }
        },
        // error callback
        function(jqXHR, textStatus) {
            me.showMessage(me._locale['sotka'].errorTitle, me._locale['sotka'].indicatorsDataXHRError);
        });
    },

    /**
     * Create indicators drop down select
     *
     * @method createIndicatorsSelect
     * @param container parent element
     * @param data contains all the indicators
     */
    createIndicatorsSelect : function(container, data) {
        var me = this;
        // Indicators' select container etc.
        var indi = jQuery('<div class="indicator-cont"><div class="indisel selector-cont"><label for="indi">' + this._locale['indicators'] + '</label><select id="indi" name="indi" class="indi"><option value="" selected="selected"></option></select></div></div>');

        var sel = indi.find('select');
        for (var i = 0; i < data.length; i++) {
            var indicData = data[i];

            for (var key in indicData) {
                if (key == "id") {
                    var value = indicData[key];
                    var title = indicData["title"][Oskari.getLang()];
                    var opt = jQuery('<option value="' + value + '">' + title + '</option>');
                    //append option
                    sel.append(opt);
                    data[i].titlename = title;
                }
            }
        }

        // if the value changes, fetch indicator meta data
        sel.change(function(e) {
            var indicator = sel.find('option:selected').val();
            me.deleteIndicatorInfoButton(container);
            me.deleteDemographicsSelect(container);
            me.getSotkaIndicatorMeta(container, indicator);
        });

        var selectorsContainer = container.find('.selectors-container');
        selectorsContainer.append(indi).append('<div class="parameters-cont"></div>');
        // if we want to select some special indicator..
        //sel.find('option[value="127"]').prop('selected', true);

        var paramCont = selectorsContainer.find('.parameters-cont');
        me._addOwnIndicatorButton(paramCont);

        // we use chosen to create autocomplete version of indicator select element.
        sel.chosen({
            no_results_text : this._locale['noMatch'],
            placeholder_text : this._locale['selectIndicator']
        });
        // this gives indicators more space to show title on dropdown
        jQuery('.chzn-drop').css('width','298px');
        jQuery('.chzn-search input').css('width','263px');
    },

/**
 *
 */
_addOwnIndicatorButton: function(paramCont) {
    var me = this;
    var button = jQuery(me.templates.addOwnIndicator);
    var container = paramCont.parents('div.statsgrid');
    button.find('input').val(me._locale.addDataButton);
    paramCont.append(button);
    button.find('input').click(function(e){
        var items = me.dataView ? me.dataView.getItems() : null;
        var form = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.AddOwnIndicatorForm', me._sandbox, me._locale, items, me._layer.getWmsName(), me._layer.getId());
        container.find('.selectors-container').hide();
        container.find('#municipalGrid').hide();
        form.createUI(container, function(data) {
            me._addUserIndicatorToGrid(data);
        });
    });
},
_addUserIndicatorToGrid : function(data) {
    alert(JSON.stringify(data));
},
    /**
     * Get Sotka indicator meta data
     *
     * @method getSotkaIndicatorMeta
     * @param container parent element.
     * @param indicator id
     */
    getSotkaIndicatorMeta : function(container, indicator) {
        var me = this;
        var sandbox = me._sandbox;
        // fetch meta data for given indicator
        me.statsService.fetchStatsData(sandbox.getAjaxUrl() + 'action_route=GetSotkaData&action=indicator_metadata&indicator=' + indicator + '&version=1.1',
        // success callback
        function(indicatorMeta) {
            if (indicatorMeta) {
                //if fetch returned something we create drop down selector
                me.createIndicatorInfoButton(container, indicatorMeta);

                if (me._hasMunicipalityValues(indicatorMeta)) {
                    me.createDemographicsSelects(container, indicatorMeta);
                } else {
                    me._warnOfInvalidIndicator(container, indicatorMeta);
                }
            } else {
                me.showMessage(me._locale['sotka'].errorTitle, me._locale['sotka'].indicatorMetaError);
            }
        },
        // error callback
        function(jqXHR, textStatus) {
            me.showMessage(me._locale['sotka'].errorTitle, me._locale['sotka'].indicatorMetaXHRError);
        });

    },
    /**
     * Checks if the indicator has municipality based values.
     * If it does not, we cannot display it in the grid at the moment.
     *
     * @method _hasMunicipalityValues
     * @param  {Object} metadata indicator metadata from SOTKAnet
     * @return {Boolean}
     */
    _hasMunicipalityValues: function(metadata) {
        var regions = metadata.classifications,
            regions = regions && regions.region,
            regions = regions && regions.values,
            regions = regions || [],
            rLen = regions.length,
            i;

        for (i = 0; i < rLen; ++i) {
            if (regions[i].toLowerCase() === 'kunta') return true;
        }
        return false;
    },
    /**
     * Displays a warning of invalid indicator for the grid
     * if the indicator does not have municipality based values.
     *
     * @method _warnOfInvalidIndicator
     * @param  {jQuery} container
     * @param  {Object} metadata
     * @return {undefined}
     */
    _warnOfInvalidIndicator: function(container, metadata) {
        var selectors = container.find('.selectors-container'),
            parameters = selectors.find('.parameters-cont');//jQuery('<div class="parameters-cont"></div>');

        parameters.html(this._locale.cannotDisplayIndicator);
        //selectors.append(parameters);
    },
    /**
     * Create indicator meta info button
     *
     * @method createIndicatorInfoButton
     * @param container parent element
     * @param indicator meta data
     */
    createIndicatorInfoButton : function(container, indicator) {
        var me = this;
        var infoIcon = jQuery('<div class="icon-info"></div>');
        var indicatorCont = container.find('.indicator-cont');
        // clear previous indicator
        indicatorCont.find('.icon-info').remove();
        // append this indicator
        indicatorCont.append(infoIcon);
        // show meta data
        infoIcon.click(function(e) {
            var lang = Oskari.getLang();
            var desc = '<h4 class="indicator-msg-popup">' + me._locale['sotka'].descriptionTitle + '</h4><p>' + indicator.description[lang] + '</p><br/><h4 class="indicator-msg-popup">' + me._locale['sotka'].sourceTitle + '</h4><p>' + indicator.organization.title[lang] + '</p>';
            me.showMessage(indicator.title[lang], desc);
        });
    },

    deleteIndicatorInfoButton: function(container) {
        container.find('.indicator-cont').find('.icon-info').remove();
    },

    /**
     * Create drop down selects for demographics (year & gender)
     *
     * @method createDemographicsSelects
     * @param container parent element
     * @param indicator meta data
     */
    createDemographicsSelects : function(container, indicator) {
        var me = this;
        this.indicators.push(indicator);

        var selectors = container.find('.selectors-container');
        // year & gender are in a different container than indicator select
        var parameters = selectors.find(".parameters-cont");
        var newIndicator = parameters.find('.new-indicator-cont');
        var year = null,
            gender = null;

        // if there is a range we can create year select
        if (indicator.range != null) {
            newIndicator.before(this.getYearSelectorHTML(indicator.range.start, indicator.range.end));
            // by default the last value is selected in getYearSelectorHTML
            year = indicator.range.end;
        }
        // if there is a classification.sex we can create gender select
        if (indicator.classifications != null && indicator.classifications.sex != null) {
            newIndicator.before(this.getGenderSelectorHTML(indicator.classifications.sex.values));
            // by default the last value is selected in getGenderSelectorHTML
            gender = indicator.classifications.sex.values[indicator.classifications.sex.values.length - 1];
        }
        gender = gender != null ? gender: 'total';

        // by default the last year and gender is selected
        var columnId = me._getIndicatorColumnId(indicator.id, gender, year);
        var includedInGrid = this.isIndicatorInGrid(columnId);

        var fetchButton = jQuery('<button class="fetch-data' + (includedInGrid ? ' hidden' : '') + ' selector-button">' + this._locale['addColumn'] + '</button>');
        var removeButton = jQuery('<button class="remove-data' + (includedInGrid ? '' : ' hidden') + ' selector-button">' + this._locale['removeColumn'] + '</button>');

        newIndicator.before(fetchButton);
        newIndicator.before(removeButton);

        selectors.find('.indicator-cont').after(parameters);

        // click listener
        fetchButton.click(function(e) {
            var element = jQuery(e.currentTarget);
            var year = jQuery('.statsgrid').find('.yearsel').find('.year').val();
            var gender = jQuery('.statsgrid').find('.gendersel').find('.gender').val();
            gender = gender != null ? gender: 'total';
            // me.getSotkaIndicatorData(container,indicator, gender, year);
            var columnId = me._getIndicatorColumnId(indicator.id, gender, year);
            me.getSotkaIndicatorData(container, indicator.id, gender, year, function() {
                me.addIndicatorMeta(indicator);
            });
        });

        // click listener
        removeButton.click(function(e) {
            var year = jQuery('.statsgrid').find('.yearsel').find('.year').val(),
                gender = jQuery('.statsgrid').find('.gendersel').find('.gender').val();
            gender = gender != null ? gender: 'total';
            var columnId = me._getIndicatorColumnId(indicator.id, gender, year);
            me.removeIndicatorDataFromGrid(indicator.id, gender, year);
        });
    },

    deleteDemographicsSelect: function(container) {
        container.find('.parameters-cont').find('.selector-cont').remove();
        container.find('.parameters-cont').find('.selector-button').remove();
    },

    /**
     * Update Demographics buttons
     *
     * @method updateDemographicsSelects
     * @param container parent element
     * @param indicator meta data
     */
    updateDemographicsButtons : function(indicatorId, gender, year) {
        indicatorId = indicatorId ? indicatorId : jQuery('.statsgrid').find('.indisel ').find('option:selected').val();
        gender = gender ? gender : jQuery('.statsgrid').find('.gendersel').find('.gender').val();
        gender = gender != null ? gender: 'total';
        year = year ? year : jQuery('.statsgrid').find('.yearsel').find('.year').val();

        var columnId = "indicator" + indicatorId + year + gender,
            includedInGrid = this.isIndicatorInGrid(columnId);

        // toggle fetch and remove buttons so that only one is visible and can only be selected once
        if (includedInGrid) {
            jQuery('.statsgrid').find('.fetch-data').addClass("hidden");
            jQuery('.statsgrid').find('.remove-data').removeClass("hidden");
        } else {
            jQuery('.statsgrid').find('.fetch-data').removeClass("hidden");
            jQuery('.statsgrid').find('.remove-data').addClass("hidden");
        }
    },

    /**
     * Checks if the given indicator id data is in the grid.
     *
     * @method isIndicatorInGrid
     * @param columnId unique column id
     */
    isIndicatorInGrid : function (columnId) {
        var columns = this.grid.getColumns();
        var found = false;
        
        for(var i = 0, ilen = columns.length; i < ilen; i++){
            if (columnId === columns[i].id) {
                return true;
            }
        }
        return false;
    },

    /**
     * Get Sotka data for one indicator
     *
     * @method getSotkaIndicatorData
     * @param container parent element
     * @param indicatorId id
     * @param gender (male / female / total)
     * @param year selected year
     * @param {Function} cb optional callback which gets executed after a successful fetch
     */
    getSotkaIndicatorData : function(container, indicatorId, gender, year, cb) {
        var me = this;
        var gndrs = gender != null ? gender : 'total';
        // ajax call
        me.statsService.fetchStatsData(
            // url
            me._sandbox.getAjaxUrl() + 'action_route=GetSotkaData&action=data&version=1.0&indicator=' + indicatorId + '&years=' + year + '&genders=' + gndrs,
            // success callback
            function(data) {
                if (data) {
                    if (cb && typeof cb === 'function') {
                        cb();
                    }
                    // Add indicator to the state.
                    if (me._state.indicators == null) {
                        me._state.indicators = [];
                    }
                    me._state.indicators.push({indicator: indicatorId, year: year, gender: gndrs});
                    // Show the data in the grid.
                    me.addIndicatorDataToGrid(container, indicatorId, gndrs, year, data, me.indicators[me.indicators.length -1]);
                } else {
                    me.showMessage(me._locale['sotka'].errorTitle, me._locale['sotka'].indicatorDataError);
                }
            },
            // error callback
            function(jqXHR, textStatus) {
                me.showMessage(me._locale['sotka'].errorTitle, me._locale['sotka'].indicatorDataXHRError);
            });
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
    _getIndicatorColumnId : function(indicatorId, gender, year) {
        var columnId = "indicator" + indicatorId + year + gender;
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
    addIndicatorDataToGrid : function(container, indicatorId, gender, year, data, meta, silent) {
        var me = this;
        var columnId = me._getIndicatorColumnId(indicatorId, gender, year);
        var columns = me.grid.getColumns();
        var indicatorName = meta.title[Oskari.getLang()];

        var columnId = "indicator" + indicatorId + year + gender;
        if(me.isIndicatorInGrid(columnId)) {
            return false;
        }

        var headerButtons = [{
            cssClass: 'icon-close-dark statsgrid-remove-indicator',
            tooltip: me._locale.removeColumn,
            handler: function(e) {
                me.removeIndicatorDataFromGrid(indicatorId, gender, year);
            }
        }];

        var name = indicatorName + '/' + year + '/' + gender;
        columns.push({
            id : columnId,
            name : name,
            field : columnId,
            toolTip : name,
            sortable : true,
            header : {
                menu: {
                    items: [
                        {element: jQuery('<div></div>').text(me._locale.filter)},
                        {element: jQuery(me.templates.filterLink).text(me._locale.filterByValue), command: 'filter', actionType: 'link'},
                        {element: jQuery(me.templates.filterLink).text(me._locale.filterByRegion), command: 'filterByRegion', actionType: 'link'}
                    ]
                },
                icon: 'icon-funnel',
                buttons: ( (this.conf && this.conf.published) ? null : headerButtons )
            },
            groupTotalsFormatter: function(totals, columnDef) {
                var text = "";
                // create grouping footer texts. => how many values there is in different colums
                valueCount = 0;
                var rows = totals.group.rows;
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    if (row[columnDef.field] != null) {
                        valueCount++;
                    };
                };
                text = valueCount + ' ' + me._locale['values'];
                return text;
            }
        });

        me.grid.setColumns(columns);

        var columnData = [];
        var ii = 0;
        me.dataView.beginUpdate();

        // loop through data and get the values
        for (var i = 0; i < data.length; i++) {
            var indicData = data[i];
            var regionId = "";
            var value = "";
            for (var key in indicData) {
                if (key == "region") {
                    regionId = indicData[key];
                } else if (key == "primary value") {
                    value = indicData[key];
                    value = value.replace(',', '.');
                }
            }
            if (!!regionId) {
                // find region
                var item = me.dataView.getItemById(regionId);
                if (item) {
                    // update row
                    item[columnId] = Number(value);
                    me.dataView.updateItem(item.id, item);
                }
                ii++;
            }
        }
        var items = me.dataView.getItems();
        for (var i = items.length - 1; i >= 0; i--) {
            var item = items[i];
            if (item[columnId] == null) {
                item[columnId] = null;
            }
        };

        // create all the aggregators we need
        var aggregators = [];

        for (var i = 0; i < columns.length; i++) {
            var id = columns[i].id;
            aggregators.push(new Slick.Data.Aggregators.Avg(id));
            aggregators.push(new Slick.Data.Aggregators.Std(id));
            aggregators.push(new Slick.Data.Aggregators.Mdn(id));
            aggregators.push(new Slick.Data.Aggregators.Mde(id));
            aggregators.push(new Slick.Data.Aggregators.Sum(id));
            aggregators.push(new Slick.Data.Aggregators.Max(id));
            aggregators.push(new Slick.Data.Aggregators.Min(id));
        }
        me.dataView.setAggregators(aggregators,true);

        // Add callback function for totals / statistics
        me.dataView.setTotalsCallback(function(groups) {
            me._updateTotals(groups);
        });



        me.dataView.endUpdate();
        me.dataView.refresh();
        me.grid.invalidateAllRows();
        me.grid.render();

        if(silent != true) {
            // Show classification
            me.sendStatsData(columns[columns.length - 1]);
        }

        me.updateDemographicsButtons(indicatorId, gender, year);
        me.grid.setSortColumn(me._state.currentColumn, true);   

    },

    /**
     * Remove indicator data to the grid.
     *
     * @method removeIndicatorDataFromGrid
     * @param indicatorId id
     * @param gender (male / female / total)
     * @param year selected year
     */
    removeIndicatorDataFromGrid : function(indicatorId, gender, year) {
        var columnId = this._getIndicatorColumnId(indicatorId, gender, year),
            columns = this.grid.getColumns(),
            allOtherColumns = [],
            found = false,
            i = 0,
            ilen = 0,
            j = 0;
        
        for(i = 0, ilen = columns.length, j = 0; i < ilen; i++){
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
            this.grid.setColumns(allOtherColumns);
            this.grid.render();
            this.dataView.refresh();
        }

        // remove indicator also from to the state!
        if (this._state.indicators) {
            for (i = 0, ilen = this._state.indicators.length; i < ilen; i++) {
                var statedIndicator = this._state.indicators[i];
                if ((indicatorId === statedIndicator.indicator) &&
                    (year === statedIndicator.year) &&
                    (gender === statedIndicator.gender)) {
                    this._state.indicators.splice(i, 1);
                    break;
                }
            }
        }

        // remove from metadata hash as well
        this.removeIndicatorMeta(indicatorId);

        this.updateDemographicsButtons(indicatorId, gender, year);

        if (columnId === this._state.currentColumn) {
            // hide the layer, as we just removed the "selected"
            this._setLayerVisibility(false);
            this._state.currentColumn = null;
        }
    },

    /**
     * Create HTML for year selector
     *
     * @method getYearSelectorHTML
     * @param startYear
     * @param endYear
     */
    getYearSelectorHTML : function(startYear, endYear) {
        var me = this;
        // Years
        var year = jQuery('<div class="yearsel selector-cont"><label for="year">' + this._locale['year'] + '</label><select name="year" class="year"></select></div>');
        var sel = year.find('select');

        for (var i = startYear; i <= endYear; i++) {
            var opt = jQuery('<option value="' + i + '">' + i + '</option>');
            sel.append(opt);
        }

        sel.val(endYear);
        sel.change(function(e) {
            me.updateDemographicsButtons(null, null, e.target.value);
        });
        return year;
    },
    /**
     * Create HTML for gender selector
     *
     * @method getGenderSelectorHTML
     * @param values for select element
     */
    getGenderSelectorHTML : function(values) {
        var me = this;
        //Gender
        var gender = jQuery('<div class="gendersel selector-cont"><label for="gender">' + this._locale['gender'] + '</label><select name="gender" class="gender"></select></div>');

        var sel = gender.find('select');
        for (var i = 0; i < values.length; i++) {
            var opt = jQuery('<option value="' + values[i] + '">' + this._locale['genders'][values[i]] + '</option>');
            sel.append(opt);
        }
        sel.val(values[values.length - 1]);
        sel.change(function(e) {
            me.updateDemographicsButtons(null, e.target.value, null);
        });
        return gender;
    },
    /**
     * Sends the selected column's data from the grid
     * in order to create the visualization.
     * 
     * @method sendStatsData
     * @param curCol  Selected indicator data column
     */
    sendStatsData : function(curCol) {
        if (curCol == null || curCol.field.indexOf('indicator') < 0) {
            // Not a valid current column nor a data value column
            return;
        }

        //Classify data
        var me = this;
        var statArray = [];
        var munArray = [];
        var check = false;
        var i, k;

        var municipalities = me._state.municipalities = [];
        // Set current column to be stated
        me._state.currentColumn = curCol.id;

        // Get values of selected column
        var data = this.dataView.getItems();
        for ( i = 0; i < data.length; i++) {
            var row = data[i];
            // Exclude null values
            if (row.sel == "checked"){
                municipalities.push(row.id);
                if(row[curCol.field] != null) {
                    statArray.push(row[curCol.field]);
                    // Municipality codes (kuntakoodit)
                    munArray.push(row['code']);
                }
            }
        }

        // Send the data trough the stats service.
        me.statsService.sendStatsData(me._layer, {
            CHECKED_COUNT : this.getItemsByGroupingKey('checked').length, // how many municipalities there is checked
            CUR_COL : curCol,
            VIS_NAME : me._layer.getWmsName(), //"ows:kunnat2013",  
            VIS_ATTR : me._layer.getFilterPropertyName(), //"kuntakoodi",
            VIS_CODES : munArray,
            COL_VALUES : statArray
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
    _setLayerVisibility: function(visibility) {
        // show the layer, if not visible
        if (this._layer._visible !== visibility) {
            var sandbox = this._sandbox;
            var visibilityRequestBuilder = sandbox.getRequestBuilder('MapModulePlugin.MapLayerVisibilityRequest');
            if (visibilityRequestBuilder) {
                var request = visibilityRequestBuilder(this._layer.getId(), visibility);
                sandbox.request(this, request);
            }
        }
    },


    /**
     * Get Sotka metadata for given indicators
     *
     * @method getSotkaIndicatorsMeta
     * @param indicators for which we fetch data
     * @param callback what to do after we have fetched metadata for all the indicators
     */
    getSotkaIndicatorsMeta : function(container, indicators, callback) {
        var me = this, fetchedIndicators = 0;
        me.indicators = [];

        for (var i = 0; i < indicators.length; i++) {
            var indicatorData = indicators[i],
            indicator = indicatorData.indicator;

            // ajax call
            me.statsService.fetchStatsData(
                // url
                me._sandbox.getAjaxUrl() + 'action_route=GetSotkaData&action=indicator_metadata&indicator=' + indicator + '&version=1.1',
                // success callback
                function(data) {
                    //keep track of returned ajax calls
                    fetchedIndicators++;

                    if (data) {
                        me.addIndicatorMeta(data);

                        for(var j = 0; j < indicators.length; j++) {
                            if(indicators[j].indicator == data.id) {
                                me.indicators[j] = data;
                            }
                        };

                        // when all the indicators have been fetched
                        // fire callback
                        if(fetchedIndicators >= indicators.length) {
                            callback();
                        }

                    } else {
                        me.showMessage(me._locale['sotka'].errorTitle, me._locale['sotka'].indicatorDataError);
                    }
                },
                // error callback
                function(jqXHR, textStatus) {
                    me.showMessage(me._locale['sotka'].errorTitle, me._locale['sotka'].indicatorDataXHRError);
                    //keep track of returned ajax calls
                    fetchedIndicators++;
                }
            );
        };
    },

    /**
     * Get Sotka data for given indicators
     *
     * @method getSotkaIndicatorsData
     * @param indicators for which we fetch data
     * @param callback what to do after we have fetched data for all the indicators
     */
    getSotkaIndicatorsData : function(container, indicators, callback) {
        var me = this, fetchedIndicators = 0, indicatorsData = {};

        for (var i = 0; i < indicators.length; i++) {
            var indicatorData = indicators[i],
                indicator = indicatorData.indicator,
                year = indicatorData.year,
                gender = indicatorData.gender != null ? indicatorData.gender: 'total';

            // ajax call
            me.statsService.fetchStatsData(
                // url
                me._sandbox.getAjaxUrl() + 'action_route=GetSotkaData&action=data&version=1.0&indicator=' + indicator + '&years=' + year + '&genders=' + gender,
                // success callback
                function(data) {
                    fetchedIndicators++;
                    if (data) {

                        //save the data to the right indicator for later use
                        for (var j = 0; j < indicators.length; j++) {
                            var ind = indicators[j];
                            if(ind.indicator == data[0].indicator &&
                                ind.year == data[0].year &&
                                ind.gender == data[0].gender) {

                                var indicatorColumnId = me._getIndicatorColumnId(ind.indicator, ind.gender, ind.year);
                                indicatorsData[indicatorColumnId] = data;
                            }
                        };
                        // when all the indicators have been fetched
                        // add them to the grid and fire callback
                        if(fetchedIndicators >= indicators.length) {
                            //add these to the grid!!
                            for (var j = 0; j < indicators.length; j++) {
                                var ind = indicators[j];
                                if(ind) {
                                    var indicatorColumnId = me._getIndicatorColumnId(ind.indicator, ind.gender, ind.year);
                                    var indData = indicatorsData[indicatorColumnId];
                                    me.addIndicatorDataToGrid(container, ind.indicator, ind.gender, ind.year, indData, me.indicators[j], true);
                                }
                            };
                            callback();
                        }
                    } else {
                        me.showMessage(me._locale['sotka'].errorTitle, me._locale['sotka'].indicatorDataError);
                    }
                },
                // error callback
                function(jqXHR, textStatus) {
                    me.showMessage(me._locale['sotka'].errorTitle, me._locale['sotka'].indicatorDataXHRError);
                    fetchedIndicators++;
                }
            );
        };
    },
    /**
     * Removes all indicator data from the grid
     *
     * @method clearDataFromGrid
     */
    clearDataFromGrid : function() {
        if(!this.grid) {
            return;
        }
        var columns = this.grid.getColumns();
        var newColumnDef    =   [];
        
        var j = 0;
        for(var i = 0; i < columns.length; i++){
            var columnId = columns[i].id;
            if((columnId == 'id' || columnId == 'municipality' || columnId == 'code' || columnId == '_checkbox_selector')) {
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
    showMessage : function(title, message, buttons) {
        // Oskari components aren't available in a published map.
        if (!this._published) {
            var loc = this._locale;
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            if(buttons) {
                dialog.show(title, message, buttons);
            } else {
                var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                okBtn.setTitle(loc.buttons.ok);
                okBtn.addClass('primary');
                okBtn.setHandler(function() {
                    dialog.close(true);
                });
                dialog.show(title, message, [okBtn]);                
            }
        }
    },


    /**
     * @method loadStateIndicators
     */
    loadStateIndicators: function(state, container) {
        var me = this;
        var classifyPlugin = this._sandbox.findRegisteredModuleInstance('MainMapModuleManageClassificationPlugin');
        // First, let's clear out the old data from the grid.
        me.clearDataFromGrid();

        if(state.indicators && state.indicators.length > 0){
            //send ajax calls and build the grid
            me.getSotkaIndicatorsMeta(container, state.indicators, function(){
                //send ajax calls and build the grid
                me.getSotkaIndicatorsData(container, state.indicators, function(){

                    if(state.currentColumn != null) {
                        if(classifyPlugin) {
                            if (state.classificationMode) {
                                classifyPlugin.classificationMode = state.classificationMode;
                                var modeSelect = classifyPlugin.element.find('.classification-mode');
                                modeSelect.val(state.classificationMode);
                            }
                            if (state.colors) {
                                classifyPlugin.currentColorSet = state.colors.set;
                                classifyPlugin.colorsetIndex = state.colors.index;
                                classifyPlugin.colorsFlipped = state.colors.flipped;
                            }
                            if(state.methodId != null && state.methodId > 0) {
                                var select = classifyPlugin.element.find('.classificationMethod').find('.method');
                                select.val(state.methodId);
                                // The manual breaks method:
                                if(state.methodId == 4 && state.manualBreaksInput) {
                                    var manualInput = classifyPlugin.element.find('.manualBreaks').find('input[name=breaksInput]');
                                    manualInput.val(state.manualBreaksInput);
                                    classifyPlugin.element.find('.classCount').hide();
                                    classifyPlugin.element.find('.manualBreaks').show();
                                }
                            }
                            if(state.numberOfClasses != null && state.numberOfClasses > 0) {
                                var slider = classifyPlugin.rangeSlider;
                                if(slider != null) {
                                    slider.slider("value", state.numberOfClasses);
                                    slider.parent().find('input#amount_class').val(state.numberOfClasses);
                                }
                            }
                        }

                        if(state.municipalities) {
                            me._showSelectedAreas(state.municipalities);
                        }

                        // current column is needed for rendering map
                        // sendstats
                        var column = me._getColumnById(state.currentColumn);
                        me.sendStatsData(column);
                        me.grid.setSortColumn(state.currentColumn,true);   
                    }
                });
            });
        }
    },
    /**
     * Loop through first group (municipalities) and create header row for
     * @private _updateTotals
     */
    _updateTotals: function(groups) {
        if(groups){
            var columns = this.grid.getColumns();
            // loop through columns
            for (var i = 0; i < columns.length; i++) {
                var column = columns[i];

                // group totals (statistical variables) should be calculated only for the checked/selected items
                var group = groups[0];
                for (var key in groups) {
                    g = groups[key];
                    if(g.groupingKey == "checked"){
                        group = g;
                    }
                };

                var gridTotals = group.totals;
                var sub = jQuery(this.templates.subHeader);

                var variableCount = 0;
                // loop through statistical variables
                for (var j = 0; j < this.conf.statistics.length; j++) {
                    var statistic = this.conf.statistics[j];
                    if(statistic.visible){
                        sub.append(this._getStatistic(gridTotals, column.id, statistic.id));
                        variableCount++;
                    }
                };

                var columnDiv = jQuery(this.grid.getHeaderRowColumn(column.id)).empty();

                var opts = this.grid.getOptions();
                // TODO: 12 = font-size, 7 = padding...
                var fontSize = columnDiv.css('line-height');
                fontSize = (fontSize) ? fontSize.split('px')[0] : 12;
                opts.headerRowHeight = variableCount * fontSize + 7;
                this.grid.setOptions(opts);

                sub.appendTo(columnDiv);

            };
        }
    },
    /**
     * A method to get statistical variables 
     * @private _getStatistic
     */
    _getStatistic: function(gridTotals, columnId, type) {
        var value = {};
        var totalsItem = null;
        var result = gridTotals[type];
        //loop through different indicator columns
        for(indicatorId in result) {
            if(!value[indicatorId]) {
                value[indicatorId] = {};
            }
            if(indicatorId.indexOf('indicator') >= 0 && indicatorId == columnId) {
                value[indicatorId][type] = result[indicatorId];
                var totalsItem = jQuery(this.templates.statsgridTotalsVar);
                var val = value[columnId][type];
                if(!this._isInt(val)) val = val.toFixed(2);
                totalsItem.addClass('statsgrid-'+type).text(val);
                break;

            } else if(columnId == 'municipality') {
                var totalsItem = jQuery(this.templates.statsgridTotalsVar);
                totalsItem.addClass('statsgrid-totals-label').text(this._locale['statistic'][type])
                break;
            }
        }
        return totalsItem;
    },
    /**
     * A method to check if int is int instead of float
     * @private _isInt 
     */
    _isInt: function(n) {
        return n % 1 === 0;
    },

    /**
     * A method to initialize header plugin
     * @private _initHeaderPlugin
     */
    _initHeaderPlugin: function(columns, grid) {
        var me = this;
        // lets create an empty container for menu items
        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            if(column.id == 'municipality') {
                column.header = {
                  menu: {
                    items: []
                  }
                };
            }
        };

        // new header menu plugin
        var headerMenuPlugin = new Slick.Plugins.HeaderMenu2({});
        // lets create a menu when user clicks the button.
        headerMenuPlugin.onBeforeMenuShow.subscribe(function(e, args) {
            var menu = args.menu;
            if(args.column.id == 'municipality') {
                menu.items = [];
                for (var i = 0; i < me.conf.statistics.length; i++) {
                    var statistic = me.conf.statistics[i];
                    var elems = jQuery(me.templates.gridHeaderMenu).addClass('statsgrid-show-total-selects');

                    // create input element with localization
                    var input = elems.find('input').attr({'id': 'statistics_'+statistic.id});
                    // if variable is visible => check the checkbox
                    if(statistic.visible) input.attr({'checked':'checked'});
                    // create label with localization
                    elems.find('label').attr('for','statistics_'+statistic.id).text(me._locale['statistic'][statistic.id]);
                    // add item to menu
                    menu.items.push({
                        element : elems,
                        command: statistic.id
                    });
                };

                // check if select rows checkbox should be checked
                // we need to do something with current state of MVC which is non-existent
                var columns = args.grid.getColumns();
                var selectRowsChecked = false;
                for (var i = 0; i < columns.length; i++) {
                    var column = columns[i];
                    if(column.field == "sel") {
                        selectRowsChecked = true;
                    }
                }
                // create checkbox for selecting rows toggle
                var showRows = jQuery(me.templates.gridHeaderMenu).addClass('statsgrid-show-row-selects');
                // create input element with localization
                var input = showRows.find('input').attr({'id': 'statsgrid-show-row-selects'});
                if(selectRowsChecked) {
                    input.attr('checked', 'checked');
                }
                // create label with localization
                showRows.find('label').attr('for', 'statsgrid-show-row-selects').text(me._locale['selectRows']);
                menu.items.push({
                    element : showRows,
                    command: 'selectRows'
                });                
            }

        });
        // when command is given shos statistical variable as a new "row" in subheader
        headerMenuPlugin.onCommand.subscribe(function(e, args) {
            if(args.command == 'selectRows') {
                var columns = args.grid.getColumns();
                var newColumns = [];
                var shouldAddSel = true;
                for (var i = 0; i < columns.length; i++) {
                    var column = columns[i];
                    if(column.field != "sel") {
                        newColumns.push(column);
                    }
                    if(column.field == "sel" && !jQuery(e.target).is(":checked")) {
                        shouldAddSel = false;
                    }
                }
                if (shouldAddSel) {
                    newColumns.unshift(me.checkboxSelector.getColumnDefinition());
                }

                args.grid.setColumns(newColumns);

            } else if(args.command == 'filter') {
                me._createFilterPopup(args.column, this);
            } else if (args.command == 'filterByRegion') {
                me._createFilterByRegionPopup(args.column, this);
            } else {

                for (var i = 0; i < me.conf.statistics.length; i++) {
                    var statistic = me.conf.statistics[i]
                    if(statistic.id == args.command) {
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
        grid.registerPlugin(headerMenuPlugin);
    },
    /**
     * Creates filter popup
     * @private _createFilterPopup
     */
    _createFilterPopup : function(column, headerMenuPlugin) {
        var me = this;
        var popup = jQuery(me.templates.filterPopup);
        popup.find('.filter-desc').text(me._locale['indicatorFilterDesc']);

        //labels for condition
        var labels = jQuery(me.templates.filterRow);
        labels.find('.filter-label').text(me._locale['filterIndicator']);
        labels.find('.filter-value').text(column.name);
        popup.find('.filter-container').append(labels);

        // condition (dropdown list of different types of filters + value)
        var condition   = jQuery(me.templates.filterRow);
        condition.find('.filter-label').text(me._locale['filterCondition']);
        var selectCont  = jQuery(me.templates.filterSelect);
        var select      = selectCont.find('.filter-select');
        select.append(jQuery(me.templates.filterOption).val('')
            .text(me._locale['filterSelectCondition']));
        select.append(jQuery(me.templates.filterOption).val('>')
            .text(me._locale['filterGT']));
        select.append(jQuery(me.templates.filterOption).val('>=')
            .text(me._locale['filterGTOE']));
        select.append(jQuery(me.templates.filterOption).val('=')
            .text(me._locale['filterE']));
        select.append(jQuery(me.templates.filterOption).val('<=')
            .text(me._locale['filterLTOE']));
        select.append(jQuery(me.templates.filterOption).val('<')
            .text(me._locale['filterLT']));
        select.append(jQuery(me.templates.filterOption).val('...')
            .text(me._locale['filterBetween']));
        condition.find('.filter-value').append(selectCont);

        // changing condition should show more input options
        select.change(function(e) {
            var element = jQuery(e.target);
            var selected = element.val();
            var filterValue = element.parents('.filter-value');
            if(selected == '...') {
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
        cancelBtn.setTitle(me._locale['buttons'].cancel);
        cancelBtn.setHandler(function() {
            popup.off();
            headerMenuPlugin.hide();
            dialog.close(true);
        });

        // filter
        var filterBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        filterBtn.setTitle(me._locale['buttons'].filter);
        filterBtn.addClass('primary');
        filterBtn.setHandler(function(e) {
            var inputArray = [];
            var divmanazerpopup = jQuery(e.target)
                .parents('.divmanazerpopup');

            var input1 = divmanazerpopup.find('.filter-input1');
            inputArray.push(input1.val());

            if(select.val() == '...') {
                var input2 = divmanazerpopup.find('.filter-input2');
                inputArray.push(input2.val());
            }

            me.filterColumn(column, select.val(), inputArray);

            popup.off();
            headerMenuPlugin.hide();
            dialog.close(true);
        });

        // show the dialog
        dialog.show(me._locale['filterTitle'], popup, [cancelBtn, filterBtn]);
        // keydown
        popup.on('keydown', function(e) {
            e.stopPropagation();
        });

    },

    /**
     * Creates a popup to filter municipalities according to region groups.
     * 
     * @method _createFilterByRegionPopup
     * @param  {Object} column
     * @param  {Object} headerMenuPlugin
     * @return {undefined}
     */
    _createFilterByRegionPopup: function(column, headerMenuPlugin) {
        var me = this,
            dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            dialogTitle = me._locale['filterTitle'],
            cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
            cancelLoc = me._locale['buttons'].cancel,
            filterBtn = Oskari.clazz.create('Oskari.userinterface.component.Button'),
            filterLoc = me._locale['buttons'].filter,
            content = jQuery(me.templates.filterByRegion).clone(),
            regionCatCont = jQuery(me.templates.filterRow).clone(),
            regionCat = jQuery(me.templates.regionCatSelect).clone(),
            labelsCont = jQuery(me.templates.filterRow).clone(),
            regionIds, key, regionCatOption, regionCatLoc;

        cancelBtn.setTitle(cancelLoc);
        cancelBtn.setHandler(function() {
            content.off();
            headerMenuPlugin.hide();
            dialog.close(true);
        });

        filterBtn.setTitle(filterLoc);
        filterBtn.addClass('primary');
        filterBtn.setHandler(function(e) {
            regionIds = content.find('div.filter-region-select select').val();
            me.filterColumnByRegion(column, regionIds);

            content.off();
            headerMenuPlugin.hide();
            dialog.close(true);
        });

        // Description text
        content.find('.filter-desc').text(me._locale['indicatorFilterDesc']);

        // Show the column name
        labelsCont.find('.filter-label').text(me._locale['filterIndicator']);
        labelsCont.find('.filter-value').text(column.name);
        content.find('.filter-container').append(labelsCont);

        // Show the region category select
        // Create an empty option first
        regionCatOption = jQuery(me.templates.filterOption).clone();
        regionCatLoc = me._locale.regionCatPlaceholder;
        regionCatOption.val('').text(regionCatLoc);
        regionCat.find('select').append(regionCatOption);

        for (key in me.regionCategories) {
            regionCatOption = jQuery(me.templates.filterOption).clone();
            regionCatLoc = me._locale.regionCategories[key];
            regionCatOption.val(key).text(regionCatLoc);
            regionCat.find('select').append(regionCatOption);
        }
        regionCatCont.find('.filter-label').text(me._locale['selectRegionCategory']);
        regionCatCont.find('.filter-value').append(regionCat);
        content.find('.filter-container').append(regionCatCont);
        regionCat.change(function(e) {
            me._createFilterByRegionSelect(content, e.target.value);
        });

        dialog.show(dialogTitle, content, [cancelBtn, filterBtn]);
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
    _createFilterByRegionSelect: function(container, regionCategory) {
        container.find('.filter-region-container').remove();

        if (!regionCategory) return null;

        var regionCont = jQuery(this.templates.filterRow).clone(),
            regionSelect = jQuery(this.templates.regionSelect).clone(),
            regions = this.regionCategories[regionCategory],
            rLen = regions.length,
            regionOption, region, i;

        regionCont.addClass('filter-region-container');

        for (i = 0; i < rLen; ++i) {
            region = regions[i];
            regionOption = jQuery(this.templates.filterOption).clone();
            regionOption.val(region.id).text(region.title);
            regionSelect.find('select').append(regionOption);
        }

        regionCont.find('.filter-label').text(this._locale['selectRegion']);
        regionCont.find('.filter-value').append(regionSelect);
        container.find('.filter-container').append(regionCont);
        container.find('div.filter-region-select select').chosen({
            width: '90%',
            no_results_text : this._locale['noRegionFound'],
            placeholder_text : this._locale['chosenRegionText']
        });
    },

    /**
     * Filters municipalities according to method and constraints (i.e. inputArray)
     * @param column Apply this filter to column
     * @method of filtering
     * @inputArray constraints
     */
    filterColumn : function(column, method, inputArray) {
        var data = this.grid.getData(); 
        var items = data.getItems();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            
            if(item.sel == 'checked'){
                if (item[column.id] == null) {
                    item.sel = 'empty'
                } else { 

                    switch(method) {
                        case '>':
                            if(!(item[column.id] > inputArray[0])) {
                                item.sel = 'empty';
                            }
                            break;
                        case '>=':
                            if(!(item[column.id] >= inputArray[0])) {
                                item.sel = 'empty';
                            }
                            break;
                        case '=':
                           if(!(item[column.id] == inputArray[0])) {
                                item.sel = 'empty';
                            }
                            break;
                        case '<=':
                           if(!(item[column.id] <= inputArray[0])) {
                                item.sel = 'empty';
                            }
                            break;
                        case '<':
                           if(!(item[column.id] < inputArray[0])) {
                                item.sel = 'empty';
                            }
                            break;
                        case '...':
                           if(!(inputArray[0] < item[column.id] && item[column.id] < inputArray[1])) {
                                item.sel = 'empty';
                            }
                            break;
                    }
                }
                data.updateItem(item.id, item);
            }

        };
        this.dataView.refresh();
        data.collapseGroup('empty');
        // sendstats ...update map
        this.sendStatsData(column);

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
    filterColumnByRegion: function(column, regionIds) {
        if (!regionIds || regionIds.length === 0) return;

        var data = this.grid.getData(); 
        var items = data.getItems();

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            
            if(item.sel == 'checked'){
                if (item[column.id] == null) {
                    item.sel = 'empty'
                } else {
                    if (!this._itemBelongsToAnyRegions(item, regionIds)) {
                        item.sel = 'empty';
                    }
                }
                data.updateItem(item.id, item);
            }

        };
        this.dataView.refresh();
        data.collapseGroup('empty');
        // sendstats ...update map
        this.sendStatsData(column);
    },

    /**
     * Returns true if the item belongs to any of the regions, false otherwise.
     * 
     * @method _itemBelongsToAnyRegions
     * @param  {Object} item
     * @param  {Array} regionIds
     * @return {Boolean}
     */
    _itemBelongsToAnyRegions: function(item, regionIds) {
        for (var i = 0; i < regionIds.length; ++i) {
            var regionId = Number(regionIds[i]);
            if (item.memberOf.indexOf(regionId) > -1) return true;
        }
        return false;
    },

    /**
     * Simple objectArray to csv 
     * http://stackoverflow.com/questions/4130849/convert-json-format-to-csv-format-for-ms-excel
     * 
     */
    downloadJSON2CSV : function(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

        var str = '';

        for (var i = 0; i < array.length; i++) {
            var line = '';

            for (var index in array[i]) {
                line += array[i][index] + ',';
            }

            // Here is an example where you would wrap the values in double quotes
            // for (var index in array[i]) {
            //    line += '"' + array[i][index] + '",';
            // }

            line.slice(0,line.Length-1); 

            str += line + '\r\n';
        }
        window.open( "data:text/csv;charset=utf-8," + escape(str))
    },

    /**
     * Highlights a municipality given by the event and scrolls to it in the grid
     *
     * @method _featureHighlightedEvent
     * @private
     * @param {Oskari.mapframework.bundle.mapstats.event.FeatureHighlightedEvent} event
     */
    _featureHighlightedEvent: function(event) {
        var featureAtts = event.getFeature().attributes,
            isHighlighted = event.isHighlighted(),
            idx = this.getIdxByCode(featureAtts.kuntakoodi),
            cssKey = 'highlight-row-' + featureAtts.kuntakoodi,
            cssHash = {};
        // if we have grid and idx => remembe selected area
        if(this.grid && idx) {
            // if we there are no checked areas => do nothing
            if(this.getItemsByGroupingKey('checked').length > 0) {
                this.selectedMunicipalities[featureAtts.kuntakoodi] = isHighlighted;

                if (isHighlighted) {
                    //if a row is found => hilight it
                    if(idx != -1) {
                        this.grid.scrollRowToTop(idx);
                        cssHash[idx] = {'municipality': 'statsgrid-highlight-row'};
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
     * Highlights a municipality given by the event and shows only hilighted municipalities in the grid
     *
     * @method _featureSelectedEvent
     * @private
     * @param {Oskari.mapframework.bundle.mapstats.event.FeatureHighlightedEvent} event
     */
    _featureSelectedEvent: function(event) {
        var featureAtts = event.getFeature().attributes,
            isHighlighted = event.isHighlighted(),
            item = this.getItemByCode(featureAtts.kuntakoodi);

        if (this.grid && item) {
            //if area is hilighted => remember it and change grid item to 'checked' state
            this.selectedMunicipalities[featureAtts.kuntakoodi] = isHighlighted;
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

    /**
     * Get items by GroupingKey
     *
     * @method getItemsByGroupingKey
     * @param grouping key (e.g. 'checked', 'empty')
     */
    getItemsByGroupingKey : function(sel) {
        var items = this.grid.getData().getItems();
        var itemsByGrouping = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if(item.sel === sel) {
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
    _showSelectedAreas : function(idArray) {
        var data = this.grid.getData();
        var items = data.getItems();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.sel = 'empty';
            for (var j = 0; j < idArray.length; j++) {
                var id = idArray[j];
                if(item.id == id) {
                    item.sel = 'checked';
                }

            }
            data.updateItem(item.id, item);
        };
/*
        for (var i = 0; i < idArray.length; i++) {
            var id = idArray[i];
            var item = data.getItemById(id);
            item.sel = 'checked';
            data.updateItem(id, item);
        };
*/
        data.collapseGroup('empty');
        data.refresh();
    },

    /**
     * Unselect all areas
     *
     * @method unselectAllAreas
     * @param leave hilighted areas to be selected in the grid
     */
    unselectAllAreas : function(leaveHilighted) {
        var _grid = this.grid;
        var _data = _grid.getData();
        var items = _grid.getData().getItems();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if(leaveHilighted && this.selectedMunicipalities[item.code]){
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
    _getColumnById : function(columnId){
        // sendstats
        var columns = this.grid.getColumns();
        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            if(column.id === columnId) {
                return column;
            }
        };
        return null;
    },

    /**
     * Sends an event with HTML for tooltips as data.
     *
     * @method sendTooltipData
     * @param {OpenLayers.Feature} feature
     */
    sendTooltipData: function(feature) {
        var featAtts = feature.attributes;
        var eventBuilder = this._sandbox.getEventBuilder('MapStats.HoverTooltipContentEvent');
        var currColumn = this._state.currentColumn;
        var item = this.getItemByCode(featAtts.kuntakoodi);
        var content = '<p>' + item.municipality;
        content += ((currColumn && item[currColumn] != null) ? '<br />' + item[currColumn] : ''); 
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
    toggleSelectMunicipalitiesMode : function() {
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
    addIndicatorMeta: function(indicator) {
        // push the indicator title and organization to the meta data hash
        var me = this,
            lang = Oskari.getLang(),
            indiMeta = me.indicatorsMeta[indicator.id];

        if (indiMeta) {
            indiMeta.count += 1
        } else {
            me.indicatorsMeta[indicator.id] = {
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
    removeIndicatorMeta: function(indicatorId) {
        var indiMeta = this.indicatorsMeta[indicatorId];
        if (indiMeta) {
            indiMeta.count -= 1;
            if (indiMeta.count === 0) {
                delete this.indicatorsMeta[indicatorId];
            }
        }
    }

}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
