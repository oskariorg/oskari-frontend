Oskari.registerLocalization({
    "lang" : "fi",
    "key" : "Printout",
    "value" : {
        "title" : "Tulosta näkymä",
        "flyouttitle" : "Siirry tulostamaan",
        "desc" : "",
        "btnTooltip" : "Tulosta",
        "BasicView" : {
            "title" : "Tulosta näkymä",
            "name" : {
                "label" : "Kartan nimi",
                "placeholder" : "pakollinen",
                "tooltip" : "Anna näkymälle kuvaileva nimi. Huomioi käyttöliittymän kieli."
            },
            "language" : {
                "label" : "Kieli",
                "options" : {
                    "fi" : "Suomi",
                    "sv" : "Ruotsi",
                    "en" : "Englanti"
                },
                "tooltip" : "Valitse kartan käyttöliittymän ja aineiston kieli."
            },
            "size" : {
                "label" : "Koko",
                "tooltip" : "Valitse arkkikoko. Näet vaikutuksen esikatselukartassa.",
                "options" : [{
                    "id" : "A4",
                    "label" : "A4-tuloste",
                    "classForPreview" : "preview-portrait",
                    "selected" : true
                }, {
                    "id" : "A4_Landscape",
                    "label" : "A4-vaakatuloste",
                    "classForPreview" : "preview-landscape"
                }, {
                    "id" : "A3",
                    "label" : "A3-tuloste",
                    "classForPreview" : "preview-portrait"
                }, {
                    "id" : "A3_Landscape",
                    "label" : "A3-vaakatuloste",
                    "classForPreview" : "preview-landscape"
                }]
            },
            "preview" : {
                "label" : "Esikatselu",
                "tooltip" : "Suuremman esikatselukuvan saat kuvaa napauttamalla.",
                "pending" : "Esikatselukuva päivitetään hetken kuluttua",
                "notes" : {
                    "extent" : "Esikatselun avulla voit hahmottaa tulosteen kattavuuden",
                    "restriction" : "Esikatselussa ei näytetä kaikkia karttatasoja"
                }
            },
            "buttons" : {
                "save" : "Hae tuloste",
                "ok" : "OK",
                "cancel" : "Peruuta"
            },
            "location" : {
                "label" : "Sijainti ja mittakaavataso",
                "tooltip" : "Mittakaavataso vastaa toistaiseksi selaimen näkymän mittakaavaa.",
                "zoomlevel" : "Mittakaavataso"
            },
            "settings" : {
                "label" : "Lisäasetukset",
                "tooltip" : "Valitse tulosteen formaatti, otsikko, mittakaava, päivämäärä "
            },
            "format" : {
                "label" : "Tiedostomuoto",
                "tooltip" : "Valitse tulosteen tiedostomuoto",
                "options" : [{
                    "id" : "png",
                    "format" : "image/png",
                    "label" : "PNG kuva"
                }, {
                    "id" : "pdf",
                    "format" : "application/pdf",
                    "label" : "PDF dokumentti",
                    "selected" : true
                }]
            },
            "mapTitle" : {
                "label" : "Kartan otsikko",
                "tooltip" : "Nimeä kartta"
            },
            "content" : {
                "options" : [{
                        "id" : "pageLogo",
                        "label" : "Näytä paikkatietoikkunan logo",
                        "tooltip" : "Voit halutessasi piilottaa logon",
                        "checked" : "checked"
                    },{
                        "id" : "pageScale",
                        "label" : "Näytä mittakaava",
                        "tooltip" : "Voit halutessasi lisätä karttaan mittakaavan",
                        "checked" : "checked"                        
                    },{
                        "id" : "pageDate",
                        "label" : "Näytä päivämäärä",
                        "tooltip" : "Voit halutessasi lisätä tulosteeseen päivämäärän",
                        "checked" : "checked"
                    }/*,{
                        "id" : "pageLegend",
                        "label" : "Näytä karttaselitteet",
                        "tooltip" : "Voit halutessasi lisätä tulosteeseen karttaselitteet",
                        "checked" : "checked"
                    },{
                        "id" : "pageCopyleft",
                        "label" : "Näytä copyright tieto",
                        "tooltip" : "Voit halutessasi lisätä tulosteeseen copyright tiedon",
                        "checked" : "checked"
                    }*/
                ]
            },
            "help" : "Ohje",
            "error" : {
                "title" : "Virhe",
                "size" : "Virhe kokomäärityksissä",
                "name" : "Nimi on pakollinen tieto",
                "nohelp" : "Ohjetta ei löytynyt",
                "saveFailed" : "Näkymän tulostus epäonnistui. Yritä myöhemmin uudelleen.",
                "nameIllegalCharacters" : "Nimessä on luvattomia merkkejä. Sallittuja merkkejä ovat kaikki suomen kielen aakkoset, numerot sekä välilyönti ja yhdysmerkki."
            }

        },
        "StartView" : {
            "text" : "Voit tulostaa tekemäsi karttanäkymän PNG kuvaksi tai PDF-tulosteeksi.",
            "info" : {
                "maxLayers" : "Tulostettavien karttatasojen lukumäärä on rajattu 8:aan.",
                "printoutProcessingTime" : "Kartan tulostus voi kestää hetken, jos useita karttatasoja on valittuna."
            },
            "buttons" : {
                "continue" : "Jatka",
                "cancel" : "Peruuta"
            }
        }
    }
});
