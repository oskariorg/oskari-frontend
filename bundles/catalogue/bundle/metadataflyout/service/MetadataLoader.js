/**
 * @class Oskari.catalogue.bundle.metadataflyout.service.MetadataLoader
 *
 * Class to load metadata content from backend
 *
 */
Oskari.clazz.define(
    'Oskari.catalogue.bundle.metadataflyout.service.MetadataLoader',
    function (baseUrl) {
        this.baseUrl = baseUrl;
    }, {
        /**
         * @public @method getCSWData
         *
         * @param {string}   uuid            Metadata UUID
         * @param {string}   lang            Metadata language
         * @param {function} successCallback Success callback function
         * @param {function} errorCallback   Error callback function
         *
         */
        getCSWData: function (uuid, lang, successCallback, errorCallback) {
            var err = this._checkArgs(
                    uuid,
                    lang,
                    successCallback,
                    errorCallback
                ),
                uri;

            if (err) {
                throw new TypeError(err);
            }

            uri = this.baseUrl + 'action_route=GetCSWData&uuid=' + uuid +
                '&lang=' + lang;

            jQuery.ajax({
                url: uri,
                dataType: 'json',
                success: successCallback,
                error: errorCallback
            });
        },

        /**
         * @private @method _isMissing
         *
         * @param value
         *
         * @return {Boolean} whether the value is missing or not
         */
        _isMissing: function (value) {
            return value === null || value === undefined;
        },

        /**
         * @private @method _checkArgs
         *
         * @param {string}    uuid            Metadata UUID
         * @param {string}    lang            Metadata language
         * @param {function}  successCallback Success callback function
         * @param {function}  errorCallback   Error callback function
         *
         * @return {string[]}                 Errors
         */
        _checkArgs: function (uuid, lang, successCallback, errorCallback) {
            var exceptions = [],
                base = 'getCSWData():\n  -',
                ret = null;

            if (this._isMissing(uuid)) {
                exceptions.push('missing uuid');
            }

            if (this._isMissing(lang)) {
                exceptions.push('missing lang');
            }

            if (this._isMissing(successCallback)) {
                exceptions.push('missing successCallback');
            } else if (typeof successCallback !== 'function') {
                exceptions.push('successCallback is not a function');
            }

            if (this._isMissing(errorCallback)) {
                exceptions.push('missing errorCallback');
            } else if (typeof errorCallback !== 'function') {
                exceptions.push('errorCallback is not a function');
            }

            if (this._isMissing(this.baseUrl)) {
                exceptions.push('missing baseUrl, check your config');
            }

            if (exceptions.length) {
                ret = base + exceptions.join('\n  -');
            }

            return ret;
        }
    }
);
