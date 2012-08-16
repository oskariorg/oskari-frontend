/**
 * @class Oskari.mapframework.bundle.featuredataDownload.ui.module.Locale
 * Localization data for Featuredata-Download bundle
 */
Oskari.clazz.define('Oskari.mapframework.bundle.featuredataDownload.ui.module.Locale',

/**
 * @method create called automatically on construction
 * @static
 * @param lang
 * 		current language ['fi'|'sv'|'en']
 */
function(lang) {
    this.lang = lang;
    this.loc = this.__locale[lang];
}, {
    __locale : {
        'fi' : {
            // generic localization
            title : 'Tietotuotteen lataus',
            toolbarbuttontext : 'Tietotuotteen lataus',
            accept : 'Hyväksy',
            decline : 'Hylkää',
            errorOnLoad : 'Virhe tietotuotteen latauksessa',
            accessDenied : 'Sinulla ei ole latausoikeutta tähän tietotuotteeseen'
        },
        'sv' : {
            title : 'Ladda ner dataprodukten',
            toolbarbuttontext : 'Ladda ner dataprodukten',
            accept : 'Acceptera',
            decline : 'Avslå',
            errorOnLoad : 'Fel vid nedladdning av dataprodukten',
            accessDenied : 'Du saknar behörighet att ladda ner det här dataprodukten'
        },
        'en' : {
            title : 'Download data product',
            toolbarbuttontext : 'Download data product',
            accept : 'Accept',
            decline : 'Reject',
            errorOnLoad : 'Error in downloading data product',
            accessDenied : 'You have insufficient privileges for downloading this data product'
        }
    },
    /**
     * @method getCurrentLocale
     * Returns the localization data for current language
	 * @return {Object} JSON presentation of localization key/value pairs
     */
    getCurrentLocale : function() {
        return this.loc;
    },
    /**
     * @method getLocale
     * Returns the localization data for requested language
	 * @param lang
	 * 		current language ['fi'|'sv'|'en']
	 * @return {Object} JSON presentation of localization key/value pairs   
     */
    getLocale : function(lang) {
        return this.__locale[lang];
    },
    /**
     * @method getLocale
     * Returns a single localized text matching the given key for current language
	 * @param {String} key
	 * 		localization key
	 * @return {String} localized text matching the key  
     */
    getText : function(key) {
        return this.loc[key];
    }
});
