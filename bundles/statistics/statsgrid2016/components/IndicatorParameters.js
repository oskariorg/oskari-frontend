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
        if(!this.regionSelector) {
			this.regionSelector = Oskari.clazz.create('Oskari.statistics.statsgrid.RegionsetSelector', me.sb, me.instance.getLocalization());
        }

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
			var regionSelect = me.regionSelector.create(indicator.regionsets);
			cont.append(regionSelect.container);
			// Add margin if there is selections
			if(selections.length > 0) {
				regionSelect.container.addClass('margintop');
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
					var added = me.service.getStateService().addIndicator(datasrc, indId, values.selections);
					if(added === false) {
						// already added, set as active instead
						var hash = me.service.getStateService().getHash(datasrc, indId, values.selections);
						me.service.getStateService().setActiveIndicator(hash);
					}
					me.service.getStateService().setRegionset(regionSelect.value());

					me.instance.getFlyout().closePanels();
				});
				elements.btn.setEnabled(indicator.regionsets.length>0);
			}
		});
	}
});