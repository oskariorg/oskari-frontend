/**
 * @class Oskari.framework.bundle.statehandler.request.SetStateRequest
 * Requests state to be set
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.statehandler.request.SetStateRequest',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} state JSON presentation of application state (optional - uses startup state if not given)
 */
function(state) {
    this._creator = null;
    this._state = state;
    this._currentViewId = 1;
}, {
    /** @static @property __name request name */
    __name : "StateHandler.SetStateRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getState
     * @return {Object} JSON presentation of application state 
     */
    getState : function() {
        return this._state;
    },

    /**
     * @method getCurrentViewId
     * @return {Number} Current view ID
     */
    getCurrentViewId : function() {
	return this._currentViewId;
    },
    /**
     * @method setCurrentViewId
     */
    setCurrentViewId : function(currentViewId) {
	this.currentViewId = currentViewId;
    }
    
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});