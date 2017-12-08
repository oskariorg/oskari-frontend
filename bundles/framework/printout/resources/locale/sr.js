Oskari.registerLocalization(
{
    "lang": "sr",
    "key": "Printout",
    "value": {
        "title": "Prikaz mape za štampu",
        "flyouttitle": "Prikaz mape za štampu",
        "desc": "",
        "btnTooltip": "",
        "BasicView": {
            "title": "Prikaz mape za štampu",
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
                "label": "Veličina",
                "tooltip": "Izaberi prikaz štampe. Prikaz je ažuriran",
                "options": [
                    {
                        "id": "A4",
                        "label": "A4 uspravno",
                        "classForPreview": "prikaz-uspravno",
                        "selected": "ispravno"
                    },
                    {
                        "id": "A4 položeno",
                        "label": "A4 položeno",
                        "classForPreview": "prikaz-položeno"
                    },
                    {
                        "id": "A3",
                        "label": "A3 uspravno",
                        "classForPreview": "prikaz-uspravno"
                    },
                    {
                        "id": "A3 uspravno",
                        "label": "A3 položeno",
                        "classForPreview": "prikaz-položeno"
                    }
                ]
            },
            "preview": {
                "label": "Prikaz",
                "tooltip": "Klik na mali prikaz da otvorite veliki prikaz",
                "pending": "Prikaz se ažurira",
                "notes": {
                    "extent": "Prikaz se koristiti za pregled područja za štampu",
                    "restriction": "Nisu svi slojevi prikazani"
                }
            },
            "buttons": {
                "save": "Prihvati podešavanja štampe",
                "ok": "Potvrdi",
                "back": "",
                "cancel": "Odustani"
            },
            "location": {
                "label": "Područje i razmera",
                "tooltip": "Razmera štampe odgovara razmeri u kartografskom pregledu",
                "zoomlevel": "Razmera"
            },
            "settings": {
                "label": "Dodatna podešavanja",
                "tooltip": "Zadavanje dodatnih podešavanja kao format, naslov i razmera"
            },
            "format": {
                "label": "Format",
                "tooltip": "Izaberi format datoteke",
                "options": [
                    {
                        "id": "png",
                        "format": "image/png",
                        "label": "PNG slika"
                    },
                    {
                        "id": "pdf",
                        "format": "application/pdf",
                        "selected": "ispravno",
                        "label": "PDF dokument"
                    }
                ]
            },
            "mapTitle": {
                "label": "Dodaj naslov",
                "tooltip": "Dodaj naslov za mapu"
            },
            "content": {
                "options": [
                    {
                        "id": "Logo",
                        "label": "Dodaj OSKARI logo",
                        "tooltip": "Možete sakriti logo ako je potrebno",
                        "checked": "provereno"
                    },
                    {
                        "id": "razmera",
                        "label": "Dodaj razmeru na mapu",
                        "tooltip": "Dodavanje razmere na mapu",
                        "checked": "provereno"
                    },
                    {
                        "id": "datum",
                        "label": "Dodati datum",
                        "tooltip": "Možete dodati datum za štampu",
                        "checked": "provereno"
                    }
                ]
            },
            "help": "Pomoć",
            "error": {
                "title": "Greška",
                "size": "",
                "name": "",
                "nohelp": "Pomoć nije dostupna",
                "saveFailed": "Greška. Probajte kasnije",
                "nameIllegalCharacters": ""
            }
        },
        "StartView": {
            "text": "Možete odštampati mapu koju ste napravili",
            "info": {
                "maxLayers": "Možete odštampati najviše 8 slojeva istovremeno",
                "printoutProcessingTime": "Priprema za štampu može potrajiti za više slojeva"
            },
            "buttons": {
                "continue": "Nastavi",
                "cancel": "Odustani"
            }
        }
    }
});
