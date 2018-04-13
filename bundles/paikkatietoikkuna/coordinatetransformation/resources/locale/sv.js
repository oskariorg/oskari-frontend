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
            "coordinateField": {
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
                "clearTables": "Haluatko tyhjentää taulukot?"
            }
        },
        "mapMarkers":{
            "show":{
                "title": "Näytä sijainnit kartalla",
                "info" : "Tarkastele muunnettuja koordinaatteja kartalla."
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
            "ok": "Ok"
        },
        "fileSettings": {
            "options": {
                "degree": "Aste",
                "gradian": "Gooni (graadi)",
                "radian": "Radiaani",
                "point": "Piste",
                "comma": "Pilkku",
                "format": "Kulman muoto/yksikkö",
                "decimalSeparator": "Desimaalierotin",
                "headerCount": "Otsakerivien määrä",
                "reverseCoords": "Koordinaatit käänteisesti",
                "useId": "Käytä tunnistetta"
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
