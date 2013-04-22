Oskari.clazz.define(
    'Oskari.digiroad.myplaces.request.FinishRestrictionRequest',
    function(isCancel, data, callback) {
        this._creator = null;
        this._isCancel = isCancel;
        this._data = data;
        this._callback = callback;
    }, {
        __name : "DigiroadMyPlaces.FinishRestrictionRequest",
        getName : function() {
            return this.__name;
        },
        isCancel : function() {
            return this._isCancel;
        },
        getData: function() {
            return this._data;
        },
        getCallback: function() {
            return this._callback;
        }
    }, {
        'protocol' : ['Oskari.mapframework.request.Request']
    }
);