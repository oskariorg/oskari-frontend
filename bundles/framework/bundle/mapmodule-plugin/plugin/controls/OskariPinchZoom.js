/**
The draw method has been copypasted from OpenLayers.Control.Navigation and custom code hooks have been 
added to it as needed to get Oskari events sent from map movements and hovering. Kinetic movement messes up location
on Oskari so disabling it.

Note! Windows Phone pinch zoom requires fractionalZoom to be used and an additional css-class to be added
to map div. 
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

    /**
     * Method: pinchDone
     *
     * Parameters:
     * evt - {Event}
     * start - {Object} pinch data object related to the touchstart event that
     *     started the pinch gesture.
     * last - {Object} pinch data object related to the last touchmove event
     *     of the pinch gesture. This give us the final scale of the pinch.
     */
    pinchDone: function(evt, start, last) {
        OpenLayers.Control.PinchZoom.prototype.pinchDone.apply(this, arguments);
        this.mapmodule.notifyMoveEnd();
    }
});