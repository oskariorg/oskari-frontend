Oskari.clazz.define('Oskari.mapframework.Parcel.event.ParcelSelectedEvent', function(pParcel, dblClick) {
    this._creator = null;
    this._parcel = pParcel;
    this._dblClick = dblClick;
}, {
    __name : "Parcel.ParcelSelectedEvent",
    getName : function() {
        return this.__name;
    },
    getPlace : function() {
        return this._parcel;
    },
    isDblClick : function() {
        return this._dblClick;
    }
}, {
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */

