/**
 * Model for indicator
 *
 * 
 *   {
    "id": 4,
    "title": {
        "fi": "Mielenterveyden häiriöihin sairaalahoitoa saaneet 0 - 17-vuotiaat / 1 000 vastaavanikäistä",

        "en": "Hospital care for mental disorders, recipients aged 0-17 per 1000 persons of the same age",
        "sv": "0 - 17-åringar som vårdats på sjukhus för psykiska störningar / 1 000 i samma åldrar"
    },
    "organization": {
        "id": 2,
        "title": {
            "fi": "Terveyden ja hyvinvoinnin laitos (THL)",
            "en": "Institute for Health and Welfare (THL)",
            "sv": "Institutet för hälsa och välfärd (THL)"
        }
    },
    "classifications": {
        "sex": {
            "values": ["male", "female", "total"]
        },
        "region": {
            "values": ["Kunta", "Maakunta", "Erva", "Aluehallintovirasto", "Sairaanhoitopiiri", "Maa", "Suuralue", "Seutukunta", "Nuts1"]
        }
    }
}
 * 
 * @class Oskari.statistics.bundle.statsgrid.domain.Indicator
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.domain.Indicator',
/**
 * @method create called automatically on construction
 * @static
 */
function(data) {
	this.data = data || {};
    this.indicatorParams = [];
    this.__parseClassifications(data);
}, {
    /**
     * 
        {
            "sex": {
                "values": ["male", "female", "total"]
            },
            "region": {
                "values": ["Kunta", "Maakunta", "Erva", "Aluehallintovirasto", "Sairaanhoitopiiri", "Maa", "Suuralue", "Seutukunta", "Nuts1"]
            }
        }
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    __parseClassifications : function(data) {

        if(!data.classifications) {
            return;
        }
        this.indicatorParams = _.map(data.classifications, function(item, id) {
            return {
                "name" : id,
                "values" : item.values
            };
        });
    },
    /**
     * Returns id
     * @method getId
     * @return {String}
     */
    getId : function() {
    	if(!this.data.id) {
    		return;
    	}
		return this.data.id;
    },

    /**
     * @method getName
     * Returns event name
     * @return {String} The event name.
     */
    getName : function(lang) {
    	if(!this.data.title) {
    		return;
    	}
        if(!lang) {
            lang = Oskari.getLang();
        }
    	if(this.data.title[lang]) {
    		return this.data.title[lang];
    	}
    	return this.data.title;
    },
    /**
     * Returns possible option values for this indicator
     * @method getParamValues
     * @params {String} param name
     * @return {String[]} list of values available for indicator
     */
    getParamValues : function(param) {
        if(!this.data.classifications || !this.data.classifications[param]) {
            return [];
        }
        return this.data.classifications[param].values || [];
    },
    setMetadata : function(data) {
        this.metadata = data;
    },
    getMetadata : function() {
        return this.metadata;
    }
});