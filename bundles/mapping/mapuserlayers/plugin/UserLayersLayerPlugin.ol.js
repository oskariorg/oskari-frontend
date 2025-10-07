/**
 * @class Oskari.mapframework.bundle.myplacesimport.plugin.MyLayersLayerPlugin
 * Provides functionality to draw user layers on the map
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.myplacesimport.plugin.UserLayersLayerPlugin',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function (config) {
        this._config = config;
    }, {
        __name: 'UserLayersLayerPlugin',
        _clazz: 'Oskari.mapframework.bundle.myplacesimport.plugin.UserLayersLayerPlugin',
        /** @static @property layerType type of layers this plugin handles */
        layertype: 'userlayer',

        getLayerTypeSelector: function () {
            // WFS plugin handles events
        },
        /**
         * @private @method _initImpl
         * Interface method for the module protocol.
         */
        _initImpl: function () {
            const type = this.layertype;
            const options = {
                type,
                editRequest: 'MyPlacesImport.ShowUserLayerDialogRequest',
                ...Oskari.getMsg('MyPlacesImport', 'layer')
            };
            this.getSandbox().getService('Oskari.mapframework.service.MapLayerService')?.registerLayerForUserDataModelBuilder(options);
            // Let wfs plugin handle this layertype
            const wfsPlugin = this.getMapModule().getLayerPlugins('wfs');
            wfsPlugin.registerLayerType(type, 'Oskari.mapframework.bundle.myplacesimport.domain.UserLayer');
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
