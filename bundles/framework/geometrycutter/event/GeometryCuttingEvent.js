/**
 * @class Oskari.mapframework.bundle.geometrycutter.GeometryCuttingEvent
 *
 * Used to notify components about geometry cutting results
 */
Oskari.clazz.define('Oskari.mapframework.bundle.geometrycutter.GeometryCuttingEvent',
    /**
     * @method create called automatically on construction
     * @static
     * @param {String} operationId 
     * @param {org.geojson.Feature} feature the result of the geometry cutting, or null if cutting failed (topology exception)
     * @param {Boolean} isFinished 
     */
    function (operationId, feature, isFinished) {
        this._operationId = operationId;
        this._feature = feature;
        this._finished = isFinished;
    }, {
        /** @static @property __name event name */
        __name: "GeometryCuttingEvent",
        /**
         * @method getName
         * Returns event name
         * @return {String}
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getId
         * Returns the operation id that started the geometry editing
         * @return {String}
         */
        getId: function () {
            return this._operationId;
        },
        /**
         * @method getFinished
         * @return {Boolean} is the editing finished?
         */
        getFinished: function() {
            return this._finished;
        },
        /**
         * @method getGeometry
         * Returns the edited geometry
         * @return {org.geojson.Feature}
         */
        getFeature: function () {
            return this._feature;
        }
    }, {
        /**
         * @property {String[]} protocol array of protocols the class implements
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });
