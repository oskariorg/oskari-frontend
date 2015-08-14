/**
 * @class Oskari.mapframework.parcel.request.SaveDrawingRequest
 *
 * Informs that drawing save operation should be started. This request does not require any properties.
 * Instead, the call itself informs about the state.
 */
Oskari.clazz.define('Oskari.mapframework.parcel.request.SaveDrawingRequest', function() {
}, {
    /**
     * @method getName
     * Returns request name
     * @return {String} The request name.
     */
    getName : function() {
        return "Parcel.SaveDrawingRequest";
    }
}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});
