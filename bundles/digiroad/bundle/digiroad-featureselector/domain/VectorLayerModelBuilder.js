/*
 * @class Oskari.digiroad.bundle.featureselector.domain.VectorLayerModelBuilder
 * JSON-parsing for vector layer (digiroad edition)
 */
Oskari.clazz.define('Oskari.digiroad.bundle.featureselector.domain.VectorLayerModelBuilder', function(sandbox) {
    this.localization = Oskari.getLocalization("FeatureSelector");
    this.sandbox = sandbox;
}, {
    /**
     * parses any additional fields to model
     * @param {Oskari.mapframework.bundle.mapstats.domain.StatsLayer} layer partially populated layer
     * @param {Object} mapLayerJson JSON presentation of the layer
     */
    parseLayerData : function(layer, mapLayerJson) {
        layer.setProtocolType(mapLayerJson.protocolType);
        layer.setProtocolOpts(mapLayerJson.protocolOpts);
        layer.setStrategyTypes(mapLayerJson.strategyTypes);
    }
});
