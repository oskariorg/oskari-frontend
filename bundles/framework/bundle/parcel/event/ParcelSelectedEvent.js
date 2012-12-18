Oskari.clazz.define('Oskari.mapframework.Parcel.event.ParcelSelectedEvent', function(pParcel) {
    this._parcel = pParcel;
}, {
    __name : "Parcel.ParcelSelectedEvent",
    getName : function() {
        return this.__name;
    },
    getPlace : function() {
        return this._parcel;
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */

