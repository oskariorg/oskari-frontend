Oskari.clazz.define('Oskari.coordinatetransformation.CoordinateDataHandler', function ( ) {
    this.inputCoords = []; //[[1324, 12424]]
    this.resultCoords = []; //[[1324, 12424]]
    this.mapCoords = []; //[{lon:123, lat:134}]
    Oskari.makeObservable(this);
}, {
    getName: function() {
        return 'Oskari.coordinatetransformation.CoordinateDataHandler';
    },
    getInputCoords: function () {
        return this.inputCoords;
    },
    addInputCoord: function (coord){
        this.inputCoords.push(coord);
        //this.trigger('InputCoordAdded', coord);
        this.trigger('InputCoordsChanged', this.inputCoords);
    },
    setInputCoords: function (coords, suppressEvent){
        this.inputCoords = coords;
        //don't render input table
        if (suppressEvent !== true){
            this.trigger('InputCoordsChanged', coords);
        }
    },
    hasInputCoords: function () {
        return this.inputCoords.length !== 0;
    },
    getResultCoords: function() {
        return this.resultCoords;
    },
    setResultCoords: function (coords) {
        this.resultCoords = coords;
        this.trigger('ResultCoordsChanged', coords);
    },
    //lonlat
    getMapCoords: function () {
        return this.mapCoords;
    },
    //lonlat
    setMapCoords: function (coords) {
        this.mapCoords = coords;
    },
    //lonlat
    addMapCoord: function (coord) {
        this.mapCoords.push(coord);
    },
    /** 
     * @method validateData
     * check different conditions if data matches to them
     */
    validateData: function( data ) {
        var lonlatKeyMatch = new RegExp(/(?:lon|lat)[\:][0-9.]+[\,].*,?/g);
        var numericWhitespaceMatch = new RegExp(/^[0-9.]+,+\s[0-9.]+,/gmi)
        
        var matched = data.match( lonlatKeyMatch );
        var numMatch = data.match( numericWhitespaceMatch );

            if( matched !== null ) {
            return this.constructObjectFromRegExpMatch( matched, true );
        } else {
            if( numMatch !== null ) {
                return this.constructObjectFromRegExpMatch( numMatch, false );
            }
        }
    },
    /** 
     * @method constructObjectFromRegExpMatch
     * @description constructs a object from string with lon lat keys
     */
    constructObjectFromRegExpMatch: function ( data, lonlat ) {
        var matchLonLat = new RegExp(/(lon|lat)[\:][0-9.]+[\,]?/g);
        var matchNumericComma = new RegExp(/([0-9.])+\s*,?/g);
        var numeric = new RegExp(/[0-9.]+/);
        var array = [];
        for ( var i = 0; i < data.length; i++ ) {
            var lonlatObject = {};

            if( lonlat ) {
                var match = data[i].match(matchLonLat);
            } else {
                var match = data[i].match(matchNumericComma);
            }
            var lonValue = match[0].match(numeric);
            var latValue = match[1].match(numeric);

            lonlatObject.lon = lonValue[0];
            lonlatObject.lat = latValue[0];
            array.push(lonlatObject);
        }
        return array;
    },
    /**
     * @method constructLonLatObjectFromArray
     * @description array -> object with lon lat keys
     */
    constructLonLatObjectFromArray: function ( data ) {
        var obj = {};
        if ( Array.isArray( data ) ) {
            for ( var i in data ) {
                if( Array.isArray(data[i]) ) {
                    for ( var j = 0; j < data[i].length; j++ ) {
                        obj[i] = {
                            lon: data[i][0],
                            lat: data[i][1]
                        }
                    }
                }
            }
        }
        return obj;
    },

    //generic -> to helper??
    //lonLatCoordToArray or addLonLatCoordToArray (array,..)
    lonLatCoordToArray: function ( coord, lonFirst){
        var arr = [];
        if (typeof coord.lon !== 'number' && typeof coord.lat !== 'number'){
            return arr;
        }
        if (lonFirst === true){
            arr.push(coord.lon);
            arr.push(coord.lat);
        } else {
            arr.push(coord.lat);
            arr.push(coord.lon);
        }
        return arr;
    },
    //generic -> to helper??
    arrayCoordToLonLat: function (coord, lonFirst){
        var obj = {};
        if (lonFirst === true){
            obj.lon = coord[0];
            obj.lat = coord[1];
        }else{
            obj.lat = coord[0];
            obj.lon = coord[1];
        }
        return obj;
    },
    addMapCoordsToInput: function (addBln){
        var me = this;
        var coords = me.getMapCoords();
        if (addBln === true){
            for (var i = 0 ; i < coords.length ; i++ ) {
                me.addInputCoord(me.lonLatCoordToArray(coords[i], true)); //TODO check mapsrs lonFirst
            }
        }
        coords.length = 0;
    },
    clearCoords: function () {
        this.inputCoords.length = 0;
        this.mapCoords.length = 0;
        this.resultCoords.length = 0;
        this.trigger('InputCoordsChanged', this.inputCoords);
        this.trigger('ResultCoordsChanged', this.resultCoords);
    },
    checkCoordsArrays: function(){
        var input = this.inputCoords.length,
            result = this.resultCoords.length;
        if (input !== 0 && result !==0){
            return input === output;
        }
    }
    /**
     * @method modifyCoordinateObject
     * @param {string} flag - coordinate array contains two objects, input & output - flag determines which one you interact with
     * @param {array} coordinates - an array containing objects with keys lon lat - one object for each coordinate pair
     * @description 
     *
    modifyCoordinateObject: function ( flag, coordinates ) {
        var data = this.getCoordinateObject().coordinates;
        var me = this;
        var actions = {
            'input': function () {
                coordinates.forEach( function ( pair ) {
                    data.push({
                        input: pair
                    });
                });
            },
            'output': function () {
                for ( var i = 0; i < Object.keys( coordinates ).length; i++ ) {
                    data[i].output = coordinates[i];
                }
            },
            'clear': function () {
                data.length = 0;
            }
        };
        if ( actions[flag] ) {
            actions[flag]();
        } else {
            return;
        }
    },*/
});