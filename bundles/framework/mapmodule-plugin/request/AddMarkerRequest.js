Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.AddMarkerRequest', function (data, id, events, iconUrl) {
    this._creator = null;
    this._data = data;
    this._id = id;
    this._events = events;
    this._iconUrl = iconUrl;
}, {
    __name: 'MapModulePlugin.AddMarkerRequest',
    getName: function () {
        return this.__name;
    },
    getData: function () {
        return this._data;
    },
    getX: function () {
        return this._data.x;
    },
    getY: function () {
        return this._data.y;
    },
    getIconUrl: function () {
        return this._data.iconUrl;
    },
    getID: function () {
        return this._id;
    },
    getEvents: function () {
        return this._events;
    }
}, {
    'protocol': ['Oskari.mapframework.request.Request']
});