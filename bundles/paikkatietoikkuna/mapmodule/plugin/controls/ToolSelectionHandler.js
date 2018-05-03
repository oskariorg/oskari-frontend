/**
 * @class Oskari.mapframework.mapmodule.ToolSelectionHandler
 * Handles ToolSelectionRequest requests
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.ToolSelectionHandler',

    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Oskari.Sandbox}
     *            sandbox reference to sandbox
     * @param {Oskari.mapframework.mapmodule.ControlsPlugin}
     *            controlsPlugin reference to controlsPlugin
     */

    function (sandbox, publisherToolbarPlugin) {
        this.sandbox = sandbox;
        this.publisherToolbarPlugin = publisherToolbarPlugin;
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
            var me = this;
            var toolName = request.getToolName();
            var stateHandler;
            var type = null;
            var id = null;
            var mapModule = me.publisherToolbarPlugin.getMapModule();
            switch ( toolName ) {
                case 'map_control_tool_prev':
                    // custom history (TODO: more testing needed + do this with request
                    // instead of findRegisteredModuleInstance)
                    stateHandler = me.sandbox.findRegisteredModuleInstance('StateHandler');
                    if (stateHandler) {
                        stateHandler.historyMovePrevious();
                    }
                    break;
                case 'map_control_tool_next':
                    // custom history (TODO: more testing needed + do this with request
                    // instead of findRegisteredModuleInstance)
                    stateHandler = me.sandbox.findRegisteredModuleInstance('StateHandler');
                    if (stateHandler) {
                        stateHandler.historyMoveNext();
                    }
                    break;
                case 'map_control_select_tool':
                    // clear selected area
                    var slp = me.sandbox.findRegisteredModuleInstance('SketchLayerPlugin');
                    if (slp) {
                        slp.clearBbox();
                    }
                    break;
                case 'map_control_zoom_tool':
                    mapModule.set3dEnabled(false);
                    me.publisherToolbarPlugin.mouseDragZoomInteraction();
                    break;
                case 'map_control_measure_tool':
                    type = 'LineString';
                    id = 'measureline';
                    me.sandbox.postRequestByName('DrawTools.StartDrawingRequest', [id, type, {
                                allowMultipleDrawing: 'single',
                                showMeasureOnMap: true}]);
                    break;
                case 'map_control_measure_area_tool':
                    type = 'Polygon';
                    id = 'measurearea';
                    me.sandbox.postRequestByName('DrawTools.StartDrawingRequest', [id, type, {
                                allowMultipleDrawing: 'single',
                                showMeasureOnMap: true}]);
                    break;
                default:
                    mapModule.set3dEnabled(true);
                    break;
            }
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });