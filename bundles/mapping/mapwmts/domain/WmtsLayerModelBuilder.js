/*
 * @class
 */
Oskari.clazz.define('Oskari.mapframework.wmts.service.WmtsLayerModelBuilder', function () {

}, {
    /**
     * parses any additional fields to model
     */
    parseLayerData: function(layer, mapLayerJson, maplayerService) {
        maplayerService.populateStyles(layer, mapLayerJson);

        if (mapLayerJson.formats) {
            layer.setQueryFormat(mapLayerJson.formats.value);
            layer.setAvailableQueryFormats(mapLayerJson.formats.available);
        }
        layer.setTileUrl(mapLayerJson.tileUrl);
        layer.setWmtsMatrixSetId(mapLayerJson.tileMatrixSetId);
        layer.setFeatureInfoEnabled(true);
    }
});