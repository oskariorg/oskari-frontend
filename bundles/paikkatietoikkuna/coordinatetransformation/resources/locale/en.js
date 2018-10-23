Oskari.registerLocalization(
{
    "lang": "en",
    "key": "coordinatetransformation",
    "value": {
        "title": "Coordinate Transformation",
        "tile": {
            "title": "Coordinate Transformation"
        },
        "flyout": {
            "title":"Coordinate Transformation",
            "filterSystems": {
                "title": "Filter coordinate reference systems",
                "epsg": "With EPSG code",
                "systems": "With datum and coordinate system"
            },
            "coordinateSystem": {
                "title": "Coordinate reference system information",
                "input": {
                    "title": "Input coordinate reference system information"
                },
                "output": {
                    "title": "Output coordinate reference system information"
                },
                "noFilter": "Any option",
                "epsgSearch": {
                    "label": "Search using EPSG code"
                },
                "geodeticDatum": {
                    "label": "Geodetic datum"
                },
                "coordinateSystem":{
                    "label": "Coordinate system",
                    "proj2D": "Projected 2D",
                    "proj3D": "Projected 3D",
                    "geo2D": "Geographic 2D",
                    "geo3D": "Geographic 3D"
                },
                "mapProjection":{
                    "label": "System of map projections"
                },
                "geodeticCoordinateSystem":{
                    "label": "Geodetic coordinate reference system",
                    "choose": "Select", // Choose
                    "kkj": "KKJ zone {zone, number}",
                    "ykj": "KKJ zone 3 / YKJ"
                },
                "heightSystem":{
                    "label": "Vertical coordinate reference system", // Height system
                    "none": "None"
                }
            },
            "coordinateTable": {
                "input": "Input coordinates",
                "output": "Output coordinates",
                "north":"Northing [m]",
                "east":"Easting [m]",
                "lat":"Geodetic latitude",
                "lon":"Geodetic longitude",
                "elevation": "Height [m]",
                "geoX":"Geocentric X [m]",
                "geoY":"Geocentric Y [m]",
                "geoZ":"Geocentric Z [m]",
                "ellipseElevation":"Ellipsoidal height [m]",
                "rows": "Rows",
                "clearTables": "Empty tables",
                "confirmClear": "Are you sure you want to empty tables?"
            },
            "transform": {
                "warnings": {
                    "title": "Warning!",
                    "3DTo2D": "The selected input information contains height values, but the output information does not. Output coordinates will therefore not include height values. Do you want to continue?",
                    "2DTo3D": "The selected output information contains height values, but the input information does not. The height values 0 and height system N2000 will be added to the input information. Do you want to continue?",
                    "xyz": "No height system has been selected for the input coordinate system. It is not possible to transform this input information into a projected 3D system.",
                    "largeFile": "Isojen tiedostojen muuntaminen voi kestää useita minuutteja."
                },
                "validateErrors": {
                    "title": "Error!", // Error in coordinate system selections
                    "message": "Selections are incomplete or contain errors. Note the following requirements and try again.",
                    "crs": "A geodetic coordinate reference system must be selected both in the input and the output information.",
                    "noInputData": "No input coordinates.",
                    "noInputFile": "The file containing input information must be selected.",
                    "noFileName": "The output file must be named.",
                    "decimalCount": "The decimal precision must be 0 or a positive integer.",
                    "headerCount": "The number of header rows must be 0 or a positive integer.",
                    "doubleComma": "The decimal and coordinate separators cannot both be commas.",
                    "doubleSpace": "Kulman muoto/yksikkö ei voi sisältää välilyöntejä, jos koordinaattierotin on Välilyönti.",
                    "noFileSettings": "No file settings.",
                    "noCoordinateSeparator": "There must be a coordinate separator..",
                    "noDecimalSeparator":"There must be a decimal separator."
                },
                "responseErrors": {
                    "title": "Error in transformation!",
                    "titleRead": "Virhe tiedoston lukemisessa!",
                    "readFileError" : "Tiedostosta ei onnistuttu lukemaan kaikkia rivejä.",
                    "transformFileError": "Tiedoston koordinaatteja ei onnistuttu muuntamaan.",
                    "invalidLine": "The file's row {index, number} contains an invalid coordinate: {line}. Check that the selected decimal and coordinate separators and number of header rows match the contents of the file.",
                    "generic": "Coordinate transformation failed...",
                    //error codes
                    "invalid_coord": "Koordinaatti virheellinen. Tarkasta, että muunnettavat koordinaatit on oikeassa muodossa sekä geodeettinen koordinaatti- ja kokeusjärjestelmä ovat oikein.",
                    "invalid_number": "Invalid coordinate.",
                    "invalid_coord_in_array": "Invalid coordinate.",
                    "no_coordinates": "No coordinates.",
                    "invalid_file_settings": "Error in file settings.",
                    "no_file": "No file matching the request could be found.",
                    "invalid_first_coord": "It was not possible to produce coordinates with these selections. Check that the coordinate separator, number of headers, geodetic coordinate and height system (dimension) selections as well as the option to use identifier or not match the contents of the file.",
                    "transformation_error": "Koordinaattimuunnos epäonnistui. Koordinaattimuunnospalvelusta palautui virhe:"
                },
                "responseFile": {
                    "title": "Attention!",
                    "hasMoreCoordinates": "It is not possible to transform more than {maxCoordsToArray, number} coordinates from the input information into the table. If you want to transform all coordinates, select Output to file."
                }
            }
        },
        "dataSource": {
            "title": "Coordinate information source",
            "confirmChange": "Input coordinates will be removed and the coordinate reference system information deleted. Do you want to continue?",
            "file": {
                "label": "From file",
                "info":  "Select the file containing the input information and its settings.",
                "action": "edit selections"
            },
            "keyboard": {
                "label": "Using keyboard",
                "info": "Put the input information into the Input coordinates table."
            },
            "map": {
                "label": "Select locations on the map",
                "info": "Select coordinates to be transformed on the map by clicking them.",
                "action": "select more"
            }
        },
        "mapMarkers":{
            "show":{
                "title": "Show locations on the map",
                "info" : "The projection of the map is ETRS89-TM35FIN. Coordinates have been placed on the map using this coordinate reference system. With the location, the coordinates are shown numerically in the input and/or output coordinate reference system. ",
                "errorTitle": "Virhe sijaintien näyttämisessä",
                "noCoordinates": "Ei koordinaatteja näytettäväksi kartalla",
                "noSrs": "Geodeettinen koordinaattijärjestelmä pitää olla valittuna lähtötiedoissa, jotta pisteet voidaan näyttää kartalla.",
                "lon": "Lon",
                "lat": "Lat",
                "north": "N",
                "east": "E"
            },
            "select":{
                "title": "Select locations on the map",
                "info": "Click to select one or more points on the map. The projection of the map is ETRS-TM35FIN. This coordinate reference system is automatically selected for the coordinates to be transformed and it cannot be changed. When selecting coordinates, please note that selecting locations on the map is not very precise.",
                "add": "Add markers",
                "remove": "Remove markers"
            }
        },
        "actions": {
            "convert": "Transform",
            "export": "Transform into file",
            "select": "Select",
            "cancel": "Cancel",
            "done": "Done",
            "ok": "Ok",
            "close": "Close"
        },
        "fileSettings": {
            "options": {
                "decimalSeparator": "Decimal separator",
                "coordinateSeparator": "Coordinate separator",
                "headerCount": "Number of header rows",
                "decimalCount": "Decimal precision",
                "reverseCoordinates": "Inverted coordinates", // Coordinates reversed
                "useId": { // Use identifier, Use id infront
                    "input": "Coordinates include identifiers",
                    "generate": "Generate identifiers",
                    "fromFile": "Include identifiers from the input file"
                },
                "writeHeader": "Write header row into file",
                "useCardinals": "Use cardinals (N,E,W,S)",
                "lineEnds": "Include end-of-row markers in output", // Line ends to output
                "choose": "Choose",
                "degreeFormat":{
                    "label": "Angle pattern", // Angle shape/unit
                    "degree": "Degree",
                    "gradian": "Grade",
                    "radian": "Radian"
                },
                "lineSeparator": {
                    "label": "Line separator", // Row separator
                    "win": "Windows / DOS",
                    "unix": "Unix",
                    "mac": "MacOS"
                },
                "delimeters":{
                    "point": "Point",
                    "comma": "Comma",
                    "tab": "Tabulator",
                    "space": "Space",
                    "semicolon": "Semicolon"
                }
            },
            "export": {
                "title": "Formation of output information", // or file
                "fileName": "File name"
            },
            "import": {
                "title": "Formation of input information" // Input information properties
            }
        },
        "infoPopup": {
            "description": "Description",
            "epsgSearch": {
                "title": "Search using EPSG code",
                "info": "You can search for a geodetic coordinate reference system using the EPSG code. Input the code as a numerical value, such as 3067.",
                "listItems": []
            },
            "geodeticDatum": {
                "title": "Geodetic datum",
                "info": "Datum describing the relationship between a 2D or 3D coordinate system and the Earth.",
                "listItems" : [
                    "Datum: a parameter or set of parameters defining the origin, scale and orientation of a coordinate system.",
                    "Examples of a geodetic datum are EUREF-FIN and the KKJ coordinate reference system."
                ]
            },
            "coordinateSystem":{
                "title": "Coordinate system",
                "info": "A set of mathematical rules defining how points are assigned coordinates.",
                "listItems" : [
                    "Diferent types of coordinate systems include rectangular coordinate systems, projected coordinate systems, polar coordinate systems, geodetic coordinate systems, spherical coordinate systems and cylindrical coordinate systems."
                ]
            },
            "mapProjection":{
                "title": "System of map projection",
                "info": "A set of rules determining how an area is described using a set of map projections.",
                "listItems" : [
                    "Map projection: a method of describing a three-dimensional surface on a two-dimensional plane (map).",
                    "The rules can be used to affirm map projections and projection zones. For projection zones the system can define identifiers, the scale, width, length and superimposition of central meridians or central parallels."
                ]
            },
            "geodeticCoordinateSystem":{
                "title": "Geodetic coordinate reference system",
                "info": "Coordinate reference system based on a geodetic datum.",
                "listItems" : [
                    "Coordinate reference system: a system consisting of a coordinate system that is tied to the real world with a datum.",
                    "The national projected coordinate system of Finland is ETRS-TM35FIN."
                ]
            },
            "heightSystem":{
                "title":"Vertical coordinate reference system",
                "info": "One-dimensional coordinate system based on a vertical datum.",
                "listItems" : [
                    "Vertical datum: a datum defining the relationship between heights or depths related to gravity and the Earth.",
                    "In nationwide tasks in Finland, we use the N2000 height system that is compliant with the JHS 163 recommendation."
                ]
            },
            "fileName":{
                "title":"File name",
                "info": "",
                "paragraphs" : [],
                "listItems" : []
            },
            "decimalPrecision":{
                "title":"Decimal precision",
                "info": "Number of decimals included in the output",
                "paragraphs": [
                    "This property is used to define the decimal accuracy of coordinates in the output. The default on the form is the number of decimals matching an accuracy of 1mm. The default for showing degrees is the nearest number of decimals in the metric system matching an accuracy of 1mm."
                ],
                "listItems" : [],
                "precisionTable": {
                    "title": "Metristen tarkkuuksien desimaalien määrä kulman muotojen/yksikkö",
                    "unit": "Kulman muoto/yksikkö",
                    "deg": "Asteet, goonit ja DD",
                    "rad": "Radiaaneissa",
                    "min": "DDMM ja DD MM",
                    "sec": "DDMMSS ja DD MM SS"
                }
            },
            "coordinateSeparator":{
                "title":"Coordinate separator",
                "info": "Coordinate separator", // TODO
                "paragraphs": [
                    "This property is used to show the column separator in the input file that is used to separate coordinate values. The input data cannot contain more than one such separator character between two coordinate values.",
                    "If the coordinates are preceded by an identifier or followed by a character string, these must also be separated from the coordinates using the same separator."
                ],
                "listItems" : []
            },
            "headerLineCount":{
                "title":"Number of header rows",
                "info": "Number of lines in the beginning of the file before the first coordinate row",
                "paragraphs": [
                    "This property is used to assign the number of lines to be bypassed at the start of the file before reading the first coordinate row.",
                    "The reason for bypassing can be, for example, a verbal description of the contents at the start of the file."
                ],
                "listItems" : []
            },
            "unitFormat":{
                "title":"Angle pattern",
                "info": "Unit of a geographic coordinate expressed in degrees",
                "paragraphs": [
                    "This property is used to define the format of angle values. Supported angle units: Degree, Grade and Radian",
                    "Sexagesimal forms derived from the degree are also supported. If in these formats degrees, minutes of arc and seconds of arc are separated by a space (DD MM and DD MM SS), the space cannot be used as the coordinate separator."
                ],
                "listItems" : []
            },
            "decimalSeparator":{
                "title":"Decimal separator",
                "info": "This property is used to define the decimal separator.",
                "paragraphs": [
                    "This property is used to define the decimal separator.",
                    "The decimal separator cannot be the same character as the coordinate separator. If the coordinate separator is a comma, the decimal separator must be a point."
                ],
                "listItems" : []
            },
            "lineSeparator":{
                "title":"Line separator",
                "info": "Character used as row or line break in the file",
                "paragraphs": [
                    "This property is used to define the character or character string used to separate rows/lines in the file. This character or character string is added to the end of each line or row in the file."
                ],
                "listItems" : []
            },
            "prefixId":{
                "title":"Use identifiers",
                "info": "Coordinate row starts with identifier",
                "paragraphs": [
                    "This property is used to define that the coordinate values of each point are preceded on the same line by the point's identifier (ID)",
                    "The point identifier must be separated from the coordinate values using the same character string as that used as the coordinate value separator.",
                    "If the input file does not contain point identifiers or the points have been imported from a table or a map, the points are assigned identifiers starting from 1 and increasing by one integer for each point.",
                    "The identifiers in the output file do not need to be numerical."
                ],
                "listItems" : []
            },
            "reverseCoordinates":{
                "title":"Inverted coordinates",
                "info": "",
                "paragraphs": [
                    "This property is used to define whether the first two coordinate values of each point in the file are in reverse order in comparison with the order given in the description of the coordinate system.",
                    "For example, koordinates in the KKJ coordinate system are by default arranged so that the N coordinate is followed by the E coordinate. If the reverse order is selected, the E coordinate must precede the N coordinate in the file."
                ],
                "listItems" : []
            },
            "writeHeader":{
                "title":"Include header rows",
                "info": "Include header rows in the output",
                "paragraphs": [
                    "This property is used to include metadata about coordinates in the header row. The name of the coordinate reference system is added to the header row.",
                    "When transforming from one file into another, any header rows in the input file in addition to the coordinate reference system information are added to the output file."
                ],
                "listItems" : []
            },
            "lineEnds":{
                "title":"Include end-of-row markers in output",
                "info": "End-of-row characters and character strings are added to the output file",
                "paragraphs": [
                    "This property is used to include any end-of-row characters or character strings from the input file to the output file. All characters following the coordinate values of a point count as the end-of-row character string for that row. The end-of-row character or character string must be separated from the coordinate values using the same character as that used as the coordinate value separator.",
                    "This property only has an effect on the transformation from one file to another."
                ],
                "listItems" : []
            },
            "useCardinals":{
                "title":"Use cardinals",
                "info": "Coordinate values are followed by points of the compass (N, E, W or S).",
                "paragraphs": [
                    "This property is used to include points of the compass after coordinate values in the output. The inverse point of the compass is added to negative values and the minus signs are removed from coordinate values. For example, the value of the E coordinate 325418 becomes 325418E and the value of the E coordinate -325418 becomes 325418W.",
                    "Points of the compass are indicated by writing N, E, W or S after the coordinate value."
                ],
                "listItems" : []
            }
        }
    }
});
