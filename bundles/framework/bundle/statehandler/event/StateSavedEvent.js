/**
 * @class Oskari.mapframework.bundle.statehandler.event.StateSavedEvent
 * 
 * This is used to notify that application state has been saved and any listing should refresh
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.statehandler.event.StateSavedEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} state JSON presentation of application state 
 */
    function(name, state) {
    	this._name = name;
    	this._state = state;
}, {
    /** @static @property __name event name */
    __name : "StateSavedEvent",
    getName : function() {
        return this.__name;
    },
    /**
     * @method getViewName
     * @return {String} name of the saved view 
     */
    getViewName : function() {
        return this._name;
    },
    /**
     * @method getState
     * @return {Object} JSON presentation of application state 
     */
    getState : function() {
        return this._state;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : [ 'Oskari.mapframework.event.Event' ]
});
