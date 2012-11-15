/**
 * @class Oskari.framework.bundle.toolbar.request.ToolButtonStateRequest
 * Requests for toolbar to enable/disable a button.
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.toolbar.request.ToolButtonStateRequest', 
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            id identifier so we can manage the button with subsequent requests
 * @param {String}
 *            group identifier for organizing buttons
 * @param {Boolean}
 *            state true if enabled, false to disable
 */
function(id, group, state) {
    this._id = id;
    this._group = group;
    this._state = (state == true);
}, {
    /** @static @property __name request name */
    __name : "Toolbar.ToolButtonStateRequest",
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
    },
    /**
     * @method getState
     * @return {Boolean} true to enable, false to disable
     */
    getState : function() {
        return this._state;
    }
}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});

/* Inheritance */