/**
 * @class Oskari.mapframework.bundle.parcel.request.DeleteCategoryRequest
 * Requests a "parcel" maplayer/category to be deleted
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.request.DeleteCategoryRequest', 

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Number}
 *            categoryId id of category to be edited
 */
function(categoryId) {
    this._categoryId = categoryId;
}, {
    __name : "Parcel.DeleteCategoryRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getId
     * @return {Number} id of category to be deleted
     */
    getId : function() {
        return this._categoryId;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});