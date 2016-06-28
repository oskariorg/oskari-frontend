
Oskari.clazz.define('Oskari.statistics.statsgrid.Datatable', function(sandbox) {
	this.sb = sandbox;
	this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
	this.__bindToEvents();
}, {
	__templates : {
		main : _.template('<div class="stats-table"></div>')
	},
	render : function(el) {
		var main = jQuery(this.__templates.main());
		this.mainEl = main;
		this.grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');

		el.append(main);
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
		var me = this;
		var regionset = this.service.getRegionsets(setId);
		var overlay = Oskari.clazz.create('Oskari.userinterface.component.Overlay');
		overlay.overlay(this.mainEl, true);
		var log = Oskari.log('Oskari.statistics.statsgrid.Datatable');
		log.info('Region changed! ', regionset);
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
		/*
		this.service.getIndicatorData(datasrc, indId, selections, this.getCurrentRegionset(), function(err, data) {
			debugger;
		});
		*/
	},
	handleIndicatorRemoved: function(datasrc, indId, selections) {
		var log = Oskari.log('Oskari.statistics.statsgrid.Datatable');
		var src = this.service.getDatasource(datasrc);
		log.info('Indicator removed', src, indId, selections)

	},
	createModel : function(regions, callback) {
		var me = this;
		var list = this.getIndicators();
		var data = {};
		regions.forEach(function(reg) {
			data[reg.id] = {};
		});
		var done = function(data) {
			var log = Oskari.log('Oskari.statistics.statsgrid.Datatable');
			log.info(data);
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
					data[key][ind.hash] = indicatorData[key];
				}
				if(count===0) {
					done(data);
				}
			});
		});


	},
	__bindToEvents : function() {
		var me = this;
		this.service.on('StatsGrid.IndicatorEvent', function(event) {
			if(event.isRemoved()) {
				me.handleIndicatorRemoved(event.getDatasource(), event.getIndicator(), event.getSelections());
			} else {
				me.handleIndicatorAdded(event.getDatasource(), event.getIndicator(), event.getSelections());
			}
		});
		this.service.on('StatsGrid.RegionsetChangedEvent', function(event) {
			me.handleRegionsetChanged(event.getRegionset());
		});
	}
});