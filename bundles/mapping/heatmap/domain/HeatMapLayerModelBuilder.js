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
            if (!layer.isLayerOfType('HEATMAP') || !this.sandbox.hasHandler('ShowUserStylesRequest')) {
                return;
            }
            const toolBuilder = Oskari.clazz.builder('Oskari.mapframework.domain.Tool');
            const locLabel = this.localization['tool_label'];
            const toolHeatmap = toolBuilder();
            toolHeatmap.setName('heatmap');
            toolHeatmap.setTitle(locLabel);
            toolHeatmap.setTooltip(locLabel);
            toolHeatmap.setCallback(() => this.sandbox.postRequestByName('ShowUserStylesRequest', [{ layerId: layer.getId() }]));
            layer.addTool(toolHeatmap);
        }
    });
