/**
 * @class Oskari.mapframework.request.action.ActionStartRequest
 * This request tells that some kind of long running action was started. It can
 * be used to notify e.g. that loading of WMS layer has started
 *
 */
Oskari.clazz.define('Oskari.mapframework.request.action.ActionStartRequest',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Object}
 *            id unique string representing task
 * @param {Object}
 *            actionDescription what kind of action is started
 * @param {Object}
 *            wfsPngAction is this wfsPng retrieval or not
 */
function(id, actionDescription, wfsPngAction) {
    this._creator = null;
    this._id = id;

    this._actionName = actionDescription;

    /* Is this action for a wfs png tile? */
    this._wfsPngAction = wfsPngAction;
}, {
    /** @static @property __name request name */
    __name : "ActionStartRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getId
     * @return {String} unique id representing task
     */
    getId : function() {
        return this._id;
    },
    /**
     * @method getActionDescription
     * @return {String} description text
     */
    getActionDescription : function() {
        return this._actionName;
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