/**
 * @class Oskari.mapframework.request.action.ActionReadyRequest
 * This request marks some ongoing action ready. It can be used to notify e.g.
 * that WMS layer has been loaded
 */
Oskari.clazz.define('Oskari.mapframework.request.action.ActionReadyRequest', 

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Object}
 *            id string of task that has been previously started. See
 * Oskari.mapframework.request.action.ActionStartRequest
 * @param {Object}
 *            wfsPngAction is this action wfsPNG or not
 */
function(id, wfsPngAction) {
    this._creator = null;
    this._id = id;

    /* Is this action for a png tile request */
    this._wfsPngAction = wfsPngAction;

}, {
    /** @static @property __name request name */
    __name : "ActionReadyRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getId
     * @return {String} unique id representing task. See
 	 * Oskari.mapframework.request.action.ActionStartRequest
     */
    getId : function() {
        return this._id;
    },
    /**
     * @method isWfsPngAction
     * @return {Boolean}
     */
    isWfsPngAction : function() {
        return this._wfsPngAction;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});

/* Inheritance */