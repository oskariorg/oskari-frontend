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

		// this.createTestSlickGrid(elTbl);
		// Add pulldowns for indicator request
		this.prepareIndicatorParams(container);
		//this.getSotkaIndicatorData(container,'127','total','2010');

	},
	/**
	 * @method prepareIndicatorParams
	 */
	prepareIndicatorParams : function(container) {
		
			// Years
		var year = jQuery('<li <div class="yearsel">' + '<label for="year">' + 'Vuosi' + '</label>' + '<select name="year"></select></div>' + '</li>');

		var sel = year.find('select');
		for (var i = 2000; i < 2013; i++) {
			var opt = jQuery('<option value="' + i.toString() + '">' + i.toString() + '</option>');
			sel.append(opt);
		}

		sel.change(function(e) {
			var val = sel.find('option:selected').val();

		});

		sel.val('2012');
		year.show();

		container.append(year);

		//Gender
		var gender = jQuery('<li <div class="gendersel">' + '<label for="gender">' + 'Sukupuoli' + '</label>' + '<select name="gender"></select></div>' + '</li>');

		var selg = gender.find('select');

		var opt = jQuery('<option value="' + 'total' + '">' + 'Kaikki' + '</option>');
		selg.append(opt);
		opt = jQuery('<option value="' + 'female' + '">' + 'Naiset' + '</option>');
		selg.append(opt);
		opt = jQuery('<option value="' + 'male' + '">' + 'Miehet' + '</option>');
		selg.append(opt);

		selg.val('total');
		gender.show();

		container.append(gender);

		
		// Indicators 
		
		this.getSotkaIndicators(container);

		
		
	},
	/**
	 * Create indicators pull down 
	 *
	 * @method createIndicatorsSelect
	 */
	createIndicatorsSelect : function(container, data) {
        var me=this;
		// Indicators
		var indi = jQuery('<li <div class="indisel">' + '<label for="indi">' + 'Indicaattorit' + '</label>' + '<select name="indi"></select></div>' + '</li>');

		var sel = indi.find('select');
		for (var i = 0; i < data.length; i++) {
			var indic_data = data[i];

				for (var key in indic_data) {
					if (key== "id") {
                        var valu = indic_data[key];
                        var title = indic_data["title"];
						var opt = jQuery('<option value="' + valu + '">' + title.fi + '</option>');
			            sel.append(opt);
					}

				}
			

		}
	
		sel.change(function(e) {
			var indicator = sel.find('option:selected').val();
			me.getSotkaIndicatorData(container,indicator,'total','2010');

		});

		sel.val('127');
		indi.show();

		container.append(indi);
		
	
	},
	/**
	 * @method createMunicipalitySlickGrid
	 */
	createMunicipalitySlickGrid : function(container, indicator, genders, years, jsdata, regiondata) {
		
		var grid;
		var gridContainer = jQuery('<div id="municipalGrid" style="width:30%;height:400px;"></div>');  
		container.append(gridContainer);
		var columns = [{
			id : "kunta",
			name : "Kunta",
			field : "kunta"
		}, {
			id : "indicator1",
			name : indicator.toString() + '/' + years.toString() + '/' + genders.toString(),
			field : "indicator1",
			sortable : true
		}];

		var options = {
			enableCellNavigation : true,
			enableColumnReorder : false
		};

		var data = [];
		var ii = 0;

		for (var i = 0; i < jsdata.length; i++) {
			var indic_data = jsdata[i];
			var region = "";
			var valu = "";
			for (var key in indic_data) {
				var attrName = key;
				if (attrName == "region") {
					region = indic_data[key];
					region = this.mapMunicipality(regiondata, region);
				} else if (attrName == "primary value")
					valu = indic_data[key];
					valu = valu.replace(',','.');

			}
			if (!!region) {
				data[ii] = {
					id : ii,
					kunta : region,
					indicator1 : Number(valu)

				};
				ii++;
			}
		}

		var sortcol = "indicator1";
		var sortdir = 1;

		function comparer(a, b) {
			var x = a[sortcol], y = b[sortcol];
			return (x == y ? 0 : (x > y ? 1 : -1));
		}

		var groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
		dataView = new Slick.Data.DataView({
			groupItemMetadataProvider : groupItemMetadataProvider,
			inlineFilters : true
		});
		dataView.onRowsChanged.subscribe(function(e, args) {
			grid.invalidateRows(args.rows);
			grid.render();
		});
		grid = new Slick.Grid(gridContainer, dataView, columns, options);

		var sortcol = "json_number";
		var sortdir = 1;
		grid.onSort.subscribe(function(e, args) {
			sortdir = args.sortAsc ? 1 : -1;
			sortcol = args.sortCol.field;

			// using native sort with comparer
			// preferred method but can be very slow in IE with huge datasets
			dataView.sort(comparer, args.sortAsc);
		});
		dataView.beginUpdate();
		dataView.setItems(data);
		dataView.endUpdate();
		grid.invalidate();
		grid.render();
		

	},
	/**
	 * Get Sotka data for one indicator
	 */
	getSotkaIndicatorData : function(container, indicator, genders, years) {
		var me = this;
		me.indicator = indicator;
		me.genders = genders;
		me.years = years;
		var sandbox = me.instance.getSandbox();
		jQuery.ajax({
			dataType : "json",
			type : "GET",
			//&action_route=GetSotkaData&action=data&version=1.0&indicator=127&years=2011&years=2010&genders=female
			url : sandbox.getAjaxUrl() + 'action_route=GetSotkaData&action=data&version=1.0&indicator=' + indicator + '&years=' + years + '&genders=' + genders,
			success : function(data) {
				if (data) {
					me.getSotkaRegionData(container, me.indicator, me.genders, me.years, data);
				} else {
					alert('error in getting sotka data');
				}
			},
			error : function() {
				alert('error loading sotka data');

			},
			complete : function() {

			}
		});

	},
	/**
	 *
	 */
	getSotkaRegionData : function(container, indicator, genders, years, jsdata) {
		var me = this;
		me.indicator = indicator;
		me.genders = genders;
		me.years = years;
		me.jsdata
		var sandbox = me.instance.getSandbox();
		jQuery.ajax({
			dataType : "json",
			type : "GET",
			//
			url : sandbox.getAjaxUrl() + 'action_route=GetSotkaData&action=regions&version=1.1',
			success : function(regiondata) {
				if (regiondata) {
					me.createMunicipalitySlickGrid(container, me.indicator, me.genders, me.years, jsdata, regiondata);
				} else {
					alert('error in getting sotka region data');
				}
			},
			error : function() {
				alert('error loading sotka region data');

			},
			complete : function() {

			}
		});

	},
	/**
	 *Map municipality name in Sotka region data
	 *
	 * @method mapMunicipality
	 */
	mapMunicipality : function(regiondata, regioncode) {

		for (var i = 0; i < regiondata.length; i++) {
			var indic_data = regiondata[i];
			if (indic_data["category"] == 'KUNTA') {
				for (var key in indic_data) {
					var attrName = key;
					if (attrName == "id" && regioncode == indic_data[key]) {
						var title = indic_data["title"];
						return title.fi;
					}

				}
			}

		}
		return "";
	},
	/**
	 *  //http://demo.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=GetSotkaData&action=indicators&version=1.1
	 * Get Sotka indicators
	 */
	getSotkaIndicators : function(container) {
		var me = this;
	
		var sandbox = me.instance.getSandbox();
		jQuery.ajax({
			dataType : "json",
			type : "GET",
			//
			url : sandbox.getAjaxUrl() + 'action_route=GetSotkaData&action=indicators&version=1.1',
			success : function(indicatorsdata) {
				if (indicatorsdata) {
					me.createIndicatorsSelect(me.container, indicatorsdata);
				} else {
					alert('error in getting sotka indicators');
				}
			},
			error : function() {
				alert('error loading sotka indicators');

			},
			complete : function() {

			}
		});

	},
	/**
	 * @method createComplexSlickGrid
	 * Sample Table Grid for PoC
	 */
	createComplexSlickGrid : function(elTbl) {
		var dataView;
		var grid;
		var data = [];
		var columns = [{
			id : "sel",
			name : "#",
			field : "num",
			cssClass : "cell-selection",
			width : 40,
			resizable : false,
			selectable : false,
			focusable : false
		}, {
			id : "title",
			name : "Title",
			field : "title",
			width : 120,
			minWidth : 120,
			cssClass : "cell-title",
			sortable : true,
			editor : Slick.Editors.Text
		}, {
			id : "duration",
			name : "Duration",
			field : "duration",
			sortable : true
		}, {
			id : "%",
			name : "% Complete",
			field : "percentComplete",
			width : 80,
			formatter : Slick.Formatters.PercentCompleteBar,
			sortable : true,
			groupTotalsFormatter : avgTotalsFormatter
		}, {
			id : "start",
			name : "Start",
			field : "start",
			minWidth : 60,
			sortable : true
		}, {
			id : "finish",
			name : "Finish",
			field : "finish",
			minWidth : 60,
			sortable : true
		}, {
			id : "effort-driven",
			name : "Effort Driven",
			width : 80,
			minWidth : 20,
			maxWidth : 80,
			cssClass : "cell-effort-driven",
			field : "effortDriven",
			formatter : Slick.Formatters.Checkmark,
			sortable : true
		}];

		var options = {
			enableCellNavigation : true,
			editable : true
		};

		var sortcol = "title";
		var sortdir = 1;
		var percentCompleteThreshold = 0;
		var prevPercentCompleteThreshold = 0;

		function avgTotalsFormatter(totals, columnDef) {
			return "avg: " + Math.round(totals.avg[columnDef.field]) + "%";
		}

		function myFilter(item, args) {
			return item["percentComplete"] >= args.percentComplete;
		}

		function percentCompleteSort(a, b) {
			return a["percentComplete"] - b["percentComplete"];
		}

		function comparer(a, b) {
			var x = a[sortcol], y = b[sortcol];
			return (x == y ? 0 : (x > y ? 1 : -1));
		}

		function collapseAllGroups() {
			dataView.beginUpdate();
			for (var i = 0; i < dataView.getGroups().length; i++) {
				dataView.collapseGroup(dataView.getGroups()[i].value);
			}
			dataView.endUpdate();
		}

		function expandAllGroups() {
			dataView.beginUpdate();
			for (var i = 0; i < dataView.getGroups().length; i++) {
				dataView.expandGroup(dataView.getGroups()[i].value);
			}
			dataView.endUpdate();
		}

		function clearGrouping() {
			dataView.groupBy(null);
		}

		function groupByDuration() {
			dataView.groupBy("duration", function(g) {
				return "Duration:  " + g.value + "  <span style='color:green'>(" + g.count + " items)</span>";
			}, function(a, b) {
				return a.value - b.value;
			});
			dataView.setAggregators([new Slick.Data.Aggregators.Avg("percentComplete")], false);
		}

		function groupByDurationOrderByCount() {
			dataView.groupBy("duration", function(g) {
				return "Duration:  " + g.value + "  <span style='color:green'>(" + g.count + " items)</span>";
			}, function(a, b) {
				return a.count - b.count;
			});
			dataView.setAggregators([new Slick.Data.Aggregators.Avg("percentComplete")], false);
		}

		function groupByDurationOrderByCountGroupCollapsed() {
			dataView.groupBy("duration", function(g) {
				return "Duration:  " + g.value + "  <span style='color:green'>(" + g.count + " items)</span>";
			}, function(a, b) {
				return a.count - b.count;
			});
			dataView.setAggregators([new Slick.Data.Aggregators.Avg("percentComplete")], true);
		}

		$(function() {
			// prepare the data
			for (var i = 0; i < 50000; i++) {
				var d = (data[i] = {});

				d["id"] = "id_" + i;
				d["num"] = i;
				d["title"] = "Task " + i;
				d["duration"] = Math.round(Math.random() * 14);
				d["percentComplete"] = Math.round(Math.random() * 100);
				d["start"] = "01/01/2009";
				d["finish"] = "01/05/2009";
				d["effortDriven"] = (i % 5 == 0);
			}

			var groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
			dataView = new Slick.Data.DataView({
				groupItemMetadataProvider : groupItemMetadataProvider,
				inlineFilters : true
			});
			grid = new Slick.Grid(elTbl, dataView, columns, options);

			// register the group item metadata provider to add expand/collapse group handlers
			grid.registerPlugin(groupItemMetadataProvider);
			grid.setSelectionModel(new Slick.CellSelectionModel());

			/*var pager = new Slick.Controls.Pager(dataView, grid, $("#pager"));*/
			var columnpicker = new Slick.Controls.ColumnPicker(columns, grid, options);

			grid.onSort.subscribe(function(e, args) {
				sortdir = args.sortAsc ? 1 : -1;
				sortcol = args.sortCol.field;

				if ($.browser.msie && $.browser.version <= 8) {
					// using temporary Object.prototype.toString override
					// more limited and does lexicographic sort only by default, but can be much faster

					var percentCompleteValueFn = function() {
						var val = this["percentComplete"];
						if (val < 10) {
							return "00" + val;
						} else if (val < 100) {
							return "0" + val;
						} else {
							return val;
						}
					};
					// use numeric sort of % and lexicographic for everything else
					dataView.fastSort((sortcol == "percentComplete") ? percentCompleteValueFn : sortcol, args.sortAsc);
				} else {
					// using native sort with comparer
					// preferred method but can be very slow in IE with huge datasets
					dataView.sort(comparer, args.sortAsc);
				}
			});
			// wire up model events to drive the grid
			dataView.onRowCountChanged.subscribe(function(e, args) {
				grid.updateRowCount();
				grid.render();
			});

			dataView.onRowsChanged.subscribe(function(e, args) {
				grid.invalidateRows(args.rows);
				grid.render();
			});
			var h_runfilters = null;

			// wire up the slider to apply the filter to the model
			$("#pcSlider,#pcSlider2").slider({
				"range" : "min",
				"slide" : function(event, ui) {
					Slick.GlobalEditorLock.cancelCurrentEdit();

					if (percentCompleteThreshold != ui.value) {
						window.clearTimeout(h_runfilters);
						h_runfilters = window.setTimeout(filterAndUpdate, 10);
						percentCompleteThreshold = ui.value;
					}
				}
			});

			function filterAndUpdate() {
				var isNarrowing = percentCompleteThreshold > prevPercentCompleteThreshold;
				var isExpanding = percentCompleteThreshold < prevPercentCompleteThreshold;
				var renderedRange = grid.getRenderedRange();

				dataView.setFilterArgs({
					percentComplete : percentCompleteThreshold
				});
				dataView.setRefreshHints({
					ignoreDiffsBefore : renderedRange.top,
					ignoreDiffsAfter : renderedRange.bottom + 1,
					isFilterNarrowing : isNarrowing,
					isFilterExpanding : isExpanding
				});
				dataView.refresh();
				prevPercentCompleteThreshold = percentCompleteThreshold;
			}

			// initialize the model after all the events have been hooked up
			dataView.beginUpdate();
			dataView.setItems(data);
			dataView.setFilter(myFilter);
			dataView.setFilterArgs({
				percentComplete : percentCompleteThreshold
			});
			dataView.groupBy("duration", function(g) {
				return "Duration:  " + g.value + "  <span style='color:green'>(" + g.count + " items)</span>";
			}, function(a, b) {
				return a.value - b.value;
			});
			dataView.setAggregators([new Slick.Data.Aggregators.Avg("percentComplete")], false);
			dataView.collapseGroup(0);
			dataView.endUpdate();
		});
	}
});
