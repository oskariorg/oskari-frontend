
Oskari.clazz.define('Oskari.statistics.statsgrid.Datatable', function(sandbox) {
    this.sb = sandbox;
    this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
    this.__bindToEvents();
}, {
    __templates : {
        main : _.template('<div class="stats-table"></div>')
    },
    render : function(el) {
        var me = this;
        var main = jQuery(this.__templates.main());
        this.mainEl = main;
        this.grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');
        this.grid.on('column.selected', function(indicatorHash) {
            // only notify if clicked column was not region
            if(indicatorHash !== 'region') {
                me.service.getStateService().setActiveIndicator(indicatorHash);
            }
        });
        this.grid.addSelectionListener(function(grid, region) {
            me.service.getStateService().selectRegion(region);
        });
        /*
        this.grid.on('sort', function(value) {
            // maybe trigger an event to sort graphs?
            console.log('sort:', value);
        });
        */

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
        var overlay = Oskari.clazz.create('Oskari.userinterface.component.Overlay');
        overlay.overlay(this.mainEl, true);
        this.service.getRegions(setId, function(err, regions) {
            me.createModel(regions, function(model) {
                me.updateModel(model, regions);
                overlay.close();
            })
        });
    },
    updateModel : function(model, regions) {
        this.grid.setColumnUIName('region', this.service.getRegionsets(this.getCurrentRegionset()).name);
        var me = this;
        var indicators = this.getIndicators();
        var log = Oskari.log('Oskari.statistics.statsgrid.Datatable');

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
            me.grid.renderTo(me.mainEl);
            me.grid.contentScroll(true);
        };
        if(!indicators.length) {
            done();
            return;
        }
        // figure out ui names for indicators
        var count = 0;
        indicators.forEach(function(ind) {
            count++;
            me.service.getIndicatorMetadata(ind.datasource, ind.indicator, function(err, indicator) {
                count--;
                var ds = me.service.getDatasource(ind.datasource).name;
                me.grid.setColumnUIName(ind.hash, ds + ' - ' + Oskari.getLocalized(indicator.name));
                me.grid.setColumnTools(ind.hash, [{
                    name : '<div class="icon-close-dark"></div>',
                    callback : function(value) {
                        log.info('Removing indicator ' + value);
                        me.service.getStateService().removeIndicator(ind.datasource, ind.indicator, ind.selections);
                    }
                }]);
                if(count === 0) {
                    done();
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
        log.info('Indicator removed', src, indId, selections)
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
            //var log = Oskari.log('Oskari.statistics.statsgrid.Datatable');
            //log.info(data);
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