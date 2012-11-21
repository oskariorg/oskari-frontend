/**
 * @class Oskari.mapframework.bundle.mapmodule.request.ClearHistoryRequest
 * 
 * Request to clear any map navigation history data from the system.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.ClearHistoryRequest', 

/**
 * @method create called automatically on construction
 * @static
 */
function() {
}, {
    /** @static @property __name request name */
    __name : "ClearHistoryRequest",
    /**
     * @method getName
     * @return {String} the name for the request 
     */
    getName : function() {
        return this.__name;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});
