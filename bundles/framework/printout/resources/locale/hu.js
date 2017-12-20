Oskari.registerLocalization(
{
    "lang": "hu",
    "key": "Printout",
    "value": {
        "title": "Nyomtatási térképnézet",
        "flyouttitle": "Nyomtatási térképnézet",
        "desc": "",
        "btnTooltip": "",
        "BasicView": {
            "title": "Nyomtatási térképnézet",
            "name": {
                "label": "",
                "placeholder": "",
                "tooltip": ""
            },
            "language": {
                "label": "",
                "options": {
                    "fi": "",
                    "sv": "",
                    "en": ""
                },
                "tooltip": ""
            },
            "size": {
                "label": "Méret",
                "tooltip": "Nyomtatási elrendezés kiválasztsa. Az előnézet ennek megfelelően frissül.",
                "options": [
                    {
                        "id": "A4",
                        "label": "A4 álló",
                        "classForPreview": "Előnézet-álló",
                        "selected": "Filename"
                    },
                    {
                        "id": "A4_Fekvő",
                        "label": "A4 fekvő",
                        "classForPreview": "előnézet-fekvő"
                    },
                    {
                        "id": "A3",
                        "label": "A3 álló",
                        "classForPreview": "Előnézet-álló"
                    },
                    {
                        "id": "A3_Fekvő",
                        "label": "A3 fekvő",
                        "classForPreview": "előnézet-fekvő"
                    }
                ]
            },
            "preview": {
                "label": "Előnézet",
                "tooltip": "Kattintson a kis előnézetre egy nagyobb méretű előnézethez.",
                "pending": "Az előnézet hamarosan frissülni fog.",
                "notes": {
                    "extent": "Az előnézetet a nyomtatási méretének beállításához használhatjuk.",
                    "restriction": "Nem minden térképréteg jelenik meg az előnézetben."
                }
            },
            "buttons": {
                "save": "Nyomtatási kép mentése",
                "ok": "OK",
                "back": "",
                "cancel": "Mégse"
            },
            "location": {
                "label": "Helyzet és nagyítási szint",
                "tooltip": "A nyomtatási méretarány megegyezik a böngészőben beállított méretaránnyal.",
                "zoomlevel": "Nagyítási szint"
            },
            "settings": {
                "label": "További beállítások",
                "tooltip": "Alkalmazzon további beállításokat, úgymint formátum, cím és méretarány."
            },
            "format": {
                "label": "Formátum",
                "tooltip": "Válassza ki a fájlformátumot.",
                "options": [
                    {
                        "id": "png",
                        "format": "image/png",
                        "label": "PNG kép"
                    },
                    {
                        "id": "pdf",
                        "format": "application/pdf",
                        "selected": "Filename",
                        "label": "PDF dokumentum"
                    }
                ]
            },
            "mapTitle": {
                "label": "Cím hozzáadása",
                "tooltip": "adjon címet a térképnek"
            },
            "content": {
                "options": [
                    {
                        "id": "pageLogo",
                        "label": "Oskari logo hozzáadása",
                        "tooltip": "A logót elrejtheti, ha szükséges.",
                        "checked": "ellenőrzött"
                    },
                    {
                        "id": "pageScale",
                        "label": "Méretarány megadása.",
                        "tooltip": "Adja meg a térkép méretarányát.",
                        "checked": "ellenőrzött"
                    },
                    {
                        "id": "pageDate",
                        "label": "Dátum megadása",
                        "tooltip": "Megadhat dátumot is a nyomtatáshoz.",
                        "checked": "ellenőrzött"
                    }
                ]
            },
            "help": "Segítség",
            "error": {
                "title": "Hiba",
                "size": "",
                "name": "",
                "nohelp": "Segítség nem áll rendelkezésre.",
                "saveFailed": "Térképnyomtatási hiba. Probálja meg később.",
                "nameIllegalCharacters": ""
            }
        },
        "StartView": {
            "text": "A most elkészített térképnézetet kinyomtathatja.",
            "info": {
                "maxLayers": "Maximum 8 réteget nyomtathat egyszerre.",
                "printoutProcessingTime": "A nyomtatás feldolgozása némi időt vesz igénybe, amikor több réteget jelölünk ki."
            },
            "buttons": {
                "continue": "Folytatás",
                "cancel": "Mégsem"
            }
        }
    }
});
