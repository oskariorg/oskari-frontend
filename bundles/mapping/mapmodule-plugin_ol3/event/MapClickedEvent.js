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
     * @param {OpenLayers.LonLat} lonlat coordinates where the map was clicked
     * @param {Number} mouseX viewport mouse position x coordinate when click happened
     * @param {Number} mouseY viewport mouse position y coordinate when click happened
     * @param {Boolean} CtrlDown true if Ctrl was pressed hwne clicked
     */
    function (lonlat, mouseX, mouseY, CtrlDown) {
        this._lonlat = lonlat;
        this._mouseX = mouseX;
        this._mouseY = mouseY;
        this._ctrlPressed = CtrlDown;
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
         * @return {OpenLayers.LonLat}
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
        /**
         * @method getCtrlPressed
         * @return {Boolean}
         */
        getCtrlPressed: function () {
            return this._ctrlPressed;
        },

        getParams: function () {
            return {
                lon: this._lonlat ? this._lonlat.lon : null,
                lat: this._lonlat ? this._lonlat.lat : null,
                x: this._mouseX,
                y: this._mouseY,
                ctrlPressed: this._ctrlPressed
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
