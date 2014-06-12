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

        if(mapLayerJson.wmsName) {
            layer.setWmtsName(mapLayerJson.wmsName);
        }
        if(mapLayerJson.wmsUrl) {
            layer.setLayerUrls(maplayerService.parseUrls(mapLayerJson.wmsUrl));
        }
        maplayerService.populateStyles(layer, mapLayerJson);

        layer.setOriginalMatrixSetData(mapLayerJson.tileMatrixSetData);
        var tileMatrixSetId = mapLayerJson.tileMatrixSetId;
        
        if (mapLayerJson.formats) {
            layer.setQueryFormat(mapLayerJson.formats.value);
            layer.setAvailableQueryFormats(mapLayerJson.formats.available);
        }
        layer.setWmtsMatrixSetId(tileMatrixSetId);
        layer.setFeatureInfoEnabled(true);
        if (mapLayerJson.tileMatrixSetData && mapLayerJson.tileLayerData) {
            /* ver 2 */
            layer.setWmtsMatrixSet(mapLayerJson.tileMatrixSetData);
            layer.setWmtsLayerDef(mapLayerJson.tileLayerData);
        } else if (mapLayerJson.tileMatrixSetData && mapLayerJson.tileMatrixSetId) {
            /* ver 1 */
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