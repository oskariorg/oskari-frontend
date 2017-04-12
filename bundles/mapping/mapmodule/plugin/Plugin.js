/**
 * @class Oskari.mapframework.ui.module.common.mapmodule.Plugin
 *
 * Interface/protocol definition for map plugins
 */
Oskari.clazz.define('Oskari.mapframework.ui.module.common.mapmodule.Plugin',
/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function() {
    throw "Oskari.mapframework.ui.module.common.mapmodule.Plugin should not be instantiated";
}, {
    /**
     * @method getName
     * Interface method for all plugins, should return plugin name
     * @return {String} plugin name
     * @throws always override this
     */
    getName : function() {
        throw "Implement your own";
    },

    /**
     * @method setMapModule
     * Sets reference to reference to map module
     * @param {Oskari.mapframework.ui.module.common.MapModule} mapModule
     */
    setMapModule : function(mapModule) {
        throw "Implement your own";
    },

    /**
     * @method register
     * Interface method for the module protocol
     */
    register : function() {
        throw "Implement your own";
    },
    /**
     * @method unregister
     * Interface method for the module protocol
     */
    unregister : function() {
        throw "Implement your own";
    },

    /**
     * @method startPlugin
     *
     * Interface method for the plugin protocol. Should registers requesthandlers and
     * eventlisteners.
     *
     * @param {Oskari.Sandbox} sandbox
     *          reference to application sandbox
     */
    startPlugin : function(sandbox) {
        throw "Implement your own";
    },
    /**
     * @method stopPlugin
     *
     * Interface method for the plugin protocol. Should unregisters requesthandlers and
     * eventlisteners.
     *
     * @param {Oskari.Sandbox} sandbox
     *          reference to application sandbox
     */
    stopPlugin : function(sandbox) {
        throw "Implement your own";
    },

    /**
     * @property {Object} eventHandlers
     * Best practices: defining which
     * events bundle is listening and how bundle reacts to them
     * @static
     */
    eventHandlers : {},

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    }
});
