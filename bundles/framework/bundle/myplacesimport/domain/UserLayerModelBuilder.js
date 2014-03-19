/*
 * @class Oskari.mapframework.bundle.myplacesimport.domain.UserLayerModelBuilder
 * JSON-parsing for user layer
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.myplacesimport.domain.UserLayerModelBuilder',
    function(sandbox) {
        this.sandbox = sandbox;
        this.localization = Oskari.getLocalization("MyPlacesImport");
        this.wfsBuilder = Oskari.clazz.create(
            'Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder',
            sandbox
        );
    }, {
        /**
         * parses any additional fields to model
         * @param {Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer} layer partially populated layer
         * @param {Object} mapLayerJson JSON presentation of the layer
         * @param {Oskari.mapframework.service.MapLayerService} maplayerService not really needed here
         */
        parseLayerData : function(layer, mapLayerJson, maplayerService) {
            var loclayer = this.localization.layer;

            // call parent parseLayerData
            this.wfsBuilder.parseLayerData(layer, mapLayerJson, maplayerService);
            // set layer specific data
            layer.setDescription(mapLayerJson.description);
            layer.setSource(mapLayerJson.source);
            layer.setOrganizationName(loclayer.organization);
            layer.setInspireName(loclayer.inspire);
            layer.setRenderingElement(mapLayerJson.renderingElement);
            layer.addLayerUrl(mapLayerJson.renderingUrl);
        }
    }
);
