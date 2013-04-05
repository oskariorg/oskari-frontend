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
        this.indicators = [];
        this.prepareIndicatorParams(container);
        container.on("keyup", function(e) {
            e.stopPropagation();
        });
        container.on("keydown", function(e) {
            e.stopPropagation();
        });
        //this.getSotkaIndicatorData(container,'127','total','2010');

    },
    /**
     * @method prepareIndicatorParams
     */
    prepareIndicatorParams : function(container) {
        
        var selectors = jQuery('<div class="selectors-container"></div>');
        container.append(selectors);
        
        // Indicators 
        // success -> createIndicators      
        this.getSotkaIndicators(container);
        this.getSotkaRegionData(container);
    },
    /**
     *
     */
//    getSotkaRegionData : function(container, indicator, genders, years, indicatorMeta) {
    getSotkaRegionData : function(container) {
        var me = this;

        me.fetchData(
            me.instance.getSandbox().getAjaxUrl() + 'action_route=GetSotkaData&action=regions&version=1.1',
            function(regionData){
                if (regionData) {
                    // get the actual data
                    //me.createMunicipalitySlickGrid(container, indicator, genders, years, indicatorMeta, regionData);
                    me.createMunicipalitySlickGrid(container, regionData);
                } else {
                    alert('error in getting sotka region data');
                }
            }, 
            function(jqXHR, textStatus){
                alert('error loading sotka region data');
            }
        );
    },

    /**
     * @method createMunicipalitySlickGrid
     */
    createMunicipalitySlickGrid : function(container, regiondata) {
        var grid;
        var gridContainer = jQuery('<div id="municipalGrid" class="municipal-grid"></div>');
        container.find('.municipal-grid').remove();
        container.append(gridContainer);
        var columns = [{
            id : "municipality",
            name : "Municipality",
            field : "municipality",
            sortable : true
        }];

        var options = {
            enableCellNavigation : true,
            enableColumnReorder : false,
            multiColumnSort: true
        };
        var data = [];
        var rowId = 0;

        for (var i = 0; i < regiondata.length; i++) {
            var indicData = regiondata[i];

            if (indicData["category"] == 'KUNTA') {
                data[rowId] = {
                    id : indicData.id, 
                    municipality: indicData.title[Oskari.getLang()]
                }
                rowId++;
            }

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
            var cols = args.sortCols;

            dataView.sort(function (dataRow1, dataRow2) {
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
        dataView.beginUpdate();
        dataView.setItems(data);
        dataView.endUpdate();
        grid.invalidate();
        grid.render();
        this.grid = grid;
        this.dataView = dataView;

    },



    /**
     *  //http://demo.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=GetSotkaData&action=indicators&version=1.1
     * Get Sotka indicators
     */
    getSotkaIndicators : function(container) {
        var me = this;
        var sandbox = me.instance.getSandbox();
        me.fetchData(
            sandbox.getAjaxUrl() + 'action_route=GetSotkaData&action=indicators&version=1.1',
            function(indicatorsdata){
                if (indicatorsdata) {
                    //if fetch returned something we create drop down selector
                    me.createIndicatorsSelect(container, indicatorsdata);
                } else {
                    alert('error in getting sotka indicators');
                }
            }, 
            function(jqXHR, textStatus){
                alert('error loading sotka indicators');
            }
        );
    },

    /**
     * Create indicators pull down 
     *
     * @method createIndicatorsSelect
     */
    createIndicatorsSelect : function(container, data) {
        var me=this;
        // Indicators
        var indi = jQuery('<div class="indicator-cont"><div class="indisel selector-cont"><label for="indi">' +  this.instance.getLocalization('indicators') + '</label><select id="indi" name="indi" class="indi"></select></div></div>');

        var sel = indi.find('select');
        for (var i = 0; i < data.length; i++) {
            var indic_data = data[i];

            for (var key in indic_data) {
                if (key == "id") {
                    var value = indic_data[key];
                    var title = indic_data["title"][Oskari.getLang()];
                    var opt = jQuery('<option value="' + value + '">' + title + '</option>');
                    sel.append(opt);
                    data[i].titlename = title;
                }
            }
        }
    
        sel.change(function(e) {
            var indicator = sel.find('option:selected').val();
            me.getSotkaIndicatorMeta(container,indicator);


        });

        container.find('.selectors-container').append(indi);
        //sel.find('option[value="127"]').prop('selected', true);

        sel.chosen({no_results_text: this.instance.getLocalization('noMatch')});

    },
    getSotkaIndicatorMeta : function(container, indicator) {
        var me = this;
        var sandbox = me.instance.getSandbox();
        me.fetchData(
            sandbox.getAjaxUrl() + 'action_route=GetSotkaData&action=indicator_metadata&indicator=' + indicator + '&version=1.1',
            function(indicatorMeta){
                if (indicatorMeta) {
                    //if fetch returned something we create drop down selector
                    me.createIndicatorInfoButton(container, indicatorMeta);
                    me.createDemographicsSelects(container, indicatorMeta);
                } else {
                    alert('error in getting sotka indicator metadata');
                }
            }, 
            function(jqXHR, textStatus){
                alert('error loading sotka indicator metadata');
            }
        );

    },
    createIndicatorInfoButton : function(container, indicator) {
        var me = this;
        var infoIcon = jQuery('<div class="icon-info"></div>');
        var indicatorCont = container.find('.indicator-cont');
        indicatorCont.find('.icon-info').remove();
        indicatorCont.append(infoIcon);
        infoIcon.click(function(e){
            var lang = Oskari.getLang();
            me.instance.showMessage(indicator.title[lang], indicator.description[lang]);
        });
    },

    createDemographicsSelects : function(container, indicator) {
        var me = this;
        this.indicators.push(indicator);

        var selectors = container.find('.selectors-container');
        var parameters = jQuery('<div class="parameters-cont"></div>');
        var fetchButton = jQuery('<button class="fetch-data">'+ this.instance.getLocalization('addColumn') +'</button>')

        if(indicator.range != null) {
            parameters.append(this.getYearSelectorHTML(indicator.range.start, indicator.range.end));
        }
        if(indicator.classifications != null && indicator.classifications.sex != null) {
            parameters.append(this.getGenderSelectorHTML(indicator.classifications.sex.values));
        }
        parameters.append(fetchButton);

        selectors.find('.parameters-cont').remove();
        selectors.append(parameters);

        //listener
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
     */
    getSotkaIndicatorData : function(container, indicator, genders, years) {
        var me = this;

        me.fetchData(
            me.instance.getSandbox().getAjaxUrl() + 'action_route=GetSotkaData&action=data&version=1.0&indicator=' + indicator + '&years=' + years + '&genders=' + genders,
            function(data){
                if (data) {
                    // get the actual data
                    me.addIndicatorDataToGrid(container, indicator, genders, years, data);
                    //me.getSotkaRegionData(container, indicator, genders, years, data);
                } else {
                    alert('error in getting sotka indicator data');
                }
            }, 
            function(jqXHR, textStatus){
                alert('error loading sotka indicator data');
            }
        );
    },


    addIndicatorDataToGrid : function(container, indicator, genders, years, data) {
        var columns = this.grid.getColumns();
        var indicatorName = this.indicators[this.indicators.length -1].title[Oskari.getLang()];
        columns.push({
            id : "indicator" + indicator+years+genders,
            name : indicatorName + '/' + years.toString() + '/' + genders.toString(),
            field : "indicator" + indicator+years+genders,
            sortable : true
        });
        this.grid.setColumns(columns);

        var columnData = [];
        var ii = 0;
        this.dataView.beginUpdate();

        for (var i = 0; i < data.length; i++) {
            var indicData = data[i];
            var regionId = "";
            var value = "";
            for (var key in indicData) {
                if (key == "region") {
                    regionId = indicData[key];
                } else if (key == "primary value") {
                    value = indicData[key];
                    value = value.replace(',','.');
                }
            }
            if (!!regionId) {
                var item = this.dataView.getItemById(regionId);
                if(item){
                    item["indicator" + indicator+years+genders] = Number(value);
                    this.dataView.updateItem(item.id, item);

                }
                ii++;                
            }
        }
            this.dataView.endUpdate();
            this.dataView.refresh();
            this.grid.invalidateAllRows();
            this.grid.render();

    },

    getYearSelectorHTML: function(startYear, endYear) {
        // Years
        var year = jQuery('<div class="yearsel selector-cont"><label for="year">'+ this.instance.getLocalization('year') + '</label><select name="year" class="year"></select></div>');
        var sel = year.find('select');

        for (var i = startYear; i <= endYear; i++) {
            var opt = jQuery('<option value="' + i + '">' + i + '</option>');
            sel.append(opt);
        }

        sel.val(endYear);
        return year;
    },
    getGenderSelectorHTML: function(values) {
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
    fetchData: function(url, successCb, errorCb) {
        jQuery.ajax({
            type : "GET",
            dataType: 'json',
            beforeSend: function(x) {
              if(x && x.overrideMimeType) {
               x.overrideMimeType("application/j-son;charset=UTF-8");
              }
             },
            url : url,
            success : function(pResp) {
                if(successCb) {
                    successCb(pResp);
                }
            },
            error : function(jqXHR, textStatus) {
                if(errorCb && jqXHR.status != 0) {
                    errorCb(jqXHR, textStatus);
                }
            }
        });
    }
});
