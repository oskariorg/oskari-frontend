/**
 * @class Oskari.mapframework.bundle.mapmodule.event.MapClickedEvent
 *
 * Event is sent when the map is clicked so bundles can react to it.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.event.MapClickedEvent',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} lonlat object with lon and lat keys as coordinates where the map was clicked
     * @param {Number} mouseX viewport mouse position x coordinate when click happened
     * @param {Number} mouseY viewport mouse position y coordinate when click happened
     * @param {Boolean} ctrlKeyDown
     */
    function (lonlat, mouseX, mouseY, ctrlKeyDown) {
        this._lonlat = lonlat;
        this._mouseX = mouseX;
        this._mouseY = mouseY;
        this._ctrlKeyDown = ctrlKeyDown;
    }, {
        /** @static @property __name event name */
        __name: "MapClickedEvent",
        /**
         * @method getName
         * @return {String} the name for the event
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getLonLat
         * @return {Object}
         */
        getLonLat: function () {
            return this._lonlat;
        },
        /**
         * @method getMouseX
         * @return {Number}
         */
        getMouseX: function () {
            return this._mouseX;
        },
        /**
         * @method getMouseY
         * @return {Number}
         */
        getMouseY: function () {
            return this._mouseY;
        },

        getParams: function () {
            return {
                lon: this._lonlat ? this._lonlat.lon : null,
                lat: this._lonlat ? this._lonlat.lat : null,
                x: this._mouseX,
                y: this._mouseY,
                ctrlKeyDown: this._ctrlKeyDown
            };
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    }
);
