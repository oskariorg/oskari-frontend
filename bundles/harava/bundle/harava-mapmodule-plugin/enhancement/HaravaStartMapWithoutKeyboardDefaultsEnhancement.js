/**
 * @class Oskari.harava.bundle.mapmodule.plugin.HaravaStartMapWithoutKeyboardDefaultsEnhancement
 */
Oskari.clazz.define('Oskari.harava.bundle.mapmodule.plugin.HaravaStartMapWithoutKeyboardDefaultsEnhancement', 

/**
 * @method create called automatically on construction
 * @static
 */
function() {
}, {
    /**
     * @method enhance
     * Oskari.mapframework.enhancement.Enhancement protocol/interface method ran on core init 
     * @param {Oskari.mapframework.core.Core} core
     */
    enhance : function(core) {
        core.printDebug("Start map withoout keyboard defaults...");
/*
        var coord = core.getRequestParameter('coord');
        var zoomLevel = core.getRequestParameter('zoomLevel');

        var mapLayers = core.getRequestParameter('mapLayers');
        var markerVisible = core.getRequestParameter('showMarker');
        var markerVisibleOption2 = core.getRequestParameter('isCenterMarker');

        var keepLayersOrder = core.getRequestParameter('keepLayersOrder');

        if (keepLayersOrder === null) {
            keepLayersOrder = true;
        }

        core.getMap().setMarkerVisible(markerVisible == 'true' || markerVisibleOption2 == 'true');

        if (coord === null || zoomLevel === null) {
            // not a link
            return;
        }

        var splittedCoord;


        if (coord.indexOf("_") >= 0) {
            splittedCoord = coord.split("_");
        } else {
            splittedCoord = coord.split("%20");
        }

        var longitude = splittedCoord[0];
        var latitude = splittedCoord[1];
        if (longitude === null || latitude === null) {
            core.printDebug("Could not parse link location. Skipping.");
            return;
        }
        core.printDebug("This is startup by link, moving map...");
        core.getMap().moveTo(longitude, latitude, zoomLevel);
        */
        console.dir(core.getMap());
    }
}, {
    /**
     * @property {String[]} protocol
     * @static 
     */
    'protocol' : ['Oskari.mapframework.enhancement.Enhancement']
});