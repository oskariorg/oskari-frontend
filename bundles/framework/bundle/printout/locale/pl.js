Oskari.registerLocalization({
    "lang": "pl",
    "key": "Printout",
    "value": {
        "title": "Widok wydruku mapy",
        "flyouttitle": "Widok wydruku mapy",
        "desc": "",
        "btnTooltip": "Drukuj",
        "BasicView": {
            "title": "Widok wydruku mapy",
            "name": {
                "label": "Nazwa mapy",
                "placeholder": "NOT TRANSLATED",
                "tooltip": "NOT TRANSLATED"
            },
            "language": {
                "label": "Język",
                "options": {
                    "fi": "Fiński",
                    "sv": "Szwedzki",
                    "en": "Angielski"
                },
                "tooltip": "Wybierz język interfejsu i danych mapy."
            },
            "size": {
                "label": "Rozmiar",
                "tooltip": "Wybierz układ drukowania Podgląd mapy jest odpowiednio zaktualizowany.",
                "options": [{
                    "id": "A4",
                    "label": "A4 portret",
                    "classForPreview": "preview-portrait",
                    "selected": true
                }, {
                    "id": "A4_Landscape",
                    "label": "A4 landscape",
                    "classForPreview": "preview-landscape"
                }, {
                    "id": "A3",
                    "label": "A3 portret",
                    "classForPreview": "preview-portrait"
                }, {
                    "id": "A3_Landscape",
                    "label": "A3 landscape",
                    "classForPreview": "preview-landscape"
                }]
            },
            "preview": {
                "label": "Podgląd",
                "tooltip": "Kliknij mały podgląd aby otworzyć duży podgląd",
                "pending": "Podgląd będzie aktualizowany wkrótce",
                "notes": {
                    "extent": "Z podglądu można wywnioskować zakres mapy do wydruku",
                    "restriction": "Nie wszystkie warstwy mapy są widoczne w podglądzie"
                }

            },

            "buttons": {
                "save": "Wydruk",
                "ok": "OK",
                "cancel": "Anuluj"
            },
            "location": {
                "label": "Lokalizacja i powiększenie",
                "tooltip": "Wydruk skali odpowiada skali mapy w przeglądarce.",
                "zoomlevel": "Poziom powiększenia"
            },
            "settings": {
                "label": "Więcej ustawień",
                "tooltip": "Stwórz dodatkowe ustawienia jak format, tytuł i skala"
            },
            "format": {
                "label": "Format",
                "tooltip": "wybierz format pliku",
                "options": [{
                    "id": "png",
                    "format": "image/png",
                    "label": "obraz PNG"
                }, {
                    "id": "pdf",
                    "format": "application/pdf",
                    "selected": true,
                    "label": "dokument PDF"
                }]
            },
            "mapTitle": {
                "label": "dodaj tytuł",
                "tooltip": "dodaj tytuł mapy"
            },
            "content": {
                "options": [{
                    "id": "pageLogo",
                    "label": "Dodaj logo Oskari",
                    "tooltip": "Możesz ukryć logo w razie potrzeby",
                    "checked": "checked"
                }, {
                    "id": "pageScale",
                    "label": "Dodaj skalę mapy",
                    "tooltip": "Dodaj skalę mapy",
                    "checked": "checked"
                }, {
                    "id": "pageDate",
                    "label": "Dodaj datę",
                    "tooltip": "Możesz dodać datę do wydruku",
                    "checked": "checked"
                }]
            },
            "legend": {
                "label": "NOT TRANSLATED",
                "tooltip": "NOT TRANSLATED",
                "options": [{
                    "id": "oskari_legend_NO",
                    "loca": "NO",
                    "label": "NOT TRANSLATED",
                    "tooltip": "NOT TRANSLATED",
                    "selected": true

                }, {
                    "id": "oskari_legend_LL",
                    "loca": "LL",
                    "label": "NOT TRANSLATED",
                    "tooltip": "NOT TRANSLATED"

                }, {
                    "id": "oskari_legend_LU",
                    "loca": "LU",
                    "label": "NOT TRANSLATED",
                    "tooltip": "NOT TRANSLATED"

                }, {
                    "id": "oskari_legend_RU",
                    "loca": "RU",
                    "label": "NOT TRANSLATED",
                    "tooltip": "NOT TRANSLATED"

                }, {
                    "id": "oskari_legend_RL",
                    "loca": "RL",
                    "label": "NOT TRANSLATED",
                    "tooltip": "NOT TRANSLATED"

                }]
            },
            "help": "Pomoc",
            "error": {
                "title": "Błąd",
                "size": "NOT TRANSLATED",
                "name": "NOT TRANSLATED",
                "nohelp": "Brak dostępnej pomocy",
                "saveFailed": "Wydruk mapy nie powiódł się. Spróbuj ponownie później.",
                "nameIllegalCharacters": "NOT TRANSLATED"
            }
        },
        "StartView": {
            "text": "Możesz wydrukować widok Mapy, który właśnie utworzyłeś.",
            "info": {
                "maxLayers": "Możesz wydrukować maksymalnie 8 warstw jednocześnie",
                "printoutProcessingTime": "Wydruk może trochę potrwać gdy wybranych jest kilka warstw."
            },
            "buttons": {
                "continue": "Kontynuuj",
                "cancel": "Anuluj"
            }
        }
    }
});
