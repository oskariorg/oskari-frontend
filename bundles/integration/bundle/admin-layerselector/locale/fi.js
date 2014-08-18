Oskari.registerLocalization({
    "lang": "fi",
    "key": "admin-layerselector",
    "value": {
        "title": "admin: Karttatasot",
        "desc": "",
        "flyout": {
            "title": "admin: karttatasot",
            "fetchingLayers" : "Haetaan tasoja."
        },
        "tile": {
            "title": "A: karttatasot",
            "tooltip": "."
        },
        "view": {
            "title": "",
            "prompt": "",
            "templates": {}
        },
        "errors": {
            "title": "Virhe!",
            "generic": "Järjestelmässä tapahtui virhe. Yritä uudelleen myöhemmin.",
            "loadFailed": "Karttatasojen latauksessa tapahtui virhe. Lataa sivu selaimeesi uudelleen ja valitse karttatasot.",
            "noResults": "Haulla ei löytynyt yhtään tulosta.",
            "layerTypeNotSupported": "Tason tyyppiä ei vielä tueta: ",
            "not_empty": "Teemaan, jota yrität poistaa, on liitetty karttatasoja. Valitse karttatasoille ensin toinen teema."
        },
        "loading": "Ladataan...",
        "filter": {
            "text": "Hae karttatasoja",
            "inspire": "Aiheittain",
            "organization": "Tiedontuottajittain",
            "published": "Käyttäjät"
        },
        "published": {
            "organization": "Julkaistu taso",
            "inspire": "Julkaistu taso"
        },
        "tooltip": {
            "type-base": "Taustakartta",
            "type-wms": "Karttataso",
            "type-wfs": "Tietotuote"
        },
        "backendStatus": {
            "OK": {
                "tooltip": "Karttataso on saatavilla tällä hetkellä.",
                "iconClass": "backendstatus-ok"
            },
            "DOWN": {
                "tooltip": "Karttataso ei ole saatavilla tällä hetkellä.",
                "iconClass": "backendstatus-down"
            },
            "MAINTENANCE": {
                "tooltip": "Karttatason saatavuudessa on tiedossa käyttökatkoja lähipäivinä.",
                "iconClass": "backendstatus-maintenance"
            },
            "UNKNOWN": {
                "tooltip": "",
                "iconClass": "backendstatus-ok"
            }
        },
        "admin": {
            "capabilitiesLabel" : "Capabilities",
            "confirmResourceKeyChange" : "Olet muuttanut Karttatason yksilöivä nimi- tai Rajapinnan osoite -kentän arvoja. Tietoturvasyistä karttatason käyttöoikeudet poistetaan ja ne täytyy asettaa uudelleen. Haluatko jatkaa?",
            "confirmDeleteLayerGroup" : "Karttatasoryhmä poistetaan. Haluatko jatkaa?",
            "confirmDeleteLayer" : "Karttataso poistetaan. Haluatko jatkaa?",
            "layertypes" : {
                "wms": "WMS Taso",
                "wfs": "WFS Taso",
                "wmts": "WMTS Taso",
                "arcgis" : "ArcGIS Taso"
            },
            "selectLayer": "Valitse ylätaso",
            "selectSubLayer": "Valitse alataso",

            "addOrganization": "Lisää tiedontuottaja",
            "addOrganizationDesc": "Lisää tiedontuottaja eli uusi orgasaatio",
            "addInspire": "Lisää aihe",
            "addInspireDesc": "Lisää aihe eli uusi Inspire-teema",
            "addLayer": "Lisää taso",
            "addLayerDesc": "Lisää taso tähän Inspire-teemaan",
            "edit": "Muokkaa",
            "editDesc": "Muokkaa nimeä",
            "layerType": "Tason tyyppi",
            "layerTypeDesc": "Tason tyyppi: WMS, WFS, WMTS",
            "type": "Tason tyyppi",
            "typePlaceholder": "Valitse tason tyyppi",
            "baseLayer": "Taustataso",
            "groupLayer": "Ryhmätaso",
            "interfaceVersion": "Rajapinnan versio",
            "interfaceVersionDesc": "Rajapinnan versio",
            "wms1_1_1": "WMS 1.1.1",
            "wms1_3_0": "WMS 1.3.0",
            "getInfo": "Hae tiedot",
            "selectClass": "Valitse aihe",
            "selectClassDesc": "Valitse aihe",

            "baseName": "Taustatason nimi",
            "groupName": "Ryhmätason nimi",
            "subLayers": "Alatasot",
            "addSubLayer": "Lisää alataso",
            "editSubLayer": "Muokkaa alatasoa",

            "wmsInterfaceAddress": "Rajapinnan osoitteet",
            "wmsUrl": "Rajapinnan osoitteet",
            "wmsInterfaceAddressDesc": "Rajapinnan URL-osoite tai osoitteet pilkulla eroteltuna",
            "wmsServiceMetaId": "Palvelun metatiedon tunniste",
            "wmsServiceMetaIdDesc": "Rajapintapalvelun palvelun metatiedon tiedostotunniste",
            "layerNameAndDesc": "Tason nimi ja kuvaus",

            "metaInfoIdDesc": "Paikkatieto&shy;hakemiston metatiedon tiedostotunniste, joka yksilöi metatiedon XML kuvailun",
            "metaInfoId": "Metatiedon tiedosto&shy;tunniste",
            "wmsName": "Karttatason yksilöivä nimi",
            "wmsNameDesc": "Karttatason yksilöivä eli tekninen nimi",

            "username": "Käyttäjätunnus",
            "password": "Salasana",

            "addInspireName": "Aiheen nimi",
            "addInspireNameTitle": "Aiheen nimi",
            "addOrganizationName": "Tiedontuottajan nimi",
            "addOrganizationNameTitle": "Tiedontuottajan nimi",
            "addNewClass": "Lisää uusi teema",
            "addNewLayer": "Lisää uusi karttataso",
            "addNewGroupLayer": "Lisää uusi ryhmätaso",
            "addNewBaseLayer": "Lisää uusi taustataso",
            "addNewOrganization": "Lisää uusi tiedontuottaja",
            "addInspireTheme": "Lisää aihe",
            "addInspireThemeDesc": "Lisää InspireTheme:n mukaiset aiheet",
            "opacity": "Peittävyys",
            "opacityDesc": "Tason peittävyys (arvo 0% tekee tasosta oletuksena näkymättömän)",
            "style": "Oletustyyli",
            "styleDesc": "Oletustyyli",

            "minScale": "Minimi&shy;mittakaava",
            "minScaleDesc": "Tason minimimittakaava (1:5669294)",
            "minScalePlaceholder": "5669294 (1:5669294) Minimimittakaava",
            "maxScale": "Maximi&shy;mittakaava",
            "maxScaleDesc": "Tason maximimittakaava (1:1)",
            "maxScalePlaceholder": "1 (1:1) Maximimittakaava ",
            "srsName": "Koordinaatti&shy;järjestelmä",
            "srsNamePlaceholder": "Koordinaattijärjestelmä",
            "legendImage": "Karttaselitteen osoite",
            "legendImageDesc": "Karttaselitteen osoitee",
            "legendImagePlaceholder": "Karttaselitteen osoite",

            "gfiContent": "Kohdetietoikkunan lisäsisältö",
            "gfiResponseType": "GFI vastauksen tyyppi",
            "gfiResponseTypeDesc": "Vastauksen tyyppi eli Get Feature Info (GFI)",
            "gfiStyle": "GFI:n tyyli",
            "gfiStyleDesc": "GFI:n tyyli (XSLT)",

            "matrixSetId" : "WMTS-tiilimatrisin tunniste",
            "matrixSetIdDesc" : "WMTS-tiilimatriisin tunniste (TileMatrixSet id)",
            "matrixSet" : "WMTS-tason JSON",
            "matrixSetDesc" : "WMTS-tason tiedot JSON-muodossa",

            "realtime": "Reaaliaikataso",
            "refreshRate": "Virkistystaajuus (sekunneissa)",

            "generic": {
                "placeholder": "Nimi kielellä {0}",
                "descplaceholder": "Kuvaus kielellä {0}"
            },
            "en": {
                "lang": "Englanniksi:",
                "title": "En",
                "placeholder": "Nimi englanniksi",
                "descplaceholder": "Kuvaus englanniksi"
            },
            "fi": {
                "lang": "Suomeksi:",
                "title": "Fi",
                "placeholder": "Nimi suomeksi",
                "descplaceholder": "Kuvaus suomeksi"
            },
            "sv": {
                "lang": "Ruotsiksi:",
                "title": "Sv",
                "placeholder": "Nimi ruotsiksi",
                "descplaceholder": "Kuvaus ruotsiksi"
            },

            "interfaceAddress": "Rajapinnan osoite",
            "interfaceAddressDesc": "Rajapinnan osoite ilman ?-merkkiä ja sen jälkeisiä parametreja",
            "viewingRightsRoles": "Katseluoikeudet rooleille",
            "metadataReadFailure": "Tason metatiedon haku epäonnistui.",
            "mandatory_field_missing": "Pakollinen tieto: ",
            "invalid_field_value": "Viallinen arvo: ",
            "operation_not_permitted_for_layer_id": "Operaatio ei ole sallittu tasolle ",
            "no_layer_with_id": "Tasoa ei löytynyt ID:llä "
        },
        "cancel": "Peruuta",
        "add": "Lisää",
        "save": "Tallenna",
        "delete": "Poista"
    }
});