Oskari.registerLocalization(
{
    "lang": "fi",
    "key": "admin-permissions",
    "value": {
        "title": "Tasojen oikeudet",
        "desc": "",
        "tile": {
            "title": "Tasojen oikeudet"
        },
        "flyout": {
            "title": "Karttatasojen oikeuksien hallinta",
            "instruction": "Aloita valitsemalla yhteenveto tai rooli",
            "unsavedChangesConfirm": "Tallentamattomat muutoksesi häviävät, haluatko jatkaa?",
            "name": "Karttataso",
            "select": {
                "label": "Valitse",
                "placeholder": "yhteenveto tai rooli",
                "group": "Yhteenvedot",
                "permissions": "Roolien oikeudet",
                "layer": "Karttatasojen tiedot"
            },
            "summary": {
                "published": "Upotus",
                "publishedTooltip": "Vierailijan katseluoikeus upotetussa kartassa",
                "anonymous": "Vierailija",
                "user": "Kirjautunut",
                "admin": "Ylläpitäjä",
                "otherRoles": "Lisäroolit",
                "otherRigthts": "{roles} lisäroolilla on {permissions} oikeutta",
                "otherTooltip": "Oikeuksia on rooleilla: {names}",
                "filter": {
                    "adminOnly": "Vain admin",
                    "default": "Oletusoikeudet",
                    "hasOthers": "Oikeuksia lisärooleilla",
                    "systemOnly": "Vain perusrooleilla",
                    'unpublished': "Ei julkaistu vierailijalle"
                }
            },
            "layerDetails": {
                "name": "Nimi",
                "type": "Tyyppi",
                "version": "Versio",
                "fi": "Suomi",
                "en": "Englanti",
                "sv": "Ruotsi",
                "provider": "Lähde",
                "groups": "Aihe",
                "opacity": "Läpinäkyvyys",
                "legend": "Selite",
                "filter": {
                    "localization": "Puutteelliset kielistykset",
                    "metadata": "Metadata puuttuu",
                    "legend": "Karttaselite puuttuu",
                    "scale": "Virheellinen mittakaava"
                }
            }
        },
        "permissions": {
            "type": {
                "PUBLISH": "Julkaisuoikeus",
                "VIEW_LAYER": "Katseluoikeus",
                "DOWNLOAD": "Latausoikeus",
                "VIEW_PUBLISHED": "Katseluoikeus upotetussa kartassa"
            },
            "success": {
                "save": "Karttatasojen oikeudet on päivitetty."
            },
            "error": {
                "fetch": "Karttatasojen oikeuksia ei voitu hakea.",
                "save": "Karttatasojen oikeuksia ei voitu päivittää."
            }
        },
        "roles": {
            "title": "Rooli",
            "placeholder": "Valitse rooli",
            "type": {
                "system": "Järjestelmäroolit",
                "other": "Lisäroolit"
            },
            "error": {
                "fetch": "Roolien haku epäonnistui.",
            }
        }
    }
});
