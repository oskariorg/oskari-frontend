/**
 * @class Oskari.mapframework.bundle.mapmodule.request.MapMovementControlsRequestHandler
 * Handles map movement control requests
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.MapMovementControlsRequestHandler', 
/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.ui.module.common.MapModule} mapModule
 * 			reference to mapModule
 */
function(mapModule) {
    this.mapModule = mapModule; 
}, {
	/**
	 * @method handleRequest 
	 * Shows/hides the maplayer specified in the request in OpenLayers implementation.
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.mapframework.bundle.mapmodule.request.EnableMapMouseMovementRequest/
	 *         Oskari.mapframework.bundle.mapmodule.request.DisableMapMouseMovementRequest/
	 *         Oskari.mapframework.bundle.mapmodule.request.EnableMapKeyboardMovementRequest/
	 *         Oskari.mapframework.bundle.mapmodule.request.DisableMapKeyboardMovementRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
        if(request.getName() == 'EnableMapKeyboardMovementRequest') {
            var control = this.mapModule.getMapControl('keyboardControls');
            if(control) {
                control.activate();
            }
        }
        else if(request.getName() == 'DisableMapKeyboardMovementRequest') {
            var control = this.mapModule.getMapControl('keyboardControls');
            if(control) {
                control.deactivate();
            }
        }
        else if(request.getName() == 'EnableMapMouseMovementRequest') {
            var control = this.mapModule.getMapControl('mouseControls');
            if(control) {
                control.activate();
                control.registerMouseEvents();
            }
        }
        else if(request.getName() == 'DisableMapMouseMovementRequest') {
            var control = this.mapModule.getMapControl('mouseControls');
            if(control) {
                control.deactivate();
                control.unregisterMouseEvents();
            }
        }
        // should we notify other bundles with AfterEnableMapKeyboardMovementEvent/AfterDisableMapKeyboardMovementEvent
   }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
