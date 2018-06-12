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
            "coordinateSystem": {
                "title": "Koordinaattijärjestelmän tiedot",
                "input": "Lähtötiedot",
                "output": "Tulostiedot",
                "noFilter": "Any option",
                "geodeticDatum": {
                    "label": "Geodeettinen datumi",
                    "infoTitle": "Geodeettinen datumi",
                    "infoContent": ""
                },
                "coordinateSystem":{
                    "label": "Koordinaatisto",
                    "infoTitle": "Koordinaatisto",
                    "infoContent": "",
                    "proj2D": "Suorakulmainen 2D (Taso)",
                    "proj3D": "Suorakulmainen 3D",
                    "geo2D": "Maantieteellinen 2D",
                    "geo3D": "Maantieteellinen 3D"
                },
                "mapProjection":{
                    "label": "Karttaprojektiojärjestelmä",
                    "infoTitle": "Karttaprojektiojärjestelmä",
                    "infoContent": ""
                },
                "geodeticCoordinateSystem":{
                    "label": "Geodeettinen koordinaattijärjestelmä",
                    "infoTitle": "Geodeettinen koordinaattijärjestelmä",
                    "infoContent":"",
                    "choose": "Choose",
                    "kkj": "KKJ zone {zone, number}",
                    "ykj": "KKJ zone 3 / YKJ"
                },
                "heightSystem":{
                    "label": "Korkeusjärjestelmä",
                    "infoTitle":"",
                    "infoContent": "",
                    "none": "None"
                }
            },
            "dataSource": {
                "title": "Koordinaattitietojen lähde",
                "confirmChange": "Muunnettavat koordinaatit tyhjennetään ja koordinaattijärjestelmän tiedot poistetaan. Haluatko jatkaa?",
                "file": {
                    "label": "Tiedostosta",
                    "info":  "Raahaa lähtöaineiston sisältävä tiedosto tähän tai",
                    "link": "valitse selaamalla",
                    "uploading": "Ladataan",
                    "error": "Virhe!",
                    "success": "Valmis"
                },
                "keyboard": {
                    "label": "Näppäimistöltä",
                    "info": "Kopioi lähtötiedot taulukkoon Muunnettavat koordinaatit ja valitse sen jälkeen Muunna."
                },
                "map": {
                    "label": "Valitse sijainnit kartalta",
                    "info": "Valitse yksi tai useampia pisteitä kartalta klikkaamalla."
                }
            },
            "coordinateTable": {
                "input": "Muunnettavat koordinaatit",
                "output": "Tuloskoordinaatit",
                "north":"Pohjois-koordinaatti [m]",
                "east":"Itä-koordinaatti [m]",
                "lat":"Leveysaste",
                "lon":"Pituusaste",
                "elevation": "Korkeus [m]",
                "geoX":"Geosentrinen X [m]",
                "geoY":"Geosentrinen Y [m]",
                "geoZ":"Geosentrinen Z [m]",
                "ellipseElevation":"Ellipsoidinen korkeus [m]",
                "rows": "Riviä",
                "clearTables": "Tyhjennä taulukot",
                "confirmClear": "Haluatko tyhjentää taulukot?"
            },
            "transform": {
                "warnings": {
                    "title": "Huomio!",
                    "3DTo2D": "Valitsemissasi lähtötiedoissa on mukana korkeusarvoja, mutta tulostiedoissa ei. Tuloskoordinaatteihin ei siis tule korkeusarvoja mukaan. Haluatko jatkaa?",
                    "2DTo3D": "Valitsemissasi lähtötiedoissa ei ole korkeusarvoja, mutta tulostiedoissa on. Lähtöaineiston korkeusarvoiksi lisätään 0 ja korkeusjärjestelmäksi N2000. Haluatko jatkaa?"
                },
                "validateErrors": {
                    "title": "Virhe!",
                    "crs": "Geodeettinen koordinaattijärjestelmä pitää olla valittuna sekä lähtö- että tulostiedoissa.",
                    "sourceHeight": "Lähtötietojen korkeusjärjestelmää ei ole valittu.",
                    "targetHeight": "Tulostietojen korkeusjärjestelmää ei ole valittu.",
                    "noInputData": "Ei muunnettavia koordinaatteja.",
                    "noInputFile": "Lähtöaineiston sisältävää tiedostoa ei ole valittu.",
                    "noFileName": "Anna tiedostonimi.",
                    "doubleComma": "Desimaali- ja koordinaattierotin eivät voi molemmat olla pilkkuja."
                },
                "responseErrors": {
                    "title": "Virhe muunnoksessa!",
                    "generic": "Koordinaattimuunnos epäonnistui...",
                    "invalid_coord": "Koordinaatti virheellinen. Tarkasta, että muunnettavat koordinaatit on oikeassa muodossa sekä geodeettinen koordinaatti- ja kokeusjärjestelmä ovat oikein.",
                    "invalid_number": "Koordinaatti virheellinen. Tarkasta..",
                    "no_coordinates": "Ei koordinaatteja",
                    "invalid_file_settings": "Invalid file settings",
                    "no_file": "No file entry",
                    "invalid_coord_length": "Tiedostossa virheellinen koordinaatti. Tarkasta, että otsakerivit, käytä tunnistetta sekä geoodeettinen koordinaatti- ja korkeusjärjestelmä ovat määritetty oikein.",
                    "invalid_coord_in_row": "Tiedostossa virheellinen koordinaatti rivillä xx."
                },
                "responseFile": {
                    "title": "Attention!",
                    "hasMoreCoordinates": "Lähtöaineistosta ei voida muuntaa taulukkoon yli {maxCoordsToArray, number} koordinaattia. Jos haluat muuntaa kaikki koordinaatit, käytä Vie tulokset tiedostoon -toimintoa."
                }
            }
        },
        "mapMarkers":{
            "show":{
                "title": "Näytä sijainnit kartalla",
                "info" : "Tarkastele muunnettuja koordinaatteja kartalla.",
                "errorTitle": "Virhe sijaintien näyttämisessä",
                "transformError": "Muunna koordinaatit ennen sijaintien näyttämistä kartalla.",
                "lon": "Lon",
                "lat": "Lat",
                "north": "N",
                "east": "E"
            },
            "select":{
                "title": "Näytä sijainnit kartalla",
                "info": "Valitse yksi tai useampia pisteitä kartalta klikkaamalla."
            }
        },
        "actions": {
            "convert": "Muunna",
            "clearTable": "Tyhjennä taulukot",
            "showMarkers": "Näytä sijainnit kartalla",
            "export": "Vie tulokset tiedostoon",
            "select": "Välj",
            "selectFromMap": "Siirry valitsemaan.",
            "cancel": "Peruuta",
            "done": "Valmis",
            "ok": "Ok",
            "close": "Stäng"
        },
        "fileSettings": {
            "options": {
                "decimalSeparator": "Decimal separator",
                "coordinateSeparator": "Coordinate separator",
                "headerCount": "Header line count",
                "decimalCount": "Decimal precision",
                "reverseCoords": "Coordinates reversed",
                "useId": "Use id infront",
                "writeHeader": "Write a header",
                "useCardinals": "Use cardinals (N,E,W,S)",
                "lineEnds": "Line ends to output",
                "degreeFormat":{
                    "label": "Angle pattern",
                    "degree": "Degree",
                    "gradian": "Grade",
                    "radian": "Radian"
                },
                "lineSeparator": {
                    "label": "Line separator",
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
                "title": "Aineiston muodostaminen",
                "fileName": "Tiedoston nimi"
            },
            "import": {
                "title": "Lähtöaineiston ominaisuudet"
            }
        }
    }
});
