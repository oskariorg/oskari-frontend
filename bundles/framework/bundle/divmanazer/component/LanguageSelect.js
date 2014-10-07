/**
 * @class Oskari.userinterface.component.LanguageSelect
 *
 * Language selection component. Locale files can be misused in other bundles
 * to list languages.
 */
Oskari.clazz.define('Oskari.userinterface.component.LanguageSelect',

    /**
     * @method create called automatically on construction
     */
    function () {
        'use strict';
        var me = this,
            i,
            languages,
            loc = Oskari.getLocalization('DivManazer').LanguageSelect,
            options = [];
        me._clazz = 'Oskari.userinterface.component.LanguageSelect';
        me._element.className =
            'oskari-formcomponent oskari-select oskari-languageselect';
        languages = Oskari.getSupportedLanguages();

        for (i = 0; i < languages.length; i += 1) {
            options.push({
                title: loc.languages[languages[i]] || languages[i],
                value: languages[i]
            });
        }
        me.setOptions(options);
        me.setName('language');
        me.setTitle(loc.title);
        me.setTooltip(loc.tooltip);
        me.setValue(Oskari.getLang());
    }, {
        /**
         * @method limitOptions
         * @param {Array} allowedValues Allowed language codes
         * Destructively filters options to allowed languages
         */
        limitOptions: function (allowedValues) {
            if (!Array.isArray(allowedValues)) {
                throw new TypeError(
                    this.getClazz() +
                        '.limitOptions: allowedValues is not an array'
                );
            }
            var els = this._select.querySelectorAll('option'),
                i;

            for (i = els.length - 1; i > -1; i -= 1) {
                if (allowedValues.indexOf(els[i].value) === -1) {
                    this._select.removeChild(els[i]);
                }
            }
        }
    }, {
        extend: ['Oskari.userinterface.component.Select']
    }
    );