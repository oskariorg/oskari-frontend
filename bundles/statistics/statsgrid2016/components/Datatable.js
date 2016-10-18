
Oskari.clazz.define('Oskari.statistics.statsgrid.Datatable', function(instance, sandbox) {
    this.instance = instance;
    this.sb = sandbox;
    this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
    this.spinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
    this.__bindToEvents();
}, {
    __templates : {
        main : _.template('<div class="stats-table">'+
            '<div class="noresults">'+
            '   <div class="title"></div>'+
            '   <div class="content"></div>'+
            '</div>'+
            '<div class="grid"></div>'+
            '</div>'),
        tableHeader: _.template('<div class="statsgrid-grid-table-header">'+
                '<div class="title"></div>'+
                '<div class="selection"></div>'+
                '<div class="info"></div>'+
                '</div>'),
        tableHeaderWithContent: _.template('<div class="statsgrid-grid-table-header-content">'+
                '<div class="header"><span class="title"></span> </div>'+
                '<div class="icon icon-close-dark"></div>' +
                '<div style="clear:both;"></div>' +
                '<div class="sortby"><div class="orderTitle"></div><div class="order"></div><div style="clear:both;"></div></div>' +
                '</div>')
    },

    render : function(el) {
        var me = this;
        var locale = me.instance.getLocalization();
        var gridLoc = locale.statsgrid;

        var main = jQuery(this.__templates.main());
        me.spinner.insertTo(main);
        var noresults = main.find('.noresults');
        noresults.find('.title').html(gridLoc.title);
        noresults.find('.content').html(gridLoc.noResults);

        this.mainEl = main;
        this.grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');

        this.grid.addSelectionListener(function(grid, region) {
            me.service.getStateService().selectRegion(region);
        });

        el.append(main);
        this.handleRegionsetChanged();
    },
    getCurrentRegionset : function() {
        return this.service.getStateService().getRegionset();
    },
    getIndicators : function() {
        return this.service.getStateService().getIndicators();
    },
    handleRegionsetChanged: function(setId) {
        if(!setId) {
            setId = this.getCurrentRegionset();
        }
        if(!setId) {
            return;
        }
        var me = this;
        var regionset = this.service.getRegionsets(setId);

        if(this.getIndicators().length>0){
            me.spinner.start();
        }
        this.service.getRegions(setId, function(err, regions) {
            me.createModel(regions, function(model) {
                me.updateModel(model, regions);
                me.spinner.stop();
            });
        });
    },
    updateModel : function(model, regions) {
        var me = this;
        var statsTableEl = jQuery('.oskari-flyoutcontent.statsgrid .stats-table');
        var log = Oskari.log('Oskari.statistics.statsgrid.Datatable');
        var locale = me.instance.getLocalization();
        var gridLoc = locale.statsgrid;

        var indicators = this.getIndicators();

        // Show no results text
        if(indicators.length === 0) {
            statsTableEl.find('.oskari-grid').hide();
            statsTableEl.find('.noresults').show();
            return;
        }
        // Show datatable
        else {
            statsTableEl.find('.oskari-grid').show();
            statsTableEl.find('.noresults').hide();
        }

        // Area selection
        this.grid.setColumnUIName('region', function(content) {
            var tableHeader = jQuery(me.__templates.tableHeader());
            tableHeader.find('.title').html(gridLoc.areaSelection.title);
            tableHeader.find('.info').html(gridLoc.areaSelection.info);

            var params = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorParameters', me.instance, me.sb);
            content.append(tableHeader);
            params.getRegionSelection(tableHeader.find('.selection'));

            content.css('height', '160px');
            content.css('width', '180px');
        });


        var regionIdMap = {};
        regions.forEach(function(reg) {
            regionIdMap[reg.id] = reg.name;
        });
        this.grid.setColumnValueRenderer('region', function(regionId) {
            return regionIdMap[regionId];
        });
        // done is called when we have indicator names for columns
        var done = function() {
            me.grid.setDataModel(model);
            me.grid.renderTo(me.mainEl.find('.grid'));
        };
        if(!indicators.length) {
            done();
            return;
        }
        // figure out ui names for indicators
        var count = 0;

        indicators.forEach(function(ind, id) {
            count++;
            me.service.getIndicatorMetadata(ind.datasource, ind.indicator, function(err, indicator) {
                count--;
                var ds = me.service.getDatasource(ind.datasource).name;
                me.grid.setColumnUIName(ind.hash, function(content) {

                    var tableHeader = jQuery(me.__templates.tableHeaderWithContent());
                    tableHeader.find('.title').html(gridLoc.source + ' ' + (id+1) + ':');
                    tableHeader.find('.header').append(Oskari.getLocalized(indicator.name)).attr('title', Oskari.getLocalized(indicator.name));
                    tableHeader.find('.icon').attr('title', gridLoc.removeSource);
                    tableHeader.find('.icon').bind('click', function(){
                        log.info('Removing indicator ' + ind.hash);
                        me.service.getStateService().removeIndicator(ind.datasource, ind.indicator, ind.selections);
                    });


                    var sortBy = tableHeader.find('.sortby');
                    sortBy.find('.orderTitle').html(gridLoc.orderBy);
                    var order = sortBy.find('.order');

                    sortBy.bind('click', function(evt){
                        evt.stopPropagation();

                        jQuery('.statsgrid-grid-table-header-content .sortby .orderTitle').removeClass('selected');
                        sortBy.find('.orderTitle').addClass('selected');


                        var descending = (sortBy.attr('data-descending') === 'true') ? true : false;

                        me.grid.sortBy(ind.hash, descending);
                        sortBy.attr('data-descending', !descending);

                        order.removeClass('asc');
                        order.removeClass('desc');

                        if(descending) {
                            sortBy.find('.orderTitle').attr('title', gridLoc.orderByDescending);
                            order.addClass('desc');
                        } else {
                            sortBy.find('.orderTitle').attr('title', gridLoc.orderByAscending);
                            order.addClass('asc');
                        }
                    });

                    sortBy.attr('data-descending', false);
                    sortBy.find('.orderTitle').attr('title', gridLoc.orderByDescending);
                    order.addClass('desc');


                    content.bind('click', function(){
                        me.service.getStateService().setActiveIndicator(ind.hash);
                    });

                    content.append(tableHeader);
                });

                if(count === 0) {
                    done();
                    /*
                    setTimeout(function(){
                        var maxHeight = 0;
                        jQuery('.statsgrid-grid-table-header-content').each(function(){
                            var el = jQuery(this);
                            if(el.height()>maxHeight) {
                                maxHeight = el.height();
                            }
                        });

                        jQuery('.statsgrid-grid-table-header-content').each(function(){
                            var el = jQuery(this);
                            el.parent().css('height', (maxHeight + 15) + 'px');
                        });
                    },1000);
                    */
                }
            });
        });
    },
    handleIndicatorAdded: function(datasrc, indId, selections) {
        var log = Oskari.log('Oskari.statistics.statsgrid.Datatable');
        var src = this.service.getDatasource(datasrc);
        log.info('Indicator added ', src, indId, selections);
        this.handleRegionsetChanged(this.getCurrentRegionset());
    },
    handleIndicatorRemoved: function(datasrc, indId, selections) {
        var log = Oskari.log('Oskari.statistics.statsgrid.Datatable');
        var src = this.service.getDatasource(datasrc);
        log.info('Indicator removed', src, indId, selections);
        this.handleRegionsetChanged(this.getCurrentRegionset());
    },
    createModel : function(regions, callback) {
        var me = this;
        var list = this.getIndicators();
        var data = {};
        regions.forEach(function(reg) {
            data[reg.id] = {};
        });
        var done = function(data) {
            var model = Oskari.clazz.create('Oskari.userinterface.component.GridModel');
            model.setIdField('region');
            for(var region in data) {
                var value = data[region] || {};
                value.region = region;
                model.addData(value);
            }
            var fields = ['region'];
            list.forEach(function(ind) {
                fields.push(ind.hash);
            });
            model.setFields(fields);
            callback(model);
        };
        var count = 0;
        if(!list.length) {
            // no indicators
            done(data);
            return;
        }
        list.forEach(function(ind) {
            count++;
            me.service.getIndicatorData(ind.datasource, ind.indicator, ind.selections, me.getCurrentRegionset(), function(err, indicatorData) {
                count--;
                for(var key in indicatorData) {
                    var region =  data[key];
                    if(!region) {
                        continue;
                    }
                    region[ind.hash] = indicatorData[key];
                }
                if(count===0) {
                    done(data);
                }
            });
        });


    },
    __bindToEvents : function() {
        var me = this;
        var log = Oskari.log('Oskari.statistics.statsgrid.Datatable');
        this.service.on('StatsGrid.IndicatorEvent', function(event) {
            if(event.isRemoved()) {
                me.handleIndicatorRemoved(event.getDatasource(), event.getIndicator(), event.getSelections());
            } else {
                me.handleIndicatorAdded(event.getDatasource(), event.getIndicator(), event.getSelections());
            }
        });
        this.service.on('StatsGrid.RegionsetChangedEvent', function(event) {
            log.info('Region changed! ', event.getRegionset());
            me.handleRegionsetChanged(event.getRegionset());
        });
        this.service.on('StatsGrid.RegionSelectedEvent', function(event) {
            log.info('Region selected! ', event.getRegion());
            if(me.getCurrentRegionset() !== event.getRegionset()) {
                // shouldn't be the case ever
                me.handleRegionsetChanged(event.getRegionset());
            }
            me.grid.select(event.getRegion());
        });

        this.service.on('StatsGrid.ActiveIndicatorChangedEvent', function(event) {
            var current = event.getCurrent();
            log.info('Active indicator changed! ', current);
            if(current) {
                me.grid.selectColumn(current.hash);
            }
        });


    }
});