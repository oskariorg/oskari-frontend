/**
 * Requests a search result action to be removed.
 * 
 * @class Oskari.mapframework.bundle.search.request.RemoveSearchResultActionRequest
 */
Oskari.clazz.define('Oskari.mapframework.bundle.search.request.RemoveSearchResultActionRequest',
/**
 * @method create called automatically on construction
 * @static
 */
function(linkName) {
    this._linkName = linkName;
},{
    /** @static @property __name request name */
    __name : "Search.RemoveSearchResultActionRequest",
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
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});