/**
 * @class Oskari.clazz.define('Oskari.mapframework.bundle.printout.event.PrintWithoutUIEvent
 * 
 * 
 */
Oskari.clazz.define('Oskari.mapframework.bundle.printout.event.PrintWithoutUIEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {String} contentId
 *
 * @param {Object} printParams
 *          Parameters for to send backend print service
 * @param {Object} geojsonData
 */
function(contentId, printParams, geojsonData) {
    this._contentId = contentId;
    this._printParams = printParams;
    this._geojsonData = geojsonData;
}, {
    /**
     * @method getName
     * Returns event name
     * @return {String} The event name.
     */
    getName : function() {
        return "Printout.PrintWithoutUIEvent";
    },

    getContentId: function() {
        return this._contentId;
    },

    /**
     * Returns print parameters for backend
     *
     * @method getPrintParams
     * @return {Array[Object]} 
     */
    getPrintParams : function() {
        return this._printParams;
    },

 /**
     * Returns the geojson data used to generate output
     *
     * @method getGeoJsonData
     * @return {Object} 
     */
    getGeoJsonData : function() {
        return this._geojsonData;
    }

}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});