import { UserDataLayer } from '../../mapuserdatalayer/domain/UserDataLayer';

/**
 * @class Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayer
 *
 * MapLayer of type MyPlaces
 */

export class MyPlacesLayer extends UserDataLayer {
    constructor () {
        super(...arguments);
        /* Layer Type */
        this._layerType = 'MYPLACES';
        this._metaType = 'MYPLACES';
    }

    isDefault () {
        return this._controlData.isDefault === true;
    }
}

Oskari.clazz.defineES('Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayer', MyPlacesLayer);
