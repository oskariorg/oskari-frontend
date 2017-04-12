/**
 * @class Oskari
 *
 * A set of methods to support loosely coupled classes and instances for the mapframework
 */
Oskari = (function () {
    var _markers = [];

    return {
        VERSION : "1.42.0",

        /**
         * @public @static @method Oskari.setMarkers
         * @param {Array} markers markers
         */
        setMarkers: function(markers) {
            _markers = markers || [];
        },
        /**
         * @public @static @method Oskari.getMarkers
         * @return {Array} markers markers
         */
        getMarkers: function() {
            return _markers;
        },

        /**
         * @public @static @method Oskari.getDefaultMarker
         * @return {Object} default marker
         */
        getDefaultMarker: function(){
            return (_markers.length>=3) ? _markers[2] : _markers[0];
        }
    };
}());