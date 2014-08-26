/**
 * @class Oskari.mapframework.enhancement.mapfull.StartMapWithLinkEnhancement
 * This sets map domain object values accoding to (optional) querystring parameters.
 * Note that this not set the actual map implementation state, only the domain object.
 */
Oskari.clazz.define('Oskari.mapframework.enhancement.mapfull.StartMapWithLinkEnhancement',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {}, {
        /**
         * @method enhance
         * Oskari.mapframework.enhancement.Enhancement protocol/interface method ran on core init
         * @param {Oskari.mapframework.core.Core} core
         */
        enhance: function(core) {
            core.printDebug('Checking if map is started with link...');

            var coord = core.getRequestParameter('coord'),
                zoomLevel = core.getRequestParameter('zoomLevel'),
                mapLayers = core.getRequestParameter('mapLayers'),
                markerVisible = core.getRequestParameter('showMarker'),
                markerVisibleOption2 = core.getRequestParameter('isCenterMarker'),
                keepLayersOrder = core.getRequestParameter('keepLayersOrder');

            if (keepLayersOrder === null) {
                keepLayersOrder = true;
            }

            function checkBoolean (bln) {
                return bln === true || bln === 'true';
            }
            core.getMap().setMarkerVisible(checkBoolean(markerVisible) || checkBoolean(markerVisibleOption2));

            if (coord === null || zoomLevel === null) {
                // not a link
                return;
            }

            var splittedCoord;

            /*
             * Coordinates can be splitted either with new "_" or
             * old "%20"
             */
            if (coord.indexOf('_') >= 0) {
                splittedCoord = coord.split('_');
            } else {
                splittedCoord = coord.split('%20');
            }

            var longitude = splittedCoord[0],
                latitude = splittedCoord[1];
            if (longitude === null || latitude === null) {
                core.printDebug('Could not parse link location. Skipping.');
                return;
            }
            core.printDebug('This is startup by link, moving map...');
            core.getMap().moveTo(longitude, latitude, zoomLevel);
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.mapframework.enhancement.Enhancement']
    });
