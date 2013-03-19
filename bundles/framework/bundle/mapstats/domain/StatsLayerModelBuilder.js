/*
 * @class Oskari.mapframework.bundle.mapstats.domain.StatsLayerModelBuilder
 * JSON-parsing for stats layer
 */
Oskari.clazz
		.define(
				'Oskari.mapframework.bundle.mapstats.domain.StatsLayerModelBuilder',
				function() {

				},
				{
					/**
					 * parses any additional fields to model
					 */
					parseLayerData : function(layer, mapLayerJson,
							maplayerService) {
/*
						layer.setWmtsName(mapLayerJson.wmsName);
						if (mapLayerJson.wmsUrl) {
							var wmsUrls = mapLayerJson.wmsUrl.split(",");
							for ( var i = 0; i < wmsUrls.length; i++) {
								layer.addWmtsUrl(wmsUrls[i]);
							}
						}

						var styleBuilder = Oskari.clazz
								.builder('Oskari.mapframework.domain.Style');

						var styleSpec;

						for ( var i = 0, ii = mapLayerJson.styles.length; i < ii; ++i) {
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

						
						layer.setFeatureInfoEnabled(true);
						if (mapLayerJson.tileMatrixSetData) {
							layer.setWmtsMatrixSet(mapLayerJson.tileMatrixSetData);
							layer.setWmtsLayerDef(mapLayerJson.tileLayerData);
						}
						*/
						
					}
				});
