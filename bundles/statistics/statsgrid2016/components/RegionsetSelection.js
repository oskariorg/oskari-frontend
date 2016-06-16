Oskari.clazz.define('Oskari.statistics.statsgrid.RegionsetSelection', function(sandbox) {
	this.sb = sandbox;
	this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
}, {
	__templates : {
		main : _.template('<div></div>'),
		select : _.template('<div><label>${name}<select data-placeholder="${placeholder}" class="${clazz}"></select></label></div>'),
		option : _.template('<option value="${id}">${name}</option>')
	},
	render : function(el) {
		var me = this;
		var main = jQuery(this.__templates.main());
		el.append(main);

		// Datasources
		main.append(jQuery(this.__templates.select({name : 'Regionset', clazz : 'stats-regionset-selector', placeholder : ''})));
		// chosen works better when it has context for the element, get a new reference for chosen
		var rsSelector = main.find('.stats-regionset-selector');
		this.service.getRegionsets().forEach(function(regionset) {
			rsSelector.append(me.__templates.option(regionset));
		});
		rsSelector.chosen({ disable_search_threshold: 10 });

		rsSelector.on('change', function() {
			var log = Oskari.log('Oskari.statistics.statsgrid.RegionsetSelection');
			var value = jQuery(this).val();
			log.info('Selected region ' + value);
			me.service.getStateService().setRegionset(value);
		});
		this.service.getStateService().setRegionset(rsSelector.val());
	}
});