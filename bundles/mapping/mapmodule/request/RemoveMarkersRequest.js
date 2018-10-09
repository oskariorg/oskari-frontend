/**
 * @class Oskari.mapframework.bundle.mapmodule.request.RemoveMarkersRequest
 * @param  {String} id optional id for marker to remove, removes all if undefined
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.RemoveMarkersRequest', function (id) {
    this._id = id;
}, {
    __name: 'MapModulePlugin.RemoveMarkersRequest',
    getName: function () {
        return this.__name;
    },
    /**
     * @method getId
     * @return {String} optional id for marker to remove, refers to all if undefined
     */
    getId: function () {
        return this._id;
    }
}, {
    'protocol': ['Oskari.mapframework.request.Request']
});
