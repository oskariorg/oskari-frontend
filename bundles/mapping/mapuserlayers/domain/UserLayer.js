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
        this._locale = {};
    }

    /**
     * @override
     */
    isFilterSupported () {
        return false;
    }

    getLocale () {
        return this._locale;
    }

    setLocale (locale) {
        this._locale = locale;
    }

    getDescription () {
        return this.getLocalizedValue('desc');
    }

    getSource () {
        return this.getLocalizedValue('source');
    }

    getLocalizedValue (key, lang = Oskari.getLang()) {
        const locale = this.getLocale();
        let values = locale[lang] || {};
        let value = values[key];
        if (!value) {
            values = locale[Oskari.getDefaultLanguage()] || {};
            value = values[key];
        }
        if (value) {
            return Oskari.util.sanitize(value);
        }
        return '';
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
