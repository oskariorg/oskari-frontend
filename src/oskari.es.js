/**
 * @class Oskari
 *
 * A set of methods to support loosely coupled classes and instances for the mapframework
 */
import Sequence from './counter.es.js';

let _markers = [];

let defaultSequence = new Sequence();
let sequences = {};

let _urls= {};
function getUrl (key) {
    return _urls[key];
}

const Oskari = {
    VERSION: '1.47.0-dev',
    setMarkers (markers) {
        _markers = markers || [];
    },
    getMarkers () {
        return _markers;
    },
    getDefaultMarker () {
        return (_markers.length >= 3) ? _markers[2] : _markers[0];
    },
    seq (type) {
        if(typeof type === 'undefined') {
            return defaultSequence;
        } else if (!sequences[type]) {
            sequences[type] = new Sequence();
        }
        return sequences[type];
    },
    _urls: {

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
            set: function (urlsOrKey, optionalValue) {
                if (typeof urlsOrKey === 'string') {
                    _urls[urlsOrKey] = optionalValue;
                } else if (typeof urlsOrKey === 'object') {
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
            getLocation: function (key) {
                return getUrl(key);
            },
            /**
             * Action route urls
             * @param  {String} route [description]
             * @return {String} url to use when making API calls
             */
            getRoute: function (route) {
                var url = getUrl('api') || '/action?';
                if (route) {
                    // TODO: check if url ends with ? or &
                    return url + 'action_route=' + route;
                }
                return url;
            }
    }
};

export default Oskari;

