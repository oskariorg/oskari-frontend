Oskari.registerLocalization({
    "lang": "fi",
    "key": "AdminHierarchicalLayerList",
    "value": {
        "buttons": {
            "add": "Lisää",
            "cancel": "Peruuta",
            "update": "Päivitä",
            "delete": "Poista",
            "ok": "Ok"
        },
        "tooltips": {
            "addMainGroup": "Lisää pääryhmä",
            "addSubgroup": "Lisää aliryhmä",
            "editMainGroup": "Muokkaa pääryhmää",
            "editSubgroup": "Muokkaa aliryhmää",
            "addLayer": "Lisää karttataso"
        },
        "groupTitles": {
            "addMainGroup": "Anna pääryhmän nimi",
            "addSubgroup": "Anna aliryhmän nimi",
            "localePrefix": "Nimi kielellä",
            "editMainGroup": "Muokkaa pääryhmää",
            "editSubgroup": "Muokkaa aliryhmää",
            "addLayer": "Lisää karttataso"
        },
        "selectableGroup": "Valintaryhmä",
        "errors": {
            "groupname": {
                "title": "Tarkista ryhmän nimi",
                "message": "Ryhmän nimen tulee olla yli 3 merkkiä pitkä"
            },
            "groupnameSave": {
                "title": "Ryhmän tallennus ei onnistunut",
                "message": "Ryhmän tallennus ei onnistunut, kokeile myöhemin uudelleen"
            },
            "groupnameDeleteCheckLayers": {
                "title": "Tarkista ryhmän tasot",
                "message": "Ryhmässä on tasoja tai aliryhmiä, siirrä ne toisen ryhmän alle ja poista ryhmä sitten."
            },
            "groupnameDelete": {
                "title": "Ryhmän poisto ei onnistunut",
                "message": "Ryhmän poisto ei onnistunut, kokeile myöhemin uudelleen"
            },
            "nodeDropSave": {
                "title": "Tason/ryhmän siirto ei onnistunut",
                "message": "Virhe tason/ryhmän siirrossa, kokeile myöhemmin uudelleen"
            }
        },
        "succeeses": {
            "groupnameSave": {
                "title": "Ryhmän tallennus onnistui",
                "message": "Ryhmän tallennus onnistui"
            },
            "groupnameDelete": {
                "title": "Ryhmän poisto onnistui",
                "message": "Ryhmän poisto onnistui"
            },
            "nodeDropSave": {
                "title": "Tason/ryhmän siirto onnistui",
                "message": "Tason/ryhmän siirto onnistui"
            }
        },
        "confirms": {
            "groupDelete": {
                "title": "Haluatko poistaa",
                "message": "Haluatko poistaa {groupname}-ryhmän ?"
            },
            "nodeDropSave": {
                "title": "Haluatko siirtää tason/ryhmän",
                "message": "Haluatko siirtää tason/ryhmän?"
            }
        },


        "admin": {
            "capabilitiesLabel": "Capabilities",
            "capabilitiesRemarks": "(*)  Nykyisen kartan koordinaatisto ei ole tuettuna palvelun capabilities tiedoissa",
            "confirmResourceKeyChange": "Olet muuttanut Karttatason yksilöivä nimi- tai Rajapinnan osoite -kentän arvoja. Tietoturvasyistä karttatason käyttöoikeudet poistetaan ja ne täytyy asettaa uudelleen. Haluatko jatkaa?",
            "confirmDeleteLayerGroup": "Karttatasoryhmä poistetaan. Haluatko jatkaa?",
            "confirmDeleteLayer": "Karttataso poistetaan. Haluatko jatkaa?",
            "layertypes": {
                "wms": "WMS-taso",
                "wfs": "WFS-taso",
                "wmts": "WMTS-taso",
                "arcgis": "ArcGISCache-taso",
                "arcgis93": "ArcGISRest-taso"
            },
            "selectLayer": "Valitse ylätaso",
            "selectSubLayer": "Valitse alataso",
            "addOrganization": "Lisää tiedontuottaja",
            "addOrganizationDesc": "Lisää uusi tiedontuottaja eli karttatason tuottava organisaatio.",
            "addInspire": "Lisää aihe",
            "addInspireDesc": "Lisää uusi aihe eli karttatasoa kuvaava Inspire-teema.",
            "addLayer": "Lisää karttataso",
            "addLayerDesc": "Lisää karttataso tähän Inspire-teemaan",
            "edit": "Muokkaa",
            "editDesc": "Muokkaa karttatason nimeä",
            "layerType": "Tason tyyppi",
            "layerTypeDesc": "Valitse karttatason tyyppi. Tällä hetkellä vaihtoehdot ovat WMS (Web Map Service), WFS (Web Feature Service), WMTS (Web Map Tile Service) ArcGISCache (ArcGIS Cache -rasteritaso) ja ArcGISRest (ArcGIS Rest -rasteritaso).",
            "type": "Karttatason tyyppi",
            "typePlaceholder": "Valitse karttatason tyyppi",
            "baseLayer": "Taustakarttataso",
            "groupLayer": "Karttatasoryhmä",
            "interfaceVersion": "Rajapinnan versio",
            "interfaceVersionDesc": "Valitse listalta rajapinnan versio. Valitse ensisijaisesti uusin rajapinnan tukema versio",
            "wms1_1_1": "WMS 1.1.1",
            "wms1_3_0": "WMS 1.3.0",
            "getInfo": "Hae tiedot",
            "editWfs": "Muokkaa WFS-tietoja",
            "selectClass": "Valitse aihe",
            "selectClassDesc": "Valitse listalta karttatasoa kuvaava aihe.",
            "baseName": "Taustakarttatason nimi",
            "groupName": "Karttatasoryhmän nimi",
            "subLayers": "Alatasot",
            "addSubLayer": "Lisää alataso",
            "editSubLayer": "Muokkaa alatasoa",
            "wmsInterfaceAddress": "Rajapinnan osoitteet",
            "wmsUrl": "Rajapinnan osoitteet",
            "wmsInterfaceAddressDesc": "Kirjoita tähän WMS-rajapinnan osoite ilman kysymysmerkkiä ja sen jälkeisiä tietoja. Hae rajapinnan tiedot painamalla ”Hae tiedot”.",
            "wmsServiceMetaId": "Palvelun metatiedon tunniste",
            "wmsServiceMetaIdDesc": "Anna rajapintapalvelua kuvaavan metatiedon tiedostotunniste.",
            "layerNameAndDesc": "Karttatason nimi ja kuvaus",
            "metaInfoIdDesc": "Metatiedon tiedostotunniste on XML-muotoisen metatietotiedoston tiedostotunniste. Se haetaan automaattisesti GetCapabilities-vastausviestistä.",
            "metaInfoId": "Metatiedon tiedosto&shy;tunniste",
            "wmsName": "Karttatason yksilöivä nimi",
            "wmsNameDesc": "Karttatason on yksilöivä nimi on tekninen tunniste. Se haetaan automaattisesti GetCapabilities-vastausviestistä.",
            "username": "Käyttäjätunnus",
            "password": "Salasana",
            "attributes": "Attribuutit",
            "selectedTime": "Valittu aika",
            "time": "Tuettu aika",
            "addInspireName": "Aiheen nimi",
            "addInspireNameTitle": "Aiheen nimi",
            "addOrganizationName": "Tiedontuottajan nimi",
            "addOrganizationNameTitle": "Tiedontuottajan nimi",
            "addNewClass": "Lisää uusi teema",
            "addNewLayer": "Lisää uusi karttataso",
            "addNewGroupLayer": "Lisää uusi ryhmätaso",
            "addNewBaseLayer": "Lisää uusi taustataso",
            "addNewOrganization": "Lisää uusi tiedontuottaja",
            "addInspireTheme": "Aihe",
            "addInspireThemeDesc": "Valitse listalta karttatasoon sopiva aihe.",
            "opacity": "Peittävyys",
            "opacityDesc": "Määrittele, mikä on karttatason oletuspeittävyys. Jos peittävyys on 100 %, se peittää kaikki alla olevat tasot. Jos taas peittävyys on 0 %, karttataso ei näy lainkaan. Palvelun käyttäjät voivat sää-tää peittävyyttä ”Valitut karttatasot” -valikon kautta.",
            "style": "Oletustyyli",
            "styleDesc": "Valitse listalta, mitä tyyliä käytetään oletusarvoisesti karttanäkymissä. Käyttäjä voi vaihtaa tyyliä ”Valitut tasot”-valikon kautta. Tyylit määritellään GetCapabilities-vastausviestin wms:Style-elementissä, josta ne haetaan valintalistalle.",
            "importStyle": "Uusi SLD tyyli",
            "addNewStyle": "Lisää uuden SLD tyylin sisältö",
            "sldStyleName": "Tyylin nimi",
            "sldFileContentDesc": "Kopioi/liitä SLD tiedoston sisältö (xml) tekstikenttään",
            "sldFileContent": "SLD:n sisältö",
            "sldStylesFetchError": "SLD stilen kunde inte hämtas",
            "addSldStyleDesc": "Valitse listalta, mitä tyylejä käytetään ko tasolle",
            "addSldStyle": "Sld tyylivalinta",
            "minScale": "Pienin mittakaava",
            "minScaleDesc": "Pienin mittakaava haetaan automaattisesti GetCapabilities-vastausviestistä. Se on pienin mittakaava, jolla karttataso näytetään. Anna mittakaava mittakaavalukuna. Jos mittakaavarajoja ei ole määritelty, karttataso näytetään kaikilla mittakaavatasoilla.",
            "minScalePlaceholder": "Pienin mittakaava muodossa 5669294 (1:5669294)",
            "maxScale": "Suurin mittakaava",
            "maxScaleDesc": "Suurin mittakaava haetaan automaattisesti GetCapabilities-vastausviestistä. Se on suurin mittakaava, jolla karttataso näytetään. Anna mittakaava mittakaavalukuna. Jos mittakaavarajoja ei ole määritelty, karttataso näytetään kaikilla mittakaavatasoilla.",
            "maxScalePlaceholder": "Suurin mittakaava muodossa 1 (1:1)",
            "srsName": "Koordinaatti&shy;järjestelmä",
            "srsNamePlaceholder": "Koordinaattijärjestelmä",
            "legendImage": "Oletuskarttaselite",
            "legendImageDesc": "URL-osoite karttaselitteelle, joka näytetään tyyleillä, joilla ei palvelussa ole määritelty karttaselitettä",
            "legendImagePlaceholder": "URL-osoite karttaselitteelle, joka näytetään tyyleillä, joilla ei palvelussa ole määritelty karttaselitettä",
            "legendUrl": "Tuo oletuskarttaselite tyyliltä",
            "legendUrlDesc": "Valitse oletuskarttaselite tarvittaessa tason selitteistä",
            "noServiceLegendUrl": "Ei tuoda tyylien selitteistä",
            "gfiContent": "Kohdetietoikkunan lisäsisältö",
            "gfiResponseType": "GFI-vastaustyyppi",
            "gfiResponseTypeDesc": "Valitse listalta formaatti, jossa kohdetiedot (GFI) haetaan. Mahdolliset formaatit on määritelty WMS-palvelun GetCapabilities-vastausviestissä.",
            "gfiStyle": "GFI-tyyli (XSLT)",
            "gfiStyleDesc": "Määrittele kohdetietojen esitystapa XSLT-muunnoksen avulla.",
            "manualRefresh": "Manuaalinen päivitys",
            "resolveDepth": "xlink:href haku",
            "matrixSetId": "WMTS-tiilimatrisin tunniste",
            "matrixSetIdDesc": "WMTS-tiilimatriisin tunniste (TileMatrixSet id) on tekninen tunniste. Se haetaan automaattisesti GetCapabilities-vastausviestistä.",
            "matrixSet": "WMTS-tason JSON",
            "matrixSetDesc": "WMTS-tason tiedot JSON-muodossa haetaan automaattisesti GetCapabilities-vastausviestistä.",
            "realtime": "Reaaliaikataso",
            "refreshRate": "Klikkaa valituksi, jos kyseessä on reaaliaikaisesti päivittyvä karttataso. Karttatason virkistystaa-juus määritellään sekunteina.",
            "jobTypeDesc": "WFS moottori",
            "jobTypeDefault": "oletus",
            "jobTypes": {
                "default": "Oletus",
                "fe": "Kohdemoottori"
            },
            "generic": {
                "placeholder": "Nimi kielellä {lang}",
                "descplaceholder": "Kuvaus kielellä {lang}"
            },
            "en": {
                "lang": "Englanniksi",
                "title": "En",
                "placeholder": "Nimi englanniksi",
                "descplaceholder": "Kuvaus englanniksi"
            },
            "fi": {
                "lang": "Suomeksi",
                "title": "Fi",
                "placeholder": "Nimi suomeksi",
                "descplaceholder": "Kuvaus suomeksi"
            },
            "sv": {
                "lang": "Ruotsiksi",
                "title": "Sv",
                "placeholder": "Nimi ruotsiksi",
                "descplaceholder": "Kuvaus ruotsiksi"
            },
            "interfaceAddress": "Rajapinnan osoite",
            "interfaceAddressDesc": "Anna rajapinnan osoite ilman ?-merkkiä ja sen jälkeisiä parametreja.",
            "viewingRightsRoles": "Katseluoikeudet rooleille",
            "metadataReadFailure": "Karttatason metatietoja ei voitu hakea.",
            "permissionFailure": "Käyttäjätunnus tai salasana on virheellinen.",
            "mandatory_field_missing": "Seuraavat tiedot ovat pakollisia:",
            "invalid_field_value": "Annettu arvo on virheellinen:",
            "operation_not_permitted_for_layer_id": "Sinulla ei ole riittäviä oikeuksia muokata tai lisätä karttatasoja.",
            "no_layer_with_id": "Karttatasoa tällä tunnisteella ei ole olemassa. Se saattaa olla jo poistettu.",
            "success": "Päivitys onnistui",
            "errorRemoveLayer": "Karttatason poisto ei onnistunut.",
            "errorInsertAllreadyExists": "Uusi karttataso on lisätty. Samalla tunnisteella on jo olemassa karttataso.",
            "errorRemoveGroupLayer": "Karttatasoryhmän poisto epäonnistui.",
            "errorSaveGroupLayer": "Karttatasoryhmän tallennus epäonnistui.",
            "errorTitle": "Virhe",
            "warningTitle": "Varoitus",
            "successTitle": "Tallennettu",
            "warning_some_of_the_layers_could_not_be_parsed": "Osaa tasoista ei voitu käsitellä.",


            "addDataprovider": "Tiedontuottaja",
            "groupTitle": "Taustakarttatason nimi"
        },
        "cancel": "Peruuta",
        "add": "Lisää",
        "save": "Tallenna",
        "delete": "Poista",
        "ok": "OK"
    }
});