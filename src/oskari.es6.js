/**
 * @class Oskari
 *
 * A set of methods to support loosely coupled classes and instances for the mapframework
 */
import Sequence from './counter.es6.js';
import Logger from './logger.es6.js';
import pkg from '../package.json';
import { DOMHelper } from './oskari.dom.js';
import { Customization } from './oskari.customization.js';

const defaultSequence = new Sequence();
const sequences = {};
// keep track of existing loggers
const loggers = {};

let _urls = {};
function getUrl (key) {
    return _urls[key];
}

function encodeParams (params) {
    if (typeof params !== 'object') {
        return '';
    }
    return Object.keys(params)
        .filter(k => params[k] != null && typeof params[k] !== 'undefined')
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
}

function appendQueryToURL (url, query) {
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

const Oskari = {
    VERSION: pkg.version,
    setMarkers (markers) {
        Oskari.log('Oskari').deprecated('setMarkers', 'Use Oskari.custom.setMarkers() instead');
        Customization.setMarkers(markers);
    },
    getMarkers () {
        Oskari.log('Oskari').deprecated('getMarkers', 'Use Oskari.custom.getMarkers() instead');
        return Customization.getMarkers();
    },
    getDefaultMarker () {
        Oskari.log('Oskari').deprecated('getDefaultMarker', 'Use Oskari.custom.getMarker() instead');
        return Customization.getMarker();
    },
    // from oskari.customization.js
    custom: Customization,
    // from oskari.dom
    dom: DOMHelper,
    seq: defaultSequence,
    getSeq (type) {
        if (typeof type === 'undefined') {
            return defaultSequence;
        } else if (!sequences[type]) {
            sequences[type] = new Sequence();
        }
        return sequences[type];
    },
    log (name = 'Oskari') {
        if (loggers[name]) {
            return loggers[name];
        }
        const log = new Logger(name);
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
            const url = appendQueryToURL(getUrl('api') || '/action?', encodeParams(optionalParams));

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
