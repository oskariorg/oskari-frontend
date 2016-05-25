/**
 * @class Oskari.mapframework.bundle.mapmodule.request.RegisterStyleRequest
 * @param  {String} key, styles key
 * @param {Object} styles styles object
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.RegisterStyleRequest', function (key, styles) {
    this._key = key;
    this._styles = styles;
}, {
    __name: 'MapModulePlugin.RegisterStyleRequest',
    getName: function () {
        return this.__name;
    },
    getKey: function () {
        return this._key;
    },
    getStyles: function() {
    	return this._styles;
    }
}, {
    'protocol': ['Oskari.mapframework.request.Request']
});