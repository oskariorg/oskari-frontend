Oskari.clazz.define('Oskari.mapframework.bundle.geometrycutter.StopGeometryCuttingRequest',
    /** @constructor
     * @param {Sting} functionalityId ID of initiating functionality
     * @param {boolean} isCancel 
     */
    function (functionalityId, isCancel) {
        this._functionalityId = functionalityId;
        this._isCancel = (isCancel == true);
    }, {
        __name: "StopGeometryCuttingRequest",
        getName: function () {
            return this.__name;
        },
        getId: function() {
            return this._functionalityId;
        },
        isCancel: function () {
            return (this._isCancel === true);
        }
    }, {
        'protocol': ['Oskari.mapframework.request.Request']
    });