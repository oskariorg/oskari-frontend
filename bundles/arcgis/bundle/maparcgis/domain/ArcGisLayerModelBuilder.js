/*
 * @class Oskari.arcgis.bundle.maparcgis.domain.ArcGisLayerModelBuilder
 * JSON-parsing for arcgis layer
 */
Oskari.clazz.define('Oskari.arcgis.bundle.maparcgis.domain.ArcGislLayerModelBuilder', function (sandbox) {
    //this.localization = Oskari.getLocalization("MapStats");
    this.sandbox = sandbox;
}, {
    /**
     * parses any additional fields to model
     * @param {Oskari.arcgis.bundle.arcgis.domain.StatsLayer} layer partially populated layer
     * @param {Object} mapLayerJson JSON presentation of the layer
     * @param {Oskari.mapframework.service.MapLayerService} maplayerService not really needed here
     */
    parseLayerData: function (layer, mapLayerJson, maplayerService) {
        console.dir(mapLayerJson);
        layer.setWmsName(mapLayerJson.wmsName);
        layer.setLayerUrl(mapLayerJson.wmsUrl);
    }
});