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
        'groupingHeader'    : "<span style='color:green'></span>"
    }
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
    eventHandlers : {},

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
            var csvLink = jQuery(me.templates.csvButton);
            //container.find('selectors-container')
            selectors.append(csvLink);
            csvLink.click(function() {
                if(me.dataView){
                    var items = me.dataView.getItems();
                    me.downloadJSON2CSV(items);
                }
            });

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


        var columns = [{
            id : "municipality",
            name : this._locale['sotka'].municipality,
            field : "municipality",
            sortable : true
        }, {
            id : "code",
            name : this._locale['sotka'].code,
            field : "code"
        }];
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
            if(target.hasClass('slick-header-menubutton')) return;

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
        })

// register checboxSelector plugin
grid.registerPlugin(checkboxSelector);
// register groupItemMetadataProvider plugin (if not registered group toggles won't work)
grid.registerPlugin(groupItemMetadataProvider);
// Our new event to subscripe - this is called when checkbox is clicked
checkboxSelector.onSelectRowClicked.subscribe(function(e, args){
    var data = args.grid.getData();
    var item = data.getItem(args.row);
    //update item values (groupingkey is created from these)
    item.sel = jQuery(e.target).is(':checked') ? 'checked' : 'empty';
    data.updateItem(item.id, item);

    // collapse group empty if it is created for the first time
    groups = data.getGroups();
    if(groups.length > 1) {
        for (var i = 0; i < groups.length; i++) {
            var group = groups[i];
            if(group.groupingKey == 'empty' && group.count < 2) {
                data.collapseGroup('empty');
            }
        };
    }

    // resize grid (content/rows does not show extra rows otherwise. i.e. group headers & footers)
    args.grid.setColumns(args.grid.getColumns());
    data.refresh();

});

        me._initHeaderPlugin(columns, grid);

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

        container.find('.selectors-container').append(indi);
        // if we want to select some special indicator..
        //sel.find('option[value="127"]').prop('selected', true);

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
                me.createDemographicsSelects(container, indicatorMeta);
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
        var parameters = jQuery('<div class="parameters-cont"></div>');
        var year = null,
            gender = null;

        // if there is a range we can create year select
        if (indicator.range != null) {
            parameters.append(this.getYearSelectorHTML(indicator.range.start, indicator.range.end));
            // by default the last value is selected in getYearSelectorHTML
            year = indicator.range.end;
        }
        // if there is a classification.sex we can create gender select
        if (indicator.classifications != null && indicator.classifications.sex != null) {
            parameters.append(this.getGenderSelectorHTML(indicator.classifications.sex.values));
            // by default the last value is selected in getGenderSelectorHTML
            gender = indicator.classifications.sex.values[indicator.classifications.sex.values.length - 1];
        }
        gender = gender != null ? gender: 'total';

        // by default the last year and gender is selected
        var columnId = me._getIndicatorColumnId(indicator.id, gender, year);
        var includedInGrid = this.isIndicatorInGrid(columnId);

        var fetchButton = jQuery('<button class="fetch-data' + (includedInGrid ? ' hidden' : '') + '">' + this._locale['addColumn'] + '</button>');
        var removeButton = jQuery('<button class="remove-data' + (includedInGrid ? '' : ' hidden') + '">' + this._locale['removeColumn'] + '</button>');

        parameters.append(fetchButton);
        parameters.append(removeButton);

        selectors.find('.parameters-cont').remove();
        selectors.append(parameters);

        // click listener
        fetchButton.click(function(e) {
            var element = jQuery(e.currentTarget);
            var year = jQuery('.statsgrid').find('.yearsel').find('.year').val();
            var gender = jQuery('.statsgrid').find('.gendersel').find('.gender').val();
            gender = gender != null ? gender: 'total';
            // me.getSotkaIndicatorData(container,indicator, gender, year);
            var columnId = me._getIndicatorColumnId(indicator.id, gender, year);
            me.getSotkaIndicatorData(container, indicator.id, gender, year);
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
        container.find('.parameters-cont').remove();
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
     */
    getSotkaIndicatorData : function(container, indicatorId, gender, year) {
        var me = this;
        var gndrs = gender != null ? gender : 'total';
        // ajax call
        me.statsService.fetchStatsData(
            // url
            me._sandbox.getAjaxUrl() + 'action_route=GetSotkaData&action=data&version=1.0&indicator=' + indicatorId + '&years=' + year + '&genders=' + gndrs,
            // success callback
            function(data) {
                if (data) {
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

        var name = indicatorName + '/' + year + '/' + gender;
        columns.push({
            id : columnId,
            name : name,
            field : columnId,
            toolTip : name,
            sortable : true,

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
//            me.grid.setColumns(me.grid.getColumns());
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
//        if (curCol == null || curCol.field == 'municipality' || curCol.field == '_checkbox_selector') {
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

        // Set current column to be stated
        me._state.currentColumn = curCol.id;

        // Get values of selected column
        var data = this.dataView.getItems();
        for ( i = 0; i < data.length; i++) {
            var row = data[i];
            // Exclude null values
            if (row[curCol.field]) {
                statArray.push(row[curCol.field]);
                // Municipality codes (kuntakoodit)
                munArray.push(row['code']);
            }
        }

        // Send the data trough the stats service.
        me.statsService.sendStatsData(me._layer, {
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
    showMessage : function(title, message) {
        // Oskari components aren't available in a published map.
        if (!this._published) {
            var loc = this._locale;
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            okBtn.setTitle(loc.buttons.ok);
            okBtn.addClass('primary');
            okBtn.setHandler(function() {
                dialog.close(true);
            });
            dialog.show(title, message, [okBtn]);
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
                        // current column is needed for rendering map
                        var columns = me.grid.getColumns();
                        for (var i = 0; i < columns.length; i++) {
                            var column = columns[i];
                            if (column.id == state.currentColumn) {
                                me.sendStatsData(column);
                                me.grid.setSortColumn(state.currentColumn,true);
                            }
                        };
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

            var columns = args.grid.getColumns();
            var selectRowsChecked = false;
            for (var i = 0; i < columns.length; i++) {
                var column = columns[i];
                if(column.field == "sel") {
                    selectRowsChecked = true;
                }
            }
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

        });
        // when command is given shos statistical variable as a new "row" in subheader
        headerMenuPlugin.onCommand.subscribe(function(e, args) {
            for (var i = 0; i < me.conf.statistics.length; i++) {
                var statistic = me.conf.statistics[i]
                if(statistic.id == args.command) {
                    statistic.visible = !statistic.visible;
                    break;
                } else if(args.command == 'selectRows') {
                    console.log('show row selector');
                    var columns = args.grid.getColumns();
                    var newColumns = [];
                    var shouldAddSell = true;
                    for (var i = 0; i < columns.length; i++) {
                        var column = columns[i];
                        if(column.field != "sel") {
                            newColumns.push(column);
                        }
                        if(column.field == "sel" && !jQuery(e.target).is(":checked")) {
                            shouldAddSell = false;
                        }
                    }
                    if (shouldAddSell) {
                        newColumns.unshift(me.checkboxSelector.getColumnDefinition());
                    }
                    args.grid.setColumns(newColumns);
                    break;
                }
            }

            //FIXME 
            //TODO we need to create grouping for statistical variables 
            // instead of using subheader!

            //reduce the number of variables
            me.dataView.refresh();
            // setColumns fires slickgrid resizing (cssrules etc.) => variables disappear
            me.grid.setColumns(me.grid.getColumns());
            // this prints variables again.
            me.dataView.refresh();
        });

        grid.registerPlugin(headerMenuPlugin);

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
    }

}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
