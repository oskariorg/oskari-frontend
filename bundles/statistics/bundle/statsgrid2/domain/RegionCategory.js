/**
 * Model for region category
 *
 * 
 *   {
 *      "id" : 1,
 *      "locale" : {
 *          "fi" : "Kunta"
 *      }
 *  }
 * 
 * @class Oskari.statistics.bundle.statsgrid.domain.RegionCategory
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.domain.RegionCategory',
/**
 * @method create called automatically on construction
 * @static
 */
function(data) {
	this.data = data || {};
	this.regions = [];
}, {
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
    	if(!this.data.locale) {
    		return;
    	}
    	if(this.data.locale[lang]) {
    		return this.data.locale[lang];
    	}
    	return this.data.locale;
    },
    setRegions : function(data) {
        this.regions = data || [];
    },
    getRegions : function() {
        return this.regions;
    }

});