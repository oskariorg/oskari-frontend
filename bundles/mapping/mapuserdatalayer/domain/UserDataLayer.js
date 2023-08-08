import { AbstractVectorLayer } from '../../mapmodule/domain/AbstractVectorLayer';

export class UserDataLayer extends AbstractVectorLayer {
    constructor () {
        super(...arguments);
        this._locale = {};
        this.__internalFlagForUsersOwnLayers = false;
    }

    handleDescribeLayer () {
        // not supported
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

    getValueFromLocale = (key, lang = Oskari.getLang()) => {
        let value = this._locale[lang]?.[key];
        if (!value || !value.trim().length) {
            value = this._locale[Oskari.getDefaultLanguage()]?.[key] || '';
        }
        return Oskari.util.sanitize(value);
    }

    getProperties () {
        // like DescribeLayer properties for WFS layer
        // doesn't conatin hidden/filtered properties and rawType
        const labels = this.getPropertyLabels();
        const { data = {} } = this.getAttributes();
        return this.getPropertySelection().map(name => ({
            name,
            type: data.types[name],
            format: data.format[name], 
            label: labels[name]
        }));

    }

    getFieldFormatMetadata (field) {
        if (typeof field !== 'string') {
            return {};
        }
        return this.getAttributes()?.data?.format?.[field] || {};
    }

    getPropertySelection () {
        const filter =  this.getAttributes()?.data?.filter || {};
        return filter[Oskari.getLang()] || filter.default || filter[Oskari.getDefaultLanguage()] || [];
    }

    getPropertyLabels () {
        return Oskari.getLocalized(this.getAttributes()?.data?.locale) || {};
    }

    getPropertyTypes () {
        return this.getAttributes()?.data?.types || {};
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
