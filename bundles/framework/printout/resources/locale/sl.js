Oskari.registerLocalization(
{
    "lang": "sl",
    "key": "Printout",
    "value": {
        "title": "Natisni pogled karte",
        "flyouttitle": "Natisni pogled karte",
        "desc": "",
        "btnTooltip": "Natisni",
        "BasicView": {
            "title": "Natisni pogled karte",
            "name": {
                "label": "Ime karte",
                "placeholder": "zahtevano",
                "tooltip": "Določi opisno ime za karto. Prosim, da upoštevaš jezik uporabniškega vmesnika."
            },
            "language": {
                "label": "Jezik",
                "options": {
                    "fi": "Finski",
                    "sv": "Švedski",
                    "en": "Angleški"
                },
                "tooltip": "Izberi jezik, ki bo uporabljen pri izrisu.  Bodi pozoren na jezik uporabniškega vmesnika in nabora podatkov."
            },
            "size": {
                "label": "Velikost",
                "tooltip": "Izberi velikost lista za izris. Zadnje spremembe vidiš v oknu za predogled.",
                "options": [
                    {
                        "id": "A4",
                        "label": "A4 pokončno",
                        "classForPreview": "predogled-pokončno",
                        "selected": true
                    },
                    {
                        "id": "A4_Ležeče",
                        "label": "A4 ležeče",
                        "classForPreview": "predogled-ležeče"
                    },
                    {
                        "id": "A3",
                        "label": "A3 pokončno",
                        "classForPreview": "predogled-pokončno"
                    },
                    {
                        "id": "A3_Ležeče",
                        "label": "A3 ležeče",
                        "classForPreview": "predogled-ležeče"
                    }
                ]
            },
            "preview": {
                "label": "Predogled",
                "tooltip": "Velikost predogleda lahko povečaš s klikom nanj.",
                "pending": "Predogled bo kmalu osvežen",
                "notes": {
                    "extent": "Velikost izrisa za tiskanje lahko preveriš v oknu za predogled.",
                    "restriction": "V predogledu niso vidni vsi sloji karte."
                }
            },
            "buttons": {
                "save": "Natisni",
                "ok": "V redu",
                "back": "Prejšnji",
                "cancel": "Prekini"
            },
            "location": {
                "label": "Lokacija in raven povečave",
                "tooltip": "Merilo izrisa se ujema z merilom na karti v brskalniku",
                "zoomlevel": "Povečava"
            },
            "settings": {
                "label": "Več nastavitev",
                "tooltip": "Izberi dodatne informacije za izris, kot so: format datoteke, naslov, merilo in datum."
            },
            "format": {
                "label": "Format datoteke",
                "tooltip": "Izberi format datoteke",
                "options": [
                    {
                        "id": "png",
                        "format": "slika/png",
                        "label": "PNG slika"
                    },
                    {
                        "id": "pdf",
                        "format": "aplikacija/pdf",
                        "selected": true,
                        "label": "PDF dokument"
                    }
                ]
            },
            "mapTitle": {
                "label": "Naslov karte",
                "tooltip": "Dodaj naslov karte"
            },
            "content": {
                "options": [
                    {
                        "id": "LogoStrani",
                        "label": "Pri izrisu dodaj Oskari logo",
                        "tooltip": "Če želiš lahko Oskari logo skriješ",
                        "checked": "preverjeno"
                    },
                    {
                        "id": "meriloStrani",
                        "label": "Dodaj merilo na karto",
                        "tooltip": "Če želiš, dodaj merilo na karto.",
                        "checked": "preverjeno"
                    },
                    {
                        "id": "datumStrani",
                        "label": "Prikaži datum na izrisu",
                        "tooltip": "Lahko dodaš datum na izris",
                        "checked": "preverjeno"
                    }
                ]
            },
            "legend": {
                "label": "Legenda karte",
                "tooltip": "Določi položaj legende na karti. Če položaj legende ne bo določen, legenda ne bo prikazana.",
                "options": [
                    {
                        "id": "oskari_legenda_NE",
                        "loca": "NE",
                        "label": "Ni legende karte",
                        "tooltip": "Legenda karte ni prikazana na izrisu",
                        "selected": true
                    },
                    {
                        "id": "oskari_legenda_LS",
                        "loca": "LS",
                        "label": "Levi spodnji vogal",
                        "tooltip": "Legenda karte je prikazana na levem spodnjem vogalu izrisa."
                    },
                    {
                        "id": "oskari_legenda_LZ",
                        "loca": "LZ",
                        "label": "Levi zgornji vogal",
                        "tooltip": "Legenda karte je prikazana na levem zgornjem vogalu izrisa."
                    },
                    {
                        "id": "oskari_legenda_DZ",
                        "loca": "DZ",
                        "label": "Desni zgornji vogal",
                        "tooltip": "Legenda karte je prikazana na desnem zgornjem vogalu izrisa."
                    },
                    {
                        "id": "oskari_legenda_DS",
                        "loca": "DS",
                        "label": "Desni spodnji vogal",
                        "tooltip": "Legenda karte je prikazana na desnem spodnjem vogalu izrisa."
                    }
                ]
            },
            "help": "Pomoč",
            "error": {
                "title": "Napaka",
                "size": "Napaka pri določitvi velikosti",
                "name": "Ime je zahtevana informacija",
                "nohelp": "Pomoč ni na voljo.",
                "saveFailed": "Tiskanje izrisa karte ni uspelo. Poskusi kasneje.",
                "nameIllegalCharacters": "Ime vsebuje nedovoljene znake. Dovoljeni znaki so črke a-z, številke, vračalke in vezaji."
            }
        },
        "StartView": {
            "text": "Pogled karte, ki si ga pripravil lahko natisneš v obliki PNG slike ali PDF datoteke.",
            "info": {
                "maxLayers": "Natisneš lahko največ 8 slojev karte na enkrat",
                "printoutProcessingTime": "Tiskanje izrisa karte lahko traja nekaj časa, ko je izbranih več slojev karte."
            },
            "buttons": {
                "continue": "Nadaljuj",
                "cancel": "Prekini"
            }
        }
    }
}
);