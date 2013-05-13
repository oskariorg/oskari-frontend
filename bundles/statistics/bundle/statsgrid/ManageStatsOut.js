/**
 * ManageStatsOut
 * Creates the indicator selection ui and the actual grid where the stats data will be displayed.
 * Handles sending the data out to create a visualization which then can be displayed on the map.
 */
Oskari.clazz.category('Oskari.statistics.bundle.statsgrid.StatsView', 'municipality-table', {
    /**
     * @method createStatsOut
     * Get Sotka data and show it in SlickGrid
     * @param {Object} container to where slick grid and pull downs will be appended
     * @param {Function} callback function which gets called after the content has finished loading
     */
    createStatsOut : function(container, callback) {
        // indicators (meta data)
        this.indicators = [];
        // indicator params are select-elements
        // (indicator drop down select and year & gender selects)
        this.prepareIndicatorParams(container, callback);

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
     * @param container element where indicator-selector should be added
     * @param {Function} callback function which gets called after the content has finished loading
     */
    prepareIndicatorParams : function(container, callback) {

        //clear the selectors container
        container.find('selectors-container').remove();
        //add selectors
        var selectors = jQuery('<div class="selectors-container"></div>');
        container.append(selectors);

        // Indicators
        // success -> createIndicators
        this.getSotkaIndicators(container);
        // Regions: success createMunicipalityGrid
        this.getSotkaRegionData(container, callback);
    },
    /**
     * Fetch region data - we need to know all the regions / municipalities
     * @method getSotkaRegionData
     * @param container element where indicator-selector should be added
     * @param {Function} callback function which gets called after the content has finished loading
     */
    getSotkaRegionData : function(container, callback) {
        var me = this;
        // call ajax function (params: url, successFallback, errorCallback)
        me.instance.statsService.fetchStatsData(me.instance.getSandbox().getAjaxUrl() + 'action_route=GetSotkaData&action=regions&version=1.1',
        // success callback
        function(regionData) {
            if (regionData) {
                // get the actual data
                //me.createMunicipalitySlickGrid(container, indicator, genders, years, indicatorMeta, regionData);
                me.createMunicipalitySlickGrid(container, regionData);

                // Data loaded and grid created, now it's time to call the function provided, if any.
                callback && callback();
            } else {
                me.instance.showMessage(me.instance.getLocalization('sotka').errorTitle, me.instance.getLocalization('sotka').regionDataError);
            }
        },
        // error callback
        function(jqXHR, textStatus) {
            me.instance.showMessage(me.instance.getLocalization('sotka').errorTitle, me.instance.getLocalization('sotka').regionDataXHRError);
        });
    },

    /**
     * Create initial grid using just one column: municipality
     * @method createMunicipalitySlickGrid
     * @param container element where indicator-selector should be added
     */
    createMunicipalitySlickGrid : function(container, regiondata) {
        var me = this;
        var grid;
        var gridContainer = jQuery('<div id="municipalGrid" class="municipal-grid"></div>');
        // clear and append municipal-grid container
        container.find('.municipal-grid').remove();
        container.append(gridContainer);
        // add one column
        var columns = [{
            id : "municipality",
            name : this.instance.getLocalization("sotka").municipality,
            field : "municipality",
            sortable : true
        }, {
            id : "code",
            name : this.instance.getLocalization("sotka").code,
            field : "code"
        }];

        // options
        var options = {
            enableCellNavigation : true,
            enableColumnReorder : true,
            multiColumnSort : true
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
                    municipality : indicData.title[Oskari.getLang()]
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
        // Grid
        grid = new Slick.Grid(gridContainer, dataView, columns, options);

        var sortcol = "json_number";
        var sortdir = 1;
        // when user sorts this grid according to selected column
        // we need to provide sort-function
        grid.onSort.subscribe(function(e, args) {
            var cols = args.sortCols;

            dataView.sort(function(dataRow1, dataRow2) {
                for (var i = 0, l = cols.length; i < l; i++) {
                    var field = cols[i].sortCol.field;
                    var sign = cols[i].sortAsc ? 1 : -1;
                    var value1 = dataRow1[field], value2 = dataRow2[field];
                    if(isNaN(Number(value1))) {
                        return 1;
                    }
                    if(isNaN(Number(value2))) {
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
            me.sendStatsData(args.column);
        });

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
        this.grid = grid;
        this.dataView = dataView;

        //window resize!
        var resizeGridTimer;
        jQuery(window).resize(function () {
            clearTimeout(resizeGridTimer);
            resizeGridTimer = setTimeout(function() {
                var gridDiv = jQuery("#municipalGrid");
                gridDiv.height(gridDiv.parent().height() - gridDiv.parent().find('.selectors-container').outerHeight());
                grid.resizeCanvas();                    
            }, 100);
        });
    },

    /**
     * Fetch all Sotka indicators
     *
     * @method getSotkaIndicators
     * @param container element
     */
    getSotkaIndicators : function(container) {
        var me = this;
        var sandbox = me.instance.getSandbox();
        // make the AJAX call
        me.instance.statsService.fetchStatsData(sandbox.getAjaxUrl() + 'action_route=GetSotkaData&action=indicators&version=1.1',
        //success callback
        function(indicatorsdata) {
            if (indicatorsdata) {
                //if fetch returned something we create drop down selector
                me.createIndicatorsSelect(container, indicatorsdata);
            } else {
                me.instance.showMessage(me.instance.getLocalization('sotka').errorTitle, me.instance.getLocalization('sotka').indicatorsDataError);
            }
        },
        // error callback
        function(jqXHR, textStatus) {
            me.instance.showMessage(me.instance.getLocalization('sotka').errorTitle, me.instance.getLocalization('sotka').indicatorsDataXHRError);
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
        var indi = jQuery('<div class="indicator-cont"><div class="indisel selector-cont"><label for="indi">' + this.instance.getLocalization('indicators') + '</label><select id="indi" name="indi" class="indi"><option value="" selected="selected"></option></select></div></div>');

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
            me.getSotkaIndicatorMeta(container, indicator);
        });

        container.find('.selectors-container').append(indi);
        // if we want to select some special indicator..
        //sel.find('option[value="127"]').prop('selected', true);

        // we use chosen to create autocomplete version of indicator select element.
        sel.chosen({
            no_results_text : this.instance.getLocalization('noMatch'),
            placeholder_text : this.instance.getLocalization('noMatch')
        });

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
        var sandbox = me.instance.getSandbox();
        // fetch meta data for given indicator
        me.instance.statsService.fetchStatsData(sandbox.getAjaxUrl() + 'action_route=GetSotkaData&action=indicator_metadata&indicator=' + indicator + '&version=1.1',
        // success callback
        function(indicatorMeta) {
            if (indicatorMeta) {
                //if fetch returned something we create drop down selector
                me.createIndicatorInfoButton(container, indicatorMeta);
                me.createDemographicsSelects(container, indicatorMeta);
            } else {
                me.instance.showMessage(me.instance.getLocalization('sotka').errorTitle, me.instance.getLocalization('sotka').indicatorMetaError);
            }
        },
        // error callback
        function(jqXHR, textStatus) {
            me.instance.showMessage(me.instance.getLocalization('sotka').errorTitle, me.instance.getLocalization('sotka').indicatorMetaXHRError);
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
            var desc = '<h4 class="indicator-msg-popup">' + me.instance.getLocalization('sotka').descriptionTitle + '</h4><p>' + indicator.description[lang] + '</p><br/><h4 class="indicator-msg-popup">' + me.instance.getLocalization('sotka').sourceTitle + '</h4><p>' + indicator.organization.title[lang] + '</p>';
            me.instance.showMessage(indicator.title[lang], desc);
        });
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

        var fetchButton = jQuery('<button class="fetch-data' + (includedInGrid ? ' hidden' : '') + '">' + this.instance.getLocalization('addColumn') + '</button>');
        var removeButton = jQuery('<button class="remove-data' + (includedInGrid ? '' : ' hidden') + '">' + this.instance.getLocalization('removeColumn') + '</button>');

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

    /**
     * Update Demographics buttons
     *
     * @method updateDemographicsSelects
     * @param container parent element
     * @param indicator meta data
     */
    updateDemographicsButtons : function(indicator, gender, year) {
        indicator = indicator ? indicator : jQuery('.statsgrid').find('.indisel ').find('option:selected').val();
        gender = gender ? gender : jQuery('.statsgrid').find('.gendersel').find('.gender').val();
        gender = gender != null ? gender: 'total';
        year = year ? year : jQuery('.statsgrid').find('.yearsel').find('.year').val();

        var columnId = "indicator" + indicator + year + gender,
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
     * @param indicator id
     * @param gender (male / female / total)
     * @param year selected year
     */
    getSotkaIndicatorData : function(container, indicator, gender, year) {
        var me = this;
        var gndrs = gender != null ? gender : 'total';
        // ajax call
        me.instance.statsService.fetchStatsData(
            // url
            me.instance.getSandbox().getAjaxUrl() + 'action_route=GetSotkaData&action=data&version=1.0&indicator=' + indicator + '&years=' + year + '&genders=' + gndrs,
            // success callback
            function(data) {
                if (data) {
                    // get the actual data
                    me.addIndicatorDataToGrid(container, indicator, gndrs, year, data, me.indicators[me.indicators.length -1]);
                } else {
                    me.instance.showMessage(me.instance.getLocalization('sotka').errorTitle, me.instance.getLocalization('sotka').indicatorDataError);
                }
            },
            // error callback
            function(jqXHR, textStatus) {
                me.instance.showMessage(me.instance.getLocalization('sotka').errorTitle, me.instance.getLocalization('sotka').indicatorDataXHRError);
            });
    },

    /**
     * Get indicator column id.
     *
     * @method _getIndicatorColumnId
     * @param indicator id
     * @param gender (male/female/total)
     * @param year selected year
     * @return columnId unique column id
     */
    _getIndicatorColumnId : function(indicator, gender, year) {
        var columnId = "indicator" + indicator + year + gender;
        return columnId;
    },

    /**
     * Add indicator data to the grid.
     *
     * @method addIndicatorDataToGrid
     * @param container parent element
     * @param indicator id
     * @param gender (male/female/total)
     * @param year selected year
     * @param data related to the indicator
     */
    addIndicatorDataToGrid : function(container, indicator, gender, year, data, meta, silent) {
        var columnId = this._getIndicatorColumnId(indicator, gender, year);        
        var columns = this.grid.getColumns();
        var indicatorName = meta.title[Oskari.getLang()];
        columns.push({
            id : columnId,
            name : indicatorName + '/' + year + '/' + gender,
            field : columnId,
            toolTip : indicatorName + '/' + year + '/' + gender,
            sortable : true
        });
        this.grid.setColumns(columns);

        // add indicator also to the state!
        if (this.instance.state.indicators == null) {
            this.instance.state.indicators = [];
        }
        this.instance.state.indicators.push({indicator: indicator, year: year, gender: gender});

        var columnData = [];
        var ii = 0;
        this.dataView.beginUpdate();

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
                var item = this.dataView.getItemById(regionId);
                if (item) {
                    // update row
                    item[columnId] = Number(value);
                    this.dataView.updateItem(item.id, item);
                }
                ii++;
            }
        }
        var items = this.dataView.getItems();
        for (var i = items.length - 1; i >= 0; i--) {
            var item = items[i];
            if (item[columnId] == null) {
                item[columnId] = NaN;
            }
        };
        this.dataView.endUpdate();
        this.dataView.refresh();
        this.grid.invalidateAllRows();
        this.grid.render();

        if(silent != true) {
            // Show classification
            this.sendStatsData(columns[columns.length - 1]);
        }

        this.updateDemographicsButtons(indicator, gender, year);
    },

    /**
     * Remove indicator data to the grid.
     *
     * @method removeIndicatorDataFromGrid
     * @param indicator id
     * @param gender (male / female / total)
     * @param year selected year
     */
    removeIndicatorDataFromGrid : function(indicator, gender, year) {
        var columnId = this._getIndicatorColumnId(indicator, gender, year),
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
        if (this.instance.state.indicators) {
            for (i = 0, ilen = this.instance.state.indicators.length; i < ilen; i++) {
                var statedIndicator = this.instance.state.indicators[i];
                if ((indicator === statedIndicator.indicator) &&
                    (year === statedIndicator.year) &&
                    (gender === statedIndicator.gender)) {
                    this.instance.state.indicators.splice(i, 1);
                    break;
                }
            }
        }

        this.updateDemographicsButtons(indicator, gender, year);

        if (columnId === this.instance.state.currentColumn) {
            // hide the layer, as we just removed the "selected"
            this._setLayerVisibility(false);
            this.instance.state.currentColumn = null;
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
        var year = jQuery('<div class="yearsel selector-cont"><label for="year">' + this.instance.getLocalization('year') + '</label><select name="year" class="year"></select></div>');
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
        var gender = jQuery('<div class="gendersel selector-cont"><label for="gender">' + this.instance.getLocalization('gender') + '</label><select name="gender" class="gender"></select></div>');

        var sel = gender.find('select');
        for (var i = 0; i < values.length; i++) {
            var opt = jQuery('<option value="' + values[i] + '">' + this.instance.getLocalization('genders')[values[i]] + '</option>');
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

        //Classify data
        var me = this;
        var statArray = [];
        var munArray = [];
        var check = false;
        var i, k;

        if (curCol == null) {
        	// Not a valid current column
        	return;
        }

        //Check that selected column is data value column
        if (curCol.field == 'municipality')
            return;

		//Check that selected column is not already selected
		if (curCol.id === me.instance.state.currentColumn) {
			return;
		} else {
	        // Set current column to be stated
	        me.instance.state.currentColumn = curCol.id;
		}

        // Get values of selected column
        var data = this.dataView.getItems();
        for ( i = 0; i < data.length; i++) {
            var row = data[i];
            // Exclude null values
            if (!isNaN(row[curCol.field])) {
                statArray.push(row[curCol.field]);
                // Municipality codes (kuntakoodit)
                munArray.push(row['code']);
            }
        }

        // send the data trough the stats service.
        me.instance.statsService.sendStatsData(me._layer, {
            CUR_COL : curCol,
            VIS_NAME : me._layer.getWmsName(), //"ows:kunnat2013",  
            VIS_ATTR : me._layer.getFilterPropertyName(), //"kuntakoodi",
            VIS_CODES : munArray,
            COL_VALUES : statArray
        });

        // show the layer, if it happens to be invisible
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
            var sandbox = this.instance.getSandbox();
            var visibilityRequestBuilder = sandbox.getRequestBuilder('MapModulePlugin.MapLayerVisibilityRequest');
            if (visibilityRequestBuilder) {
                var request = visibilityRequestBuilder(this._layer.getId(), visibility);
                sandbox.request(this.instance, request);
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
    getSotkaIndicatorsMeta : function(indicators, callback) {
        var me = this, container = this.getEl(), fetchedIndicators = 0;
        me.indicators = [];

        for (var i = 0; i < indicators.length; i++) {
            var indicatorData = indicators[i],
            indicator = indicatorData.indicator;

            // ajax call
            me.instance.statsService.fetchStatsData(
                // url
                me.instance.getSandbox().getAjaxUrl() + 'action_route=GetSotkaData&action=indicator_metadata&indicator=' + indicator + '&version=1.1',
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
                        me.instance.showMessage(me.instance.getLocalization('sotka').errorTitle, me.instance.getLocalization('sotka').indicatorDataError);
                    }
                },
                // error callback
                function(jqXHR, textStatus) {
                    me.instance.showMessage(me.instance.getLocalization('sotka').errorTitle, me.instance.getLocalization('sotka').indicatorDataXHRError);
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
    getSotkaIndicatorsData : function(indicators, callback) {
        var me = this, container = this.getEl(), fetchedIndicators = 0;

        for (var i = 0; i < indicators.length; i++) {
            var indicatorData = indicators[i],
                indicator = indicatorData.indicator,
                year = indicatorData.year,
                gender = indicatorData.gender != null ? indicatorData.gender: 'total';

            // ajax call
            me.instance.statsService.fetchStatsData(
                // url
                me.instance.getSandbox().getAjaxUrl() + 'action_route=GetSotkaData&action=data&version=1.0&indicator=' + indicator + '&years=' + year + '&genders=' + gender,
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

                                ind.data = data;
                            }
                        };
                        // when all the indicators have been fetched
                        // add them to the grid and fire callback
                        if(fetchedIndicators >= indicators.length) {
                            //TODO add these to the grid!!
                            for (var j = 0; j < indicators.length; j++) {
                                var ind = indicators[j];
                                if(ind) {
                                    me.addIndicatorDataToGrid(container, ind.indicator, ind.gender, ind.year, ind.data, me.indicators[j], true);
                                }
                            };
                            callback();
                        }
                    } else {
                        me.instance.showMessage(me.instance.getLocalization('sotka').errorTitle, me.instance.getLocalization('sotka').indicatorDataError);
                    }
                },
                // error callback
                function(jqXHR, textStatus) {
                    me.instance.showMessage(me.instance.getLocalization('sotka').errorTitle, me.instance.getLocalization('sotka').indicatorDataXHRError);
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
            if((columnId == 'id' || columnId == 'municipality' || columnId == 'code')) {
                newColumnDef[j] = columns[i];
                j++;
            }
        }
        this.grid.setColumns(newColumnDef);
        this.grid.render();
        this.dataView.refresh();
        this.instance.state.indicators = [];
    }
});
