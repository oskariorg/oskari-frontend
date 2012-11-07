/**
 * This enchancement adds all preselected layers on map
 *
 */
Oskari.clazz.define('Oskari.mapframework.enhancement.mapfull.StartMapWithLinkEnhancement', function() {
}, {
    enhance : function(core) {
        core.printDebug("Checking if map is started with link...");

        var coord = core.getRequestParameter('coord');
        var zoomLevel = core.getRequestParameter('zoomLevel');

        var mapLayers = core.getRequestParameter('mapLayers');
        var markerVisible = core.getRequestParameter('showMarker');
        var markerVisibleOption2 = core.getRequestParameter('isCenterMarker');
        
        var keepLayersOrder = core.getRequestParameter('keepLayersOrder');

        if(keepLayersOrder === null) {
            keepLayersOrder = true;
        } 

        core.getMap().setMarkerVisible(markerVisible == 'true' || markerVisibleOption2 == 'true');

        if(coord === null || zoomLevel === null) {
            // not a link
            return;
        }

        /* This seems like a link start */
        var splittedCoord;

        /*
         * Coordinates can be splitted either with new "_" or
         * old "%20"
         */
        if(coord.indexOf("_") >= 0) {
            splittedCoord = coord.split("_");
        } else {
            splittedCoord = coord.split("%20");
        }

        var longitude = splittedCoord[0];
        var latitude = splittedCoord[1];
        if(longitude === null || latitude === null) {
            core.printDebug("Could not parse link location. Skipping.");
            return;
        }
        core.printDebug("This is startup by link, moving map...");
        core.getMap().moveTo(longitude, latitude, zoomLevel);
    }
}, {
    'protocol' : ['Oskari.mapframework.enhancement.Enhancement']
});

/* Inheritance */
