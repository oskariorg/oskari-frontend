Oskari.registerLocalization(
{
    "lang": "sv",
    "key": "coordinatetransformation",
    "value": {
        "title": "Coordinateconversion",
        "tile": {
            "title": "Coordinateconversion"
        },
        "flyout": {
            "title":"Coordinateconversion",
            "coordinateSystem": {
                "title": "Koordinaattijärjestelmän tiedot",
                "input": "Från-system",
                "output": "Till-system",
                "noFilter": "Mikä tahansa",
                "geodeticDatum": {
                    "label": "Geodetiskt datum",
                    "infoTitle": "Geodetiskt datum",
                    "infoContent": ""
                },
                "coordinateSystem":{
                    "label": "Koordinatsystem",
                    "infoTitle": "Koordinatsystem",
                    "infoContent": "",
                    "proj2D": "Suorakulmainen 2D (Taso)",
                    "proj3D": "Suorakulmainen 3D",
                    "geo2D": "Maantieteellinen 2D",
                    "geo3D": "Maantieteellinen 3D"
                },
                "mapProjection":{
                    "label": "Kartprojektionssystem",
                    "infoTitle": "Kartprojektionssystem",
                    "infoContent": ""
                },
                "geodeticCoordinateSystem":{
                    "label": "Geodetiskt koordinatsystem",
                    "infoTitle": "Geodetiskt koordinatsystem",
                    "infoContent":"",
                    "choose": "Valitse",
                    "kkj": "KKS zon {zone, number}",
                    "ykj": "KKS zon 3 / ?YKJ?"
                },
                "heightSystem":{
                    "label": "Höjdsystemet",
                    "infoTitle":"Höjdsystemet",
                    "infoContent": "",
                    "none": "Ei mitään"
                }
            },
            "dataSource": {
                "title": "Källa för koordinatinformation",
                "confirmChange": "Muunnettavat koordinaatit tyhjennetään ja koordinaattijärjestelmän tiedot poistetaan. Haluatko jatkaa?",
                "file": {
                    "label": "Fil",
                    "info":  "Raahaa lähtöaineiston sisältävä tiedosto tähän tai",
                    "link": "valitse selaamalla",
                    "uploading": "Ladataan",
                    "error": "Virhe!",
                    "success": "Valmis"
                },
                "keyboard": {
                    "label": "kopiera från urklipp",
                    "info": "Kopioi lähtötiedot taulukkoon Muunnettavat koordinaatit ja valitse sen jälkeen Muunna."
                },
                "map": {
                    "label": "Välj platser från kartan",
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
                "rows": "Rader",
                "clearTables": "Haluatko tyhjentää taulukot?",
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
                    "invalid_coord_length": "Tiedostossa virheellinen koordinaatti. Tarkasta, että otsakerivit, käytä tunnistetta sekä geoodeettinen koordinaatti- ja korkeusjärjestelmä ovat määritetty oikein."
                },
                "responseFile": {
                    "title": "Huomio!",
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
                "north": "N", //or P
                "east": "E"
            },
            "select":{
                "title": "Näytä sijainnit kartalla",
                "info": "Valitse yksi tai useampia pisteitä kartalta klikkaamalla."
            }
        },
        "actions": {
            "convert": "Transformera",
            "clearTable": "Tyhjennä taulukot",
            "showMarkers": "Näytä sijainnit kartalla",
            "export": "Vie tulokset tiedostoon",
            "select": "Valitse",
            "cancel": "Ångra",
            "done": "Färdig",
            "ok": "Ok",
            "close": "Sulje"
        },
        "fileSettings": {
            "options": {
                "decimalSeparator": "Desimaalierotin",
                "coordinateSeparator": "Koordinaattierotin",
                "headerCount": "Otsakerivien määrä",
                "decimalCount": "Desimaalien tarkkuus",
                "reverseCoords": "Koordinaatit käänteisesti",
                "useId": "Käytä tunnistetta",
                "writeHeader": "Kirjoita otsakerivi tiedostoon",
                "useCardinals": "Käytä kardinaaleja (N,E,W,S)",
                "lineEnds": "Tulosteeseen rivin loput",
                "degreeFormat":{
                    "label": "Kulman muoto/yksikkö",
                    "degree": "Aste",
                    "gradian": "Gooni (graadi)",
                    "radian": "Radiaani"
                },
                "lineSeparator": {
                    "label": "Rivin erotin",
                    "win": "Windows / DOS",
                    "unix": "Unix",
                    "mac": "MacOS"
                },
                "delimeters":{
                    "point": "Piste",
                    "comma": "Pilkku",
                    "tab": "Tabulaattori",
                    "space" : "Välilyönti"
                }
            },
            "export": {
                "title": "Aineiston muodostaminen",
                "fileName": "Filnamn"
            },
            "import": {
                "title": "Lähtöaineiston ominaisuudet"
            }
        }
    }
});
