Oskari.clazz.define('Oskari.coordinatetransformation.CoordinateDataHandler', function ( ) {

    this.data = {
        coordinates: []
    };
},
{
    getName: function() {
        return 'Oskari.coordinatetransformation.CoordinateDataHandler';
    },
    getCoordinateObject: function () {
        return this.data;
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
    /**
     * @method modifyCoordinateObject
     * @param {string} flag - coordinate array contains two objects, input & output - flag determines which one you interact with
     * @param {array} coordinates - an array containing objects with keys lon lat - one object for each coordinate pair
     * @description 
     */
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
    },
});