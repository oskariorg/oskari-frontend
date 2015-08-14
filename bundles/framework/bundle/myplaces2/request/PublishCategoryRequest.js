/**
 * @class Oskari.mapframework.bundle.myplaces2.request.PublishCategoryRequest
 * Requests a "my place" maplayer/category to be made publishable or private
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplaces2.request.PublishCategoryRequest', 

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Number}
 *            categoryId id of category to be edited
 * @param {Boolean}
 *            isPublic true to make layer publishable, false to make it private
 */
function(categoryId, isPublic) {
    this._categoryId = categoryId;
    this._isPublic = isPublic == true;
}, {
    __name : "MyPlaces.PublishCategoryRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getId
     * @return {Number} id of category to be edited
     */
    getId : function() {
        return this._categoryId;
    },
    /**
     * @method getId
     * @return {Number} id of category to be edited
     */
    isPublic : function() {
        return this._isPublic;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});