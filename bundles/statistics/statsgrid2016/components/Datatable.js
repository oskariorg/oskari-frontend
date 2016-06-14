
Oskari.clazz.define('Oskari.statistics.statsgrid.Datatable', function(sandbox) {
	this.sb = sandbox;
	var log = Oskari.log('Oskari.statistics.statsgrid.Datatable');
	this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
	this.service.on('StatsGrid.IndicatorEvent', function(event) {
		var src = me.service.getDatasource(event.getDatasource());
		if(event.isRemoved()) {
			log.info('Indicator removed',  src, event.getIndicator())
		} else {
			log.info('Indicator added', src, event.getIndicator())
		}
		log.info('Indicator selections:', event.getSelections());
	});
	var me = this;
	this.service.on('StatsGrid.RegionsetChangedEvent', function(event) {
		var regionset = me.service.getRegionsets(event.getRegionset());
		log.info('Region changed! ', regionset);
	});
}, {
	render : function(el) {
		el.append('TBD: data');
	}
});