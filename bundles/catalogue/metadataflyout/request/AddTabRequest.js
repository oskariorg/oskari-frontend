/**
 * @class Oskari.mapframework.bundle.personaldata.request.AddTabRequest
 * Requests tab to be added
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.catalogue.request.AddTabRequest',
/**
 * @method create called automatically on construction
 * @static
 */
function(data) {
    this._data = data;
},{
    /** @static @property __name request name */
    __name : "catalogue.AddTabRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getData
     * @return {String} tab data
     */
    getData : function() {
       return this._data;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});