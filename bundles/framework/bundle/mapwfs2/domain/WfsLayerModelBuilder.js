/*
 * @class Oskari.mapframework.bundle.mapwfs.domain.WfsLayerModelBuilder
 * JSON-parsing for wfs layer
 */
Oskari.clazz.define(
	'Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder',

function(sandbox) {
	this.sandbox = sandbox;
	this.localization = Oskari.getLocalization('MapWfs2');
}, {
	/**
	 * parses any additional fields to model
	 * @param {Oskari.mapframework.domain.WfsLayer} layer partially populated layer
	 * @param {Object} mapLayerJson JSON presentation of the layer
	 * @param {Oskari.mapframework.service.MapLayerService} maplayerService not really needed here
	 */
	parseLayerData: function(layer, mapLayerJson, maplayerService) {
		var me = this;
		var locTool = this.localization['object-data'];
		// add object data tool
		// TODO: should propably be configurable -> maybe through wfslayerplugin conf
		// so we can disable if feature data bundle is not loaded
		var toolBuilder = Oskari.clazz.builder('Oskari.mapframework.domain.Tool');
		var toolObjData = toolBuilder();
		toolObjData.setName("objectData");
		toolObjData.setTitle(locTool);
		toolObjData.setTooltip(locTool);
		toolObjData.setCallback(function() {
			me.sandbox.postRequestByName('ShowFeatureDataRequest',[layer.getId()]);
		});
		layer.addTool(toolObjData);
	}
});
