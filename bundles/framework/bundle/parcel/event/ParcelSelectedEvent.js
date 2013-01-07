/**
 * @class Oskari.mapframework.Parcel.event.ParcelSelectedEvent
 *
 * Use to notify that given parcel has been selected.
 */
Oskari.clazz.define('Oskari.mapframework.Parcel.event.ParcelSelectedEvent',
/**
 * @method create called automatically on construction
 * @static
 * @param {OpenLayer.Feature.Vector} pParcel The parcel feature.
 */
function(pParcel) {
    this._parcel = pParcel;
}, {
    /**
     * @method getName
     * @return {String} The event name.
     */
    getName : function() {
        return "Parcel.ParcelSelectedEvent";
    },
    /**
     * @method getPlace
     * @return {OpenLayer.Feature.Vector} The parcel feature.
     */
    getPlace : function() {
        return this._parcel;
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});
