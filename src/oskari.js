/**
 * @class Oskari
 *
 * A set of methods to support loosely coupled classes and instances for the mapframework
 */
Oskari = (function () {
    var _markers = [];
    var _urls = {};
    var getUrl = function(key) {
        return _urls[key] || 'N/A';
    }

    return {
        VERSION: '1.45.1',

        /**
         * @public @static @method Oskari.setMarkers
         * @param {Array} markers markers
         */
        setMarkers: function (markers) {
            _markers = markers || [];
        },
        /**
         * @public @static @method Oskari.getMarkers
         * @return {Array} markers markers
         */
        getMarkers: function () {
            return _markers;
        },

        /**
         * @public @static @method Oskari.getDefaultMarker
         * @return {Object} default marker
         */
        getDefaultMarker: function () {
            return (_markers.length >= 3) ? _markers[2] : _markers[0];
        },
        urls: {
            /**
             * Oskari.urls.set({
                  "map" : "https://my.map.com",
                  "api": "https://api.map.com/action?",
                  "login" :"https://my.map.com/login",
                  "register" :"http://some.auth.site.com/register",
                  "tou" :"http://my.organization/map/tou",
                });
                OR
                Oskari.urls.set('login', 'https://my.map.com/login');
             */
            set: function(urlsOrKey, optionalValue) {
                if(typeof urlsOrKey === 'string') {
                    _urls[urlsOrKey] = optionalValue;
                } else if(typeof urlsOrKey === 'object') {
                    _urls = urlsOrKey || {};
                } else {
                    throw new Error('Unrecognized parameter for urls: ' + urlsOrKey);
                }
            },
            /**
             * Generic url "location" getter
             * @param  {String} key type of url like "login" or "registration"
             * @return {String} URL that points to requested functionality
             */
            getLocation: function(key) {
                return getUrl(key);
            },
            /**
             * Action route urls
             * @param  {String} route [description]
             * @return {String} url to use when making API calls
             */
            getRoute: function(route) {
                var url = getUrl('api');
                if(route) {
                    // TODO: check if url ends with ? or &
                    return url + 'action_route=' + route;
                }
                return url;
            }
        }
    };
}());
