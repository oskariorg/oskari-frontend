Oskari.registerLocalization({
    lang: 'fi',
    key: 'oskariui',
    value: {
        buttons: {
            add: 'Lisää',
            cancel: 'Peruuta',
            close: 'Sulje',
            delete: 'Poista',
            edit: 'Muokkaa',
            save: 'Tallenna',
            submit: 'Lähetä',
            import: 'Tuo',
            yes: 'Kyllä',
            no: 'Ei',
            next: 'Seuraava',
            previous: 'Edellinen',
            print: 'Tulosta',
            search: 'Etsi',
            reset: 'Tyhjennä',
            copy: 'Kopioi leikepöydälle',
            clear: 'Tyhjennä',
            accept: 'Hyväksy',
            reject: 'Hylkää',
            info: 'Näytä lisätietoa',
            move: 'Siirry'
        },
        messages: {
            confirm: 'Haluatko varmasti jatkaa?',
            confirmDelete: 'Haluatko varmasti poistaa?',
            copied: 'Kopioitu'
        },
        error: {
            generic: 'Tapahtui odottamaton virhe'
        },
        table: {
            sort: {
                desc: 'Lajittele laskevasti',
                asc: 'Lajittele nousevasti',
                cancel: 'Peruuta lajittelu'
            },
            emptyText: 'Ei tietoja.'
        },
        ColorPicker: {
            tooltip: 'Valitse väri',
            moreColors: 'Enemmän värejä'
        },
        StyleEditor: {
            subheaders: {
                styleFormat: 'Geometriatyyppi',
                name: 'Tyylin nimi',
                style: 'Esitystapa',
                pointTab: 'Piste',
                lineTab: 'Viiva',
                areaTab: 'Alue'
            },
            tooltips: {
                transparent: 'Ei täyttöväriä',
                solid: 'Peittävä täyttöväri',
                thin_diagonal: 'Ohut vinottainen raita',
                thick_diagonal:'Paksu vinottainen raita',
                thin_horizontal: 'Ohut vaakaraita',
                thick_horizontal: 'Paksu vaakaraita'
            },
            fill: {
                color: 'Täyttöväri',
                area: {
                    pattern: 'Täyttökuvio'
                }
            },
            image: {
                shape: 'Symboli',
                size: 'Koko',
                fill: {
                    color: 'Väri'
                }
            },
            stroke: {
                color: 'Väri',
                lineCap: 'Päädyt',
                lineDash: 'Tyyli',
                lineJoin: 'Kulmat',
                width: 'Leveys',
                area: {
                    color: 'Väri',
                    lineDash: 'Tyyli',
                    lineJoin: 'Kulmat',
                    width: 'Viivan paksuus'
                }
            }
        },
        FileInput: {
            drag: 'Raahaa {maxCount, plural, one {tiedosto} other {tiedostot}} tähän tai valitse selaamalla.',
            noFiles: 'Ei tiedostoja.',
            error: {
                invalidType: 'Tiedostomuoto ei ole sallittu.',
                allowedExtensions: 'Sallitut tiedostopäätteet: {allowedExtensions}.',
                multipleNotAllowed: 'Anna vain yksi tiedosto.',
                fileSize: 'Tiedoston koko on liian suuri. Suurin sallittu koko yksittäiselle tiedostolle on {maxSize, number} Mt.'
            }
        },
        LocalizationComponent: {
            otherLanguages: 'Muut kielet',
            othersTip: 'Käännökset näytetään käytettäessä palvelua eri kielillä',
            locale: {
                generic: 'kielellä ({0})',
                fi: 'suomeksi',
                en: 'englanniksi',
                sv: 'ruotsiksi'
            }
        },
        Spin: {
            loading: 'Ladataan...'
        },
        FeatureFilter: {
            single: 'Yksi ominaisuus',
            and: 'AND-operaattori',
            or: 'OR-operaattori',
            range: {
                true: 'Älä käytä arvoaluetta',
                false: 'Käytä arvoaluetta'
            },
            addTooltip: 'Lisää suodattimeen uusi rivi',
            clearTooltip: 'Tyhjennä suodatin',
            caseSensitive: {
                true: 'Kirjainkoko vaikuttaa',
                false: 'Kirjainkoko ei vaikuta'
            },
            operators: {
                value: 'on',
                in: 'jokin',
                notIn: 'ei mikään',
                like: 'kuten',
                notLike: 'ei kuten',
                greaterThan: 'suurempi kuin',
                atLeast: 'vähintään',
                lessThan: 'pienempi kuin',
                atMost: 'enintään'
            }
        },
        coordinates: {
            lon: "Lon",
            lat: "Lat",
            n: "N",
            e: "E",
            p: "N",
            i: "E",
            crs: {
              'EPSG:3067': "ETRS89-TM35FIN -koordinaatit",
              'EPSG:3575': "North Pole LAEA Europe -koordinaatit",
              'EPSG:3857': "WGS 84 / Pseudo-Mercator -koordinaatit",
              default: "{crs} -koordinaatit"
          },
        },
        layerTooltipTitle: {
            'wms': 'Rasteritaso',
            'wmts': 'Rasteritaso',
            'arcgis93': 'Rasteritaso',
            'arcgis': 'Rasteritaso',
            'vectortile': 'Rasteritaso',
            'bingmaps': 'Rasteritaso',
            'wfs': 'Vektoritaso',
            'vector': 'Vektoritaso',
            'userlayer': 'Oma aineisto',
            'myplaces': 'Oma karttataso',
            'analysislayer': 'Oma analyysi',
            'tiles3d': '3D-taso'
        },
        "FeatureEditorView": {
            "title": "Sisältöeditori",
            "info": {
                "layerLabel": "Muokataan tasoa",
                "featureModifyInfo": "Valitse muokattava kohde kartalta klikkaamalla.",
                "loading": "Ladataan tason tietoja...",
                "problem": "Tason tiedot puuttuvat!"
            },
            "newTitle": "Uusi kohde",
            "setCurrentLayerTitle": "Valitse karttataso",
            "geometrylist": {
                "title": "Geometria",
                "empty": "Merkitse geometria kartalle",
                "notRecognized": "Geometrian tyyppiä ({type}) ei tunnistettu. Kaikki piirtomuodot sallitaan, mutta varmista rajapinnan tukevan näitä ennen tallennusta.",
                "editing": "Tee merkintä kartalle",
                "Point": "Piste",
                "LineString": "Viiva",
                "Polygon": "Alue",
            },
            "editConfirm": {
                "title": "Muokattavaa kohdetta ollaan vaihtamassa",
                "msg": "Tallentamattomat muutokset menetetään. Haluatko varmasti vaihtaa?"
            },
            "exitConfirm": "Tallentamattomat muutokset menetetään. Haluatko varmasti poistua?",
            "originalValue": "Alkuperäinen arvo",
            "missingValue": "Arvo puuttuu",
            "modified": "Muokattu",
            "restoreOriginal": "Palauta alkuperäinen arvo",
            "multipleFeatureModifyInfo": "Voit myös valita useita kohteita kartalta ctrl-nappi pohjassa ja muokata niitä.",
            "geometryModifyInfo": "Geometrian muokkautyökalulla voit muokata kohteen geometriaa.",
            "geometryDeleteInfo": "Geometrian poistotyökalulla voit poistaa yhden geometrian monipalstaisesta kohteesta.",
            "buttons": {
                "save": "Tallenna",
                "cancel": "Peruuta",
                "close": "Sulje",
                "ok": "Ok",
                "delete": "Poista",
                "addFeature": "Lisää kohde",
                "editFeature": "Muokkaa kohdetta",
                "editMultipleFeatures": "Muokkaa useita kohteita",
                "deleteFeature": "Poista kohde",
                "yes": "Kyllä",
                "no": "Ei",
                "setCurrentLayer": "Valitse taso"
            },
            "tools": {
                "point": "Lisää piste",
                "line": "Lisää viiva",
                "area": "Lisää alue",
                "geometryEdit": "Muokkaa kartalla",
                "finishSketch": "Lukitse karttamerkintä",
                "remove": "Poista yksittäinen geometria"
            },
            "featureUpdate": {
                "header": "Kohde päivitetty",
                "success": "Kohteen päivittäminen onnistui",
                "error": "Kohteen päivittäminen epäonnistui"
            },
            "multipleFeaturesUpdate": {
                "header": "Kohteet päivitetty",
                "success": "Kohteiden päivittäminen onnistui",
                "error": "Kohteiden päivittäminen epäonnistui"
            },
            "featureDelete": {
                "header": "Poista kohde",
                "success": "Kohteen poisto onnistui",
                "error": "Kohteen poistossa tapahtui virhe"
            },
            "geometryDelete": {
                "header": "Poista geometria",
                "success": "Geometrian poisto onnistui",
                "error": "Geometrian poistossa tapahtui virhe"
            },
            "unsavedChanges": {
                "title": "Tallentamattomia muutoksia",
                "text": "Kohteella on tallentamattomia muutoksia."
            },
            "deleteGeometryDialog": {
                "title": "Poista geometria",
                "text": "Haluatko poistaa valitun geometrian?"
            },
            "deleteFeature": {
                "title": "Poista kohde",
                "text": "Haluatko poistaa valitun kohteen?"
            },
            "formValidationError": {
                "title": "Virheellisiä arvoja lomakkeella",
                "text": "Korjaa virheet korostetuissa kentissä"
            },
            "formValidationNumberError": {
                "title": "Virheellinen numero",
                "text": "Korjaa arvo numeroksi"
            },
            "modifyMultipleFeaturesConfirmation": {
                "title": "Vahvista",
                "text": "Haluatko asettaa kaikkien valitsemiesi kohteiden kenttien arvoksi antamasi arvot?"
            },
            "messages": {
                "cannot_save_all_features": "Kaikkia kohteita ei saatu tallennettua"
            }
        },
        "VectorLayerPresentation": {
            "attributes": {
                "label": "Attribuutit",
                "properties": "Kohteiden ominaisuuksien käyttö",
                "presentation": "Esitystapa",
                "presentationTooltip": "Esitystapa vaikuttaa kohdetietojen kyselyyn ja kohdetietotaulukkoon.",
                "showAll": "Näytä kaikki ominaisuustiedot",
                "idProperty": "Käytä ominaisuustietoa kohteiden yksilöimiseen",
                "idPropertyTooltip": "Rajapinnan tulee palauttaa yksilöivä tunniste kohteille. Pyydä ensisijaisesti palveluntarjoajaa ottamaan käyttöön yksilöivät tunnisteet. Toimii vain 'Suuria kohteita' tyypille (GeoJSON).",
                "geometryType": {
                    "label": "Geometriatyyppi",
                    "sourceAttributes": "Lähde: tason attribuutit",
                    "sourceCapabilities": "Lähde: tason Capabilities-tiedot",
                    "unknown":"Ei tiedossa",
                    "point": "Piste",
                    "line": "Viiva",
                    "area":"Alue",
                    "collection":"Kaikki"
                },
                "featureFilter": {
                    "title": "Suodata rajapinnasta haettavia kohteita ominaisuuksien mukaan",
                    "button": "Kohteiden suodatus"
                },
                "filter": {
                    "title": "Kohteiden ominaisuuksien näyttäminen",
                    "lang": "Valitse tason kohteille näytettävät ominaisuudet ja niiden järjestys",
                    "default": "oletussuodattimelle",
                    "fromDefault": "Valitulle kielelle ei ole lisätty suodatinta. Valitulla kielellä käytetään oletussuodatinta. Muokkaa valintoja luodaksesi kielelle oman suodattimen.",
                    "button": "Valitse kentät"
                },
                "locale": {
                    "title": "Nimet käyttöliittymässä ominaisuuksille",
                    "button": "Nimeäminen"
                },
                "format": {
                    "title": "Kohteiden ominaisuuksien arvojen muotoilu",
                    "button": "Muotoilu",
                    "type": {
                        "label": "Tyyppi",
                        "typeFormats": "Arvon tyyppi",
                        "textFormats": "Tekstin muotoilu",
                        "link": "Linkki",
                        "image": "Kuva",
                        "number": "Numero",
                        "phone": "Puhelinnumero"
                    },
                    "options": {
                        "noLabel": "Näytä vain arvo",
                        "skipEmpty": "Älä näytä tyhjää"
                    },
                    "params": {
                        "link": "Näytä linkkinä",
                        "fullUrl": "Näytä koko osoite",
                        "label": "Linkin label"
                    }
                }
            }
        }
    }
});
