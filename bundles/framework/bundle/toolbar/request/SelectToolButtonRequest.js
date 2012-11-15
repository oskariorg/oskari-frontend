/**
 * @class Oskari.mapframework.bundle.toolbar.request.SelectToolButtonRequest
 * Requests for toolbar to act as if user had clicked a button or returns a defuult tool if
 * create params aren't given.
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.toolbar.request.SelectToolButtonRequest', 
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            id identifier for the button (optional)
 * @param {String}
 *            group identifier for button group (ignored if id is not given)
 */
function(id, group) {
    this._id = id;
    this._group = group;
}, {
    /** @static @property __name request name */
    __name : "Toolbar.SelectToolButtonRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getId
     * @return {String} identifier for the button
     */
    getId : function() {
        return this._id;
    },
    /**
     * @method getGroup
     * @return {String} identifier for button group
     */
    getGroup : function() {
        return this._group;
    }
}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});