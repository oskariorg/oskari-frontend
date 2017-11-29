Oskari.clazz.define('Oskari.mapframework.bundle.geometrycutter.StartGeometryCuttingRequest',

    /** @constructor
     * @param {Sting} operationId ID of edit operation. Caller defined, for example bundle name
     * @param {String} mode kind of geometry editing, see __modes
     * @param {org.geojson.Feature} feature to edit
     */
    function (operationId, mode, feature) {
        if (!this.__modes[mode]) {
            throw new Error("Unknown geometry edit mode: '" + mode + "'");
        }
        this._operationId = operationId;
        this._feature = feature;
        this._mode = mode;

    }, {
        __name: "StartGeometryCuttingRequest",
        __modes: {
            "lineSplit": true,
            "polygonClip": true
        },
        getName: function () {
            return this.__name;
        },

        getId: function () {
            return this._operationId;
        },

        getMode: function () {
            return this._mode;
        },

        getFeature: function () {
            return this._feature;
        },
    }, {
        'protocol': ['Oskari.mapframework.request.Request']
    });