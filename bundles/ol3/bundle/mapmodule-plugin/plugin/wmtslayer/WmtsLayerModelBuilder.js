/*
 * @class
 */
Oskari.clazz.define('Oskari.mapframework.wmts.service.WmtsLayerModelBuilder', function() {

}, {
    /**
     * parses any additional fields to model
     */
    parseLayerData : function(layer, mapLayerJson, maplayerService) {

        layer.setWmtsName(mapLayerJson.wmsName);
        if (mapLayerJson.wmsUrl) {
            var wmsUrls = mapLayerJson.wmsUrl.split(",");
            for (var i = 0; i < wmsUrls.length; i++) {
                layer.addWmtsUrl(wmsUrls[i]);
            }
        }

        var styleBuilder = Oskari.clazz.builder('Oskari.mapframework.domain.Style');

        var styleSpec;

        for (var i = 0, ii = mapLayerJson.tileLayerData.styles.length; i < ii; ++i) {
            styleSpec = mapLayerJson.tileLayerData.styles[i];
            var style = styleBuilder();
            style.setName(styleSpec.identifier);
            style.setTitle(styleSpec.identifier);

            layer.addStyle(style);
            if (styleSpec.isDefault) {
                layer.selectStyle(styleSpec.identifier);
                break;
            }
        }

        /*
         * layer.setWmtsMatrixSet(mapLayerJson.tileMatrixSetData);
         *
         * layer.setWmtsLayerDef(mapLayerJson.tileLayerData);
         */

        layer.setFeatureInfoEnabled(true);
        layer.setWmtsMatrixSet(mapLayerJson.tileMatrixSetData);
        layer.setWmtsLayerDef(mapLayerJson.tileLayerData);
        layer._data = mapLayerJson;
        layer.setWmtsCaps(mapLayerJson.caps);

    }
});
