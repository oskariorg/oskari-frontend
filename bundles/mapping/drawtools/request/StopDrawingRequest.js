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
         */

        function(id, clearCurrent) {
            this._id = id;
            this._clearCurrent = !!clearCurrent;
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
            }
        }, {
            /**
             * @property {String[]} protocol array of superclasses as {String}
             * @static
             */
            'protocol': ['Oskari.mapframework.request.Request']
        });