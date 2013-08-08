/**
 * @class Oskari.lupapiste.bundle.myplaces2.request.EditPlaceRequest
 * Requests a saved "my place" to be opened for editing
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.lupapiste.bundle.myplaces2.request.EditPlaceRequest', 

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Number}
 *            placeId id of place to be edited
 */
function(placeId) {
    this._placeId = placeId;
}, {
    __name : "MyPlaces.EditPlaceRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getId
     * @return {Number} id of place to be edited
     */
    getId : function() {
        return this._placeId;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});