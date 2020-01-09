/*
 * @class Oskari.mapframework.bundle.myplacesimport.domain.UserLayerModelBuilder
 * JSON-parsing for user layer
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.myplacesimport.domain.UserLayerModelBuilder',
    function (sandbox, clusteringDistance) {
        this.sandbox = sandbox;
        this.localization = Oskari.getLocalization('MyPlacesImport');
        this.wfsBuilder = Oskari.clazz.create(
            'Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder',
            sandbox
        );
        this.clusteringDistance = clusteringDistance;
    }, {
        /**
         * Parses any additional fields to model
         *
         * @param {Oskari.mapframework.bundle.myplacesimport.domain.UserLayer} layer partially populated layer
         * @param {Object} mapLayerJson JSON presentation of the layer
         * @param {Oskari.mapframework.service.MapLayerService} maplayerService not really needed here
         */
        parseLayerData: function (layer, mapLayerJson, maplayerService) {
            var loclayer = this.localization.layer;
            // call parent parseLayerData
            this.wfsBuilder.parseLayerData(layer, mapLayerJson, maplayerService);
            // set layer specific data
            if (this.clusteringDistance && this.clusteringDistance > 0) {
                layer.setClusteringDistance(this.clusteringDistance);
            }
            layer.setOrganizationName(loclayer.organization);
            layer.setGroups([{
                id: 'USERLAYER',
                name: loclayer.inspire
            }]);
            layer.setDescription(mapLayerJson.description);
            layer.setSource(mapLayerJson.source);
            layer.setRenderingElement(mapLayerJson.renderingElement);
            layer.addLayerUrl(mapLayerJson.renderingUrl);
            if (mapLayerJson.fields) {
                layer.setFields(mapLayerJson.fields);
            }
            if (mapLayerJson.fieldLocales) {
                layer.setLocales(mapLayerJson.fieldLocales);
            }
        }
    }
);
