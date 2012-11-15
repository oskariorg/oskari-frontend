/**
 * @class Oskari.framework.bundle.toolbar.request.RemoveToolButtonRequest
 * Requests for toolbar to remove button with given id/group
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.toolbar.request.RemoveToolButtonRequest', 
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            id identifier so we can manage the button with subsequent requests
 * @param {String}
 *            group identifier for organizing buttons
 */
function(id, group) {
    this._id = id;
    this._group = group;
}, {
    /** @static @property __name request name */
    __name : "Toolbar.RemoveToolButtonRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getId
     * @return {String} identifier so we can manage the button with subsequent requests
     */
    getId : function() {
        return this._id;
    },
    /**
     * @method getGroup
     * @return {String} identifier for organizing buttons
     */
    getGroup : function() {
        return this._group;
    }
}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});