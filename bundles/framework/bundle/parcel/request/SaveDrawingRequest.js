Oskari.clazz.define('Oskari.mapframework.parcel.request.SaveDrawingRequest', function(isCancel) {
    this._creator = null;
    this._isCancel = (isCancel == true);
}, {
    getName : function() {
        return "Parcel.SaveDrawingRequest";
    },
    isCancel : function() {
        return (this._isCancel === true);
    }
}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});
