Oskari.registerLocalization(
    {
        "lang": "fi",
        "key": "admin-layereditor",
        "value": {
            "wizard": {
                "type": "Tason tyyppi",
                "service": "Rajapinta",
                "layers": "Karttatasot",
                "typeDescription": "Valitse lisättävän rajapinnan tyyppi",
                "serviceDescription": "Syötä lisättävän rajapinnan osoite ja versionumero",
                "layersDescription": "Valitse rajapinnasta löytyvistä tasoista se jonka haluat lisätä karttatasoksi",
                "details": "Tason tiedot"
            },
            "layertype": {
                "wmslayer": "WMS",
                "wmtslayer": "WMTS",
                "wfslayer": "WFS/OAPIF",
                "arcgislayer": "ArcGIS cache",
                "arcgis93layer": "ArcGIS Rest",
                "vectortilelayer": "Mapbox vektoritiili",
                "tiles3dlayer": "Cesium 3D Tiles",
                "bingmapslayer": "Bing"
            },
            "fields": {
                "url": "Rajapinnan osoite",
                "version": "Rajapinnan versio",
                "username": "Käyttäjätunnus",
                "password": "Salasana",
                "uniqueName": "Karttatason yksilöivä nimi",
                "options": {
                    "apiKey": "Api key",
                    "tileGrid": "Tiilimatriisi"
                },
                "locale": {
                    "generic": {
                        "placeholder": "Nimi kielellä {0}",
                        "descplaceholder": "Kuvaus kielellä {0}"
                    },
                    "en": {
                        "lang": "Englanti",
                        "placeholder": "Nimi englanniksi",
                        "descplaceholder": "Kuvaus englanniksi"
                    },
                    "fi": {
                        "lang": "Suomi",
                        "placeholder": "Nimi suomeksi",
                        "descplaceholder": "Kuvaus suomeksi"
                    },
                    "sv": {
                        "lang": "Ruotsi",
                        "placeholder": "Nimi ruotsiksi",
                        "descplaceholder": "Kuvaus ruotsiksi"
                    }
                },
                "opacity": "Peittävyys",
                "style": "Oletustyyli",
                "params": {
                    "selectedTime": "Valittu aika"
                },
                "realtime": "Reaaliaikataso",
                "refreshRate": " Virkistystaajuus sekunteina",
                "scale": "Mittakaava",
                "metadataId": "Metatiedon tiedostotunniste",
                "gfiContent": "Kohdetietoikkunan lisäsisältö",
                "gfiType": "GFI-vastaustyyppi",

            },
            "editor-tool": "Muokkaa tasoa",
            "flyout-title": "Karttatasohallinta",
            "generalTabTitle": "Yleiset",
            "visualizationTabTitle": "Visualisointi",
            "additionalTabTitle": "Lisätiedot",
            "permissionsTabTitle": "Oikeudet",
            "interfaceVersionDesc": "Valitse ensisijaisesti uusin rajapinnan tukema versio.",
            "attributions": "Lähdeviitteet",
            "usernameAndPassword": "Käyttäjätunnus ja salasana",
            "addLayer": "Lisää uusi karttataso",
            "dataProvider": "Tiedontuottaja",
            "dataProviderName": "Tiedontuottajan nimi",
            "addDataProvider": "Lisää tiedontuottaja",
            "themeName": "Teeman nimi",
            "addTheme": "Lisää teema",
            "editTheme" : "Muokkaa teemaa",
            "editDataProvider": "Muokkaa tiedontuottajaa",
            "mapLayerGroups": "Tason ryhmät",
            "selectMapLayerGroupsButton": "Valitse ryhmät",
            "cancel": "Peruuta",
            "close": "Sulje",
            "backToPrevious": "Takaisin edelliseen vaiheeseen",
            "ok": "Ok",
            "add": "Lisää",
            "save": "Tallenna",
            "skipCapabilities": "Manuaalinen lisäys",
            "addNewFromSameService": "Lisää uusi taso samasta palvelusta",
            "delete": "Poista",
            "styleDesc": "Valitse listalta, mitä tyyliä käytetään oletusarvoisesti karttanäkymissä. Käyttäjä voi vaihtaa tyyliä ”Valitut tasot”-valikon kautta.",
            "realtimeDesc": "Klikkaa valituksi, jos kyseessä on reaaliaikaisesti päivittyvä karttataso. Karttatason virkistystaajuus määritellään sekunteina.",
            "capabilities": {
                "show": "Näytä palvelun GetCapabilities-vastaus",
                "styleDesc": "Tyylit määritellään GetCapabilities-vastausviestin wms:Style-elementissä, josta ne haetaan valintalistalle.",
                "update": "Päivitä nyt",
                "updateRate": "Capabilities päivitystiheys",
                "updateRateDesc": "Päivitystiheys sekunteina",
                "updatedSuccesfully": "GetCapabilities päivitys onnistui.",
                "updateFailed": "GetCapabilities päivitys epäonnistui.",
                "updateFailedWithReason": "GetCapabilities päivitys epäonnistui: {reason}"
            },
            "layerStatus": {
                "existing": "Taso on jo rekisteröity palveluun. Valitsemalla tämän tulet lisäämään saman tason useampaan kertaan.",
                "problematic": "Tason capabilities parsinnassa ongelmia. Taso ei välttämättä toimi oikein.",
                "unsupported": "Taso ei capabilitiesin mukaan tue käytössä olevia projektioita. Taso ei välttämättä toimi oikein."
            },
            "metadataIdDesc": "Metatiedon tiedostotunniste on XML-muotoisen metatietotiedoston tiedostotunniste. Se haetaan automaattisesti GetCapabilities-vastausviestistä.",
            "gfiTypeDesc": "Valitse listalta formaatti, jossa kohdetiedot (GFI) haetaan. Mahdolliset formaatit on määritelty WMS-palvelun GetCapabilities-vastausviestissä.",
            "gfiStyle": "GFI-tyyli (XSLT)",
            "gfiStyleDesc": "Määrittele kohdetietojen esitystapa XSLT-muunnoksen avulla.",
            "attributes": "Attribuutit",
            "clusteringDistance": "Pisteiden etäisyys klusteroidessa",
            "legendImage": "Oletuskarttaselite",
            "legendImageDesc": "URL-osoite karttaselitteelle, joka näytetään tyyleillä, joilla ei palvelussa ole määritelty karttaselitettä",
            "legendImagePlaceholder": "URL-osoite karttaselitteelle, joka näytetään tyyleillä, joilla ei palvelussa ole määritelty karttaselitettä",
            "forcedSRS": "Pakotetut projektiot",
            "forcedSRSInfo": "Pakotetut projektiot verrattuna GetCapabilites-määritykseen",
            "supportedSRS": "Tuetut projektiot",
            "missingSRS": "Puuttuvat projektiot",
            "missingSRSInfo": "Sovelluksen oletusnäkymien projektiot, joita taso ei tue",
            "renderMode": {
                "title": "Sisällön tyyppi",
                "mvt": "Paljon pieniä kohteita",
                "geojson": "Suuria kohteita",
                "info": "Pienten kohteiden esittämistä on optimoitu. Tämä rajoittaa mittakaavatasoja, joilla kohteet näytetään."
            },
            "validation": {
                "mandatoryMsg": "Pakollinen tieto puuttuu:",
                "dataprovider": "Tiedontuottaja on pakollinen tieto.",
                "nopermissions": "Tasolle ei ole asetettu oikeuksia",
                "locale": "Tasolle ei ole annettu nimeä oletuskielelle.",
                "styles" : "Tyylimääritysten JSON-syntaksi on virheellinen.",
                "externalStyles" : "Kolmannen osapuolen tyylimääritysten JSON-syntaksi on virheellinen.",
                "hover" : "Kohteen korostus ja tooltip JSON-syntaksi on virheellinen.",
                "attributes" : "Attribuutit kentän JSON-syntaksi on virheellinen.",
                "attributions" : "Lähdeviitteet kentän JSON-syntaksi on virheellinen.",
                "tileGrid" : "Tiilimatriisi kentän JSON-syntaksi on virheellinen.",
                "url": "Rajapinnan osoite on pakollinen tieto.",
                "name": "Karttatason yksilöivä nimi on pakollinen tieto.",
                "version": "Rajapinnan versio on pakollinen tieto.",
                "options": {
                    "apiKey": "Api key on pakollinen tieto."
                }
            },
            "messages": {
                "saveSuccess": "Tallennettu",
                "saveFailed": "Järjestelmässä tapahtui virhe. Tietoja ei ole tallennettu.",
                "confirmDeleteLayer": "Karttataso poistetaan. Haluatko jatkaa?",
                "confirmDeleteGroup": "Ryhmä poistetaan. Haluatko jatkaa?",
                "confirmDuplicatedLayer": "Taso on jo rekisteröity palveluun. Haluatko varmasti lisätä saman tason moneen kertaan?",
                "errorRemoveLayer": "Karttatason poisto ei onnistunut.",
                "errorInsertAllreadyExists": "Uusi karttataso on lisätty. Samalla tunnisteella on jo olemassa karttataso.",
                "errorFetchUserRolesAndPermissionTypes": "Käyttäjäroolien ja käyttöoikeustyyppien haku ei onnistunut",
                "errorFetchCapabilities": "Rajapinnan tietojen haku epäonnistui.",
                "unauthorizedErrorFetchCapabilities": "Palvelu vaatii käyttäjätunnuksen ja salasanan.",
                "timeoutErrorFetchCapabilities": "Pyyntö aikakatkaistiin ennen kuin palvelusta saatiin tietoja. Tarkista rajapinnan osoite.",
                "connectionErrorFetchCapabilities": "Pyynnön lähettäminen palveluun ei onnistunut. Tarkista rajapinnan osoite.",
                "parsingErrorFetchCapabilities": "Palvelusta saatua vastausta ei saatu tulkittua. Tarkista rajapinnan tyyppi ja versio.",
                "deleteSuccess" : "Poistettu",
                "deleteFailed" : "Poisto epäonnistui"
            },
            "otherLanguages": "Muut kielet",
            "stylesJSON": "Tyylimääritykset (JSON)",
            "externalStylesJSON": "Kolmannen osapuolen tyylimääritykset (JSON)",
            "externalStyleFormats": "Tuetut muodot: 3D Tiles, Mapbox",
            "deleteGroupLayers" : "Poista ryhmään kuuluvat karttatasot",
            "hover": "Kohteen korostus ja tooltip (JSON)",
            "ion": {
                "title": "Cesium ion",
                "assetId": "Asset ID",
                "assetServer": "Asset Server",
                "accessToken": "Access Token"
            },
            "rights": {
                "PUBLISH": "Julkaisuoikeus",
                "VIEW_LAYER": "Katseluoikeus",
                "DOWNLOAD": "Latausoikeus",
                "VIEW_PUBLISHED": "Katseluoikeus upotetussa kartassa",
                "role": "Rooli"
            }
        }
    }
);