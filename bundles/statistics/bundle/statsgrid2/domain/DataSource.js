/**
 * Model for datasource
 *
 * 
 *   {
 *      "id" : 1,
 *      "locale" : {
 *          "fi" : "SotkaNet"
 *      },
 *      "indicatorParams" : 
 *      [{
 *          "name" : "year"
 *      }]
 *  }
 * 
 * @class Oskari.statistics.bundle.statsgrid.domain.DataSource
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.domain.DataSource',
/**
 * @method create called automatically on construction
 * @static
 */
function(data) {
	this.data = data || {};
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
    /**
     * @method getIndicatorParams
     * Returns options to be shown for indicators of this data source
     * {
 	 *   "name" : "year"
 	 * }
     * @return {Object[]} 
     */
    getIndicatorParams : function() {
    	if(!this.data.indicatorParams) {
    		return [];
    	}
    	return this.data.indicatorParams;
    },
    /**
     * @method getIndicatorListUrl
     * Returns url to get indicators for this datasource
     * @return {String} 
     */
    getIndicatorListUrl : function() {
    	if(!this.data.indicatorURL) {
    		return Oskari.getSandbox().getAjaxUrl() + "action_route=Indicators&datasource=" + this.getId();
    	}
    	return this.data.indicatorURL;
    },
    /**
     * @method getIndicatorMetadataUrl
     * Returns url to get indicators for this datasource
     * @return {String} 
     */
    getIndicatorMetadataUrl : function(id) {
    	if(!this.data.indicatorMetadataURL) {
    		return Oskari.getSandbox().getAjaxUrl() + "action_route=IndicatorMetadata&datasource=" + this.getId() + "&id=" + id;
    	}
    	return this.data.indicatorMetadataURL + id;
    }

});