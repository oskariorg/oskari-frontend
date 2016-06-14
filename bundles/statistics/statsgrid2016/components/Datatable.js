
Oskari.clazz.define('Oskari.statistics.statsgrid.Datatable', function(sandbox) {
	this.sb = sandbox;
	this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
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
}, {
	__templates : {
		main : _.template('<div class="stats-table"><table></table></div>'),
		tableHeader : _.template('<th></th>'),
		tableRow : _.template('<tr></tr>'),
		tableCell : _.template('<td>${value}</td>')
	},
	render : function(el) {
		el.append('TBD: data');
	},
	handleRegionsetChanged: function(setId) {
		var regionset = this.service.getRegionsets(setId);
		var log = Oskari.log('Oskari.statistics.statsgrid.Datatable');
		log.info('Region changed! ', regionset);

	},
	handleIndicatorAdded: function(datasrc, indId, selections) {
		var log = Oskari.log('Oskari.statistics.statsgrid.Datatable');
		var src = this.service.getDatasource(datasrc);
		log.info('Indicator added ', src, indId, selections);

	},
	handleIndicatorRemoved: function(datasrc, indId, selections) {
		var log = Oskari.log('Oskari.statistics.statsgrid.Datatable');
		var src = this.service.getDatasource(datasrc);
		log.info('Indicator removed', src, indId, selections)

	}
});