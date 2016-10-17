Oskari.clazz.define('Oskari.statistics.statsgrid.IndicatorParameters', function(instance, sandbox) {
	this.instance = instance;
	this.sb = sandbox;
	this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
	this.spinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
}, {
	__templates : {
		main : _.template('<div class="stats-ind-params">'+
			'</div>'),
		select : _.template('<div><select data-placeholder="${placeholder}" name="${id}" class="${clazz}"></select></div>'),
		option : _.template('<option value="${id}">${name}</option>')
	},
	clean : function() {
		if(!this.container) {
			return;
		}
		this.container.remove();
		this.container = null;
	},
	addMetadata : function(el, label, value) {
		if(!value) {
			// Nothing to show
			return;
		}
		el.append(this.__templates.data({
			name : label,
			data : value
		}));
	},
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
				var select = me.__templates.select({
					id : selector.id,
					name : selector.name || selector.id,
					clazz : 'stats-select-param-' + selector.id,
					placeholder: placeholderText
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
				jqSelect.chosen({
					allow_single_deselect : true,
					disable_search_threshold: 10,
					width: '100%'
				});
				if(index>0) {
					jqSelect.parent().addClass('margintop');
				}
				selections.push(jqSelect);
			});

			var jqSelect = me.getRegionSelection(cont,indicator);
			// Add margin if there is selections
			if(selections.length>0) {
				jqSelect.parent().addClass('margintop');
			}
			selections.push(jqSelect);

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
	 * @return {Object}           jQuery element
	 */
	getRegionSelection: function(cont, indicator) {
		var me = this;
		var locale = me.instance.getLocalization();
		var panelLoc = locale.panels.newSearch;
		var allRegionsets = me.service.getRegionsets();
		var placeholderText = (panelLoc.selectionValues.regionset && panelLoc.selectionValues.regionset.placeholder) ? panelLoc.selectionValues.regionset.placeholder :panelLoc.defaultPlaceholder;
		var select = me.__templates.select({
			id : 'regionset',
			clazz : 'stats-regionset-selector',
			placeholder: placeholderText
		});

		var allowedRegionsets = [];
		if(indicator) {
			var addAllowedRegionSets = function(indicatorRegionset){
				var grepAllRegionsets = jQuery.grep(allRegionsets, function(regionset,id) {
					return regionset.id === indicatorRegionset;
				});

				grepAllRegionsets.forEach(function(regionset){
					allowedRegionsets.push(regionset);
				});
			};
			indicator.regionsets.forEach(function(indicatorRegionset) {
				addAllowedRegionSets(indicatorRegionset);
			});

			if(allowedRegionsets.length === 0) {
				select = jQuery('<div class="noresults">'+panelLoc.noRegionset+'</div>');
				select.addClass('margintop');
			}
		} else {
			allowedRegionsets = allRegionsets;
		}
		cont.append(select);
		var jqSelect = cont.find('.stats-regionset-selector');

		// If there is indicators then do selections
		if(allowedRegionsets.length > 0) {
			if(indicator) {
				// add empty selection to show placeholder
				jqSelect.append('<option></option>');
			}

			me.service.getRegionsets().forEach(function(regionset) {
				jqSelect.append(me.__templates.option(regionset));
			});
			jqSelect.chosen({
				allow_single_deselect : true,
				disable_search_threshold: 10,
				width: '100%'
			});
			me.instance.addChosenHacks(jqSelect);
			jqSelect.on('change', function() {
				var log = Oskari.log('Oskari.statistics.statsgrid.RegionsetSelection');
				var value = jQuery(this).val();
				log.info('Selected region ' + value);
				me.service.getStateService().setRegionset(value);
			});
		}

		return jqSelect;
	}
});