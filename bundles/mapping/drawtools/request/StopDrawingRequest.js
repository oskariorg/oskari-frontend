/**
 * @class Oskari.mapping.drawtools.request.StopDrawingRequest
 *
 * Requests drawtools to complete current drawing and/or clear the current drawing.
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz
    .define('Oskari.mapping.drawtools.request.StopDrawingRequest',
        /**
         * @method create called automatically on construction
         * @static
         *
         * @param {String} id
         *        id for drawing as given in StartDrawingRequest
         * @param {boolean} clearCurrent
         *        true to remove the current drawing
         * @param {boolean} supressEvent
         *        true to not send event
         */

        function(id, clearCurrent, supressEvent) {
            this._id = id;
            this._clearCurrent = !!clearCurrent;
            this._supressEvent = supressEvent;
        }, {
            /** @static @property __name request name */
            __name: "DrawTools.StopDrawingRequest",
            /**
             * @method getName
             * @return {String} request name
             */
            getName: function() {
                return this.__name;
            },
            /**
             * @method getId
             * @return {String} id for drawing as given in StartDrawingRequest
             */
            getId: function() {
                return this._id;
            },
            /**
             * @method isClearCurrent
             * @return {boolean} true to remove the current drawing
             */
            isClearCurrent: function() {
                return this._clearCurrent;
            },
            /**
             * @method supressEvent
             * @return {boolean} true to not send event
             */
            supressEvent: function() {
                return this._supressEvent;
            }
        }, {
            /**
             * @property {String[]} protocol array of superclasses as {String}
             * @static
             */
            'protocol': ['Oskari.mapframework.request.Request']
        });