/**
 * @class Oskari.framework.bundle.statehandler.request.SaveStateRequest
 * Requests state to be saved
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.statehandler.request.SaveStateRequest',
/**
 * @method create called automatically on construction
 * @static
 * @param {String} viewname for the view to be saved
 */
function(viewname) {
    this._viewName = viewname;
}, {
    /** @static @property __name request name */
    __name : "StateHandler.SaveStateRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getViewName
     * @return {String} name for the view to be saved
     */
    getViewName : function() {
        return this._viewName;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});