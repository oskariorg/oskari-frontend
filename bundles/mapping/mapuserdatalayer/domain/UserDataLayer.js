import { WFSLayer } from '../../mapwfs2/domain/WFSLayer';
import { DESCRIBE_LAYER } from '../../mapmodule/domain/constants';

export class UserDataLayer extends WFSLayer {
    constructor () {
        super(...arguments);
        this._locale = {};
        this.__internalFlagForUsersOwnLayers = false;
        this._describeLayerStatus = DESCRIBE_LAYER.PREDEFINED;
    }

    isFilterSupported () {
        return false;
    }

    getName (lang) {
        return this.getValueFromLocale('name', lang);
    }

    getLocale () {
        return this._locale;
    }

    setLocale (locale) {
        this._locale = locale;
    }

    getLocaleValues () {
        const values = Oskari.getLocalized(this._locale) || {};
        return Object.keys(values).reduce((sanitized, key) => {
            sanitized[key] = Oskari.util.sanitize(values[key]);
            return sanitized;
        }, {});
    }

    getValueFromLocale (key, lang = Oskari.getLang()) {
        let value = this._locale[lang]?.[key];
        if (!value || !value.trim().length) {
            value = this._locale[Oskari.getDefaultLanguage()]?.[key] || '';
        }
        return Oskari.util.sanitize(value);
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
