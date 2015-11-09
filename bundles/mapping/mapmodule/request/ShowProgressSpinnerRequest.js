/**
 * @class Oskari.mapframework.bundle.mapmodule.request.ShowProgressSpinnerRequest
 * @param  {bool} show, whether to show or hide the spinner
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.ShowProgressSpinnerRequest', function (show) {
    this._show = show;
}, {
    __name: 'ShowProgressSpinnerRequest',
    getName: function () {
        return this.__name;
    },
    getShow: function () {
        return this._show;
    }
}, {
    'protocol': ['Oskari.mapframework.request.Request']
});