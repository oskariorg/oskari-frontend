/**
 * Map plugins that will be started even without bundle plugin configuration.
 */
export const automagicPlugins = [
    'Oskari.wfsvector.WfsVectorLayerPlugin',
    'Oskari.mapframework.mapmodule.VectorTileLayerPlugin',
    'Oskari.mapframework.mapmodule.BingMapsLayerPlugin',
    'Oskari.mapframework.bundle.mapmodule.plugin.PinchZoomResetPlugin'
];
