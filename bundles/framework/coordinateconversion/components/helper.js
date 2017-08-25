Oskari.clazz.define('Oskari.framework.bundle.coordinateconversion.helper', function(instance, locale) {
    this.loc = locale;
    this.instance = instance;
    this.sb = instance.sandbox;
    this.sb.register(this);
    for (var p in this.eventHandlers) {
    this.sb.registerForEventByName(this, p);
    this.clickCoordinates = null;
    this.moveReq = this.sb.getRequestBuilder('MapMoveRequest');
}
}, {
    getName: function() {
        return 'Oskari.framework.bundle.coordinateconversion.helper';
    },
    init : function() {},
    /****** PUBLIC METHODS ******/
    /**
     * @method  @public getPanelContent get content panel
     */
    eventHandlers: {
        'MapClickedEvent': function (event) {
            this.clickCoordinates = event._lonlat;        
        }
    },
    getCoordinatesFromMap: function() {
        return this.clickCoordinates;
    },
    moveToCoords: function (coords) {
    var reqBuilder = this.sb.getRequestBuilder('MapModulePlugin.AddMarkerRequest');
        if (reqBuilder) {
                var data = {
                    x: Number(coords.lon),
                    y: Number(coords.lat),
                    iconUrl: '/Oskari/resources/icons/marker-pin2.png'
                };
            var request = reqBuilder(data);
            this.sb.request('MainMapModule', request);
        }
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
    	var handler = this.eventHandlers[event.getName()];

        if(!handler)
        	return;

        return handler.apply(this, [event]);
    },
    getOptionsJSON: function() {
         var json = {
                        "geodeticdatum": {
                            0: { "id":"DATUM_DEFAULT", "title":"Mikä tahansa", "cls":"DATUM_KKJ DATUM_EUREF-FIN DATUM_DEFAULT"},
                            1: { "id":"DATUM_KKJ", "title":"KKJ", "cls":"DATUM_KKJ DATUM_EUREF-FIN DATUM_DEFAULT"},
                            2: { "id":"DATUM_EUREF-FIN", "title":"EUREF-FIN", "cls":"DATUM_KKJ DATUM_EUREF-FIN DATUM_DEFAULT"}
                            },
                        "koordinaatisto": {
                            0: { "id":"KOORDINAATISTO_DEFAULT", "title":"Mikä tahansa" },
                            1: { "id":"KOORDINAATISTO_SUORAK_2D", "title":"Suorakulmainen 2D (Taso)", "cls":"DATUM_KKJ DATUM_EUREF-FIN" },
                            2: { "id":"KOORDINAATISTO_SUORAK_3D", "title":"Suorakulmainen 3D", "cls":"DATUM_EUREF-FIN" },
                            3: { "id":"KOORDINAATISTO_MAANT_2D", "title":"Maantieteellinen 2D", "cls":"DATUM_EUREF-FIN DATUM_KKJ" },
                            4: { "id":"KOORDINAATISTO_MAANT_3D", "title":"Maantieteellinen 3D", "cls":"DATUM_EUREF-FIN" }
                            },
                        "mapprojection": {
                            0: { "id":"DATUM_KARTTAPJ_DEFAULT", "title":"Mikä tahansa"},
                            1: { "id":"KKJ_KAISTA", "title":"KKJ", "cls":"DATUM_KKJ"},
                            2: { "id":"TM", "title":"ETRS-TM",  "cls":"DATUM_EUREF-FIN"},
                            3: { "id":"GK", "title":"ETRS-GK",  "cls":"DATUM_EUREF-FIN"}
                            },
                        "coordinatesystem": {
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
                            18: { "id":"COORDSYS_ETRS-TM35", "title":"ETRS-TM36", "cls":"DATUM_EUREF-FIN TM" },
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
                        "heigthsystem": {
                            0: { "id":"KORKEUSJ_DEFAULT", "title":"Ei mitään","cls":"DATUM_KKJ DATUM_EUREF-FIN DATUM_DEFAULT"},
                            1: { "id":"KORKEUSJ_N2000", "title":"N2000", "cls":"DATUM_KKJ DATUM_EUREF-FIN DATUM_DEFAULT"},
                            2: { "id":"KORKEUSJ_N60", "title":"N60", "cls":"DATUM_KKJ DATUM_EUREF-FIN DATUM_DEFAULT"},
                            3: { "id":"KORKEUSJ_N43", "title":"N43", "cls":"DATUM_KKJ DATUM_EUREF-FIN DATUM_DEFAULT"}
                            }
                        }
                        return json;
    }

});