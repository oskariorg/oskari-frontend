/**
 * @class Oskari.mapframework.parcel.request.CancelDrawingRequest
 * 
 * Informs that drawing operation is cancelled. This request does not require any properties.
 * Instead, the call itself informs about the state.
 */
Oskari.clazz.define('Oskari.mapframework.parcel.request.CancelDrawingRequest', function() {
}, {
    /**
     * @method getName
     * Returns request name
     * @return {String} The request name.
     */
    getName : function() {
        return "Parcel.CancelDrawingRequest";
    }
}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});
