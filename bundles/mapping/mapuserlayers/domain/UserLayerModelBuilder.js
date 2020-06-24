/*
 * @class Oskari.mapframework.bundle.myplacesimport.domain.UserLayerModelBuilder
 * JSON-parsing for user layer
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.myplacesimport.domain.UserLayerModelBuilder',
    function (sandbox) {
        this.sandbox = sandbox;
        this.wfsBuilder = Oskari.clazz.create(
            'Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder',
            sandbox
        );
    }, {
        /**
         * Parses any additional fields to model
         *
         * @param {Oskari.mapframework.bundle.myplacesimport.domain.UserLayer} layer partially populated layer
         * @param {Object} mapLayerJson JSON presentation of the layer
         * @param {Oskari.mapframework.service.MapLayerService} maplayerService not really needed here
         */
        parseLayerData: function (layer, mapLayerJson, maplayerService) {
            // call parent parseLayerData
            this.wfsBuilder.parseLayerData(layer, mapLayerJson, maplayerService);
            layer.setDescription(mapLayerJson.description);
            layer.setSource(mapLayerJson.source);
            layer.setRenderingElement(mapLayerJson.renderingElement);
            layer.addLayerUrl(mapLayerJson.renderingUrl);
            const props = mapLayerJson.propertyNames;
            if (Array.isArray(props)) {
                layer.setFields(props.map(p => p.name));
                layer.setLocales(props.map(p => p.locale));
            }
        }
    }
);
