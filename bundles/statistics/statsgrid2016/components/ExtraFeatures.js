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

		var test = jQuery('<div></div>');
		test.append(checkbox.getElement());

var colorSelection = Oskari.clazz.create('Oskari.userinterface.component.ColorSelect');

colorSelection.setColorValues(['ff0000', '00ff00', '0000ff', ['ff0000', '00ff00', '0000ff'],
        ['1b9e77','d95f02','7570b3','e7298a','66a61e','e6ab02'],
        ['ffffb2','fed976','feb24c','fd8d3c','f03b20','bd0026']
        ]);
//colorSelection.setColorValues(['ff00ff', '0000ff', ['ff0000', '00ff00', '0000ff']]);
colorSelection.setHandler(function(selected){
	console.log('Selected index: ' + selected);
});
/*
colorSelection.setUIColors({
            hover: 'FF0000',
            selected: '00FF00',
            menu: '0000FF'
        });*/
colorSelection.setValue(0);
var el = colorSelection.getElement();
test.append(el);
setTimeout(function(){
	jQuery('.oskari-flyoutcontent.statsgrid .accordion_panel').css('overflow', 'visible');
},1000);
		return test;
		//return checkbox.getElement();
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