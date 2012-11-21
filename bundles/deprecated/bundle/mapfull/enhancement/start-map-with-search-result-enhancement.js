/**
 * @class
 * Oskari.mapframework.enhancement.mapfull.StartMapWithSearchResultEnhancement
 * @deprecated

 */
Oskari.clazz.define('Oskari.mapframework.enhancement.mapfull.StartMapWithSearchResultEnhancement', function() {
}, {
    enhance : function(core) {
        core.printDebug("Checking if map is started with search result...");
        var coord = core.getRequestParameter('coord');
        var zoomLevel = core.getRequestParameter('zoomLevel');

        if (coord == null || zoomLevel == null) {
            // not a search result
            return;
        }

        var mapLayers = core.getRequestParameter('mapLayers');
        if (mapLayers != null) {
            core.printDebug("This is probably startup by link, not by search result. Skipping.");
            return;
        }

        // This seems like a search result start
        var splittedCoord;

        /*
         * Coordinates can be splitted either with new "_" or
         * old "%20"
         */
        if (coord.indexOf("_") >= 0) {
            splittedCoord = coord.split("_");
        } else {
            splittedCoord = coord.split("%20");
        }

        var longitude = splittedCoord[0];
        var latitude = splittedCoord[1];
        if (longitude == null || latitude == null) {
            core.printDebug("Could not parse link location. Skipping.");
        }

        core.printDebug("This is startup by search result, moving map.");

        core.getMap().moveTo(longitude, latitude, zoomLevel);
        core.getMap().setMarkerVisible(true);
    }
}, {
    'protocol' : ['Oskari.mapframework.enhancement.Enhancement']
});