/**
 * Transforms the given coordinates using action_route=Coordinates and updates coordinates to the UI
 * @method getTransformedCoordinatesFromServer
 * @param {Object} data: {lonlat: lat: '', lon: ''} coordinates to be transformed
 * @param {String} srs: projection for given lonlat params like "EPSG:4326"
 * @param {String} targetSRS: projection to transform to like "EPSG:4326"
 * @param {Function} successCb success callback
 * @param {Function} errorCb error callback
 */
export const getTransformedCoordinatesFromServer = async (mapModule, data, srs, targetSRS) => {
    if (!data) {
        const map = Oskari.getSandbox().getMap();
        data = {
            'lonlat': {
                'lat': parseFloat(map.getY()),
                'lon': parseFloat(map.getX())
            }
        };
    }

    // If coordinates are empty then not try to transform these
    if ((typeof data.lonlat.lon === 'undefined' && typeof data.lonlat.lat === 'undefined') ||
        (data.lonlat.lon === '' && data.lonlat.lat === '')) {
        throw new Error('Cannot transform coordinates');
    }

    if (!srs) {
        srs = mapModule.getProjection();
    }
    if (srs !== targetSRS) {
        return await jQuery.ajax({
            url: Oskari.urls.getRoute('Coordinates'),
            data: {
                lat: data.lonlat.lat,
                lon: data.lonlat.lon,
                srs: srs,
                targetSRS: targetSRS
            }
        });
    }
};

/**
 * Transforms the given coordinates
 * @method @public transformCoordinates
 * @param {Object} data: lat/lon coordinates to be transformed
 * @param {String} srs: projection for given lonlat params like "EPSG:4326"
 * @param {String} targetSRS: projection to transform to like "EPSG:4326"
 * @return {Object} data: transformed coordinates as object with lon and lat keys
 */
export const transformCoordinates = (mapModule, data, srs, targetSRS) => {
    if (!data) {
        const map = Oskari.getSandbox().getMap();
        data = {
            'lonlat': {
                'lat': parseFloat(map.getY()),
                'lon': parseFloat(map.getX())
            }
        };
    }
    if (!srs) {
        srs = mapModule.getProjection();
    }

    try {
        if (srs && targetSRS) {
            data.lonlat = mapModule.transformCoordinates(data.lonlat, srs, targetSRS);
        }
    } catch (e) {
        throw new Error('SrsName not supported!');
    }
    return data;
};

/**
 * format different degree presentations of lon/lat coordinates
 */
export const formatDegrees = (lon, lat, type) => {
    let degreesX,
        degreesY,
        minutesX,
        minutesY,
        secondsX,
        secondsY;

    switch (type) {
    case 'min':
        degreesX = parseInt(lon);
        degreesY = parseInt(lat);
        minutesX = Number((lon - degreesX) * 60).toFixed(5);
        minutesY = Number((lat - degreesY) * 60).toFixed(5);
        return {
            'degreesX': degreesX,
            'degreesY': degreesY,
            'minutesX': minutesX.replace('.', Oskari.getDecimalSeparator()),
            'minutesY': minutesY.replace('.', Oskari.getDecimalSeparator())
        };
    case 'sec':
        degreesX = parseInt(lon);
        degreesY = parseInt(lat);
        minutesX = parseFloat((lon - degreesX) * 60);
        minutesY = parseFloat((lat - degreesY) * 60);
        secondsX = parseFloat((minutesX - parseInt(minutesX)) * 60).toFixed(3);
        secondsY = parseFloat((minutesY - parseInt(minutesY)) * 60).toFixed(3);
        return {
            'degreesX': degreesX,
            'degreesY': degreesY,
            'minutesX': parseInt(minutesX),
            'minutesY': parseInt(minutesY),
            'secondsX': secondsX.replace('.', Oskari.getDecimalSeparator()),
            'secondsY': secondsY.replace('.', Oskari.getDecimalSeparator())
        };
    }
};
