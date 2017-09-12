Oskari.registerLocalization(
{
    "lang": "sk",
    "key": "MyPlacesImport",
    "value": {
        "title": "Import Datasetu",
        "desc": "",
        "tool": {
            "tooltip": "Importujte vaše vlastné datasety."
        },
        "flyout": {
            "title": "Import Datasetu",
            "description": "Načítajte dataset z vášho počítača ako zip súbor. Dataset musí byť v jednom z nasledovných súborových formátov: Shapefile (*.shp, *.shx, *dbf, *prj) <br/>\r\nGPS-siirtotiedosto (*.gpx) <br/>\r\nMapInfo (*.mif, *mid) <br/>\r\nGoogle Map (*.kml, *.kmz) <br/>\r\nProsím uistite sa, že všetky súbory sú v správnom referenčnom súradnicovom systéme.",
            "help": "Načítajte dataset z vášho počítača ako zip súbor. Prosím uistite sa, že všetky súbory sú v správnom súborovom formáte a v správnom referenčnom súradnicovom systéme.",
            "actions": {
                "cancel": "Zrušiť",
                "next": "Ďalej"
            },
            "file": {
                "submit": "Import",
                "fileOverSizeError": {
                    "title": "Chyba",
                    "message": "Vybraný súbor je príliš veľký. Môže mať maximálne <xx> mb.",
                    "close": "Zatvoriť"
                }
            },
            "layer": {
                "title": "Informácie o datasete",
                "name": "Názov",
                "desc": "Popis",
                "source": "Zdroj údajov",
                "style": "Definície štýlov"
            },
            "validations": {
                "error": {
                    "title": "Chyba",
                    "message": "Dataset nebol importovaný. Súbor a názov chýba. Opravte ich a skúste to znova."
                }
            },
            "finish": {
                "success": {
                    "title": "Import datasetu bol úspešný",
                    "message": "Dataset bol importovaný. Môžete ho nájsť v menu \"Moje údaje\"."
                },
                "failure": {
                    "title": "Dataset  sa nedal importovať."
                }
            }
        },
        "tab": {
            "title": "Datasety",
            "grid": {
                "name": "Názov",
                "description": "Popis",
                "source": "Zdroj údajov",
                "remove": "Vymazať",
                "removeButton": "Vymazať"
            },
            "confirmDeleteMsg": "Chcete vymazať dataset \"{name}\"?",
            "buttons": {
                "ok": "OK",
                "cancel": "Zrušiť",
                "delete": "Vymazať"
            },
            "notification": {
                "deletedTitle": "Vymazať dataset",
                "deletedMsg": "Dataset bol vymazaný."
            },
            "error": {
                "title": "Chyba",
                "generic": "Vyskytla sa chyba systému."
            }
        },
        "layer": {
            "organization": "Vlastné datasety",
            "inspire": "Vlastné datasety"
        }
    }
});
