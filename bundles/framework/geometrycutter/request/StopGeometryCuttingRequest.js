Oskari.clazz.define('Oskari.mapframework.bundle.geometrycutter.StopGeometryCuttingRequest',
    /** @constructor
     * @param {Sting} operationId ID of edit operation. Caller defined, for example bundle name
     */
    function (operationId, isCancel) {
        this._operationId = operationId;
        this._isCancel = (isCancel == true);
    }, {
        __name: "StopGeometryCuttingRequest",
        getName: function () {
            return this.__name;
        },
        getId: function () {
            return this._operationId;
        }
    }, {
        'protocol': ['Oskari.mapframework.request.Request']
    });