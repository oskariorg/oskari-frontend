/**
 * @class Oskari.mapframework.bundle.mapmodule.request.MarkerVisibilityRequest
 * @param  {String} id optional id for marker to change it's visibility, all markers visibility changed if not given. If a marker with same id
 *                     exists, it will be changed visibility.
 * @param  {Boolean} visibility is marker visible or not. True if show marker, else false.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.MarkerVisibilityRequest', function (visibility, id) {
    this._id = id;
    this._visibility = visibility;
}, {
    __name: 'MapModulePlugin.MarkerVisibilityRequest',
    getName: function () {
        return this.__name;
    },
    getID: function () {
        return this._id;
    },
    isVisible: function () {
        return this._visibility;
    }
}, {
    'protocol': ['Oskari.mapframework.request.Request']
});