Oskari.registerLocalization(
{
    "lang": "fi",
    "key": "Printout",
    "value": {
        "title": "Tulosta näkymä",
        "flyouttitle": "Siirry tulostamaan",
        "desc": "",
        "btnTooltip": "Tulosta",
        "BasicView": {
            "title": "Tulosta nykyinen karttanäkymä.",
            "name": {
                "label": "Kartan nimi",
                "placeholder": "pakollinen",
                "tooltip": "Anna näkymälle kuvaileva nimi. Huomioi käyttöliittymän kieli."
            },
            "language": {
                "label": "Kieli",
                "options": {
                    "fi": "Suomi",
                    "sv": "Ruotsi",
                    "en": "Englanti"
                },
                "tooltip": "Valitse kieli, jota käytetään tulosteella. Huomioi käyttöliittymän ja aineiston kieli."
            },
            "size": {
                "label": "Koko",
                "tooltip": "Valitse arkkikoko. Näet karttanäkymän valitussa koossa esikatselukuvassa.",
                "options": [
                    {
                        "id": "A4",
                        "label": "A4-tuloste",
                        "classForPreview": "preview-portrait",
                        "selected": true
                    },
                    {
                        "id": "A4_Landscape",
                        "label": "A4-vaakatuloste",
                        "classForPreview": "preview-landscape"
                    },
                    {
                        "id": "A3",
                        "label": "A3-tuloste",
                        "classForPreview": "preview-portrait"
                    },
                    {
                        "id": "A3_Landscape",
                        "label": "A3-vaakatuloste",
                        "classForPreview": "preview-landscape"
                    }
                ]
            },
            "preview": {
                "label": "Esikatselu",
                "tooltip": "Voit suurentaa esikatselukuvaa klikkaamalla kuvaa hiirellä.",
                "pending": "Esikatselukuva päivitetään hetken kuluttua.",
                "notes": {
                    "extent": "Esikatselukuvasta voit tarkistaa tulosteen kattavuusalueen.",
                    "restriction": "Esikatselukuvassa ei näytetä kaikkia karttatasoja."
                }
            },
            "buttons": {
                "save": "Hae tuloste",
                "ok": "OK",
                "back": "Edellinen",
                "cancel": "Peruuta"
            },
            "location": {
                "label": "Sijainti ja mittakaavataso",
                "tooltip": "Mittakaavataso vastaa selaimessa näkyvän karttanäkymän mittakaavaa.",
                "zoomlevel": "Mittakaavataso"
            },
            "settings": {
                "label": "Lisäasetukset",
                "tooltip": "Valitse karttatulosteelle tiedostomuoto, otsikko, mittakaava ja päivämäärä."
            },
            "format": {
                "label": "Tiedostomuoto",
                "tooltip": "Valitse tulosteen tiedostomuoto",
                "options": [
                    {
                        "id": "png",
                        "format": "image/png",
                        "label": "PNG-kuva"
                    },
                    {
                        "id": "pdf",
                        "format": "application/pdf",
                        "selected": true,
                        "label": "PDF-dokumentti"
                    }
                ]
            },
            "mapTitle": {
                "label": "Kartan otsikko",
                "tooltip": "Anna karttatulosteelle otsikko."
            },
            "content": {
                "options": [
                    {
                        "id": "pageLogo",
                        "label": "Näytä paikkatietoikkunan logo tulosteessa.",
                        "tooltip": "Voit halutessasi piilottaa Paikkatietoikkunan logon tulosteesta.",
                        "checked": "checked"
                    },
                    {
                        "id": "pageScale",
                        "label": "Näytä mittakaava",
                        "tooltip": "Voit halutessasi näyttää tulosteessa kartan mittakaavan.",
                        "checked": "checked"
                    },
                    {
                        "id": "pageDate",
                        "label": "Näytä päivämäärä",
                        "tooltip": "Voit halutessasi lisätä tulosteeseen päivämäärän.",
                        "checked": "checked"
                    }
                ]
            },
            "legend": {
                "label": "Karttaselite",
                "tooltip": "Valitse karttaselitteelle paikka. Karttaselitettä ei näytetä tulosteessa, jos paikkaa ei valittuna.",
                "options": [
                    {
                        "id": "oskari_legend_NO",
                        "loca": "NO",
                        "label": "Ei karttaselitettä.",
                        "tooltip": "Karttaselitettä ei näytetä tulosteessa.",
                        "selected": true
                    },
                    {
                        "id": "oskari_legend_LL",
                        "loca": "LL",
                        "label": "Vasen alanurkka",
                        "tooltip": "Karttaselite näytetään tulosteen vasemmassa alanurkassa."
                    },
                    {
                        "id": "oskari_legend_LU",
                        "loca": "LU",
                        "label": "Vasen ylänurkka",
                        "tooltip": "Karttaselite näytetään tulosteen vasemmassa ylänurkassa."
                    },
                    {
                        "id": "oskari_legend_RU",
                        "loca": "RU",
                        "label": "Oikea ylänurkka",
                        "tooltip": "Karttaselite näytetään tulosteen oikeassa ylänurkassa."
                    },
                    {
                        "id": "oskari_legend_RL",
                        "loca": "RL",
                        "label": "Oikea alanurkka",
                        "tooltip": "Karttaselite näytetään tulosteen oikeassa alanurkassa."
                    }
                ]
            },
            "help": "Ohje",
            "error": {
                "title": "Virhe",
                "size": "Tulosteen koko on virheellinen.",
                "name": "Kartan nimi on pakollinen tieto.",
                "nohelp": "Ohjetta ei löytynyt.",
                "saveFailed": "Karttanäkymän tulostus epäonnistui. Yritä myöhemmin uudelleen.",
                "nameIllegalCharacters": "Kartan nimessä on luvattomia merkkejä. Sallittuja merkkejä ovat kaikki suomen kielen aakkoset, numerot sekä välilyönti ja yhdysmerkki."
            }
        },
        "StartView": {
            "text": "Voit tulostaa tekemäsi karttanäkymän PNG-kuvaksi tai PDF-tulosteeksi.",
            "info": {
                "maxLayers": "Tulosteessa voi olla enintään kahdeksan karttatasoa.",
                "printoutProcessingTime": "Kartan tulostus voi kestää hetken, jos useita karttatasoja on valittuna."
            },
            "buttons": {
                "continue": "Jatka",
                "cancel": "Peruuta"
            }
        }
    }
}
);