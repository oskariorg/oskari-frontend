Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.IndicatorSelection', function(sandbox) {
	this.sb = sandbox;
	this.service = sandbox.getService('Oskari.statistics.bundle.statsgrid.StatisticsService');
}, {
	render : function(el) {
        el.append(JSON.stringify(this.service.getDatasource()));
	}
});