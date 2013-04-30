/*
 * @class Oskari.mapframework.bundle.mapstats.domain.StatsLayerModelBuilder
 * JSON-parsing for stats layer
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapstats.domain.StatsLayerModelBuilder', function(sandbox) {
	this.localization = Oskari.getLocalization("MapStats");
    this.sandbox = sandbox;
}, {
	/**
	 * parses any additional fields to model
	 * @param {Oskari.mapframework.bundle.mapstats.domain.StatsLayer} layer partially populated layer
	 * @param {Object} mapLayerJson JSON presentation of the layer
	 * @param {Oskari.mapframework.service.MapLayerService} maplayerService not really needed here
	 */
	parseLayerData : function(layer, mapLayerJson, maplayerService) {

        var me = this;
		layer.setWmsName(mapLayerJson.wmsName);
		//  Default field name  for to link map features in stats visualization
		if(mapLayerJson.visualizations) layer.setFilterPropertyName(mapLayerJson.visualizations[0].filterproperty);
		// Populate layer tools 
		var toolBuilder = Oskari.clazz.builder('Oskari.mapframework.domain.Tool');
        // Table icon
		var tool1 = toolBuilder();
		var locTool = this.localization.tools.table_icon;
		tool1.setName("table_icon");
		tool1.setTitle(locTool.title);
		tool1.setTooltip(locTool.tooltip);
		tool1.setIconCls("icon-restore");
		tool1.setCallback(function() {
            me.sandbox.postRequestByName('StatsGrid.StatsGridRequest',[true, layer]);
		});
		layer.addTool(tool1);
		// Diagram icon
		var tool2 = toolBuilder();
		var locTool = this.localization.tools.diagram_icon;
		tool2.setName("diagram_icon");
		tool2.setTitle(locTool.title);
		tool2.setTooltip(locTool.tooltip);
		tool2.setIconCls("layer-stats");
		tool2.setCallback(function() {
			alert('Näytä tiedot diagrammissa');
		});
		// Statistics mode
		layer.addTool(tool2);
		var tool3 = toolBuilder();
		var locTool = this.localization.tools.statistics;
		tool3.setName("statistics");
		tool3.setTitle(locTool.title);
		tool3.setTooltip(locTool.tooltip);
		tool3.setCallback(function() {
			alert('Kirjaudu palveluun ja siirry tilastomoodiin');
		});
		layer.addTool(tool3);

		//mapLayerJson.visualizations = [] -> populate styles
		/*

		 var styleBuilder = Oskari.clazz
		 .builder('Oskari.mapframework.domain.Style');

		 var styleSpec;

		 for ( var i = 0, ii = mapLayerJson.styles.length; i < ii; ++i) {
		 styleSpec = mapLayerJson.styles[i];
		 var style = styleBuilder();
		 style.setName(styleSpec.identifier);
		 style.setTitle(styleSpec.identifier);

		 layer.addStyle(style);
		 if (styleSpec.isDefault) {
		 layer.selectStyle(styleSpec.identifier);
		 break;
		 }
		 }

		 layer.setFeatureInfoEnabled(true);
		 if (mapLayerJson.tileMatrixSetData) {
		 layer.setWmtsMatrixSet(mapLayerJson.tileMatrixSetData);
		 layer.setWmtsLayerDef(mapLayerJson.tileLayerData);
		 }
		 */

	}
});
