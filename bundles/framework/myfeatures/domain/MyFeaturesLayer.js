import { UserDataLayer } from '../../../mapping/mapuserdatalayer/domain/UserDataLayer';
/**
 * @class Oskari.mapframework.MyFeaturesLayer
 *
 * MapLayer of type MyFeaturesLayer
 */

export class MyFeaturesLayer extends UserDataLayer {
    constructor () {
        super(...arguments);
        this._layerType = 'myf';
    }
}

Oskari.clazz.defineES('Oskari.mapframework.MyFeaturesLayer', MyFeaturesLayer);
