Oskari.clazz.define('Oskari.statistics.statsgrid.IndicatorParameters', function(instance, sandbox) {
	this.instance = instance;
	this.sb = sandbox;
	this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
	this.spinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
}, {
	__templates : {
		main : _.template('<div class="stats-ind-params">'+
			'</div>'),
		select : _.template('<div class="parameter"><div class="label">${label}</div><div class="select"><select data-placeholder="${placeholder}" name="${id}" class="${clazz}"></select></div><div class="clear"></div></div>'),
		option : _.template('<option value="${id}">${name}</option>')
	},

	/****** PUBLIC METHODS ******/

	/**
	 * @method  @public  clean clean params
	 */
	clean : function() {
		if(!this.container) {
			return;
		}
		this.container.remove();
		this.container = null;
	},

	/**
	 * @method  @public indicatorSelected  handle indicator selected
	 * @param  {Object} el       jQuery element
	 * @param  {Integer} datasrc indicator datasource
	 * @param  {String} indId    indicator id
	 * @param  {Object} config   config
	 * @param  {Object} elements elements
	 */
	indicatorSelected : function(el, datasrc, indId, config, elements) {
		var me = this;
		var locale = me.instance.getLocalization();
		var panelLoc = locale.panels.newSearch;
		config = config || {};
		elements = elements || {};

		this.clean();

		if(!indId && indId ==='')  {
			if(elements.dataLabelWithTooltips) {
				elements.dataLabelWithTooltips.find('.tooltip').show();
			}
			return;
		}

		var cont = jQuery(this.__templates.main());
		el.append(cont);
		this.container = cont;

        me.spinner.insertTo(cont.parent().parent());
        me.spinner.start();

		this.service.getIndicatorMetadata(datasrc, indId, function(err, indicator) {
            me.spinner.stop();
            if(elements.dataLabelWithTooltips) {
				elements.dataLabelWithTooltips.find('.tooltip').hide();
			}
			if(err) {
				// notify error!!
				return;
			}

			// selections
			var selections = [];
			indicator.selectors.forEach(function(selector, index) {
				var placeholderText = (panelLoc.selectionValues[selector.id] && panelLoc.selectionValues[selector.id].placeholder) ? panelLoc.selectionValues[selector.id].placeholder :panelLoc.defaultPlaceholder;
				var label = (locale.parameters[selector.id]) ? locale.parameters[selector.id] : selector.id;
				var select = me.__templates.select({
					id : selector.id,
					name : selector.name || selector.id,
					clazz : 'stats-select-param-' + selector.id,
					placeholder: placeholderText,
					label: label
				});

				cont.append(select);
				var jqSelect = cont.find('.stats-select-param-' + selector.id);

				// add empty selection to show placeholder
				jqSelect.append('<option></option>');

				selector.allowedValues.forEach(function(val) {
					var name = val.name || val.id || val;
					var optName = (panelLoc.selectionValues[selector.id] && panelLoc.selectionValues[selector.id][name]) ? panelLoc.selectionValues[selector.id][name] : name;

					// val can be an object with id and name or plain value
					var opt = me.__templates.option({
						id : val.id || val,
						name : optName
					});
					jqSelect.append(opt);
				});
				jqSelect.find('option:nth-child(2)').prop('selected', true);
				jqSelect.chosen({
					allow_single_deselect : true,
					disable_search_threshold: 10,
					width: '100%'
				});
				if(index>0) {
					jqSelect.parent().parent().addClass('margintop');
				}
				selections.push(jqSelect);
			});

			var jqSelect = me.getRegionSelection(cont,indicator, true);
			// Add margin if there is selections
			if(selections.length>0) {
				jqSelect.parent().parent().addClass('margintop');
			}

			if(elements.btn) {
				elements.btn.setHandler(function() {
					var values = {
						datasource : datasrc,
						indicator : indId,
						selections : {}
					};
					selections.forEach(function(select) {
						values.selections[select.attr('name')] = select.val();
					});
					me.service.getStateService().addIndicator(datasrc, indId, values.selections);

					me.instance.getFlyout().closePanels();
				});
				elements.btn.setEnabled(indicator.regionsets.length>0);
			}
		});
	},

	/**
	 * Get region selection.
	 * @method  @public getRegionSelection
	 *
	 * @param  {Object} cont      jQuery element
	 * @param  {Object} indicator indicator. If is set indicator, then grep allowed regions. Else if indicator is not defined then shows all regions.
	 * @param {Boolean} firstSelected if setted true then first option is selected
	 * @return {Object}           jQuery element
	 */
	getRegionSelection: function(cont, indicator, firstSelected) {
		var me = this;
		var locale = me.instance.getLocalization();
		var panelLoc = locale.panels.newSearch;
		var allRegionsets = me.service.getRegionsets();

		var placeholderText = (panelLoc.selectionValues.regionset && panelLoc.selectionValues.regionset.placeholder) ? panelLoc.selectionValues.regionset.placeholder :panelLoc.defaultPlaceholder;
		var label = (locale.parameters.regionset) ? locale.parameters.regionset : 'Regionset';
		var select = me.__templates.select({
			id : 'regionset',
			clazz : 'stats-regionset-selector',
			placeholder: placeholderText,
			label: label
		});

		var allowedRegionsets = [];

		var addAllowedRegionSets = function(indicatorRegionset){
			var grepAllRegionsets = jQuery.grep(allRegionsets, function(regionset) {
				return regionset.id === indicatorRegionset;
			});

			grepAllRegionsets.forEach(function(regionset){
				allowedRegionsets.push(regionset);
			});
		};

		if(indicator) {
			indicator.regionsets.forEach(function(indicatorRegionset) {
				addAllowedRegionSets(indicatorRegionset);
			});

			if(allowedRegionsets.length === 0) {
				select = jQuery('<div class="noresults">'+panelLoc.noRegionset+'</div>');
				select.addClass('margintop');
			}
		}
		// No indicators, so this selection is showed by Datatable. DAtatable needs to show all regionsets of selected indicators.
		else {

			var indicatorRegions = me.service.getSelectedIndicatorsRegions();

			indicatorRegions.forEach(function(indicatorRegionset) {
				addAllowedRegionSets(indicatorRegionset);
			});
		}
		cont.append(select);
		var jqSelect = cont.find('.stats-regionset-selector');

		// If there is indicators then do selections
		if(allowedRegionsets.length > 0) {
			if(indicator) {
				// add empty selection to show placeholder
				jqSelect.append('<option></option>');
			}

			var currentRegion = me.service.getStateService().getRegionset();

			allowedRegionsets.forEach(function(regionset) {
				var optionEl = jQuery(me.__templates.option(regionset));
				if(regionset.id == currentRegion) {
					optionEl.attr('selected', 'selected');
				}
				jqSelect.append(optionEl);
			});

			jqSelect.chosen({
				allow_single_deselect : true,
				disable_search_threshold: 10,
				width: '100%'
			});
			me.instance.addChosenHacks(jqSelect);

			jqSelect.on('change', function() {
				var log = Oskari.log('Oskari.statistics.statsgrid.IndicatorParameters');
				var value = jQuery(this).val();
				log.info('Selected region ' + value);
				me.service.getStateService().setRegionset(value);
			});

			// Select second if firs selected is true, first option is empty because of placeholder text
			if(firstSelected === true) {
				jqSelect.find('option:nth-child(2)').prop('selected', true);
				jqSelect.trigger('change');
				jqSelect.trigger('chosen:updated');
			}
		}

		return jqSelect;
	}
});