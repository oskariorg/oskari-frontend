/*
 * @class Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayerModelBuilder
 * JSON-parsing for myplaces layer
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayerModelBuilder',
    function (sandbox) {
        this.localization = Oskari.getLocalization('MapMyPlaces');
        this.sandbox = sandbox;
        this.wfsBuilder = Oskari.clazz.create('Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder', sandbox);
        // created in parseLayer so it can be used to detect if we have already done it
        this.groupId = null;
    }, {
        /**
         * parses any additional fields to model
         * @param {Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayer} layer partially populated layer
         * @param {Object} mapLayerJson JSON presentation of the layer
         * @param {Oskari.mapframework.service.MapLayerService} maplayerService not really needed here
         */
        parseLayerData: function (layer, mapLayerJson, maplayerService) {
            var me = this;
            var loclayer = me.localization.layer;
            // call parent parseLayerData
            this.wfsBuilder.parseLayerData(layer, mapLayerJson, maplayerService);
            layer.setLocale(mapLayerJson.locale);

            if (loclayer.organization) {
                layer.setOrganizationName(loclayer.organization);
            }
            if (!this.groupId) {
                // negative value for group id means that admin isn't presented with tools for it
                this.groupId = -1 * Oskari.getSeq('usergeneratedGroup').nextVal();
                const mapLayerGroup = maplayerService.findLayerGroupById(this.groupId);
                if (!mapLayerGroup) {
                    const group = {
                        id: this.groupId,
                        name: {
                            [Oskari.getLang()]: loclayer.inspire
                        }
                    };
                    maplayerService.addLayerGroup(Oskari.clazz.create('Oskari.mapframework.domain.MaplayerGroup', group));
                }
            }
            if (loclayer.inspire) {
                layer.setGroups([{
                    id: this.groupId,
                    name: loclayer.inspire
                }]);
            }
        }
    });
