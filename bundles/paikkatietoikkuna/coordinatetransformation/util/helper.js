Oskari.clazz.define('Oskari.coordinatetransformation.helper', function(instance, locale) {
    this.loc = locale;
    this.instance = instance;
    this.sb = instance.sandbox;
    this.removeMarkersReq = Oskari.requestBuilder('MapModulePlugin.RemoveMarkersRequest');
    this.addMarkerReq = Oskari.requestBuilder('MapModulePlugin.AddMarkerRequest');
    for ( var p in this.eventHandlers ) {
        this.sb.registerForEventByName(this, p);
        this.clickCoordinates = null;
        this.moveReq = Oskari.requestBuilder('MapMoveRequest');
    }
}, {
    getName: function() {
        return 'Oskari.coordinatetransformation.helper';
    },
    init: function () {},
    eventHandlers: {
        'MapClickedEvent': function ( event, cb ) {
            this.clickCoordinates = event._lonlat;
            this.addMarkerForCoords( this.clickCoordinates );
            this.instance.getViews().MapSelection.getCoords( this.clickCoordinates )
        }
    },
    getClickCoordinates: function() {
        return this.clickCoordinates;
    },
    addMarkerForCoords: function (coords, startingSystem) {
        // TODO: disable gfi when selecting markers
        if ( !this.instance.isMapSelectionMode()  ) {
            return;
        }
        if ( this.addMarkerReq ) {
                var data = {
                    x: Number(coords.lon),
                    y: Number(coords.lat),
                    color: "ff0000",
                    shape: 3
                };
                if ( startingSystem ) {
                    data.msg = "lon: "+coords.lon+ "lat: "+coords.lat;
                }
            var request = this.addMarkerReq(data);
            this.sb.request('MainMapModule', request);
        }
    },
    removeMarkers: function () {
        if( this.removeMarkersReq ) {
            this.sb.request('MainMapModule', this.removeMarkersReq());
        }
    },
    onEvent : function(event) {
    	var handler = this.eventHandlers[event.getName()];

        if(!handler)
        	return;

        return handler.apply(this, [event]);
    },
    getOptionsJSON: function() {
         var json = {
            "datum": {
                0: { "id":"DATUM_DEFAULT", "title":"Mikä tahansa", "cls":"DATUM_KKJ DATUM_EUREF-FIN DATUM_DEFAULT"},
                1: { "id":"DATUM_KKJ", "title":"KKJ", "cls":"DATUM_KKJ DATUM_EUREF-FIN DATUM_DEFAULT"},
                2: { "id":"DATUM_EUREF-FIN", "title":"EUREF-FIN", "cls":"DATUM_KKJ DATUM_EUREF-FIN DATUM_DEFAULT"}
                },
            "coordinate": {
                0: { "id":"KOORDINAATISTO_DEFAULT", "title":"Mikä tahansa" },
                1: { "id":"KOORDINAATISTO_SUORAK_2D", "title":"Suorakulmainen 2D (Taso)", "cls":"DATUM_KKJ DATUM_EUREF-FIN" },
                2: { "id":"KOORDINAATISTO_SUORAK_3D", "title":"Suorakulmainen 3D", "cls":"DATUM_EUREF-FIN" },
                3: { "id":"KOORDINAATISTO_MAANT_2D", "title":"Maantieteellinen 2D", "cls":"DATUM_EUREF-FIN DATUM_KKJ" },
                4: { "id":"KOORDINAATISTO_MAANT_3D", "title":"Maantieteellinen 3D", "cls":"DATUM_EUREF-FIN" }
                },
            "projection": {
                0: { "id":"DATUM_KARTTAPJ_DEFAULT", "title":"Mikä tahansa"},
                1: { "id":"KKJ_KAISTA", "title":"KKJ", "cls":"DATUM_KKJ"},
                2: { "id":"TM", "title":"ETRS-TM",  "cls":"DATUM_EUREF-FIN"},
                3: { "id":"GK", "title":"ETRS-GK",  "cls":"DATUM_EUREF-FIN"}
                },
            "geodetic-coordinate": {
                0: { "id":"COORDSYS_DEFAULT", "title":"Valitse" },
                1: { "id":"COORDSYS_ETRS-GK19", "title":"ETRS-GK19", "cls":"DATUM_EUREF-FIN GK" },
                2: { "id":"COORDSYS_ETRS-GK20", "title":"ETRS-GK20", "cls":"DATUM_EUREF-FIN GK" },
                3: { "id":"COORDSYS_ETRS-GK21", "title":"ETRS-GK21", "cls":"DATUM_EUREF-FIN GK" },
                4: { "id":"COORDSYS_ETRS-GK22", "title":"ETRS-GK22", "cls":"DATUM_EUREF-FIN GK" },
                5: { "id":"COORDSYS_ETRS-GK23", "title":"ETRS-GK23", "cls":"DATUM_EUREF-FIN GK" },
                6: { "id":"COORDSYS_ETRS-GK24", "title":"ETRS-GK24", "cls":"DATUM_EUREF-FIN GK" },
                7: { "id":"COORDSYS_ETRS-GK25", "title":"ETRS-GK25", "cls":"DATUM_EUREF-FIN GK" },
                8: { "id":"COORDSYS_ETRS-GK26", "title":"ETRS-GK26", "cls":"DATUM_EUREF-FIN GK" },
                9: { "id":"COORDSYS_ETRS-GK27", "title":"ETRS-GK27", "cls":"DATUM_EUREF-FIN GK" },
                10: { "id":"COORDSYS_ETRS-GK28", "title":"ETRS-GK28", "cls":"DATUM_EUREF-FIN GK" },
                11: { "id":"COORDSYS_ETRS-GK29", "title":"ETRS-GK29", "cls":"DATUM_EUREF-FIN GK" },
                12: { "id":"COORDSYS_ETRS-GK30", "title":"ETRS-GK30", "cls":"DATUM_EUREF-FIN GK" },
                13: { "id":"COORDSYS_ETRS-GK31", "title":"ETRS-GK31", "cls":"DATUM_EUREF-FIN GK" },
                14: { "id":"COORDSYS_ETRS-LAEA", "title":"ETRS-LAEA", "cls":"DATUM_EUREF-FIN GK" },
                15: { "id":"COORDSYS_ETRS-LCC", "title":"ETRS-LCC", "cls":"DATUM_EUREF-FIN" },
                16: { "id":"COORDSYS_ETRS-TM34", "title":"ETRS-TM34", "cls":"DATUM_EUREF-FIN TM" },
                17: { "id":"COORDSYS_ETRS-TM35", "title":"ETRS-TM35", "cls":"DATUM_EUREF-FIN TM" },
                18: { "id":"COORDSYS_ETRS-TM36", "title":"ETRS-TM36", "cls":"DATUM_EUREF-FIN TM" },
                19: { "id":"COORDSYS_ETRS-TM35FIN", "title":"ETRS-TM35FIN", "cls":"DATUM_EUREF-FIN TM" },
                20: { "id":"COORDSYS_EUREF-FIN-GEO2D", "title":"EUREF-FIN-GRS80", "cls":"DATUM_EUREF-FIN KOORDINAATISTO_MAANT_2D" },
                21: { "id":"COORDSYS_EUREF-FIN-GEO3D", "title":"EUREF-FIN-GRS80h", "cls":"DATUM_EUREF-FIN KOORDINAATISTO_MAANT_3D" },
                22: { "id":"COORDSYS_ETRS-EUREF-FIN_SUORAK3d", "title":"EUREF-FIN-XYZ", "cls":"DATUM_EUREF-FIN KOORDINAATISTO_SUORAK_3D" },
                23: { "id":"COORDSYS_KKJ0", "title":"KKJ kaista 0", "cls":"DATUM_KKJ KKJ_KAISTA" },
                24: { "id":"COORDSYS_KKJ1", "title":"KKJ kaista 1", "cls":"DATUM_KKJ KKJ_KAISTA" },
                25: { "id":"COORDSYS_KKJ2", "title":"KKJ kaista 2", "cls":"DATUM_KKJ KKJ_KAISTA" },
                26: { "id":"COORDSYS_KKJ3", "title":"KKJ kaista 3 / YKJ", "cls":"DATUM_KKJ KKJ_KAISTA" },
                27: { "id":"COORDSYS_KKJ4", "title":"KKJ kaista 4", "cls":"DATUM_KKJ KKJ_KAISTA" },
                28: { "id":"COORDSYS_KKJ5", "title":"KKJ kaista 5", "cls":"DATUM_KKJ KKJ_KAISTA" },
                29: { "id":"COORDSYS_KKJ_GEO", "title":"KKJ-Hayford", "cls":"DATUM_KKJ KOORDINAATISTO_MAANT_2D" }
                },
            "elevation": {
                0: { "id":"KORKEUSJ_DEFAULT", "title":"Ei mitään","cls":"DATUM_KKJ DATUM_EUREF-FIN DATUM_DEFAULT"},
                1: { "id":"KORKEUSJ_N2000", "title":"N2000", "cls":"DATUM_KKJ DATUM_EUREF-FIN DATUM_DEFAULT"},
                2: { "id":"KORKEUSJ_N60", "title":"N60", "cls":"DATUM_KKJ DATUM_EUREF-FIN DATUM_DEFAULT"},
                3: { "id":"KORKEUSJ_N43", "title":"N43", "cls":"DATUM_KKJ DATUM_EUREF-FIN DATUM_DEFAULT"}
                }
            }
            return json;
    },
    getMappedEPSG: function ( value ) {
        var EPSG = {
            'COORDSYS_ETRS-GK19': "EPSG:3126",
            'COORDSYS_ETRS-GK20': "EPSG:3127",
            'COORDSYS_ETRS-GK21': "EPSG:3128",
            'COORDSYS_ETRS-GK22': "EPSG:3129",
            'COORDSYS_ETRS-GK23': "EPSG:3130",
            'COORDSYS_ETRS-GK24': "EPSG:3131",
            'COORDSYS_ETRS-GK25': "EPSG:3132",
            'COORDSYS_ETRS-GK26': "EPSG:3133",
            'COORDSYS_ETRS-GK27': "EPSG:3134",
            'COORDSYS_ETRS-GK28': "EPSG:3135",
            'COORDSYS_ETRS-GK29': "EPSG:3136",
            'COORDSYS_ETRS-GK30': "EPSG:3137",
            'COORDSYS_ETRS-GK31': "EPSG:3138",
            'COORDSYS_ETRS-LAEA': "EPSG:3035",
            'COORDSYS_ETRS-LCC': "EPSG:3034",
            'COORDSYS_ETRS-TM34': "EPSG:3046",
            'COORDSYS_ETRS-TM35': "EPSG:3047",
            'COORDSYS_ETRS-TM36': "EPSG:3048", 
            'COORDSYS_ETRS-TM35FIN': "EPSG:3067", 
            'COORDSYS_EUREF-FIN-GEO2D': "EPSG:4258", 
            'COORDSYS_EUREF-FIN-GEO3D': "EPSG:4937", 
            'COORDSYS_ETRS-EUREF-FIN_SUORAK3d': "EPSG:4936", 
            'COORDSYS_KKJ0': "EPSG:3386", 
            'COORDSYS_KKJ1': "EPSG:2391", 
            'COORDSYS_KKJ2': "EPSG:2392", 
            'COORDSYS_KKJ3': "EPSG:2393", 
            'COORDSYS_KKJ4': "EPSG:2394", 
            'COORDSYS_KKJ5': "EPSG:3387", 
            'COORDSYS_KKJ_GEO': "EPSG:4123", 
            'KORKEUSJ_N2000': "EPSG:3900",
            'KORKEUSJ_N60': "EPSG:5717",
            'KORKEUSJ_N43': "N43"
	    }

        return EPSG[value];
}
});