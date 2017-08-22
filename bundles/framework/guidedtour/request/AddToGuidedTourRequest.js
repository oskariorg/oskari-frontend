/**
 * @class Oskari.framework.bundle.guidedtour.AddToGuidedTourRequest
 */
Oskari.clazz.define('Oskari.framework.bundle.guidedtour.AddToGuidedTourRequest',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} delegate
     *          delegate object with methods for handling sending bundle guided tour
     */
    function (delegate) {
        this._delegate = delegate;
    },
    {
        __name: "Guidedtour.AddToGuidedTourRequest",
        getName: function () {
            return this.__name;
        },
        getDelegate: function () {
            return this._delegate;
        }
    },
    {
        'protocol': ['Oskari.mapframework.request.Request']
});
