/*
 * @class Oskari.mapframework.bundle.mapstats.domain.StatsLayerModelBuilder
 * JSON-parsing for stats layer
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapstats.domain.StatsLayerModelBuilder', function (sandbox) {
    this.localization = Oskari.getLocalization("MapStats");
    this.sandbox = sandbox;
}, {
    /**
     * parses any additional fields to model
     * @param {Oskari.mapframework.bundle.mapstats.domain.StatsLayer} layer partially populated layer
     * @param {Object} mapLayerJson JSON presentation of the layer
     * @param {Oskari.mapframework.service.MapLayerService} maplayerService not really needed here
     */
    parseLayerData: function (layer, mapLayerJson, maplayerService) {

        var me = this;
        // Populate layer tools
        var toolBuilder = Oskari.clazz.builder('Oskari.mapframework.domain.Tool');

        // Statistics
        var tool1 = toolBuilder(),
            locTool = me.localization.tools.table_icon;
        tool1.setName("table_icon");
        tool1.setTitle(locTool.title);
        tool1.setTooltip(locTool.tooltip);
        //tool1.setIconCls("icon-restore");
        tool1.setCallback(function () {
            me.sandbox.postRequestByName('StatsGrid.StatsGridRequest', [true, layer]);
        });
        layer.addTool(tool1);
    }
});
