/**
 * Map plugins that will be started even without bundle plugin configuration.
 */
export const automagicPlugins = [
    'Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin',
    'Oskari.mapframework.mapmodule.WmsLayerPlugin',
    'Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin',
    'Oskari.wfsvector.WfsVectorLayerPlugin',
    // wfsvector does have minZoomLevel, origin coordinates array, resolutions array and tileSize as config
    'Oskari.mapframework.mapmodule.VectorTileLayerPlugin',
    'Oskari.mapframework.mapmodule.BingMapsLayerPlugin',
    'Oskari.mapframework.bundle.mapmodule.plugin.PinchZoomResetPlugin',
    'Oskari.mapframework.mapmodule.VectorLayerPlugin'
    /*, 'Oskari.mapframework.mapmodule.Tiles3DLayerPlugin' ? */
];
