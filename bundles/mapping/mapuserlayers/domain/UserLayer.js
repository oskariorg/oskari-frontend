import { UserDataLayer } from '../../mapuserdatalayer/domain/UserDataLayer';
/**
 * @class Oskari.mapframework.bundle.myplacesimport.domain.UserLayer
 *
 * MapLayer of type UserLayer
 */

export class UserLayer extends UserDataLayer {
    constructor () {
        super(...arguments);
        this._layerType = 'USERLAYER';
        this._metaType = 'USERLAYER';
    }
}

Oskari.clazz.defineES('Oskari.mapframework.bundle.myplacesimport.domain.UserLayer', UserLayer);
