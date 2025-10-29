import { WFSLayer } from '../../../mapping/mapmodule/plugin/wfsvectorlayer/WFSLayer';
/**
 * @class Oskari.mapframework.MyFeaturesLayer
 *
 * MapLayer of type MyFeaturesLayer
 */
export class MyFeaturesLayer extends WFSLayer {
    constructor () {
        super(...arguments);
        this._layerType = 'myf';
        this._featureCount = -1;
    }

    setFeatureCount (count) {
        this._featureCount = count;
    }

    getFeatureCount () {
        return this._featureCount;
    }

    /**
     * Internal information as link params might produce layers that are NOT this user's layers in the maplayerservice
     */
    markAsInternalDownloadSource () {
        this.__internalFlagForUsersOwnLayers = true;
    }

    isInternalDownloadSource () {
        return this.__internalFlagForUsersOwnLayers;
    }
}

// Oskari.clazz.defineES('Oskari.mapframework.MyFeaturesLayer', MyFeaturesLayer);
