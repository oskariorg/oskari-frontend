/**
 * @class Oskari
 *
 * A set of methods to support loosely coupled classes and instances for the mapframework
 */
import Sequence from './counter.es6.js';
import Logger from './logger.es6.js';
import pkg from '../package.json';

let _markers = [];

let defaultSequence = new Sequence();
let sequences = {};
// keep track of existing loggers
let loggers = {};

// for constructing/referencing the base HTML
const DEFAULT_ROOT_EL_ID = 'oskari';
const ROOT_EL_CLASS_FOR_STYLING = 'oskari-root-el';
const getBodyTag = () => document.getElementsByTagName('body')[0];

let _urls= {};
function getUrl (key) {
    return _urls[key];
}

function encodeParams(params) {
    if (typeof params !== 'object') {
        return '';
    }
    return Object.keys(params)
        .filter(k => params[k] != null && typeof params[k] !== 'undefined')
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
}

function appendQueryToURL(url, query) {
    if (typeof query === 'undefined' || query === '') {
        return url;
    }
    if (url.indexOf('?') === -1) {
        return `${url}?${query}`;
    }
    if (url.endsWith('?')) {
        return url + query;
    }
    if (url.endsWith('&')) {
        return url + query;
    }
    return `${url}&${query}`;
}
let rootEl;

const Oskari = {
    VERSION: pkg.version,
    setMarkers (markers) {
        _markers = markers || [];
    },
    getMarkers () {
        return _markers;
    },
    setRootEl (id) {
        if (id) {
            rootEl = document.getElementById(id);
        }
        if (!rootEl) {
            rootEl = getBodyTag();
            if (!rootEl.style.height) {
                // rendering directly to body and no height set
                // -> set CSS to follow expected styling/assume full screen app
                rootEl.style.height = '100vh';
            }
        }
        // use styles from .oskari-root-el for body like display: flex
        rootEl.classList.add(ROOT_EL_CLASS_FOR_STYLING);
        return rootEl;
    },
    getRootEl () {
        if (!rootEl) {
            return this.setRootEl(DEFAULT_ROOT_EL_ID);
        }
        return rootEl;
    },
    getDefaultMarker () {
        return (_markers.length >= 3) ? _markers[2] : _markers[0];
    },
    seq: defaultSequence,
    getSeq (type) {
        if(typeof type === 'undefined') {
            return defaultSequence;
        } else if (!sequences[type]) {
            sequences[type] = new Sequence();
        }
        return sequences[type];
    },
    log(name = 'Oskari') {
        if (loggers[name]) {
            return loggers[name];
        }
        var log = new Logger(name);
        loggers[name] = log;
        return log;
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
             * @param  {String} route optional route name. Returns base url if name is not given.
             * @param  {Object} optionalParams optional object that will be encoded as querystring parameters for the URL.
             * @return {String} url to use when making API calls
             */
            getRoute: function (route, optionalParams) {
                var url = appendQueryToURL(getUrl('api') || '/action?', encodeParams(optionalParams));

                if (route) {
                    return appendQueryToURL(url, 'action_route=' + route);
                }
                return url;
            },
            /**
             * Builds an URL by attaching optional parameters to base url
             * @param {String} url complete baseUrl that might already have querystring
             * @param {*} optionalParams parameters that should be attached to baseUrl
             * @returns base url with optional params included as querystring
             */
            buildUrl: function (url, optionalParams) {
                return appendQueryToURL(url, encodeParams(optionalParams));
            }
    }
};

window.Oskari = Oskari; // TODO: remove when whole of core is ES6

export default Oskari;

