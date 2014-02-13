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
            "noResults": "Haulla ei löytynyt yhtään tulosta."
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
            "confirmResourceKeyChange" : "Muuttamalla wmsname ja url arvoja tason oikeudet muuttuvat. Haluatko jatkaa?",
            "confirmDeleteLayerGroup" : "Tasoryhmän poisto. Haluatko jatkaa?",
            "confirmDeleteLayer" : "Tason poisto. Haluatko jatkaa?",
            "layertypes" : {
                "wms": "WMS Taso",
                "wfs": "WFS Taso",
                "wmts": "WMTS Taso"
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
            "normalLayer": "Normaali taso",
            "baseLayer": "Taustataso",
            "groupLayer": "Ryhmätaso",
            "interfaceVersion": "Rajapinnan versio",
            "interfaceVersionDesc": "Rajapinnan versio",
//            "wmslayer": "WMS Taso",
            "wms1_1_1": "WMS 1.1.1",
            "wms1_3_0": "WMS 1.3.0",
//            "wfslayer": "WFS Taso",
//            "wmtslayer": "WMTS Taso",
            "getInfo": "Hae tiedot",
            "selectClass": "Valitse aihe",
            "selectClassDesc": "Valitse aihe",

            "baseName": "Taustatason nimi",
            "groupName": "Ryhmätason nimi",
            "subLayers": "Alatasot",
            "addSubLayer": "Lisää alataso",

            "wmsInterfaceAddress": "WMS-rajapinnan osoitteet",
            "wmsUrl": "WMS-rajapinnan osoitteet",
            "wmsInterfaceAddressDesc": "WMS-rajapinnan URL-osoitteet pilkulla eroteltuna",
            "wmsServiceMetaId": "WMS metatiedon tunniste",
            "wmsServiceMetaIdDesc": "WMS-palvelun metatiedon tiedostotunniste",
            "layerNameAndDesc": "Tason nimi ja kuvaus",

            "metaInfoIdDesc": "Paikkatieto&shy;hakemiston metatiedon tiedostotunniste, joka yksilöi metatiedon XML kuvailun",
            "metaInfoId": "Metatiedon tiedosto&shy;tunniste",
            "wmsName": "WMS nimi",
            "wmsNameDesc": "WMS taso eli uniikki nimi",

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
            "legendImage": "Legenda-kuvan osoite",
            "legendImageDesc": "Legenda-kuvan osoite",
            "legendImagePlaceholder": "Legenda-kuvan osoite",
            "gfiResponseType": "GFI vastauksen tyyppi",
            "gfiResponseTypeDesc": "Vastauksen tyyppi eli Get Feature Info (GFI)",
            "gfiStyle": "GFI:n tyyli",
            "gfiStyleDesc": "GFI:n tyyli (XSLT)",

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
            "interfaceAddressDesc": "WMS&shy;-tasomäärittelyjen osoite",
            "viewingRightsRoles": "Katseluoikeudet rooleille",
            "metadataReadFailure": "Tason metatiedon haku epäonnistui.",
            "mandatory_field_missing": "Pakollinen tieto: ",
            "invalid_field_value": "Viallinen arvo: ",
            "operation_not_permitted_for_layer_id": "Operaatio ei ole sallittu tasolle ",
            "no_layer_with_id": "Tasoa ei löytynyt ID:llä "
        },
        "cancel": "Peruuta",
        "add": "Tallenna",
        "delete": "Poista"
    }
});