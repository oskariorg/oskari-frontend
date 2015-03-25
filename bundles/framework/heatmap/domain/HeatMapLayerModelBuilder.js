/*
 * @class Oskari.mapframework.bundle.heatmap.domain.HeatMapLayerModelBuilder
 * JSON-parsing for heatmap layer
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.heatmap.domain.HeatMapLayerModelBuilder',

    function (sandbox) {
        this.localization = Oskari.getLocalization('heatmap');
        this.sandbox = sandbox;
    }, {
        /**
         * parses any additional fields to model
         * @param {Oskari.mapframework.bundle.heatmap.domain.HeatmapLayer} layer partially populated layer
         * @param {Object} mapLayerJson JSON presentation of the layer
         * @param {Oskari.mapframework.service.MapLayerService} maplayerService not really needed here
         */
        parseLayerData: function (layer, mapLayerJson, maplayerService) {
            var me = this,
                toolBuilder = Oskari.clazz.builder('Oskari.mapframework.domain.Tool');

            if (!layer.isLayerOfType("HEATMAP")) {
            	return;
            }
            var locLabel = this.localization['tool_label'],
                toolHeatmap = toolBuilder();
            toolHeatmap.setName("heatmap");
            toolHeatmap.setTitle(locLabel);
            toolHeatmap.setTooltip(locLabel);
            toolHeatmap.setCallback(function () {
                me.sandbox.postRequestByName('ShowOwnStyleRequest', [layer.getId()]);
            });
            layer.addTool(toolHeatmap);
        }
    });
