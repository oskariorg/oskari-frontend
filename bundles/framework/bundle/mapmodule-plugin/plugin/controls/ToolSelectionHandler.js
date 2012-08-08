Oskari.clazz.define('Oskari.mapframework.mapmodule.ToolSelectionHandler', function(sandbox, controlsPlugin) {

    this.sandbox = sandbox;
    this.controlsPlugin = controlsPlugin;
}, {
    __name : 'ToolSelectionHandler',
    getName : function() {
        return this.__name;
    },
    init : function(sandbox) {},
    handleRequest : function(core, request) {
        var toolId = request.getToolId();
        var namespace = request.getNamespace();
        var toolName = request.getToolName();
        if(toolName == 'map_control_tool_prev') {
            // custom history (TODO: more testing needed + do this with request instead of findRegisteredModuleInstance)
            var stateHandler = this.sandbox.findRegisteredModuleInstance('StateHandler');
            if(stateHandler) {
                stateHandler.historyMovePrevious();
            }
            
        } else if(toolName == 'map_control_tool_next') {
            // custom history (TODO: more testing needed + do this with request instead of findRegisteredModuleInstance)
            var stateHandler = this.sandbox.findRegisteredModuleInstance('StateHandler');
            if(stateHandler) {
                stateHandler.historyMoveNext();
            } 
        } else if(toolName == 'map_control_select_tool') {
            // clear selected area
           var slp = this.sandbox.findRegisteredModuleInstance('SketchLayerPlugin'); 
            if (slp) { slp.clearBbox(); }
        } else if(toolName == 'map_control_zoom_tool') {
            this.controlsPlugin._zoomBoxTool.activate();
        } else if(toolName == 'map_control_measure_tool') {
            this.controlsPlugin._measureControls.line.activate();
        } else if(toolName == 'map_control_measure_area_tool') {
            this.controlsPlugin._measureControls.area.activate();
        }
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
