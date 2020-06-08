
const errorCodes = { 1: 'denied', 2: 'unavailable', 3: 'timeout' };
const sandbox = Oskari.getSandbox();
const log = Oskari.log('Oskari.mapframework.module.LocationModule');
// let _pathJson = null;
let _locationCoords = [];
let _locationWatch = null;

function _addCoord (pos) {
    _locationCoords.push([pos.lon, pos.lat]);
};
function notifyError (cb, code) {
    const error = errorCodes[code] || errorCodes[2];
    if (typeof cb === 'function') {
        cb(error);
    }
    const evt = Oskari.eventBuilder('UserLocationEvent');
    // notify event without position to signal failure
    sandbox.notifyAll(evt(null, null, null, error));
};
function notifyLonLat (cb, lonlat, accuracy) {
    if (typeof cb === 'function') {
        cb(lonlat.lon, lonlat.lat, accuracy);
    }
    const evt = Oskari.eventBuilder('UserLocationEvent');
    sandbox.notifyAll(evt(lonlat.lon, lonlat.lat, accuracy));
};
function notifyPosition (cb, pos) {
    if (typeof cb === 'function') {
        cb(pos);
    }
    const evt = Oskari.eventBuilder('UserLocationEvent');
    sandbox.notifyAll(evt(pos.lon, pos.lat, pos.accuracy));
};

// TODO: push pos to pathJson coords.
// Now geojson is generated from coords array on update if it's added to map
// Also geojson could be added to event
/*
function _updatePath (pos) {
    _addCoord(pos);
    if (_pathJson) {

    }
};
*/
/**
 * Tries to get the user location. Signals with an UserLocationEvent and callback with lon and lat params
 * when successfully got the location or without params as error indicator.
 * @param  {Function} successCb function that is called with lon, lat and accuracy as params on happy case
 * @param  {Function} errorCB function that is called with error as params on failure
 * @param  {Object}   options  options for navigator.geolocation.getCurrentPosition()
 */
export function getUserLocation (successCb, errorCB, options) {
    // normalize opts with defaults
    const mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
    var opts = options || {};
    var navigatorOpts = {
        maximumAge: 0,
        timeout: 6000,
        enableHighAccuracy: false
    };
    // override defaults with given options
    Object.keys(navigatorOpts).forEach((key) => {
        if (opts.hasOwnProperty(key)) {
            navigatorOpts[key] = opts[key];
        }
    });
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const { longitude, latitude, accuracy } = position.coords;
                // transform coordinates from browser projection to current
                var lonlat = mapmodule.transformCoordinates({
                    lon: longitude,
                    lat: latitude
                }, 'EPSG:4326');
                if (mapmodule.isValidLonLat(lonlat.lon, lonlat.lat)) {
                    notifyLonLat(successCb, lonlat, accuracy);
                } else {
                    notifyError(errorCB);
                }
            },
            function (errors) {
                log.warn('Error getting user location', errors);
                notifyError(errorCB, errors.code);
            }, navigatorOpts
        );
    } else {
        // browser doesn't support
        notifyError(errorCB);
    }
};
export function watchUserLocation (successCb, errorCB, options) {
    const mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
    let opts = options || {};
    let prevTime;
    // default values
    let navigatorOpts = {
        maximumAge: 5000,
        timeout: 10000,
        enableHighAccuracy: true
    };
    // override defaults with given options
    Object.keys(navigatorOpts).forEach((key) => {
        if (opts.hasOwnProperty(key)) {
            navigatorOpts[key] = opts[key];
        }
    });
    if (navigator.geolocation) {
        _locationWatch = navigator.geolocation.watchPosition(
            function (position) {
                log.debug(position);
                const { timestamp, coords } = position;
                if (prevTime === timestamp) {
                    // some browsers sends first previous position and then changed position
                    // TODO: is this only location emulator feature, test how this works with mobile phones
                    return;
                }
                prevTime = timestamp;
                // transform coordinates from browser projection to current
                var pos = mapmodule.transformCoordinates({
                    lon: coords.longitude,
                    lat: coords.latitude
                }, 'EPSG:4326');
                if (!mapmodule.isValidLonLat(pos.lon, pos.lat)) {
                    notifyError(errorCB);
                    return;
                }

                pos.accuracy = coords.accuracy;
                _addCoord(pos);
                notifyPosition(successCb, pos);
            },
            function (errors) {
                log.warn('Error getting user location', errors);
                notifyError(errorCB, errors.code);
            }, navigatorOpts
        );
    } else {
        // browser doesn't support
        notifyError(errorCB);
    }
};
export function getLocationCoords () {
    return _locationCoords;
};
export function stopUserLocationWatch () {
    if (navigator.geolocation && _locationWatch !== null) {
        navigator.geolocation.clearWatch(_locationWatch);
        _locationWatch = null;
    }
};

export function clearLocationCoords () {
    _locationCoords = [];
};
// TODO: check if add geometry to map is better to do here instead of handlers
