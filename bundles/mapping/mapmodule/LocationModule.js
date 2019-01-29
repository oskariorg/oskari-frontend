
const errorCodes = {1: 'denied', 2: 'unavailable', 3: 'timeout'};
const sandbox = Oskari.getSandbox();
const log = Oskari.log('Oskari.mapframework.module.LocationModule');
let _pathJson = null;
let _locationCoords = [];
let _locationWatch = null;

function _addCoord (pos) {
    _locationCoords.push([pos.lon, pos.lat]);
};

function _updatePath (pos) {
    _addCoord(pos);
    if (_pathJson) {
        // TODO: update coord
    }
};
// TODO: add _getMapmodule ()

/**
 * Tries to get the user location. Signals with an UserLocationEvent and callback with lon and lat params
 * when successfully got the location or without params as error indicator.
 * @param  {Function} successCb function that is called with lon, lat and accuracy as params on happy case
 * @param  {Function} errorCB function that is called with error as params on failure
 * @param  {Object}   options  options for navigator.geolocation.getCurrentPosition()
 */
export function getUserLocation (successCb, errorCB, options) {
    // normalize opts with defaults
    const evtBuilder = Oskari.eventBuilder('UserLocationEvent');
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
                // transform coordinates from browser projection to current
                var lonlat = mapmodule.transformCoordinates({
                    lon: position.coords.longitude,
                    lat: position.coords.latitude }, 'EPSG:4326');
                sandbox.notifyAll(evtBuilder(lonlat.lon, lonlat.lat, position.coords.accuracy, null));
                // notify callback
                if (typeof successCb === 'function') {
                    successCb(lonlat.lon, lonlat.lat, position.coords.accuracy);
                }
            },
            function (errors) {
                log.warn('Error getting user location', errors);
                // notify event without position to signal failure
                var error = errorCodes[errors.code] || errorCodes[2];
                sandbox.notifyAll(evtBuilder(null, null, null, error));
                if (typeof errorCB === 'function') {
                    errorCB(error);
                }
            }, navigatorOpts
        );
    } else {
        // browser doesn't support
    }
};
export function watchUserLocation (successCb, errorCB, options) {
    // var me = this;
    // var sandbox = me.getSandbox();
    const evtBuilder = Oskari.eventBuilder('UserLocationEvent');
    const mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
    // var errorCodes = {1: 'denied', 2: 'unavailable', 3: 'timeout'};
    let opts = options || {};
    let timestamp;
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
                if (timestamp === position.timestamp) {
                    // some browsers sends first previous position and then changed position
                    // TODO: is this only location emulator feature, test how this works with mobile phones
                    return;
                }
                timestamp = position.timestamp;
                // transform coordinates from browser projection to current
                var pos = mapmodule.transformCoordinates({
                    lon: position.coords.longitude,
                    lat: position.coords.latitude }, 'EPSG:4326');
                pos.accuracy = position.coords.accuracy;
                _addCoord(pos);
                sandbox.notifyAll(evtBuilder(pos.lon, pos.lat, pos.accuracy, null));
                // notify callback
                if (typeof successCb === 'function') {
                    successCb(pos);
                }
            },
            function (errors) {
                log.warn('Error getting user location', errors);
                // notify event without position to signal failure
                var error = errorCodes[errors.code] || errorCodes[2];
                sandbox.notifyAll(evtBuilder(null, null, null, error));
                // me.stopUserLocationWatch();
                if (typeof errorCB === 'function') {
                    errorCB(error);
                }
            }, navigatorOpts
        );
    } else {
        // browser doesn't support
    }
};
export function getLocationCoords () {
    return _locationCoords;
};
export function stopUserLocationWatch () {
    if (navigator.geolocation) {
        navigator.geolocation.clearWatch(_locationWatch);
    }
};

export function clearLocationCoords () {
    _locationCoords = [];
};
// TODO: check if add geometry to map is better to do here instead of handlers
