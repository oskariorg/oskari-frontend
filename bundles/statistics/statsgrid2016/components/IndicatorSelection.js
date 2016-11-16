Oskari.clazz.define('Oskari.statistics.statsgrid.IndicatorSelection', function(instance, sandbox) {
	this.instance = instance;
	this.sb = sandbox;
	this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
	this.spinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
}, {
	__templates : {
		main : _.template('<div class="statsgrid-ds-selections"></div>'),
		selections : _.template('<div class="statsgrid-indicator-selections"></div>'),
		select : _.template('<div class="selection">'+
			'<div class="title">${name}</div>'+
			'<div>'+
			'	<select data-placeholder="${placeholder}" class="${clazz}"></select>'+
			'</div>'+
			'</div>'),
		headerWithTooltip:  _.template('<div class="selection tooltip">'+
			'<div class="title">${title}</div>'+
			'<div class="tooltip">${tooltip1}</div>'+
			'<div class="tooltip">${tooltip2}</div>'+
			'</div>'),
		option : _.template('<option value="${id}">${name}</option>')
	},
	/****** PRIVATE METHODS ******/

	/**
	 * @method  @private _populateIndicators populate indicators
	 * @param  {Object} select  jQuery element of selection
	 * @param  {Integer} datasrc datasource
	 */
	_populateIndicators : function(select, datasrc) {
		var me = this;

		select.trigger('chosen:close');

		if(!datasrc || datasrc === '') {
			return;
		}

		this.service.getIndicatorList(datasrc, function(err, indicators) {
			if(err) {
				// notify error!!
				return;
			}

			select.find('option').each(function(){
				var el = jQuery(this);
				var elValue = el.attr('value');
				if(elValue !== null && elValue !== '') {
					el.remove();
				}
			});

			select.empty();

			// add empty selection to show placeholder
			select.append('<option></option>');

			indicators.forEach(function(ind) {
				select.append(me.__templates.option({
					id : ind.id,
					name : Oskari.getLocalized(ind.name)
				}));
			});
			// let chosen know options has been updated (liszt:updated is only needed for old chosen version)
			select.trigger('chosen:updated');
            me.spinner.stop();
		});
	},

	/****** PUBLIC METHODS ******/

	/**
	 * @method  @public getPanelContent get panel content
	 * @param  {Object} config config
	 * @return {Object} jQuery element
	 */
	getPanelContent: function(config) {
		var me = this;
		var main = jQuery(this.__templates.main());
		var locale = me.instance.getLocalization();
		var panelLoc = locale.panels.newSearch;
		me.spinner.insertTo(main);

		// Datasources
		main.append(jQuery(this.__templates.select({name : locale.panels.newSearch.datasourceTitle, clazz : 'stats-ds-selector', placeholder : locale.panels.newSearch.selectDatasourcePlaceholder})));
		// chosen works better when it has context for the element, get a new reference for chosen
		var dsSelector = main.find('.stats-ds-selector');
		// Add empty option to show placeholder
		dsSelector.append('<option></option>');
		this.service.getDatasource().forEach(function(ds) {
			dsSelector.append(me.__templates.option(ds));
		});
		dsSelector.chosen({
			allow_single_deselect : true,
			disable_search_threshold: 10,
			no_results_text: locale.panels.newSearch.noResults,
			width: '100%'
		});

		me.instance.addChosenHacks(dsSelector);
		// Indicator list
		main.append(jQuery(this.__templates.select({name : locale.panels.newSearch.indicatorTitle, clazz : 'stats-ind-selector', placeholder : locale.panels.newSearch.selectIndicatorPlaceholder})));
		// chosen works better when it has context for the element, get a new reference for chosen
		var indicatorSelector = main.find('.stats-ind-selector');
		// add empty selection to show placeholder
		indicatorSelector.append('<option></option>');
		this._populateIndicators(indicatorSelector, dsSelector.val());

		indicatorSelector.chosen({
			allow_single_deselect : true,
			disable_search_threshold: 10,
			no_results_text: locale.panels.newSearch.noResults,
			width: '100%'
		});
		me.instance.addChosenHacks(indicatorSelector);

		// Refine data label and tooltips
		var dataLabelWithTooltips = jQuery(this.__templates.headerWithTooltip({title: panelLoc.refineSearchLabel, tooltip1:panelLoc.refineSearchTooltip1 || '', tooltip2: panelLoc.refineSearchTooltip2 || ''}));
		main.append(dataLabelWithTooltips);

		// Refine data selections
		var selectionsContainer = jQuery(this.__templates.selections());
		main.append(selectionsContainer);

		var params = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorParameters', this.instance, this.sb);
		dsSelector.on('change', function() {
			params.clean();

			// If removed selection then need to be also update indicator selection
			if(jQuery(this).val() === '') {
				indicatorSelector.val(indicatorSelector.find('option:first').val());
				indicatorSelector.trigger('change');
				indicatorSelector.trigger('chosen:updated');
			}
			// else show spinner
			else {
				me.spinner.start();
			}

			me._populateIndicators(indicatorSelector, jQuery(this).val());
		});

		var btn = Oskari.clazz.create('Oskari.userinterface.component.Button');
		btn.addClass('margintopLarge');
		btn.setTitle(panelLoc.addButtonTitle);
		btn.setEnabled(false);
		btn.insertTo(main);

		indicatorSelector.on('change', function() {
			params.indicatorSelected(selectionsContainer, dsSelector.val(), jQuery(this).val(), config, {dataLabelWithTooltips:dataLabelWithTooltips, btn: btn});
		});


		return main;
	}

});
