/*
 * @class Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayerModelBuilder
 * JSON-parsing for myplaces layer
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayerModelBuilder',
    function (sandbox) {
        this.localization = Oskari.getLocalization("MapMyPlaces");
        this.sandbox = sandbox;
        this.wfsBuilder = Oskari.clazz.create('Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder', sandbox);
    }, {
        /**
         * parses any additional fields to model
         * @param {Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayer} layer partially populated layer
         * @param {Object} mapLayerJson JSON presentation of the layer
         * @param {Oskari.mapframework.service.MapLayerService} maplayerService not really needed here
         */
        parseLayerData: function (layer, mapLayerJson, maplayerService) {
            var me = this,
                loclayer = me.localization.layer;

            // call parent parseLayerData
            this.wfsBuilder.parseLayerData(layer, mapLayerJson, maplayerService);

            if (mapLayerJson.fields) {
                layer.setFields(mapLayerJson.fields);
            }
            if (mapLayerJson.name) {
                layer.setName(mapLayerJson.name);
            }
            if (mapLayerJson.wmsName) {
                layer.setWmsName(mapLayerJson.wmsName);
            }
            if (mapLayerJson.wmsUrl) {
                layer.setWmsUrl(mapLayerJson.wmsUrl);
            }
            if (loclayer.organization) {
                layer.setOrganizationName(loclayer.organization);
            }
            if (loclayer.inspire) {
                layer.setGroups([{
                    id:layer.getId(),
                    name:loclayer.inspire
                }]);
            }
        }
    });
