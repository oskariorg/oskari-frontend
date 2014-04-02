define(["bundles/framework/bundle/mapwmts/service/WmtsLayerModelBuilder"], function() {
    Oskari.cls('Oskari.mapframework.wmts.service.WmtsLayerModelBuilder').category({

        /**
         * parses any additional fields to model
         */
        parseLayerData: function(layer, mapLayerJson, maplayerService) {

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
            layer.setWmtsCaps(mapLayerJson.caps);

            // NOTE! OL2 only as OL2 changed format from {lat: x, lon: y} to [x,y]
            // which differs from OL3 usage
        }
    });
});