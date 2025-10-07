/**
 * Provides functionality to draw MyPlaces layers on the map
 *
 * @class Oskari.mapframework.bundle.mapmyplaces.plugin.MyPlacesLayerPlugin
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmyplaces.plugin.MyPlacesLayerPlugin',

    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function (config) {
        this._config = config;
    }, {
        _clazz: 'Oskari.mapframework.bundle.mapmyplaces.plugin.MyPlacesLayerPlugin',
        __name: 'MyPlacesLayerPlugin',
        /** @static @property layertype type of layers this plugin handles */
        layertype: 'myplaces',

        getLayerTypeSelector: function () {
            // WFS plugin handles events
        },
        /**
         * Interface method for the module protocol.
         * @private @method _initImpl
         */
        _initImpl: function () {
            const type = this.layertype;
            const options = {
                type,
                editRequest: 'MyPlaces.EditCategoryRequest',
                ...Oskari.getMsg('MapMyPlaces', 'layer')
            };
            this.getSandbox().getService('Oskari.mapframework.service.MapLayerService')?.registerLayerForUserDataModelBuilder(options);

            // Let wfs plugin handle this layertype
            const wfsPlugin = this.getMapModule().getLayerPlugins('wfs');
            wfsPlugin.registerLayerType(type, 'Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayer');
            this.unregister();
        }
    }, {
        extend: ['Oskari.mapping.mapmodule.AbstractMapLayerPlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
