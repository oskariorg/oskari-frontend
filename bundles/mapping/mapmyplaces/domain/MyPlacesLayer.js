/**
 * @class Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayer
 *
 * MapLayer of type MyPlaces
 */
const WFSLayer = Oskari.clazz.get('Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer');

export class MyPlacesLayer extends WFSLayer {
    constructor () {
        super(...arguments);
        /* Layer Type */
        this._layerType = 'MYPLACES';
        this._metaType = 'MYPLACES';
    }
    /* Layer type specific functions */

    isFilterSupported () {
        // this defaults to false in AbstractLayer, but WFSLayer returns true.
        // Not sure if this is something we want, but it's the same behavior as before but NOT having
        // WFS and analysis referenced in AbstractLayer
        return false;
    }
}
Oskari.clazz.defineES('Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayer', MyPlacesLayer);
