Oskari.clazz.define('Oskari.statistics.statsgrid.IndicatorSelection', function(sandbox) {
	this.sb = sandbox;
	this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
}, {
	__templates : {
		main : _.template('<div></div>'),
		selections : _.template('<div class="statsgrid-indicator-selections"></div>'),
		select : _.template('<div><label>${name}<select data-placeholder="${placeholder}" class="${clazz}"></select></label></div>'),
		option : _.template('<option value="${id}">${name}</option>')
	},
	render : function(el) {
		var me = this;
		var main = jQuery(this.__templates.main());
		el.append(main);

		// Datasources
		main.append(jQuery(this.__templates.select({name : 'Datasources', clazz : 'stats-ds-selector', placeholder : ''})));
		// chosen works better when it has context for the element, get a new reference for chosen
		var dsSelector = main.find('.stats-ds-selector');
		this.service.getDatasource().forEach(function(ds) {
			dsSelector.append(me.__templates.option(ds));
		});
		dsSelector.chosen({ disable_search_threshold: 10 });

		// Indicator list
		main.append(jQuery(this.__templates.select({name : 'Indicators', clazz : 'stats-ind-selector', placeholder : 'Select an indicator'})));
		// chosen works better when it has context for the element, get a new reference for chosen
		var indicatorSelector = main.find('.stats-ind-selector');
		indicatorSelector.chosen({
			allow_single_deselect : true,
			disable_search_threshold: 10,
			no_results_text: "Oops, nothing found!"
		});
		this.populateIndicators(indicatorSelector, dsSelector.val());
		var selectionsContainer = jQuery(this.__templates.selections());
		main.append(selectionsContainer);

		var params = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorParameters', this.sb);
		dsSelector.on('change', function() {
			params.clean();
			me.populateIndicators(indicatorSelector, jQuery(this).val());
		});

		indicatorSelector.on('change', function() {
			params.indicatorSelected(selectionsContainer, dsSelector.val(), jQuery(this).val());
		});
	},
	populateIndicators : function(select, datasrc) {
		var me = this;
		select.trigger('chosen:close');
		var spinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
        spinner.insertTo(select);
        spinner.start();
		this.service.getIndicatorList(datasrc, function(err, indicators) {
			if(err) {
				// notify error!!
				return;
			}
			select.empty();
			indicators.forEach(function(ind) {
				select.append(me.__templates.option({
					id : ind.id,
					name : Oskari.getLocalized(ind.name)
				}));
			});
			// let chosen know options has been updated (liszt:updated is only needed for old chosen version)
			//select.trigger("liszt:updated");
			select.trigger("chosen:updated");
            spinner.stop();
		});
	}

});
