/**
 * @class Oskari.mapframework.core.Core
 *
 * This is the Oskari core. Bundles can register modules and services here for other bundles to reference.
 * Requests and events are forwarded through the core to handlers.
 * TODO: Move handlers (and events as well as requests) to handler bundles with
 * registrable handlers
 */
(function(Oskari) {
    var log = Oskari.log('Core');

    Oskari.clazz.define('Oskari.mapframework.core.Core',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
    }, {

        /**
         * @method init
         * Inits Oskari core so bundles can reference components/services through sandbox
         */
        init: function () {
            log.debug('Initializing core...');

            this.handleMapLinkParams();

            log.debug('Modules started. Core ready.');
        },
        handleMapLinkParams: function() {
            log.debug('Checking if map is started with link...');
            var coord = Oskari.util.getRequestParam('coord');
            var zoomLevel = Oskari.util.getRequestParam('zoomLevel');

            if (coord === null || zoomLevel === null) {
                // not a link
                return;
            }

            var splittedCoord;

            // Coordinates can be separated either with new "_" or old "%20"
            if (coord.indexOf('_') >= 0) {
                splittedCoord = coord.split('_');
            } else {
                splittedCoord = coord.split('%20');
            }

            var longitude = splittedCoord[0],
                latitude = splittedCoord[1];
            if (longitude === null || latitude === null) {
                log.debug('Could not parse link location. Skipping.');
                return;
            }
            log.debug('This is startup by link, moving map...');
            Oskari.getSandbox().getMap().moveTo(longitude, latitude, zoomLevel);
        }
    });
}(Oskari));