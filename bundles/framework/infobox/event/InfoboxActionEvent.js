/**
 * @class Oskari.mapframework.bundle.infobox.event.InfoboxActionEvent
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.infobox.event.InfoboxActionEvent',
/**
 * @method create called automatically on construction
 * @static
 */
function(id, action, params) {
    this._id = id;
    this._action = action;
    this._params = params;
}, {
    /** @static @property __name event name */
    __name : "InfoboxActionEvent",
    /**
     * @method getName
     * @return {String} the name for the event
     */
    getName : function() {
        return this.__name;
    },
    getId : function() {
        return this._id;
    },
    getAction : function() {
        return this._action;
    },
    getActionParams : function() {
        return this._params;
    },
    /**
     * Serialization for RPC
     * @return
     */
    getParams: function () {
        return {
        	id: this._id,
        	action: this._action,
        	params: this._params
        };
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
