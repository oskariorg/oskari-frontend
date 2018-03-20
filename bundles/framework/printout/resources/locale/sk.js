Oskari.registerLocalization(
{
    "lang": "sk",
    "key": "Printout",
    "value": {
        "title": "Vytlačiť zobrazenie mapy",
        "flyouttitle": "Vytlačiť zobrazenie mapy",
        "desc": "",
        "btnTooltip": "Vytlačiť aktuálne mapové zobrazenie ako PNG obrázok alebo PDF súbor.",
        "BasicView": {
            "title": "Vytlačiť zobrazenie mapy",
            "name": {
                "label": "Názov mapy",
                "placeholder": "Požadovaný",
                "tooltip": "Zadajte názov pre váš výtlačok. Prosím, všimnite si, aký jazyk bol použitý v mapových vrstvách."
            },
            "language": {
                "label": "Jazyk",
                "options": {
                    "fi": "Fínčina",
                    "sv": "Švédčina",
                    "en": "Angličtina"
                },
                "tooltip": "Zvoľte jazyk pre váš výtlačok. Prosím, všimnite si, aký jazyk bol použitý v používateľskom rozhraní a v mapových vrstvách."
            },
            "size": {
                "label": "Veľkosť a smer",
                "tooltip": "Vybrať veľkosť tlače a smer. Aktualizácie je možné vidieť v náhľade.",
                "options": [
                    {
                        "id": "A4",
                        "label": "A4 na výšku",
                        "classForPreview": "náhľad-na výšku",
                        "selected": true
                    },
                    {
                        "id": "A4_na šírku",
                        "label": "A4 na šírku",
                        "classForPreview": "náhľad-na šírku"
                    },
                    {
                        "id": "A3",
                        "label": "A3 na výšku",
                        "classForPreview": "náhľad-na výšku"
                    },
                    {
                        "id": "A3_na šírku",
                        "label": "A3 na šírku",
                        "classForPreview": "náhľad-na šírku"
                    }
                ]
            },
            "preview": {
                "label": "Náhľad",
                "tooltip": "Kliknite na náhľad, aby sa otvoril väčší obrázok v samostatnom okne.",
                "pending": "Náhľad sa o chvíľu aktualizuje.",
                "notes": {
                    "extent": "Skontrolujte oblasť mapového rozsahu v náhľade.",
                    "restriction": "Iba podkladová mapa je zobrazená v náhľade."
                }
            },
            "buttons": {
                "save": "Vytlačiť",
                "ok": "OK",
                "back": "Predchádzajúci",
                "cancel": "Zrušiť"
            },
            "location": {
                "label": "Umiestnenie a mierka",
                "tooltip": "Mierka výtlačku sa zhoduje s mierkou v náhľade mapy.",
                "zoomlevel": "Mierka"
            },
            "settings": {
                "label": "Viac nastavení",
                "tooltip": "Vybrať nastevenia pre váš výtlačok."
            },
            "format": {
                "label": "Formát súboru",
                "tooltip": "Vyberte formát súboru pre váš výtlačok.",
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
                "label": "Názov mapy",
                "tooltip": "Pridať názov k mape"
            },
            "content": {
                "options": [
                    {
                        "id": "logoStránky",
                        "label": "Ukázať logo fínskeho geoportálu Paikkatietoikkuna vo výtlačku.",
                        "tooltip": "Ak je to nutné, môžete skryť logo fínskeho geoportálu Paikkatietoikkuna.",
                        "checked": "skontrolované"
                    },
                    {
                        "id": "stránkaMierka",
                        "label": "Pridať mierku k výtlačku mapy.",
                        "tooltip": "Ak chcete, môžete pridať mierku k mape.",
                        "checked": "skontrolované"
                    },
                    {
                        "id": "stránkaDátum",
                        "label": "Zobraziť dátum vo výtlačku mapy.",
                        "tooltip": "Môžete pridať dátum k výtlačku.",
                        "checked": "skontrolované"
                    }
                ]
            },
            "help": "Pomoc",
            "error": {
                "title": "Chyba",
                "size": "Chyba v definíciách veľkosti",
                "name": "Názov je požadovaná informácia",
                "nohelp": "Pomoc nie je k dispozícii",
                "saveFailed": "Tlačenie mapového zobrazenia zlyhalo. Skúste neskôr, prosím.",
                "nameIllegalCharacters": "Názov obsahuje nepovolené znaky. Povolené znaky sú písmená a-z, rovnako aj å, ä, ö, čísla, medzerníky a spojovníky."
            }
        },
        "StartView": {
            "text": "Môžete vytlačiť Zobrazenie mapy, ktoré ste práve vytvorili ako PNG obrázok alebo PDF súbor.",
            "info": {
                "maxLayers": "Môžete použiť maximálne 8 mapových vrstiev vo výtlačku.",
                "printoutProcessingTime": "Proces tlačenia mapového zobrazenia trvá dlhšie ak sa vybralo viacero vrstiev."
            },
            "buttons": {
                "continue": "Pokračovať",
                "cancel": "Zrušiť"
            }
        }
    }
});
