Oskari.clazz.define('Oskari.coordinatetransformation.helper', function() {
    var me = this;
    this.loc = Oskari.getMsg.bind(null, 'coordinatetransformation');
    this.sb = Oskari.getSandbox();
    this.removeMarkersReq = Oskari.requestBuilder('MapModulePlugin.RemoveMarkersRequest');
    this.addMarkerReq = Oskari.requestBuilder('MapModulePlugin.AddMarkerRequest');
    this.mapmodule = this.sb.findRegisteredModuleInstance('MainMapModule');
    this.mapSrs = this.sb.getMap().getSrsName();
    this.epsgValues = this.getGeodeticCoordinateOptions();
    this.elevationSystems = this.getElevationOptions();
    this.mapEpsgValues = this.getEpsgValues(this.mapSrs);
}, {
    getName: function() {
        return 'Oskari.coordinatetransformation.helper';
    },
    init: function () {},
    addMarkerForCoords: function (lonlat, label, color) {
        var color = color || "ff0000";
        if ( this.addMarkerReq ) {
                var data = {
                    x: lonlat.lon,
                    y: lonlat.lat,
                    color: color,
                    shape: 3
                };
                if (label) {
                    data.msg = label;
                }
            var request = this.addMarkerReq(data);
            this.sb.request('MainMapModule', request);
        }
    },
    showMarkersOnMap: function (coords, addExisting, srs){
        var me = this,
            color,
            epsgValues,
            lonlat,
            label,
            transform;

        if (addExisting === true){
            color = "#ffe5e5";
        }

        if (srs !== this.mapSrs){
            transform = true;
            epsgValues = this.getEpsgValues(srs);
        } else {
            transform = false;
            epsgValues = this.mapEpsgValues;
        }
        coords.some( function ( coord ) {
            lonlat = me.getLonLatObj(coord, epsgValues.lonFirst);
            label = me.getLabelForMarker(lonlat, epsgValues);
            if (transform){
                try{
                    lonlat = me.mapmodule.transformCoordinates(lonlat, srs, me.mapSrs);
                } catch (error){
                    me.showPopup(me.loc('mapMarkers.show.errorTitle'), me.loc('mapMarkers.show.transformError'));
                    return true;
                }
            }
            me.addMarkerForCoords(lonlat, label, color);
        });
    },
    getLonLatObj: function (coord, lonFirst){
        var lonlat = {};
        if (lonFirst === true){
            lonlat.lon = coord[0];
            lonlat.lat = coord[1];
        } else {
            lonlat.lon = coord[1];
            lonlat.lat = coord[0];
        }
        return lonlat;
    },
    getLabelForMarker: function(lonlat, epsgValues){
        var epsgValues = epsgValues || this.mapEpsgValues,
            lonLabel,
            latLabel;
        if (epsgValues.coord === "COORD_GEOG_2D" || epsgValues.coord === "COORD_GEOG_3D"){
            lonLabel = this.loc('mapMarkers.show.lon');
            latLabel = this.loc('mapMarkers.show.lat');
        } else {
            lonLabel = this.loc('mapMarkers.show.east');
            latLabel = this.loc('mapMarkers.show.north');
        }
        //TODO do we need to localize decimal separator for label
        // Oskari.getDecimalSeparator();
        //lon = coords[].replace('.', Oskari.getDecimalSeparator());
        if (epsgValues.lonFirst){
            return lonLabel + ": " + lonlat.lon + ", "+ latLabel +": " + lonlat.lat;
        } else {
            return latLabel + ": " + lonlat.lat + ", " + lonLabel + ": " + lonlat.lon;
        }
    },
    removeMarkers: function () {
        if( this.removeMarkersReq ) {
            this.sb.request('MainMapModule', this.removeMarkersReq());
        }
    },
    validateCrsSelections: function (crs){
        var error = "";
        //source crs and target crs should be always selected
        if (!crs.sourceCrs || !crs.targetCrs){
            error += this.loc('flyout.transform.validateErrors.crs') + " ";
        }
        if (error.length !== 0){
            this.showPopup(this.loc('flyout.transform.validateErrors.title'), error);
            return false;
        }
        return true;
    },
    validateFileSelections: function (settings, requireFileName){
        var error = "";
        if (settings.decimalSeparator === "," && settings.coordinateSeparator === "comma"){
            error += this.loc('flyout.transform.validateErrors.doubleComma');
        }
        if (requireFileName === true && !settings.fileName && settings.fileName === ""){
            error += this.loc('flyout.transform.validateErrors.noFileName');
        }
        if (error.length !== 0){
            this.showPopup(this.loc('flyout.transform.validateErrors.title'), error);
            return false;
        }
        return true;
    },
    checkDimensions: function (crs, callback){
        var ok = true,
            message;
        if (crs.sourceDimension === 2 && crs.targetDimension === 3){
            message = this.loc('flyout.transform.warnings.2DTo3D');
        } else if (crs.sourceDimension === 3 && crs.targetDimension === 2){
            message = this.loc('flyout.transform.warnings.3DTo2D');
        } else {
            callback();
            return;
        }
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            cancelBtn = dialog.createCloseButton(this.loc('actions.cancel')),
            okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        okBtn.setTitle(this.loc('actions.ok'));
        okBtn.addClass('primary');

        okBtn.setHandler(function() {
            callback();
            dialog.close();
        });
        dialog.show(this.loc('flyout.transform.warnings.title'), message, [cancelBtn, okBtn]);
    },
    showPopup: function (title, message){
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            btn = dialog.createCloseButton(this.loc('actions.close'));
        dialog.show(title, message, [btn]);
    },
    getEpsgValues: function (srs) {
        if (srs && this.epsgValues.hasOwnProperty(srs)){
            return this.epsgValues[srs];
        }
        return {};
    },
    getMapEpsgValues: function () {
        var epsg = this.mapEpsgValues;
        epsg.srs = this.mapSrs;
        return epsg;
    },
    isGeogSystem: function(srs){
        var epsgValues = this.getEpsgValues(srs);
        if (epsgValues.coord === "COORD_GEOG_2D" || epsgValues.coord === "COORD_GEOG_3D"){
            return true;
        } else {
            return false;
        }
    },
    is3DSystem: function (srs){
        var epsgValues = this.getEpsgValues(srs);
        if (epsgValues.coord === "COORD_PROJ_3D" || epsgValues.coord === "COORD_GEOG_3D"){
            return true;
        } else {
            return false;
        }
    },
    isCoordInBounds: function (srs, coord){
        var epsgValues = this.getEpsgValues(srs),
            x,
            y;
        if (!epsgValues){
            return;
        }
        if (epsgValues.lonFirst === true){
            x = coord[0];
            y = coord[1];
        } else {
            x = coord[1];
            y = coord[0];
        }
        return this.mapmodule.isPointInExtent(epsgValues.bounds, x, y);
    },
    getDimension: function(srs, elevation){
        var srsValues = this.getEpsgValues(srs);
        var dimension;
        if (srsValues && (srsValues.coord === "COORD_PROJ_3D" || srsValues.coord === "COORD_GEOG_3D")){
            dimension = 3;
        } else if (this.elevationSystems.hasOwnProperty(elevation)){
            dimension = 3;
        } else {
            dimension = 2;
        }
        return dimension;
    },
    getOptionsJSON: function() {
        var geoCoords = this.getGeodeticCoordinateOptions();
        this.createCls(geoCoords);
        return {
            "datum": this.getDatumOptions(),
            "coordinate": this.getCoordinateOptions(),
            "projection": this.getProjectionOptions(),
            "geodetic-coordinate": geoCoords,
            "elevation": this.getElevationOptions()
        }

    },
    getDatumOptions: function() {
        return {
            "DEFAULT": {
                "title": this.loc('flyout.coordinateSystem.noFilter'),
                "cls": "DATUM_KKJ DATUM_EUREF-FIN"
            },
            "DATUM_KKJ": {
                "title": "KKJ",
                "cls": "DATUM_KKJ DATUM_EUREF-FIN"
            },
            "DATUM_EUREF-FIN": {
                "title": "EUREF-FIN",
                "cls": "DATUM_KKJ DATUM_EUREF-FIN"
            }
        }
    },
    getCoordinateOptions: function() {
        return {
            "DEFAULT": {
                "title": this.loc('flyout.coordinateSystem.noFilter'),
                 "cls": "DATUM_KKJ DATUM_EUREF-FIN"
            },
            "COORD_PROJ_2D": {
                "title": this.loc('flyout.coordinateSystem.coordinateSystem.proj2D'),
                "cls": "DATUM_KKJ DATUM_EUREF-FIN",
                "dimension": 2
            },
            "COORD_PROJ_3D": {
                "title": this.loc('flyout.coordinateSystem.coordinateSystem.proj3D'),
                "cls": "DATUM_EUREF-FIN",
                "dimension": 3
            },
            "COORD_GEOG_2D": {
                "title": this.loc('flyout.coordinateSystem.coordinateSystem.geo2D'),
                "cls": "DATUM_EUREF-FIN DATUM_KKJ",
                "dimension": 2
            },
            "COORD_GEOG_3D": {
                "title": this.loc('flyout.coordinateSystem.coordinateSystem.geo3D'),
                "cls": "DATUM_EUREF-FIN",
                "dimension": 3
            }
        }
    },
    getProjectionOptions: function() {
        return {
            "DEFAULT": {
                "title": this.loc('flyout.coordinateSystem.noFilter'),
                "cls": "DATUM_KKJ DATUM_EUREF-FIN"
            },
            "PROJECTION_KKJ": {
                "title": "KKJ",
                "cls": "DATUM_KKJ"
            },
            "PROJECTION_TM": {
                "title": "Transversal Mercator",
                "cls": "DATUM_EUREF-FIN"
            },
            "PROJECTION_GK": {
                "title": "Gauss-Kruger",
                "cls": "DATUM_EUREF-FIN"
            },
            "PROJECTION_LAEA":{
                "title": "Lambert Azimuthal Equal Area",
                "cls": "DATUM_EUREF-FIN"
            },
            "PROJECTION_LCC": {
                "title": "Lambert Conic Conformal",
                "cls": "DATUM_EUREF-FIN"
            }
        }
    },
    //bounds:[minx, miny, maxx, maxy], lonFirst: true -> lonlat, EN, XY
    getGeodeticCoordinateOptions: function() {
        return {
            "DEFAULT": {
                "title": this.loc('flyout.coordinateSystem.geodeticCoordinateSystem.choose'),
                "datum":"",
                "proj":"",
                "coord":"",
            },
            //newer GK EPSG-codes which have false easting 500000 prefixed with zone number -> GK19 19500000
            "EPSG:3873":{
                "title": "ETRS-GK19",
                "datum": "DATUM_EUREF-FIN",
                "proj": "PROJECTION_GK",
                "coord": "COORD_PROJ_2D",
                "bounds": [16136220.08, 4245436.94, 19729336.74, 9392386.51],
                "lonFirst": false
            },
            "EPSG:3874": {
                "title": "ETRS-GK20",
                "datum": "DATUM_EUREF-FIN",
                "proj": "PROJECTION_GK",
                "coord": "COORD_PROJ_2D",
                "bounds": [17036139.71, 4284384.64, 20718673.04, 9388493.84],
                "lonFirst": false
            },
            "EPSG:3875": {
                "title": "ETRS-GK21",
                "datum": "DATUM_EUREF-FIN",
                "proj": "PROJECTION_GK",
                "coord": "COORD_PROJ_2D",
                "bounds": [17935765.83, 4324906.92, 21707943.90, 9384787.32],
                "lonFirst": false
            },
            "EPSG:3876":{
                "title": "ETRS-GK22",
                "datum": "DATUM_EUREF-FIN",
                "proj": "PROJECTION_GK",
                "coord": "COORD_PROJ_2D",
                "bounds": [18835101.07, 4367049.45, 22697152.55, 9381268.03],
                "lonFirst": false
            },
            "EPSG:3877":{
                "title": "ETRS-GK23",
                "datum": "DATUM_EUREF-FIN",
                "proj": "PROJECTION_GK",
                "coord": "COORD_PROJ_2D",
                "bounds": [19734149.31, 4410859.98, 23686302.23, 9377936.99],
                "lonFirst": false
            },
            "EPSG:3878":{
                "title": "ETRS-GK24",
                "datum": "DATUM_EUREF-FIN",
                "proj": "PROJECTION_GK",
                "coord": "COORD_PROJ_2D",
                "bounds": [20632915.73, 4456388.39, 24675396.21, 9374795.15],
                "lonFirst": false
            },
            "EPSG:3879":{
                "title": "ETRS-GK25",
                "datum": "DATUM_EUREF-FIN",
                "proj": "PROJECTION_GK",
                "coord": "COORD_PROJ_2D",
                "bounds": [21531406.93, 4503686.78, 25664437.76, 9371843.41],
                "lonFirst": false
            },
            "EPSG:3880":{
                "title": "ETRS-GK26",
                "datum": "DATUM_EUREF-FIN",
                "proj": "PROJECTION_GK",
                "coord": "COORD_PROJ_2D",
                "bounds": [22429630.98, 4552809.52, 26653430.17, 9369082.63],
                "lonFirst": false
            },
            "EPSG:3881":{
                "title": "ETRS-GK27",
                "datum": "DATUM_EUREF-FIN",
                "proj": "PROJECTION_GK",
                "coord":"COORD_PROJ_2D",
                "bounds": [23327597.57, 4603813.37, 27642376.73, 9366513.60],
                "lonFirst": false
            },
            "EPSG:3882":{
                "title": "ETRS-GK28",
                "datum": "DATUM_EUREF-FIN",
                "proj": "PROJECTION_GK",
                "coord": "COORD_PROJ_2D",
                "bounds": [24225318.05, 4656757.53, 28631280.76, 9364137.06],
                "lonFirst": false
            },
            "EPSG:3883":{
                "title":"ETRS-GK29",
                "datum": "DATUM_EUREF-FIN",
                "proj": "PROJECTION_GK",
                "coord": "COORD_PROJ_2D",
                "bounds": [25122805.55, 4711703.72, 29620145.58, 9361953.68],
                "lonFirst": false
            },
            "EPSG:3884":{
                "title":"ETRS-GK30",
                "datum": "DATUM_EUREF-FIN",
                "proj": "PROJECTION_GK",
                "coord": "COORD_PROJ_2D",
                "bounds": [26020075.09, 4768716.31, 30608974.53, 9359964.10],
                "lonFirst": false
            },
            "EPSG:3885":{
                "title": "ETRS-GK31",
                "datum": "DATUM_EUREF-FIN",
                "proj": "PROJECTION_GK",
                "coord": "COORD_PROJ_2D",
                "bounds": [26917143.71, 4827862.39, 31597770.94, 9358168.88],
                "lonFirst": false
            },
            "EPSG:3035":{
                "title": "ETRS-LAEA",
                "datum": "DATUM_EUREF-FIN",
                "proj": "PROJECTION_LAEA",
                "coord": "COORD_PROJ_2D",
                "bounds": [1896628.62, 1507846.05, 4656644.57, 6827128.02],
                "lonFirst": false
            },
            "EPSG:3034":{
                "title": "ETRS-LCC",
                "datum": "DATUM_EUREF-FIN",
                "proj": "PROJECTION_LCC",
                "coord": "COORD_PROJ_2D",
                "bounds": [1584884.54,1150546.94,4435373.08,6675249.46],
                "lonFirst": false
            },
            "EPSG:3046":{
                "title":"ETRS-TM34",
                "datum": "DATUM_EUREF-FIN",
                "proj": "PROJECTION_TM",
                "coord": "COORD_PROJ_2D",
                "bounds": [-3062460.04, 4323108.17, 707860.72, 9381033.40],
                "lonFirst": false
            },
            "EPSG:3047":{
                "title": "ETRS-TM35",
                "datum": "DATUM_EUREF-FIN",
                "proj": "PROJECTION_TM",
                "coord": "COORD_PROJ_2D",
                "bounds": [-3669433.90, 4601644.86, 642319.78, 9362767.00],
                "lonFirst": false
            },
            "EPSG:3048":{
                "title": "ETRS-TM36",
                "datum": "DATUM_EUREF-FIN",
                "proj": "PROJECTION_TM",
                "coord": "COORD_PROJ_2D",
                "bounds": [-4283197.87, 4949558.27, 575249.45, 9351421.46],
                "lonFirst": false
            },
            "EPSG:3067":{
                "title": "ETRS-TM35FIN",
                "datum": "DATUM_EUREF-FIN",
                "proj": "PROJECTION_TM",
                "coord": "COORD_PROJ_2D",
                "bounds": [-3669433.90, 4601644.86, 642319.78, 9362767.00],
                "lonFirst": true
            },
            "EPSG:4258":{
                "title": "EUREF-FIN-GRS80",
                "datum": "DATUM_EUREF-FIN",
                "proj": "",
                "coord": "COORD_GEOG_2D",
                "bounds": [-16.1, 32.88, 39.65, 84.17],
                "lonFirst": false
            },
            "EPSG:4937":{
                "title": "EUREF-FIN-GRS80h",
                "datum": "DATUM_EUREF-FIN",
                "proj": "",
                "coord": "COORD_GEOG_3D",
                "bounds": [-16.1, 32.88, 39.65, 84.17],
                "lonFirst": false
            },
            "EPSG:4936":{
                "title": "EUREF-FIN-XYZ",
                "datum": "DATUM_EUREF-FIN",
                "proj": "",
                "coord": "COORD_PROJ_3D",
                "bounds": [5151420.52, -1486881.13, 500495.11, 414781.77],
                "lonFirst": true
            },
            "EPSG:3386":{
                "title": this.loc('flyout.coordinateSystem.geodeticCoordinateSystem.kkj', {'zone':0}),
                "datum": "DATUM_KKJ",
                "proj": "PROJECTION_KKJ",
                "coord": "COORD_PROJ_2D",
                "bounds": [569217.09, 6663791.81, 583029.96, 6693054.88],
                "lonFirst": false
            },
            "EPSG:2391":{
                "title": this.loc('flyout.coordinateSystem.geodeticCoordinateSystem.kkj', {'zone':1}),
                "datum": "DATUM_KKJ",
                "proj": "PROJECTION_KKJ",
                "coord": "COORD_PROJ_2D",
                "bounds": [1415885.57, 6628437.53, 1559300.06, 7695112.84],
                "lonFirst": false
            },
            "EPSG:2392":{
                "title": this.loc('flyout.coordinateSystem.geodeticCoordinateSystem.kkj', {'zone':2}),
                "datum": "DATUM_KKJ",
                "proj": "PROJECTION_KKJ",
                "coord": "COORD_PROJ_2D",
                "bounds": [2415851.96, 6627314.46, 2560464.61, 7647148.92],
                "lonFirst": false
            },
            "EPSG:2393":{
                "title": this.loc('flyout.coordinateSystem.geodeticCoordinateSystem.ykj'),
                "datum": "DATUM_KKJ",
                "proj": "PROJECTION_KKJ",
                "coord": "COORD_PROJ_2D",
                "bounds": [3064557.21, 6651895.29, 3674549.99, 7785726.70],
                "lonFirst": false
            },
            "EPSG:2394":{
                "title": this.loc('flyout.coordinateSystem.geodeticCoordinateSystem.kkj', {'zone':4}),
                "datum": "DATUM_KKJ",
                "proj": "PROJECTION_KKJ",
                "coord": "COORD_PROJ_2D",
                "bounds": [4418851.11, 6759862.03, 4557959.34, 7748619.72],
                "lonFirst": false
            },
            "EPSG:3387":{
                "title": this.loc('flyout.coordinateSystem.geodeticCoordinateSystem.kkj', {'zone':5}),
                "datum": "DATUM_KKJ",
                "proj": "PROJECTION_KKJ",
                "coord": "COORD_PROJ_2D",
                "bounds": [5423705.81, 6970442.95, 5428707.25, 6989284.23],
                "lonFirst": false
            },
            "EPSG:4123":{//KKJ_GEO
                "title": "KKJ-Hayford",
                "datum": "DATUM_KKJ",
                "proj": "",
                "coord": "COORD_GEOG_2D",
                "bounds": [19.24, 59.75, 31.59, 70.09],
                "lonFirst": false
            }
        }
    },
    getElevationOptions: function(){
        return {
            "DEFAULT": {
                "title": this.loc('flyout.coordinateSystem.heightSystem.none'),
                "cls":"DATUM_KKJ DATUM_EUREF-FIN DATUM_DEFAULT"
            },
            "EPSG:3900": {
                "title":"N2000",
                "cls":"DATUM_KKJ DATUM_EUREF-FIN DATUM_DEFAULT"
            },
            "EPSG:5717": {
                "title":"N60",
                "cls":"DATUM_KKJ DATUM_EUREF-FIN DATUM_DEFAULT"
            },
            "N43": { //no EPSG
                "title":"N43",
                "cls":"DATUM_KKJ DATUM_EUREF-FIN DATUM_DEFAULT"
            }
        }
    },
    createCls: function(json){
        Object.keys( json ).forEach( function ( key ) {
            var geoCoord = json[key];
            if (key === "DEFAULT"){
                geoCoord.cls = "";
            } else {
                geoCoord.cls = geoCoord.datum + " " + geoCoord.proj + " " + geoCoord.coord;
            }
        });

    }
});