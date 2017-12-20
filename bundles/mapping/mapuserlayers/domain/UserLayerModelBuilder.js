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
         * Parses any additional fields to model
         *
         * @param {Oskari.mapframework.bundle.myplacesimport.domain.UserLayer} layer partially populated layer
         * @param {Object} mapLayerJson JSON presentation of the layer
         * @param {Oskari.mapframework.service.MapLayerService} maplayerService not really needed here
         */
        parseLayerData : function(layer, mapLayerJson, maplayerService) {
            var loclayer = this.localization.layer;
            // call parent parseLayerData
            this.wfsBuilder.parseLayerData(layer, mapLayerJson, maplayerService);
            // set layer specific data
            layer.setOrganizationName(loclayer.organization);
            layer.setInspireName(loclayer.inspire);
            layer.setDescription(mapLayerJson.description);
            layer.setSource(mapLayerJson.source);
            layer.setRenderingElement(mapLayerJson.renderingElement);
            layer.addLayerUrl(mapLayerJson.renderingUrl);
            if (mapLayerJson.fields && mapLayerJson.fields.length !== 0){
                layer.setFeatureProperties(this.addHiddenFields(mapLayerJson.fields));
            } else {
                layer.setFeatureProperties([]);
            }
        },

        addHiddenFields: function(fields){
            if (fields.indexOf('__fid') === -1){
                fields.splice(0,0,"__fid");
            }
            if (fields.indexOf('__centerX') === -1){
                fields.push('__centerX');
            }
            if (fields.indexOf('__centerY') === -1){
                fields.push('__centerY');
            }
        return fields;
        }
    }
);
