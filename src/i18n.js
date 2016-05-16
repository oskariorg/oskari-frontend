/**
 * Adds internalization support for Oskari
 */
(function(O) {
	var oskariLang = null;
	var defaultLang = null;
	var localizations = {};
	var supportedLocales = null;

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
        if (locales === null || locales === undefined) {
            throw new TypeError(
                'setSupportedLocales(): Missing locales'
            );
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
        if (lang === null || lang === undefined) {
            throw new TypeError(
                'setLang(): Missing lang'
            );
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
        var langs = [],
            supported = O.getSupportedLocales(),
            locale,
            i;

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

        if(supported.length === 0) {
            // supported locales not set, use current
            if (console && console.warn) {
                console.warn(
                    'Supported locales not set, using current language ' + this.getLang()
                );
            }
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
        var l = lang || oskariLang;
        if (key === null || key === undefined) {
            throw new TypeError(
                'getLocalization(): Missing key'
            );
        }
        if (!localizations) {
            return null;
        }
        if(localizations[l] && localizations[l][key]) {
            return localizations[l][key];
        } else {
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

                if(override && override === true){
                    if(pp.key && pp.lang){
                        loc = O.getLocalization(pp.key, pp.lang);
                    }

                    if(loc && loc !== null){
                        pp.value = jQuery.extend(true, {}, loc, pp.value);
                    }

                } else {
                    if(pp.key && pp.lang){
                        loc = O.getLocalization(pp.key, pp.lang);
                    }

                    if(loc && loc !== null){
                        pp.value = jQuery.extend(true, {}, pp.value, loc);
                    }
                }

                setLocalization(pp.lang, pp.key, pp.value);
            }

        } else {
            if(override && override === true){
                if(props.key && props.lang){
                    loc = O.getLocalization(props.key, props.lang);
                }

                if(loc && loc !== null){
                    props.value = jQuery.extend(true, {}, loc, props.value);
                }

            } else {
                if(props.key && props.lang){
                    loc = O.getLocalization(props.key, props.lang);
                }

                if(loc && loc !== null){
                    props.value = jQuery.extend(true, {}, props.value, loc);
                }
            }
            setLocalization(props.lang,props.key,props.value);

        }
    };

    // ------------------------------------------------
    // Decimal separators
    // ------------------------------------------------
    var decimalSeparators = [];

    /**
     * @public @method setDecimalSeparators
     *
     * @param {Object} decimalSeparators Decimal separators
     *
     */
    O.setDecimalSeparators = function (separators) {
        decimalSeparators = separators;
    };
    /**
     * @public @method getDecimalSeparator
     *
     * @return {string} Decimal separator
     */
    O.getDecimalSeparator =  function () {
        var me = this,
            lang = O.getLang();
        var locales = O.getSupportedLocales().filter(
                function (locale){
                    return locale.indexOf(lang) === 0;
                }
            );
        var separators = locales.map(function (locale) {
                    return me.getDecimalSeparators()[locale];
                }
            );

        if (separators.length > 1 &&console && console.warn) {
            console.warn(
                'Found more than one separator for ' + this.getLang()
            );
        }

        if (separators.length && separators[0]) {
            return separators[0];
        }
        return ','; // Most common separator
    };


    O.getDecimalSeparators = function () {
        return decimalSeparators;
    };
}(Oskari));
