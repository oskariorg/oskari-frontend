Oskari.registerLocalization(
{
    "lang": "fi",
    "key": "AdminUsers",
    "value": {
        "title": "A: Käyttäjät",
        "desc": "",
        "tile": {
            "title": "A: Käyttäjät"
        },
        "flyout": {
            "title": "Käyttäjien ylläpito",
            "adminusers": {
                "title": "Käyttäjät",
                "firstName": "Etunimi",
                "lastName": "Sukunimi",
                "user": "Nimimerkki",
                "password": "Salasana",
                "email": "Sähköposti",
                "rePassword": "Salasana uudestaan",
                "addRole": "Valitse rooli(t)",
                "password_mismatch": "Salasanat eivät täsmää.",
                "password_too_short": "Salasanan on oltava vähintään kahdeksan merkkiä pitkä.",
                "passwordRequirements": {
                    "title": "Salasanan vaatimukset: ",
                    "length": "Vähimmäispituus:  {length}",
                    "case": "Pitää sisältää sekä pieniä että ISOJA kirjaimia"
                },
                "form_invalid": "Annetut arvot ovat virheellisiä tai puutteellisia.",
                "field_required": "Kenttä \"{fieldName}\" on pakollinen",
                "confirm_delete": "Haluatko varmasti poistaa käyttäjän {user}?",
                "delete_failed": "Käyttäjän poistaminen epäonnistui.",
                "fetch_failed": "Käyttäjien tietoja ei voitu hakea.",
                "save_failed": "Tallennus epäonnistui.",
                "save_failed_message": "Valitsemasi nimimerkki on jo käytössä, yritä eri nimimerkkiä.",
                "noMatch": "Ei hakutuloksia.",
                "selectRole": "Valitse rooli",
                "searchResults": "Hakutulokset"
            },
            "adminroles": {
                "title": "Roolit",
                "newrole": "Lisää rooli:",
                "confirm_delete": "Haluatko varmasti poistaa roolin {role}?",
                "delete_failed": "Käyttäjän poistaminen epäonnistui.",
                "doSave_failed": "Roolin tallennus epäonnistui.",
                "showUsers": "Näytä käyttäjät",
                "roles": {
                    "system": "Järjestelmäroolit",
                    "other": "Lisäroolit"
                }
            },
            "usersByRole": {
                "title": "Roolin käyttäjät",
                "fetchFailed": "Käyttäjien tietoja ei voitu hakea roolille.",
                "noUsers": "Roolilla ei ole yhtään käyttäjää."
            }
        },
        "save": "tallenna",
        "failed_to_get_roles_title": "Roolien haku epäonnistui",
        "failed_to_get_roles_message": "Roolien haku epäonnistui, tarkista oskari-control-admin saatavuus."
    }
});
