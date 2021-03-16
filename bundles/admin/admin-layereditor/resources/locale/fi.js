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
                "name": "Karttatason yksilöivä nimi",
                "options": {
                    "apiKey": "Api key",
                    "tileGrid": "Tiilimatriisi"
                },
                "locale": {
                    "generic": {
                        "name": "Nimi kielellä {0}",
                        "subtitle": "Kuvaus kielellä {0}"
                    },
                    "en": {
                        "lang": "Englanti",
                        "name": "Nimi englanniksi",
                        "subtitle": "Kuvaus englanniksi"
                    },
                    "fi": {
                        "lang": "Suomi",
                        "name": "Nimi suomeksi",
                        "subtitle": "Kuvaus suomeksi"
                    },
                    "sv": {
                        "lang": "Ruotsi",
                        "name": "Nimi ruotsiksi",
                        "subtitle": "Kuvaus ruotsiksi"
                    }
                },
                "opacity": "Peittävyys",
                "params": {
                    "selectedTime": "Valittu aika"
                },
                "singleTile": "Single Tile",
                "realtime": "Reaaliaikataso",
                "refreshRate": " Virkistystaajuus sekunteina",
                "scale": "Mittakaava",
                "metadataId": "Metatiedon tiedostotunniste",
                "gfiContent": "Kohdetietoikkunan lisäsisältö",
                "gfiType": "GFI-vastaustyyppi",
                "role_permissions": "Oikeudet",
                "dataProviderId": "Tiedontuottaja",
                "groups": "Tason ryhmät"
            },
            "editor-tool": "Muokkaa tasoa",
            "flyout-title": "Karttatasohallinta",
            "fieldNoRestriction": "Ei rajoitusta",
            "generalTabTitle": "Yleiset",
            "visualizationTabTitle": "Visualisointi",
            "additionalTabTitle": "Lisätiedot",
            "permissionsTabTitle": "Oikeudet",
            "interfaceVersionDesc": "Valitse ensisijaisesti uusin rajapinnan tukema versio.",
            "attributions": "Lähdeviitteet",
            "usernameAndPassword": "Käyttäjätunnus ja salasana",
            "addLayer": "Lisää uusi karttataso",
            "dataProviderName": "Tiedontuottajan nimi",
            "addDataProvider": "Lisää tiedontuottaja",
            "themeName": "Teeman nimi",
            "addTheme": "Lisää teema",
            "editTheme": "Muokkaa teemaa",
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
            "realtimeDesc": "Klikkaa valituksi, jos kyseessä on reaaliaikaisesti päivittyvä karttataso. Karttatason virkistystaajuus määritellään sekunteina.",
            "singleTileDesc": "Single Tile -asetuksen ollessa päällä palvelusta pyydetään koko näkymän kokoinen karttakuva tiilien sijaan.",
            "capabilities": {
                "parsed": "Tasolle parsitut Capabilities-tiedot",
                "show": "Näytä palvelun GetCapabilities-vastaus",
                "update": "Päivitä nyt",
                "updateRate": "Capabilities päivitystiheys",
                "updateRateDesc": "Päivitystiheys sekunteina",
                "updatedSuccesfully": "GetCapabilities päivitys onnistui.",
                "updateFailed": "GetCapabilities päivitys epäonnistui.",
                "updateFailedWithReason": "GetCapabilities päivitys epäonnistui: {reason}"
            },
            "styles": {
                "default": "Oletustyyli",
                "desc": "Taso lisätään kartalle oletustyylillä. Käyttäjä voi vaihtaa tyyliä ”Valitut tasot”-valikon kautta.",
                "raster": {
                    "title": "Esitystyylit ja karttaselitteet",
                    "styleDesc": "Tyylit määritellään GetCapabilities-vastausviestissä, josta ne haetaan valintalistalle.",
                    "legendImage": "Oletuskarttaselite",
                    "legendImageDesc": "URL-osoite karttaselitteelle, joka näytetään tyyleillä, joilla ei palvelussa ole määritelty karttaselitettä.",
                    "legendImagePlaceholder": "Anna URL-osoite karttaselitteelle",
                    "serviceLegend": "Palvelussa määritelty karttaselite",
                    "overriddenLegend": "Korvaava karttaselite",
                    "overrideTooltip": "URL-osoite karttaselitteelle, jolla korvataan palvelusta saatavilla oleva karttaselite.",
                    "serviceNotAvailable": "Ei saatavilla"
                },
                "vector": {
                    "addStyle": "Lisää tyyli",
                    "newStyleName": "Uusi tyyli",
                    "name": "Tyylin nimi",
                    "selectDefault": "Valitse oletustyyli",
                    "deleteStyle": "Poista tyyli",
                    "validation": {
                        "name": "Täytä nimi tyylille",
                        "noStyles": "Ei tallennettuja tyylejä"
                    }
                }
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
            "timeSeries": {
                "metadataLayer": "Metadata layer",
                "metadataAttribute": "Timeline attribute",
                "metadataToggleLevel": "Zoom level to toggle between WMS and WFS layers",
                "noToggle": "No toggle",
                "ui": "Time series UI",
                "player": "Animaatio",
                "range": "Aikajana",
                "none": "Ei valintaa",
                "tooltip": {
                    "player": "Aikasarjadata näkyy animaationa kuva kerrallaan.",
                    "range": "Aikasarjatason näytettävän aineiston yksittäinen ajankohta tai aikaväli valitaan janalta. Metadatan avulla voidaan esittää janalla ne ajankohdat, joista kunkin näkymän kohdalla dataa on. Sopii ajassa ja tilassa hajanaiselle aineistolle.",
                    "none": "Endast standardbildet visas av WMS kartlagret.",
                },
                "selectMetadataLayer": "Valitse metadatataso"
            },
            "validation": {
                "mandatoryMsg": "Pakollisia tietoja puuttuu:",
                "styles": "Tyylimääritysten JSON-syntaksi on virheellinen.",
                "externalStyles": "Kolmannen osapuolen tyylimääritysten JSON-syntaksi on virheellinen.",
                "hover": "Kohteen korostus ja tooltip JSON-syntaksi on virheellinen.",
                "attributes": "Attribuutit kentän JSON-syntaksi on virheellinen.",
                "attributions": "Lähdeviitteet kentän JSON-syntaksi on virheellinen.",
                "tileGrid": "Tiilimatriisi kentän JSON-syntaksi on virheellinen."
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
                "deleteSuccess": "Poistettu",
                "deleteFailed": "Poisto epäonnistui",
                "updateCapabilitiesFail": "Rajapinnan tietojen haku epäonnistui. Tason osoite, tyyppi tai versio voi olla väärin tai rajapinta on tällä hetkellä pois käytöstä.",
                "errorFetchLayerFailed": "Tason tietojen haku epäonnistui. Taso on mahdollisesti poistettu tai sinulla ei ole siihen oikeuksia.",
                "errorFetchLayerEnduserFailed": "Tason tietojen haku listauksen päivittämistä varten epäonnistui. Tallensithan katseluoikeuden roolille joka sinulla on?"
            },
            "otherLanguages": "Muut kielet",
            "stylesJSON": "Tyylimääritykset (JSON)",
            "externalStylesJSON": "Kolmannen osapuolen tyylimääritykset (JSON)",
            "externalStyleFormats": "Tuetut muodot: 3D Tiles, Mapbox",
            "dynamicScreenSpaceErrorOptions": "Dynamic screen space error options",
            "dynamicScreenSpaceError": "Dynamic screen space error",
            "dynamicScreenSpaceErrorDensity": "Dynamic screen space error density",
            "dynamicScreenSpaceErrorFactor": "Dynamic screen space error factor",
            "dynamicScreenSpaceErrorHeightFalloff": "Dynamic screen space error height falloff",
            "deleteGroupLayers": "Poista ryhmään kuuluvat karttatasot",
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
