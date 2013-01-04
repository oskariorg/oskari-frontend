/**
 * @class Oskari.mapframework.bundle.parcel.event.FinishedDrawingEvent
 *
 * Used to notify components that the drawing has been finished.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.event.FinishedDrawingEvent',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
}, {
    /**
     * @method getName
     * Returns event name
     * @return {String} The event name.
     */
    getName : function() {
        return "Parcel.FinishedDrawingEvent";
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});
