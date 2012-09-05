/**
 * @class Oskari.mapframework.bundle.toolbar.event.ToolSelectedEvent
 * 
 * Used to notify components that a tool has been selected and 
 * components should cancel their tool related operations if any. 
 */
Oskari.clazz.define('Oskari.mapframework.bundle.toolbar.event.ToolSelectedEvent', 
/**
 * @method create called automatically on construction
 * @static
 * @param {String} toolId tool that was selected
 * @param {String} groupId group of the tool that was selected
 */
function(toolId, groupId) {
    this._toolId = toolId;
    this._groupId = groupId;
}, {
    /** @static @property __name event name */
    __name : "Toolbar.ToolSelectedEvent",
    /**
     * @method getName
     * Returns event name
     * @return {String}
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getToolId
     * Returns id for the tool that was selected
     * @return {String}
     */
    getToolId : function() {
        return this._toolId;
    },
    /**
     * @method getGroupId
     * Returns group id for the tool that was selected
     * @return {String}
     */
    getGroupId : function() {
        return this._groupId;
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
