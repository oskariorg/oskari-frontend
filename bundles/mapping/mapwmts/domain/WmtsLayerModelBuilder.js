/*
 * @class
 */
Oskari.clazz.define('Oskari.mapframework.wmts.service.WmtsLayerModelBuilder', function () {

}, {
    /**
     * parses any additional fields to model
     */
    parseLayerData: function (layer, mapLayerJson, maplayerService) {
        maplayerService.populateStyles(layer, mapLayerJson);
        layer.setTileUrl(mapLayerJson.tileUrl);
        layer.setWmtsMatrixSetId(mapLayerJson.tileMatrixSetId);
        layer.setFeatureInfoEnabled(true);
    }
});
