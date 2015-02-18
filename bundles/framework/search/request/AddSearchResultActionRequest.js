/**
 * Requests a link to be added to a search result popup which triggers the action givem.
 * 
 * @class Oskari.mapframework.bundle.search.request.AddSearchResultActionRequest
 */
Oskari.clazz.define('Oskari.mapframework.bundle.search.request.AddSearchResultActionRequest',
/**
 * @method create called automatically on construction
 * @static
 */
function(linkName, callback) {
    this._linkName = linkName;
    this._callback = callback;
},{
    /** @static @property __name request name */
    __name : "Search.AddSearchResultActionRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getLinkName
     * @return {String} link name
     */
    getLinkName : function() {
       return this._linkName;
    },
    /**
     * @method getCallback
     * @return {Function} callback function
     */
    getCallback : function() {
       return this._callback;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});