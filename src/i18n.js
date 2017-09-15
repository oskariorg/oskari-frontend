/**
 * Adds internalization support for Oskari
 */
(function (O) {
    var oskariLang = 'en';
    var localizations = {};
    var supportedLocales = null;
    var log = Oskari.log('Oskari.deprecated');

    // ------------------------------------------------
    // Locales/lang
    // ------------------------------------------------
    /**
     * @public @method setSupportedLocales
     *
     * @param {string[]} locales Locales array
     *
     */
    O.setSupportedLocales = function (locales) {
        if (!locales) {
            return;
        }
        if (!Array.isArray(locales)) {
            throw new TypeError(
                'setSupportedLocales(): locales is not an array'
            );
        }
        supportedLocales = locales;
    };
    /**
     * @public @method getSupportedLocales
     *
     *
     * @return {string[]} Supported locales
     */
    O.getSupportedLocales = function () {
        return supportedLocales || [];
    };
    /**
     * @public @method setLang
     *
     * @param {string} lang Language
     *
     */
    O.setLang = function (lang) {
        if (!lang) {
            return;
        }
        oskariLang = lang;
    };

    /**
     * @public @method getLang
     *
     *
     * @return {string} Language
     */
    O.getLang = function () {
        return oskariLang || 'en';
    };

    /**
     * @public @method getSupportedLanguages
     *
     *
     * @return {string[]} Supported languages
     */
    O.getSupportedLanguages = function () {
        var langs = [];
        var supported = O.getSupportedLocales();
        var locale;
        var i;

        for (i = 0; i < supported.length; i += 1) {
            locale = supported[i];
            // FIXME what do if indexOf === -1?
            langs.push(locale.substring(0, locale.indexOf('_')));
        }
        return langs;
    };

    /**
     * @public @method getDefaultLanguage
     *
     *
     * @return {string} Default language
     */
    O.getDefaultLanguage = function () {
        var supported = O.getSupportedLocales();

        if (supported.length === 0) {
            return this.getLang();
        }
        var locale = supported[0];

        if (locale.indexOf('_') !== -1) {
            return locale.substring(0, locale.indexOf('_'));
        }
        return this.getLang();
    };

    // ------------------------------------------------
    // Locale strings
    // ------------------------------------------------

    /**
     * @public @method setLocalization
     *
     * @param {string}  lang  Language
     * @param {string}  key   Key
     * @param {string=} value Value
     *
     */
    var setLocalization = function (lang, key, value) {
        if (lang === null || lang === undefined) {
            throw new TypeError(
                'setLocalization(): Missing lang'
            );
        }
        if (key === null || key === undefined) {
            throw new TypeError(
                'setLocalization(): Missing key'
            );
        }
        if (!localizations[lang]) {
            localizations[lang] = {};
        }
        localizations[lang][key] = value;
    };
    /**
     * @public @method getLocalization
     *
     * @param  {string} key Key
     * @param  {string} lang Lang
     * @param  {boolean} fallbackToDefault whether to fall back to Oskari Default language in case localization is not found for given lang
     * @return {string}     Localized value for key
     */
    O.getLocalization = function (key, lang, fallbackToDefault) {
        log.deprecated('Oskari.getLocalization()', 'Use Oskari.getMsg() instead.');
        var l = lang || oskariLang;
        if (key === null || key === undefined) {
            throw new TypeError(
                'getLocalization(): Missing key'
            );
        }
        if (!localizations) {
            return null;
        }
        if (localizations[l] && localizations[l][key]) {
            return localizations[l][key];
        } else {
            var defaultLang = O.getDefaultLanguage();
            if (fallbackToDefault && localizations[defaultLang] && localizations[defaultLang][key]) {
                return localizations[defaultLang][key];
            } else {
                return null;
            }
        }
    };
    /**
     * @public @static @method Oskari.registerLocalization
     *
     * @param {Object|Object[]} props Properties
     * @param {Boolean} override override languages
     *
     */
    O.registerLocalization = function (props, override) {
        var p,
            pp,
            loc;

        if (props === null || props === undefined) {
            throw new TypeError('registerLocalization(): Missing props');
        }

        if (props.length) {
            for (p = 0; p < props.length; p += 1) {
                pp = props[p];

                if (override && override === true) {
                    if (pp.key && pp.lang) {
                        loc = O.getLocalization(pp.key, pp.lang);
                    }

                    if (loc && loc !== null) {
                        pp.value = jQuery.extend(true, {}, loc, pp.value);
                    }
                } else {
                    if (pp.key && pp.lang) {
                        loc = O.getLocalization(pp.key, pp.lang);
                    }

                    if (loc && loc !== null) {
                        pp.value = jQuery.extend(true, {}, pp.value, loc);
                    }
                }

                setLocalization(pp.lang, pp.key, pp.value);
            }
        } else {
            if (override && override === true) {
                if (props.key && props.lang) {
                    loc = O.getLocalization(props.key, props.lang);
                }

                if (loc && loc !== null) {
                    props.value = jQuery.extend(true, {}, loc, props.value);
                }
            } else {
                if (props.key && props.lang) {
                    loc = O.getLocalization(props.key, props.lang);
                }

                if (loc && loc !== null) {
                    props.value = jQuery.extend(true, {}, props.value, loc);
                }
            }
            setLocalization(props.lang, props.key, props.value);
        }
    };

    // ------------------------------------------------
    // Decimal separators
    // ------------------------------------------------
    var decimalSeparator;

    /**
     * @public @method setDecimalSeparator
     *
     * @param {String} separator to use. Defaults to ','
     *
     */
    O.setDecimalSeparator = function (separator) {
        if (!separator) {
            return;
        }
        decimalSeparator = separator;
    };
    /**
     * @public @method getDecimalSeparator
     *
     * @return {string} Decimal separator
     */
    O.getDecimalSeparator = function () {
        return decimalSeparator || ',';
    };

    /**
     * Returns a string from localized content.
     */
    O.getLocalized = function (locale, lang) {
        if (typeof locale !== 'object') {
            return locale;
        }
        if (!lang) {
            lang = Oskari.getLang();
        }
        var value = locale[lang];
        if (!value) {
            value = locale[Oskari.getDefaultLanguage()];
        }
        if (!value) {
            for (var key in locale) {
                if (locale[key]) {
                    // any locale will do at this point
                    return locale[key];
                }
            }
        }
        return value;
    };
    var intlCache = {};
    function resolvePath(key, path) {
        var ob = O.getLocalization(key);
        var parts = path.split('.');
        for (var i = 0; i < parts.length; i++) {
            ob = ob[parts[i]];
            if (!ob) {
                if(i === parts.length-1 && ob === '') {
                    return ob;
                }
                return null;
            }
        }
        return ob;
    }
    O.getMsg = function (key, path, values) {
        var message;
        if (!values) {
            message = resolvePath(key, path);
            if(message === null) {
                return path;
            }
            return message;
        }
        var cacheKey = oskariLang + '_' + key + '_' + path;
        var formatter = intlCache[cacheKey];
        if (!formatter) {
            message = resolvePath(key, path);
            if(message === null) {
                return path;
            }
            formatter = new IntlMessageFormat(message, oskariLang);
            intlCache[cacheKey] = formatter;
        }
        return formatter.format(values);
    };
}(Oskari));
