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
            reset: 'Återställa',
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
            generic: 'Something went wrong'
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
                name: 'Stilets namn',
                style: 'Stilet',
                pointTab: 'Punkten',
                lineTab: 'Linje',
                areaTab: 'Området'
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
                color: 'Ifyllnadsfärg för område',
                area: {
                    pattern: 'Ifyllnandsmönster för område'
                }
            },
            image: {
                shape: 'Ikon',
                size: 'Storlek',
                fill: {
                    color: 'Ifyllnadsfärg för ikon'
                }
            },
            stroke: {
                color: 'Linjens färg',
                lineCap: 'Linjens ändpunkter',
                lineDash: 'Linjens stil',
                lineJoin: 'Hörn',
                width: 'Bredd',
                area: {
                    color: 'Linjens färg',
                    lineDash: 'Linjens stil',
                    lineJoin: 'Hörn',
                    width: 'Linjens bredd'
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
            'userlayer': 'Eget dataset',
            'myplaces': 'Mitt kartlager',
            'analysislayer': 'Min analys',
            'tiles3d': '3D kartlager'
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
                    "point": "Punkten",
                    "line": "Linje",
                    "area":"Området",
                    "collection":"All"
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
                }
            }
        }
    }
});
