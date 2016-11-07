Oskari.clazz.define('Oskari.statistics.statsgrid.ExtraFeatures', function(instance, sandbox) {
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

	/****** PUBLIC METHODS ******/

	/**
	 * @method  @public getPanelContent get content panel
	 */
	getPanelContent: function() {
		var me = this;
		var locale = me.instance.getLocalization();
		var panelLoc = locale.panels.extraFeatures;
		var checkbox = Oskari.clazz.create('Oskari.userinterface.component.CheckboxInput');
		checkbox.setTitle(panelLoc.showMapLayers);
		checkbox.setChecked(true);
		checkbox.setHandler(function() {
			me.toggleSelectedLayersVisibility(checkbox.isChecked());
		});
		return checkbox.getElement();
	},

	/**
	 * @method  @public toggleSelectedLayersVisibility toggle selected layers visibility
	 * @param  {Boolean} checked is checked
	 */
	toggleSelectedLayersVisibility: function(checked) {
		var me  = this;
		var selectedLayers = me.sb.findAllSelectedMapLayers();
		var visibilityRequestBuilder = me.sb.getRequestBuilder('MapModulePlugin.MapLayerVisibilityRequest');
		if (visibilityRequestBuilder) {
			selectedLayers.forEach(function(layer){
				if(!checked && layer.getLayerType() !== 'stats') {
					var hideRequest = visibilityRequestBuilder(layer.getId(), false);
    				me.sb.request(me.instance, hideRequest);
				} else {
					var showRequest = visibilityRequestBuilder(layer.getId(), true);
    				me.sb.request(me.instance, showRequest);
				}
			});
		}
	}
});