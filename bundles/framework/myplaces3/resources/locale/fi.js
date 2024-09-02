Oskari.registerLocalization(
{
    "lang": "fi",
    "key": "MyPlaces3",
    "value": {
        "title": "Kohteet",
        "desc": "",
        "guest": {
            "loginShort": "Kirjaudu sisään, jotta voit lisätä kohteita."
        },
        "tab": {
            "title": "Kohteet",
            "categoryTitle": "Karttataso",
            "publishCategory": {
                "privateTooltip": "Karttataso on yksityinen. Muuta karttataso julkiseksi klikkaamalla tästä.",
                "publicTooltip": "Karttataso on julkinen. Muuta karttataso yksityiseksi klikkaamalla tästä."
            },
            "export": {
                "title":"Vie kohteet",
                "tooltip": "Lataa karttatason kohteet GeoJSON-muodossa."
            },
            "addCategory": "Lisää karttataso",
            "editCategory": "Muokkaa karttatasoa",
            "deleteCategory": "Poista karttataso",
            "deleteDefault": "Oletuskarttatasoa ei voi poistaa.",
            "grid": {
                "name": "Kohteen nimi",
                "desc": "Kuvaus",
                "createDate": "Luontiaika",
                "updateDate": "Muokkausaika",
                "measurement": "Koko",
                "edit": "Muokkaa",
                "delete": "Poista",
                "actions": "Toiminnot"
            },
            "confirm": {
                "deleteCategory": "Haluatko poistaa karttatason {name}?",
                "categoryToPrivate": "Olet muuttamassa karttatasoa {name} yksityiseksi. Karttataso ei ole enää julkisesti jaettavissa ja sitä ei voi liittää toiseen verkkopalveluun. Karttataso ei ole enää muiden palvelun käyttäjien nähtävissä.",
                "categoryToPublic": "Olet muuttamassa karttatasoa {name} julkiseksi. Karttataso on tämän jälkeen julkisesti jaettavissa ja sen voi liittää toiseen verkkopalveluun. Karttataso on myös muiden palvelun käyttäjien nähtävissä.",
                "deletePlace": "Haluatko poistaa kohteen \"{name}\"?"
            },
            "deleteWithMove": {
                "name": "Olet poistamassa karttatasoa:",
                "count": "Karttatasolla on {count, plural, one {# kohde} other {# kohdetta}}. Haluatko:",
                "delete": "1. poistaa karttatason kohteineen",
                "move": "2. siirtää {count, plural, one {kohteen} other {kohteet}} karttatasolle:"
            }
        },
        "tools": {
            "point": {
                "title": "Lisää piste omiin kohteisiin",
                "tooltip": "Piirrä piste ja lisää se omiin kohteisiin. Voit liittää saman kohteeseen useampia pisteitä.",
                "add": "Piirrä piste klikkaamalla karttaa.",
                "next": "Voit piirtää samaan kohteeseen useita pisteitä.",
                "edit": "Voit siirtää pistettä raahaamalla sitä hiirellä."
            },
            "line": {
                "title": "Lisää viiva omiin kohteisiin",
                "tooltip": "Piirrä viiva ja lisää se omiin kohteisiin.",
                "add": "Piirrä viiva kartalle. Klikkaa viivan taitepisteitä. Lopuksi kaksoisklikkaa päätepistettä tai paina \"Tallenna kohde\".",
                "next": "Voit piirtää samaan kohteeseen useita viivoja.",
                "edit": "Voit siirtää taitepisteitä raahaamalla niitä hiirellä.",
                "noResult": "0 m"
            },
            "area": {
                "title": "Lisää alue omiin kohteisiin",
                "tooltip": "Piirrä alue ja lisää se omiin kohteisiin.",
                "add": "Piirrä alue kartalle klikkaamalla alueen reunapisteitä. Lopuksi kaksoisklikkaa viimeistä pistettä. Voit piirtää samaan kohteeseen useita alueita. Lopuksi paina \"Tallenna kohde\".",
                "next": "Voit piirtää samaan kohteeseen useita alueita.",
                "edit": "Voit siirtää taitepisteitä raahaamalla niitä hiirellä.",
                "noResult": "0 m²",
                "save": "Tallenna kohde"
            }
        },
        "buttons": {
            "savePlace": "Tallenna kohde",
            "movePlaces": "Siirrä kohteet ja poista",
            "deleteCategoryAndPlaces": "Poista kohteineen",
            "changeToPublic": "Muuta julkiseksi",
            "changeToPrivate": "Muuta yksityiseksi"
        },
        "placeform": {
            "title": "Kohteen tiedot",
            "tooltip": "Tallenna kohde omiin tietoihisi. Kohteelle on annettava vähintään nimi. Lopuksi valitse karttataso, johon kohde tallennetaan, tai luo uusi karttataso. Löydät kohteet myöhemmin \"Omat tiedot\"-valikosta.",
            "previewLabel": "Kuvan esikatselu",
            "fields": {
                "name": "Kohteen nimi",
                "description": "Kohteen kuvaus",
                "attentionText": "Kartalla kohteessa näkyvä teksti",
                "link": "Linkki lisätietoihin kohteesta",
                "imagelink": "Linkki kuvaan kohteesta"
            },
            "category": {
                "label": "Karttataso",
                "newLayer": "Luo uusi karttataso",
                "choose": "Valitse karttataso olemassa olevista karttatasoistasi:"
            },
            "validation": {
                "mandatoryName": "Kohteen nimi puuttuu",
                "invalidName": "Kohteen nimessä on kiellettyjä merkkejä",
                "invalidDesc": "Kohteen kuvauksessa on kiellettyjä merkkejä",
            }
        },
        "categoryform": {
            "title": "Tason tiedot",
            "layerName": "Karttatason nimi",
            "styleTitle": "Tyyli",
            "validation": {
                "mandatoryName": "Karttatason nimi puuttuu",
                "invalidName": "Karttatason nimessä on kiellettyjä merkkejä"
            }
        },
        "notification": {
            "place": {
                "saved": "Kohde on tallennettu.",
                "deleted": "Kohde on poistettu.",
                "info": "Löydät kohteen Omat tiedot -valikosta."
            },
            "category": {
                "saved": "Karttataso on tallennettu.",
                "updated": "Karttataso on päivitetty.",
                "deleted": "Karttataso on poistettu."
            }
        },
        "error": {
            "generic": "Järjestelmässä tapahtui virhe.",
            "saveCategory": "Karttatason tallentaminen epäonnistui.",
            "deleteCategory": "Karttatason poistaminen epäonnistui.",
            "savePlace": "Kohteen tallentaminen epäonnistui.",
            "deletePlace": "Kohteen poistaminen epäonnistui."
        }
    }
});
