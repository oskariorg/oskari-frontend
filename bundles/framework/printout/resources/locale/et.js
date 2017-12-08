Oskari.registerLocalization(
{
    "lang": "et",
    "key": "Printout",
    "value": {
        "title": "Trüki kaart",
        "flyouttitle": "Trüki kaart",
        "desc": "",
        "btnTooltip": "Trüki kaart png pildiformaadis või pdf dokumendina",
        "BasicView": {
            "title": "Trüki kaardivaade",
            "name": {
                "label": "Kaardi nimi",
                "placeholder": "kohustuslik",
                "tooltip": "Kirjuta trükise nimi. Märgi keel, mida kasutad kaardikihtidel."
            },
            "language": {
                "label": "Keel",
                "options": {
                    "fi": "Soome",
                    "sv": "Rootsi",
                    "en": "Inglise"
                },
                "tooltip": "Vali kaardiliidese ja kaardiandmete keel."
            },
            "size": {
                "label": "Suurus ja  suund",
                "tooltip": "Vali trükimall. Nähtav eelvaates.",
                "options": [
                    {
                        "id": "A4",
                        "label": "A4-püstformaat",
                        "classForPreview": "preview-portrait",
                        "selected": true
                    },
                    {
                        "id": "A4_Landscape",
                        "label": "A4 põikformaat",
                        "classForPreview": "preview-landscape"
                    },
                    {
                        "id": "A3",
                        "label": "A3 püstformaat",
                        "classForPreview": "preview-portrait"
                    },
                    {
                        "id": "A3_Landscape",
                        "label": "A3 põikformaat",
                        "classForPreview": "preview-landscape"
                    }
                ]
            },
            "preview": {
                "label": "Eelvaade",
                "tooltip": "Suurema eelvaate nägemiseks uues aknas klõpsa pisipildil.",
                "pending": "Eelvaade värskendatakse",
                "notes": {
                    "extent": "Kaardiulatust saab kontrollida eelvaate aknas.",
                    "restriction": "Ainult aluskaart on nähtav eelvaate aknas."
                }
            },
            "buttons": {
                "save": "Trüki",
                "ok": "OK",
                "back": "Eelmine",
                "cancel": "Tühista"
            },
            "location": {
                "label": "Asukoht ja suurendusaste",
                "tooltip": "Väljatrüki mõõtkava vastab eelvaate aknas olevale.",
                "zoomlevel": "Mõõtkava"
            },
            "settings": {
                "label": "Lisaseaded",
                "tooltip": "Määra lisaseaded nagu formaat, pealkiri ja mõõtkava"
            },
            "format": {
                "label": "Failiformaad",
                "tooltip": "Vali failiformaat",
                "options": [
                    {
                        "id": "png",
                        "format": "image/png",
                        "label": "PNG kujutis"
                    },
                    {
                        "id": "pdf",
                        "format": "application/pdf",
                        "selected": true,
                        "label": "PDF dokument"
                    }
                ]
            },
            "mapTitle": {
                "label": "Lisa pealkiri",
                "tooltip": "Lisa kaardi pealkiri"
            },
            "content": {
                "options": [
                    {
                        "id": "pageLogo",
                        "label": "Lisa Paikkatietokkuna logo väljatrükile",
                        "tooltip": "Vajadusel saab Paikkatietokkuna logo peita",
                        "checked": "märgitud"
                    },
                    {
                        "id": "pageScale",
                        "label": "Lisa kaardile mõõtkava",
                        "tooltip": "Soovi korral lisa trükisele mõõtkava.",
                        "checked": "checked"
                    },
                    {
                        "id": "pageDate",
                        "label": "Näita trükisel kuupäeva",
                        "tooltip": "Trükisele saab lisada selle kuupäeva",
                        "checked": "checked"
                    }
                ]
            },
            "help": "Abi",
            "error": {
                "title": "Viga",
                "size": "Viga trükise suuruse määrangutes",
                "name": "Pealkiri on kohustuslik",
                "nohelp": "Abi pole saadaval",
                "saveFailed": "Kaardi väljatrükk ebaõnnestus. Proovi hiljem uuesti.",
                "nameIllegalCharacters": "Pealkiri sisaldab lubamatuid tähemärke. Lubatud on tähed a-z,  å, ä ja ö, numbrid, tühikud ja sidekriipsud"
            }
        },
        "StartView": {
            "text": "Genereeritud trükise võib salvestada ja trükkida kui png-pildi või pdf dokumendi.",
            "info": {
                "maxLayers": "Trükisele saab lisada maksimaalselt 8 kaardikihti.",
                "printoutProcessingTime": "Trükise genereerimine võtab seda rohkem aega, mida rohkem kihte on trükisele lisatud."
            },
            "buttons": {
                "continue": "Jätka",
                "cancel": "Tühista"
            }
        }
    }
});
