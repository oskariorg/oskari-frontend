/*
 * @class
 */
Oskari.clazz.define('Oskari.mapframework.wmts.service.WmtsLayerModelBuilder', function () {

}, {
    /**
     * parses any additional fields to model
     */
    parseLayerData: function (layer, mapLayerJson, maplayerService) {
        var i,
            ii,
            style,
            wmsUrls;
        layer.setWmtsName(mapLayerJson.wmsName);
        if (mapLayerJson.wmsUrl) {
            wmsUrls = mapLayerJson.wmsUrl.split(",");
            for (i = 0; i < wmsUrls.length; i++) {
                layer.addWmtsUrl(wmsUrls[i]);
            }
        }

        var styleBuilder = Oskari.clazz.builder('Oskari.mapframework.domain.Style');

        var styleSpec;

        for (i = 0, ii = mapLayerJson.styles.length; i < ii; ++i) {
            styleSpec = mapLayerJson.styles[i];
            style = styleBuilder();
            style.setName(styleSpec.identifier);
            style.setTitle(styleSpec.identifier);

            layer.addStyle(style);
            if (styleSpec.isDefault) {
                layer.selectStyle(styleSpec.identifier);
                break;
            }
        }

        // Right now hard coded to set it two value '2'.
        layer.setZoomOffset();

        /*
         * layer.setWmtsMatrixSet(mapLayerJson.tileMatrixSetData);
         *
         * layer.setWmtsLayerDef(mapLayerJson.tileLayerData);
         */

        layer.setFeatureInfoEnabled(true);
        if (mapLayerJson.tileMatrixSetData && mapLayerJson.tileLayerData) {
            /* ver 2 */
            layer.setWmtsMatrixSet(mapLayerJson.tileMatrixSetData);
            layer.setWmtsLayerDef(mapLayerJson.tileLayerData);
        } else if (mapLayerJson.tileMatrixSetData && mapLayerJson.tileMatrixSetId) {
            /* ver 1 */
            var tileMatrixSetId = mapLayerJson.tileMatrixSetId;
            if (mapLayerJson.tileMatrixSetData.contents && mapLayerJson.tileMatrixSetData.contents.tileMatrixSets) {
                var tileMatrixSet = mapLayerJson.tileMatrixSetData.contents.tileMatrixSets[tileMatrixSetId];
                layer.setWmtsMatrixSet(tileMatrixSet);

            }


            var wmtsLayerName = layer.getWmtsName();
            var wmtsLayersArr = mapLayerJson.tileMatrixSetData.contents.layers,
                n;
            for (n = 0; n < wmtsLayersArr.length; n++) {
                if (wmtsLayersArr[n].identifier === wmtsLayerName) {
                    layer.setWmtsLayerDef(wmtsLayersArr[n]);
                    break;
                }

            }

        }

    }
});