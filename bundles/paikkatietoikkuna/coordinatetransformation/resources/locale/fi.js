Oskari.registerLocalization(
{
    "lang": "fi",
    "key": "coordinatetransformation",
    "value": {
        "title": "Koordinaattimuunnos",
        "tile": {
            "title": "Koordinaattimuunnos"
        },
        "flyout": {
            "title":"Koordinaattimuunnos",
            "coordinateSystem": {
                "title": "Koordinaattijärjestelmän tiedot",
                "input": "Lähtötiedot",
                "output": "Tulostiedot",
                "noFilter": "Mikä tahansa",
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
                    "choose": "Valitse",
                    "kkj": "KKJ kaista {zone, number}",
                    "ykj": "KKJ kaista 3 / YKJ"
                },
                "heightSystem":{
                    "label": "Korkeusjärjestelmä",
                    "infoTitle":"",
                    "infoContent": "",
                    "none": "Ei mitään"
                }
            },
            "dataSource": {
                "title": "Koordinaattitietojen lähde",
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
                "rows": "Riviä"
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
            "convert": "Muunna",
            "clearTable": "Tyhjennä taulukot",
            "showMarkers": "Näytä sijainnit kartalla",
            "export": "Vie tulokset tiedostoon",
            "select": "Valitse",
            "cancel": "Peruuta",
            "done": "Valmis",
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
                "fileName": "Tiedoston nimi"
            },
            "import": {
                "title": "Lähtöaineiston ominaisuudet"
            }
        }
    }
});
