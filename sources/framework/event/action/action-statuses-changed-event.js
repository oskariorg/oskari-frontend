/**
 * @class Oskari.mapframework.event.action.ActionStatusesChangedEvent
 * This event tells that some kind of long running action was started or
 * finished. It can be used to notify e.g. that loading of WMS layer has started
 * or finished loading.
 *
 * This is triggered when ever the core processes
 * Oskari.mapframework.request.action.ActionStartRequest or
 * Oskari.mapframework.request.action.ActionReadyRequest
 */
Oskari.clazz.define('Oskari.mapframework.event.action.ActionStatusesChangedEvent',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            currentlyRunningActionsDescriptions desriptions for the currently running tasks
 * See Oskari.mapframework.request.action.ActionStartRequest
 */
function(currentlyRunningActionsDescriptions) {
    this._creator = null;
    this._currentlyRunningActionsDescriptions = currentlyRunningActionsDescriptions;

}, {
    /** @static @property __name event name */
    "__name" : "ActionStatusesChangedEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getCurrentlyRunningActionsDescriptions
     * @return {String} descriptions for currently running actions
     */
    getCurrentlyRunningActionsDescriptions : function() {
        return this._currentlyRunningActionsDescriptions;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */