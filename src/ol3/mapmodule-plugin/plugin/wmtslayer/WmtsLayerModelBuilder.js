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

        for (var i = 0, ii = mapLayerJson.styles.length; i < ii; ++i) {
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
            var wmtsLayersArr = mapLayerJson.tileMatrixSetData.contents.layers;
            for (var n = 0; n < wmtsLayersArr.length; n++) {
                if (wmtsLayersArr[n].identifier == wmtsLayerName) {
                    layer.setWmtsLayerDef(wmtsLayersArr[n]);
                    break;
                }

            }

        }

        layer._data = mapLayerJson;

        // OL2 changed format from {lat: x, lon: y} to [x,y]
        // Modify until data changes
        var capabilities = mapLayerJson.tileMatrixSetData,
            i, ilen, topLeftCorner, bounds;

        layers = capabilities.contents.layers;
        for (i = 0, ilen = layers.length; i < ilen; i++) {
            layers[i].resourceUrls = {}
            tile = layers[i].resourceUrl.tile.resourceType;
            url = layers[i].resourceUrl.tile.template;
            layers[i].resourceUrls[tile] = {};
            layers[i].resourceUrls[tile][layers[i].resourceUrl.tile.format] = [url];
            delete layers[i]["supportedCRS"];
            delete layers[i]["resourceUrl"];
        }

        for (srs in capabilities.contents.tileMatrixSets) {
            matrixIds = capabilities.contents.tileMatrixSets[srs].matrixIds;
            for (i = 0, ilen = matrixIds.length; i < ilen; i++) {
                // replace object with array
                capabilities.contents.tileMatrixSets[srs].matrixIds[i].topLeftCorner = [matrixIds[i].topLeftCorner.lon, matrixIds[i].topLeftCorner.lat];

                capabilities.contents.tileMatrixSets[srs].matrixIds[i].supportedCRS = "EPSG:3067";
            }

            // fixing bounds
            capabilities.contents.tileMatrixSets[srs].projection = "EPSG:3067";
            capabilities.contents.tileMatrixSets[srs].supportedCRS = "EPSG:3067";
            bounds = [
                capabilities.contents.tileMatrixSets[srs].bounds.left,
                capabilities.contents.tileMatrixSets[srs].bounds.right,
                capabilities.contents.tileMatrixSets[srs].bounds.bottom,
                capabilities.contents.tileMatrixSets[srs].bounds.top];

            capabilities.contents.tileMatrixSets[srs].bounds = bounds;
        }

        layer.setWmtsCaps(capabilities);

    }
});
