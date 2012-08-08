Oskari.clazz.define('Oskari.mapframework.mapmodule-plugin.request.ToolSelectionRequest', function(toolId) {
    this._toolId = toolId;
    this._creator = null;
}, {
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
    __name : "ToolSelectionRequest",
    getName : function() {
        return this.__name;
    },
    getToolId : function() {
        return this._toolId;
    },
    setToolId : function(toolId) {
        this._toolId = toolId;
    },
    getNamespace : function() {
        if(this._toolId.indexOf('.') == -1) {
            return '';
        }
        // This should basically be the this._name of the sender
        return this._toolId.substring(0, this._toolId.lastIndexOf('.'));
    },
    getToolName : function() {
        if(this._toolId.indexOf('.') == -1) {
            return this._toolId;
        }
        return this._toolId.substring(this._toolId.lastIndexOf('.'));
    }
}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});
