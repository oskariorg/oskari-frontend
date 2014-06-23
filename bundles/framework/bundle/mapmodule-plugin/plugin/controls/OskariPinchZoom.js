/**
Wraps pinchDone to hook a call to mapmodule notifyMoveEnd().
*/
OskariPinchZoom = OpenLayers.Class(OpenLayers.Control.PinchZoom, {

    /**
     * OpenLayers Constructor
     */
    initialize: function() {
        // Call the super constructor
        OpenLayers.Control.PinchZoom.prototype.initialize.apply(this, arguments);
    },
    /* @method setup */
    setup : function(mapmodule) {
      this.mapmodule = mapmodule;
    },
    pinchDone: function() {
        OpenLayers.Control.PinchZoom.prototype.pinchDone.apply(this, arguments);
        this.mapmodule.notifyMoveEnd();
    }
});