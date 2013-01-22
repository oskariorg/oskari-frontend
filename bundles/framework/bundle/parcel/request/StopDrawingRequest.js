/**
 * @class Oskari.mapframework.bundle.parcel.request.StopDrawingRequest
 *
 * Handle request to stop drawing operation. This request does not require any properties.
 * Instead, the call itself informs about the state.
 */
Oskari.clazz.define('Oskari.mapframework.parcel.request.StopDrawingRequest', function() {
}, {
    /**
     * @method getName
     * Returns request name
     * @return {String} The request name.
     */
    getName : function() {
        return "Parcel.StopDrawingRequest";
    }
}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});
