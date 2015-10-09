Oskari.registerLocalization(
{
    "lang": "sk",
    "key": "Printout",
    "value": {
        "title": "Vytlačiť zobrazenie mapy",
        "flyouttitle": "Vytlačiť zobrazenie mapy",
        "desc": "",
        "btnTooltip": "Print",
        "BasicView": {
            "title": "Vytlačiť zobrazenie mapy",
            "name": {
                "label": "The name of the map",
                "placeholder": "required",
                "tooltip": "Give your map a descriptive name. Please note the language of the user interface."
            },
            "language": {
                "label": "Language",
                "options": {
                    "fi": "Finnish",
                    "sv": "Swedish",
                    "en": "English"
                },
                "tooltip": "Select the language to be used in the print. Please note the language of the the user interface and the data set."
            },
            "size": {
                "label": "Veľkosť",
                "tooltip": "Vybrať rozvrhnutie tlače| Náhľad mapy sa priebežne aktualizuje",
                "options": [
                    {
                        "id": "A4",
                        "label": "A4 na výšku",
                        "classForPreview": "náhľad-na výšku",
                        "selected": true
                    },
                    {
                        "id": "A4_Landscape",
                        "label": "A4 na šírku",
                        "classForPreview": "náhľad-na šírku"
                    },
                    {
                        "id": "A3",
                        "label": "A3 na výšku",
                        "classForPreview": "náhľad-na výšku"
                    },
                    {
                        "id": "A3_Landscape",
                        "label": "A3 na šírku",
                        "classForPreview": "náhľad-na šírku"
                    }
                ]
            },
            "preview": {
                "label": "Náhľad",
                "tooltip": "Kliknite na malý náhľad aby sa otvoril väčší náhľad",
                "pending": "Náhľad sa o chvíľu aktualizuje",
                "notes": {
                    "extent": "Náhľad sa môže použiť na vypočítanie rozsahu mapy pre tlač",
                    "restriction": "Nie všetky mapové vrstvy sú v náhľade zobrazené"
                }
            },
            "buttons": {
                "save": "Vytlačte to",
                "ok": "OK",
                "back": "Previous",
                "cancel": "Zrušiť"
            },
            "location": {
                "label": "Úroveň umiestnenia a priblíženia",
                "tooltip": "Mierka výtlačku sa zhoduje s mierkou mapy v prehliadači",
                "zoomlevel": "Úroveň priblíženia"
            },
            "settings": {
                "label": "Viac nastavení",
                "tooltip": "Vytvoriť dodatočné nastavenia ako formát, názov a mierka"
            },
            "format": {
                "label": "Formát",
                "tooltip": "Vyberte formát súboru",
                "options": [
                    {
                        "id": "png",
                        "format": "obrázok/png",
                        "label": "PNG obrázok"
                    },
                    {
                        "id": "pdf",
                        "format": "aplikácia/pdf",
                        "selected": true,
                        "label": "PDF dokument"
                    }
                ]
            },
            "mapTitle": {
                "label": "Pridať názov",
                "tooltip": "pridať názov k mape"
            },
            "content": {
                "options": [
                    {
                        "id": "logoStránky",
                        "label": "Pridať logo Oskari",
                        "tooltip": "Ak je to nutné, môžete skryť logo",
                        "checked": "skontrolované"
                    },
                    {
                        "id": "stránkaMierka",
                        "label": "Pridať mierku k mape",
                        "tooltip": "Pridať mierku k mape",
                        "checked": "skontrolované"
                    },
                    {
                        "id": "stránkaDátum",
                        "label": "Pridať dátum",
                        "tooltip": "Môžete pridať dátum k výtlačku",
                        "checked": "skontrolované"
                    }
                ]
            },
            "legend": {
                "label": "Map legend",
                "tooltip": "Select a position for the map legend. If any position is not selected, a map legend is not shown in the map printout.",
                "options": [
                    {
                        "id": "oskari_legend_NO",
                        "loca": "NO",
                        "label": "No map legend",
                        "tooltip": "The map legend is not shown in the map printout.",
                        "selected": true
                    },
                    {
                        "id": "oskari_legend_LL",
                        "loca": "LL",
                        "label": "Left lower corner",
                        "tooltip": "The map legend is shown in the left lower corner of the printout."
                    },
                    {
                        "id": "oskari_legend_LU",
                        "loca": "LU",
                        "label": "Left upper corner",
                        "tooltip": "The map legend is shown in the left upper corner of the printout."
                    },
                    {
                        "id": "oskari_legend_RU",
                        "loca": "RU",
                        "label": "Right upper corner",
                        "tooltip": "The map legend is shown in the right upper corner of the printout."
                    },
                    {
                        "id": "oskari_legend_RL",
                        "loca": "RL",
                        "label": "Right lower corner",
                        "tooltip": "The map legend is shown in the right upper corner of the printout."
                    }
                ]
            },
            "help": "Pomoc",
            "error": {
                "title": "Chyba",
                "size": "Error in size definitions",
                "name": "Name is required information",
                "nohelp": "Pomoc nie je k dispozícii",
                "saveFailed": "Tlačenie mapy zlyhalo| Skúste neskôr",
                "nameIllegalCharacters": "The name contains disallowed characters. Allowed characters are the letters a-z as well as å, ä and ö, numbers, backspaces and hyphens."
            }
        },
        "StartView": {
            "text": "Môžete vytlačiť Zobrazenie mapy, ktoré ste práve vytvorili",
            "info": {
                "maxLayers": "Môžete vytlačiť maximálne 8 vrstiev naraz",
                "printoutProcessingTime": "Proces tlačenia trvá dlhšie ak sa vybralo viacero vrstiev"
            },
            "buttons": {
                "continue": "Pokračovať",
                "cancel": "Zrušiť"
            }
        }
    }
}
);