Oskari.registerLocalization({
    lang: 'sv',
    key: 'oskariui',
    value: {
        buttons: {
            add: 'Lägg till',
            cancel: 'Avbryt',
            close: 'Stäng',
            delete: 'Ta bort',
            edit: 'Redigera',
            save: 'Spara',
            submit: 'Skicka',
            import: 'Importera',
            yes: 'Ja',
            no: 'Nej',
            next: 'Nästa',
            previous: 'Föregående',
            print: 'Få utskrift',
            search: 'Sök',
            reset: 'Återställ',
            copy: 'Kopiera till klippbordet',
            clear: 'Rensa',
            accept: 'Acceptera',
            reject: 'Avvisa',
            info: 'Visa mera information',
            move: 'Flytta'
        },
        messages: {
            confirm: 'Är du säker på att du vill fortsätta?',
            confirmDelete: 'Vill du säkert ta bort?',
            copied: 'Kopieras'
        },
        error: {
            generic: 'Ett oväntat fel inträffade. Försök igen.'
        },
        table: {
            sort: {
                desc: 'Sortera i fallande ordning',
                asc: 'Sortera i stigande ordning',
                cancel: 'Annullera sorteringen'
            },
            emptyText: 'Ingen data.'
        },
        ColorPicker: {
            tooltip: 'Välj färg',
            moreColors: 'Mera färger'
        },
        StyleEditor: {
            subheaders: {
                styleFormat: 'Typ av geometri',
                name: 'Stilnamn',
                style: 'Stil',
                pointTab: 'Punkt',
                lineTab: 'Linje',
                areaTab: 'Område'
            },
            tooltips: {
                transparent: 'Ingen fyllning',
                solid: 'Täckande fyllning',
                thin_diagonal: 'Tunn diagonal linje',
                thick_diagonal: 'Tjock diagonal linje',
                thin_horizontal: 'Tunn horisontal linje',
                thick_horizontal: 'Tjock horisontal linje'
            },
            fill: {
                color: 'Fyllnadsfärg',
                area: {
                    pattern: 'Fyllnadssmönster'
                }
            },
            image: {
                shape: 'Ikon',
                size: 'Storlek',
                fill: {
                    color: 'Färg'
                }
            },
            stroke: {
                color: 'Färg',
                lineCap: 'Ändpunkter',
                lineDash: 'Stil',
                lineJoin: 'Hörn',
                width: 'Bredd',
                area: {
                    color: 'Kantlinjens färg',
                    lineDash: 'Kantlinjens stil',
                    lineJoin: 'Hörn',
                    width: 'Kantlinjens bredd'
                }
            }
        },
        FileInput: {
            drag: 'Dra {maxCount, plural, one {fil} other {filerna}} hit, eller välj genom att bläddra.',
            noFiles: 'Ingen fil vald.',
            error: {
                invalidType: 'Filformatet är inte tillåtet.',
                allowedExtensions: 'Tillåtna filändelser: {allowedExtensions}.',
                multipleNotAllowed: 'Endast en fil kan laddas upp.',
                fileSize: 'Den valda filen är för stor. Den högsta tillåtna storleken är {maxSize, number} Mb.'
            }
        },
        LocalizationComponent: {
            otherLanguages: 'Andra språk',
            othersTip: 'Översättningar kommer att visas när tjänsten används på olika språk',
            locale: {
                generic: 'på ({0})',
                fi: 'på finska',
                en: 'på engelska',
                sv: 'på svenska'
            }
        },
        Spin: {
            loading:'Laddar...'
        },
        FeatureFilter: {
            single: 'Ett attribut',
            and: 'AND operatör',
            or: 'OR operatör',
            range: {
                true: 'Använd inte värdeintervall',
                false: 'Använd värdeintervall'
            },
            addTooltip: 'Lägg till ny rad för filter',
            clearTooltip: 'Rensa filtret',
            caseSensitive: {
                true: 'Skiftlägeskänsligt',
                false: 'Skiftlägesokänsligt'
            },
            operators: {
                value: 'är',
                in: 'i',
                notIn: 'inte i',
                like: 'som',
                notLike: 'inte som',
                greaterThan: 'större än',
                atLeast: 'minst',
                lessThan: 'mindre än',
                atMost: 'som mest'
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
              'EPSG:3067': "ETRS89-TM35FIN koordinater",
              'EPSG:3575': "North Pole LAEA Europe koordinater",
              'EPSG:3857': "WGS 84 / Pseudo-Mercator koordinater",
              default: "{crs} koordinater"
          },
        },
        layerTooltipTitle: {
            'wms': 'Kartlager i rasterformat',
            'wmts': 'Kartlager i rasterformat',
            'arcgis93': 'Kartlager i rasterformat',
            'arcgis': 'Kartlager i rasterformat',
            'vectortile': 'Kartlager i rasterformat',
            'bingmaps': 'Kartlager i rasterformat',
            'wfs': 'Kartlager i vektorformat',
            'vector': 'Kartlager i vektorformat',
            'userlayer': 'Eget datamängd',
            'myplaces': 'Mitt kartlager',
            'analysislayer': 'Min analys',
            'tiles3d': '3D kartlager'
        },
        "FeatureEditorView": {
            "title": "Objektredigerare",
            "info": {
                "layerLabel": "Redigerar datamängden",
                "featureModifyInfo": "Klicka på ett objekt på kartan för att ändra det.",
                "loading": "Laddar metadata...",
                "problem": "Datamängden saknar nödvändiga metadata."
            },
            "newTitle": "Ny objekt",
            "editTitle": "Redigera objekt",
            "geometrylist": {
                "title": "Redigera på kartan",
                "empty": "Rita objekt på kartan",
                "notRecognized": "Geometry type ({type}) not recognized. Allowing all types to be added. Make sure the interface is ok with this.",
                "editing": "Rita på kartan",
                "Point": "Punkt",
                "LineString": "Linje",
                "Polygon": "Område",
            },
            "editConfirm": {
                "title": "The feature to edit is being switched",
                "msg": "Osparade ändringar går förlorade. Vill du byta objekt?"
            },
            "exitConfirm": "Osparade ändringar går förlorade. Vill du avsluta?",
            "originalValue": "Ursprungligt värde",
            "missingValue": "Värdet fattas",
            "modified": "Redigerad",
            "restoreOriginal": "Återställ ursprungligt värde",
            "multipleFeatureModifyInfo": "Du kan också välja flera objekt på kartan genom att hålla ned Ctrl-tangenten och klicka på objekten.",
            "toolInfo": "Välj punkt, linje eller område för att rita en ny geometri.",
            "geometryModifyInfo": "Med geometriredigeringsverktyget kan du redigera objektets geometri.",
            "geometryDeleteInfo": "Med verktyget för att ta bort geometri kan du ta bort en geometri från ett objekt med flera geometrier.",
            "buttons": {
                "delete": "Ta bort",
                "addFeature": "Lägg till objekt",
                "deleteFeature": "Ta bort objekt"
            },
            "tools": {
                "point": "Punkt",
                "line": "Linje",
                "area": "Område",
                "geometryEdit": "Rita objektet på kartan",
                "finishSketch": "Avsluta ritningen på kartan",
                "remove": "Ta bort en geometri"
            },
            "featureUpdate": {
                "header": "Uppdatera objekt",
                "success": "Objektegenskaperna har uppdaterats",
                "error": "Ett fel uppstod vid uppdatering av objektegenskaperna"
            },
            "multipleFeaturesUpdate": {
                "header": "Uppdatera flera objekten",
                "success": "Objektegenskaperna har uppdaterats",
                "error": "Ett fel uppstod vid uppdatering av objektegenskaperna"
            },
            "featureDelete": {
                "header": "Ta bort objekt",
                "success": "Objektet har tagits bort",
                "error": "Ett fel uppstod när objektet skulle tas bort"
            },
            "geometryDelete": {
                "header": "Ta bort geometri",
                "success": "Geometrin har tagits bort",
                "error": "Ett fel uppstod när geometrin skulle tas bort"
            },
            "unsavedChanges": {
                "title": "Osparade ändringar",
                "text": "Du har osparade ändringar. Välj hur du vill fortsätta."
            },
            "deleteGeometryDialog": {
                "title": "Ta bort geometri",
                "text": "Är du säker på att du vill ta bort geometrin?"
            },
            "deleteFeature": {
                "title": "Ta bort objekt",
                "text": "Är du säker på att du vill ta bort objektet?"
            },
            "formValidationError": {
                "title": "Valideringsfel i formuläret",
                "text": "Korrigera värdena i de markerade fälten"
            },
            "formValidationNumberError": {
                "title": "Felaktigt numeriskt värde",
                "text": "Korrigera numeriskt värde"
             },
            "modifyMultipleFeaturesConfirmation": {
                "title": "Bekräfta",
                "text": "Är du säker på att du vill ange det här värdet för alla markerade objekt?"
            },
            "messages": {
                "cannot_save_all_features": "Alla objekten kan inte sparas"
            }
        },
        "VectorLayerPresentation": {
            "attributes": {
                "label": "Attribut",
                "properties": "Användning object attribut",
                "presentation": "Presentationsmetod",
                "presentationTooltip": "Presentationsmetoden påverkar GetFeatureInfo förfrågan och objektuppgifter tabell.",
                "showAll": "Visa alla attribut",
                "idProperty": "Använd funktionsegenskap som identifierare",
                "idPropertyTooltip": "Tjänsten bör returnera unik identifierare för objekt. Be först tjänsteleverantören att använda unika identifierare. Fungerar endast för typen 'Stora objekt' (GeoJSON).",
                "geometryType": {
                    "label": "Typ av geometri",
                    "sourceAttributes": "Källa: kartlagrets attribut",
                    "sourceCapabilities": "Källa: kartlagrets capabilities",
                    "unknown":"Okänd",
                    "point": "Punkt",
                    "line": "Linje",
                    "area": "Område",
                    "collection": "Alla"
                },
                "featureFilter": {
                    "title": "Filtrera begärda objekt baserat på attribut",
                    "button": "Filtrering av objekt"
                },
                "filter": {
                    "title": "Visning av attribut",
                    "lang": "Välj attribut som visas och ordning",
                    "default": "för standardfilter",
                    "fromDefault": "Inget filter har lagts till för det valda språket. Standardfiltret används för det valda språket. Redigera alternativen för att skapa ditt eget filter för språket.",
                    "button": "Välj attribut"
                },
                "locale": {
                    "title": "Märkningar för attribut",
                    "button": "Märkning"
                },
                "format": {
                    "title": "Formatera värden för attribut",
                    "button": "Formatering",
                    "type": {
                        "label": "Typ",
                        "typeFormats": "Värde typ",
                        "textFormats": "Textformatering",
                        "link": "Länk",
                        "image": "Bild",
                        "number": "Nummer",
                        "phone": "Telefonnummer"
                    },
                    "options": {
                        "noLabel": "Visa endast värde",
                        "skipEmpty": "Skippa tomt värde"
                    },
                    "params": {
                        "link": "Visa som länk",
                        "fullUrl": "Visa hela URL",
                        "label": "Etikett för länk"
                    }
                },
                "messages": {
                    "noFeatureProperties": "Datamängden saknar information om objektsegenskaper."
                }
            }
        }
    }
});
