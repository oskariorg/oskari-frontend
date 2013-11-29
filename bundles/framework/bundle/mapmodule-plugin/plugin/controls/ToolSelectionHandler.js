/**
 * @class Oskari.mapframework.mapmodule.ToolSelectionHandler
 * Handles ToolSelectionRequest requests
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.ToolSelectionHandler',

    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Oskari.mapframework.sandbox.Sandbox}
     *            sandbox reference to sandbox
     * @param {Oskari.mapframework.mapmodule.ControlsPlugin}
     *            controlsPlugin reference to controlsPlugin
     */

    function (sandbox, controlsPlugin) {

        this.sandbox = sandbox;
        this.controlsPlugin = controlsPlugin;
    }, {
        /**
         * @method handleRequest
         * Handles the request
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox
         * core.getSandbox())
         * @param {Oskari.mapframework.bundle.mapmodule.request.ToolSelectionRequest}
         * request
         *      request to handle
         */
        handleRequest: function (core, request) {
            var toolId = request.getToolId();
            var namespace = request.getNamespace();
            var toolName = request.getToolName();
            var stateHandler;
            if (toolName === 'map_control_tool_prev') {
                // custom history (TODO: more testing needed + do this with request
                // instead of findRegisteredModuleInstance)
                stateHandler = this.sandbox.findRegisteredModuleInstance('StateHandler');
                if (stateHandler) {
                    stateHandler.historyMovePrevious();
                }

            } else if (toolName === 'map_control_tool_next') {
                // custom history (TODO: more testing needed + do this with request
                // instead of findRegisteredModuleInstance)
                stateHandler = this.sandbox.findRegisteredModuleInstance('StateHandler');
                if (stateHandler) {
                    stateHandler.historyMoveNext();
                }
            } else if (toolName === 'map_control_select_tool') {
                // clear selected area
                var slp = this.sandbox.findRegisteredModuleInstance('SketchLayerPlugin');
                if (slp) {
                    slp.clearBbox();
                }
            } else if (toolName === 'map_control_zoom_tool' && this.controlsPlugin._zoomBoxTool) {
                this.controlsPlugin._zoomBoxTool.activate();
            } else if (toolName === 'map_control_measure_tool' && this.controlsPlugin._measureControls) {
                this.controlsPlugin._measureControls.line.activate();
            } else if (toolName === 'map_control_measure_area_tool' && this.controlsPlugin._measureControls) {
                this.controlsPlugin._measureControls.area.activate();
            }
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });