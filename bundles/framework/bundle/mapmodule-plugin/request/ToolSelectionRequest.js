/**
 * @class Oskari.mapframework.bundle.mapmodule.request.ToolSelectionRequest
 * 
 * Requests a tool to be activated on the map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.ToolSelectionRequest', 
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            toolId id for the tool to select
 */
function(toolId) {
    this._toolId = toolId;
}, {
    /** @static @property tools available tools to select */
    tools : {
        navigate : 'map_control_navigate_tool',
        previous : 'map_control_tool_prev',
        next : 'map_control_tool_prev',
        select : 'map_control_select_tool',
        zoom : 'map_control_zoom_tool',
        draw_area : 'map_control_draw_area_tool',
        measure : 'map_control_measure_tool',
        measure_area : 'map_control_measure_area_tool',
        info : 'map_control_show_info_tool'
    },
    /** @static @property __name request name */
    __name : "ToolSelectionRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getToolId
     * @return {String}
     */
    getToolId : function() {
        return this._toolId;
    },
    /**
     * @method setToolId
     * @param {String} toolId
     */
    setToolId : function(toolId) {
        this._toolId = toolId;
    },
    /**
     * @method getNamespace
     * If the toolId has . this returns the first part of the toolId, otherwise returns empty string
     * @return {String}
     */
    getNamespace : function() {
        if(this._toolId.indexOf('.') == -1) {
            return '';
        }
        // This should basically be the this._name of the sender
        return this._toolId.substring(0, this._toolId.lastIndexOf('.'));
    },
    /**
     * @method getToolName
     * If the toolId has . this returns the last part of the toolId, otherwise returns the toolId as is 
     * @return {String}
     */
    getToolName : function() {
        if(this._toolId.indexOf('.') == -1) {
            return this._toolId;
        }
        return this._toolId.substring(this._toolId.lastIndexOf('.'));
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});
