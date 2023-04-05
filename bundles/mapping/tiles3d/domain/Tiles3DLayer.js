import { AbstractVectorLayer } from '../../mapmodule/domain/AbstractVectorLayer';
/**
 * @class Oskari.mapframework.domain.Tiles3DLayer
 *
 * 3D-tile tileset layer
 */
class Tiles3DLayer extends AbstractVectorLayer {
    constructor () {
        super(...arguments);
        /* Layer Type */
        this._layerType = 'tiles3d';
    }

    getQueryable () {
        // not sure why but previously the plugin called layer.setQueryable(false); when layer was added to the map
        // and this makes it more explicit
        return false;
    }

    isSupported () {
        return Oskari.getSandbox().getMap().getSupports3D();
    }
};
Oskari.clazz.defineES('Oskari.mapframework.mapmodule.Tiles3DLayer', Tiles3DLayer);
