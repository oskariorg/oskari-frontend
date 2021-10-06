/**
 * @class Oskari.mapframework.bundle.myplacesimport.domain.UserLayer
 *
 * MapLayer of type UserLayer
 */
const WFSLayer = Oskari.clazz.get('Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer');

export class UserLayer extends WFSLayer {
    constructor () {
        super(...arguments);
        this._layerType = 'USERLAYER';
        this._metaType = 'USERLAYER';
        this.description = undefined;
        this.source = undefined;
    }

    /**
     * @override
     */
    isFilterSupported () {
        return false;
    }

    setDescription (desc) {
        this.description = desc;
    }

    getDescription () {
        if (this.description) {
            return Oskari.util.sanitize(this.description);
        }
        return this.description;
    }

    setSource (source) {
        this.source = source;
    }

    getSource () {
        if (this.source) {
            return Oskari.util.sanitize(this.source);
        }
        return this.source;
    }

    /**
     * Internal information as link params might produce userlayers that are NOT this users layers in the maplayerservice
     * @param {String} src set by myplacesimport if this is truely
     */
    markAsInternalDownloadSource () {
        this.__internalFlagForUsersOwnLayers = true;
    }

    isInternalDownloadSource () {
        return this.__internalFlagForUsersOwnLayers;
    }
}

Oskari.clazz.defineES('Oskari.mapframework.bundle.myplacesimport.domain.UserLayer', UserLayer);
