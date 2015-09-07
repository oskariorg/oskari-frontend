/**
Wraps pinchDone to hook a call to mapmodule notifyMoveEnd().
*/

// -------> voidaan poistaa
OskariPinchZoom = new ol.interaction.PinchZoom({

    /**
     * OpenLayers Constructor
     */
    initialize: function() {
        // Call the super constructor
        ol.interaction.PinchZoom.prototype.initialize.apply(this, arguments);
    },
    /* @method setup */
    setup : function(mapmodule) {
      this.mapmodule = mapmodule;
    },
    pinchDone: function() {
        ol.interaction.PinchZoom.prototype.pinchDone.apply(this, arguments);
        this.mapmodule.notifyMoveEnd();
    }
});