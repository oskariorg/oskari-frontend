Oskari.clazz.category('Oskari.statistics.bundle.statsgrid.StatsView', 'municipality-table', {
	/**
	 * @method createStatsOut
	 * @param
	 * {obj}
	 * container
	 *           to where slick grid and pull downs will be appended
	 * Get Sotka data and show it in slcik grid
	 */
	createStatsOut : function(container) {

		// indicators (meta data)
		this.indicators = [];
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
	 * @param container element where indicator-selector should be added
	 */
	prepareIndicatorParams : function(container) {

		//clear the selectors container
		container.find('selectors-container').remove();
		//add selectors
		var selectors = jQuery('<div class="selectors-container"></div>');
		container.append(selectors);

		// Indicators
		// success -> createIndicators
		this.getSotkaIndicators(container);
		// Regions: success createMunicipalityGrid
		this.getSotkaRegionData(container);
	},
	/**
	 * Fetch region data - we need to know all the regions / municipalities
	 * @method getSotkaRegionData
	 */
	getSotkaRegionData : function(container) {
		var me = this;
		// call ajax function (params: url, successFallback, errorCallback)
		me.fetchData(me.instance.getSandbox().getAjaxUrl() + 'action_route=GetSotkaData&action=regions&version=1.1',
		// success callback
		function(regionData) {
			if (regionData) {
				// get the actual data
				//me.createMunicipalitySlickGrid(container, indicator, genders, years, indicatorMeta, regionData);
				me.createMunicipalitySlickGrid(container, regionData);
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
			enableColumnReorder : false,
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

			me.classifyData(args.column);

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

	},

	/**
	 * Fetch all Sotka indicators
	 *
	 * @param container element
	 */
	getSotkaIndicators : function(container) {
		var me = this;
		var sandbox = me.instance.getSandbox();
		// make the AJAX call
		me.fetchData(sandbox.getAjaxUrl() + 'action_route=GetSotkaData&action=indicators&version=1.1',
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
		var indi = jQuery('<div class="indicator-cont"><div class="indisel selector-cont"><label for="indi">' + this.instance.getLocalization('indicators') + '</label><select id="indi" name="indi" class="indi"></select></div></div>');

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
			no_results_text : this.instance.getLocalization('noMatch')
		});

	},

	/**
	 * Get Sotka indicator meta data
	 * @method getSotkaIndicatorMeta
	 * @param container parent element.
	 * @param indicator id
	 */
	getSotkaIndicatorMeta : function(container, indicator) {
		var me = this;
		var sandbox = me.instance.getSandbox();
		// fetch meta data for given indicator
		me.fetchData(sandbox.getAjaxUrl() + 'action_route=GetSotkaData&action=indicator_metadata&indicator=' + indicator + '&version=1.1',
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
		var fetchButton = jQuery('<button class="fetch-data">' + this.instance.getLocalization('addColumn') + '</button>')

		// if there is a range we can create year select
		if (indicator.range != null) {
			parameters.append(this.getYearSelectorHTML(indicator.range.start, indicator.range.end));
		}
		// if there is a classification.sex we can create gender select
		if (indicator.classifications != null && indicator.classifications.sex != null) {
			parameters.append(this.getGenderSelectorHTML(indicator.classifications.sex.values));
		}
		parameters.append(fetchButton);

		selectors.find('.parameters-cont').remove();
		selectors.append(parameters);

		// click listener
		fetchButton.click(function(e) {
			var element = jQuery(e.currentTarget);
			var year = jQuery('.statsgrid').find('.yearsel').find('.year').val();
			var gender = jQuery('.statsgrid').find('.gendersel').find('.gender').val();
			// me.getSotkaIndicatorData(container,indicator, gender, year);
			me.getSotkaIndicatorData(container, indicator.id, gender, year)
		});

	},

	/**
	 * Get Sotka data for one indicator
	 * @method getSotkaIndicatorData
	 * @param container parent element
	 * @param indicator id
	 * @param gender (male / female / total)
	 * @param year selected year
	 */
	getSotkaIndicatorData : function(container, indicator, gender, year) {
		var me = this;
		// ajax call
		me.fetchData(
		// url
		me.instance.getSandbox().getAjaxUrl() + 'action_route=GetSotkaData&action=data&version=1.0&indicator=' + indicator + '&years=' + year + '&genders=' + gender,
		// success callback
		function(data) {
			if (data) {
				// get the actual data
				me.addIndicatorDataToGrid(container, indicator, gender, year, data);
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
	 * Add indicator data to the grid.
	 *
	 * @method addIndicatorDataToGrid
	 * @param container parent element
	 * @param indicator id
	 * @param gender (male/female/total)
	 * @param year selected year
	 * @param data related to the indicator
	 */
	addIndicatorDataToGrid : function(container, indicator, gender, year, data) {
		var columns = this.grid.getColumns();
		var indicatorName = this.indicators[this.indicators.length -1].title[Oskari.getLang()];
		columns.push({
			id : "indicator" + indicator + year + gender,
			name : indicatorName + '/' + year + '/' + gender,
			field : "indicator" + indicator + year + gender,
			sortable : true
		});
		this.grid.setColumns(columns);

		// add indicator also to the state!		
		var statedIndicators = (this.instance.state.indicators != null) ? this.instance.state.indicators : [];
		statedIndicators.push({indicator: indicator, year: year, gender: gender});
		this.instance.state.indicators = statedIndicators;

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
					item["indicator" + indicator + year + gender] = Number(value);
					this.dataView.updateItem(item.id, item);
				}
				ii++;
			}
		}
		var items = this.dataView.getItems();
		for (var i = items.length - 1; i >= 0; i--) {
			var item = items[i];
			if (item['indicator' + indicator + year + gender] == null) {
				item['indicator' + indicator + year + gender] = -1;
			}
		};
		this.dataView.endUpdate();
		this.dataView.refresh();
		this.grid.invalidateAllRows();
		this.grid.render();
		// Show classification
		this.classifyData(columns[columns.length - 1]);
	},

	/**
	 * Create HTML for year selector
	 *
	 * @param startYear
	 * @param endYear
	 */
	getYearSelectorHTML : function(startYear, endYear) {
		// Years
		var year = jQuery('<div class="yearsel selector-cont"><label for="year">' + this.instance.getLocalization('year') + '</label><select name="year" class="year"></select></div>');
		var sel = year.find('select');

		for (var i = startYear; i <= endYear; i++) {
			var opt = jQuery('<option value="' + i + '">' + i + '</option>');
			sel.append(opt);
		}

		sel.val(endYear);
		return year;
	},
	/**
	 * Create HTML for gender selector
	 *
	 * @param values for select element
	 */
	getGenderSelectorHTML : function(values) {
		//Gender
		var gender = jQuery('<div class="gendersel selector-cont"><label for="gender">' + this.instance.getLocalization('gender') + '</label><select name="gender" class="gender"></select></div>');

		var sel = gender.find('select');
		for (var i = 0; i < values.length; i++) {
			var opt = jQuery('<option value="' + values[i] + '">' + this.instance.getLocalization('genders')[values[i]] + '</option>');
			sel.append(opt);
		}
		sel.val(values[values.length - 1]);
		return gender;
	},
	/**
	 * Classify Sotka indicator data
	 *
	 * @param curCol  Selected indicator data column
	 */
	classifyData : function(curCol) {
		//Classify data
		var me = this;
		var statArray = [];
		var munArray = [];
		var check = false;
		var i, k;
		//Check that selected column is data value column
		if (curCol.field == 'municipality')
			return;

		// Set current column to be stated
		me.instance.state.currentColumn = curCol;

		// Get values of selected column
		var data = this.dataView.getItems();
		for ( i = 0; i < data.length; i++) {
			var row = data[i];
			statArray.push(row[curCol.field]);
			// Municipality codes (kuntakoodit)
			munArray.push(row['code']);
		}

		var sandbox = me.instance.getSandbox();
		var eventBuilder = sandbox.getEventBuilder('MapStats.SotkadataChangedEvent');
		if (eventBuilder) {
			var event = eventBuilder(me._layer, {
				CUR_COL : curCol,
				VIS_NAME : "ows:kunnat2013",  // TODO: how to get geoserver layer name
				VIS_ATTR : "kuntakoodi",   // TODO:  how to get geoserver layer/table column name
				VIS_CODES : munArray,
				COL_VALUES : statArray
			});
			sandbox.notifyAll(event);
		}

	},

	/**
	 * Make the AJAX call. This method helps
	 * if we need to do someting for all the calls to backend.
	 *
	 * param url to correct action route
	 * param successCb (success callback)
	 * param errorCb (error callback)
	 */
	fetchData : function(url, successCb, errorCb) {
		jQuery.ajax({
			type : "GET",
			dataType : 'json',
			beforeSend : function(x) {
				if (x && x.overrideMimeType) {
					x.overrideMimeType("application/j-son;charset=UTF-8");
				}
			},
			url : url,
			success : function(pResp) {
				if (successCb) {
					successCb(pResp);
				}
			},
			error : function(jqXHR, textStatus) {
				if (errorCb && jqXHR.status != 0) {
					errorCb(jqXHR, textStatus);
				}
			}
		});
	}
});
