/**
 * @class Oskari.mapframework.bundle.mapmodule.request.AddMarkerRequest
 * @param  {Object} data, the object should have atleast x and y keys with coordinates and can have
 *                        color, msg, shape, size and iconUrl.
 * @param  {String} id optional id for marker to add, one will be generated if not given. If a marker with same id
 *                     exists, it will be replaced with this.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.AddMarkerRequest', function (data, id) {
    this._data = data;
    this._id = id;
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
    }
}, {
    'protocol': ['Oskari.mapframework.request.Request']
});
