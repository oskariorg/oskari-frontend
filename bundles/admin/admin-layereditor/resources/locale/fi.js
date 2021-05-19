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
                "gfiContent": "Kohdetietoikkunan lisäsisältö",
                "gfiType": "GFI-vastaustyyppi",
                "role_permissions": "Oikeudet",
                "dataProviderId": "Tiedontuottaja",
                "groups": "Tason ryhmät",
                "updated": "Taso päivitettiin",
                "created": "Taso luotiin",
                "layerId": "Tason uniikki tunniste"
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
            "addSubtheme": "Lisää aliteema",
            "editSubtheme": "Muokkaa aliteemaa",
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
            "serviceNotAvailable": "ei saatavilla",
            "metadata": {
                "title": "Metatiedon tiedostotunniste",
                "desc": "Metatiedon tiedostotunniste on XML-muotoisen metatietotiedoston tiedostotunniste. Se haetaan automaattisesti GetCapabilities-vastausviestistä.",
                "service": "Palvelussa määritelty",
                "overridden": "Korvaava tiedostotunniste"
            },
            "capabilities": {
                "parsed": "Tasolle parsitut Capabilities-tiedot",
                "show": "Näytä palvelun GetCapabilities-vastaus",
                "update": "Päivitä nyt",
                "updateRate": "Capabilities päivitystiheys",
                "updateRateDesc": "Päivitystiheys sekunteina",
                "updatedSuccesfully": "GetCapabilities päivitys onnistui.",
                "updateFailed": "GetCapabilities päivitys epäonnistui.",
                "updateFailedWithReason": "GetCapabilities päivitys epäonnistui: {reason}",
                "validate": "Tason tiedot eivät vastaa rajapinnan määrityksiä",
                "rasterStyle" : {
                    "defaultStyle" : "Oletustyyliä ei löydy tason tyyleistä. Päivitä tason oletustyyli.",
                    "additionalLegend": "Tasolla on karttaselite, jolle ei löydy tyyliä. Päivitä karttaselitteet. Ylimääräisen karttaselitteen nimessä on *-merkki.",
                    "globalWithStyles": "Tasolle on määritetty oletuskarttaselite, vaikka sillä on tyylejä. Poista oletuskarttaselite ja määritä mahdolliset tyylikohtaiset karttaselitteet."
                }
            },
            "styles": {
                "default": "Oletustyyli",
                "desc": "Taso lisätään kartalle oletustyylillä. Käyttäjä voi vaihtaa tyyliä ”Valitut tasot”-valikon kautta.",
                "raster": {
                    "title": "Esitystyylit ja karttaselitteet",
                    "styleDesc": "Tyylit määritellään GetCapabilities-vastausviestissä, josta ne haetaan valintalistalle.",
                    "unavailable": "Palvelussa määritelty esitystyyli: ei saatavilla",
                    "legendImage": "Oletuskarttaselite",
                    "serviceLegend": "Palvelussa määritelty karttaselite",
                    "overriddenLegend": "Korvaava karttaselite",
                    "overrideTooltip": "URL-osoite karttaselitteelle, jolla korvataan palvelusta saatavilla oleva karttaselite."
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
                "unsupportedType": "Ylläpitotoiminnallisuus ei tue tasotyyppiä",
                "existing": "Taso on jo rekisteröity palveluun. Valitsemalla tämän tulet lisäämään saman tason useampaan kertaan.",
                "problematic": "Tason capabilities parsinnassa ongelmia. Taso ei välttämättä toimi oikein.",
                "unsupported": "Taso ei capabilitiesin mukaan tue käytössä olevia projektioita. Taso ei välttämättä toimi oikein."
            },
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
                "metadataLayer": "Metadatataso",
                "metadataAttribute": "Metadatan aika-atribuutti",
                "metadataToggleLevel": "Mittakaavatasot, joilla metatietotaso on käytössä",
                "metadataVisualize": "Metadatatason näkyminen",
                "noToggle": "Ei valintaa",
                "ui": "Aikasarjan käyttö",
                "player": "Animaatio",
                "range": "Aikajana",
                "none": "Ei valintaa",
                "tooltip": {
                    "player": "Aikasarjadata näkyy animaationa kuva kerrallaan.",
                    "range": "Yksittäinen ajankohta tai aikaväli valitaan janalta. Metadatan esitetään janalla ne ajankohdat, joista dataa on olemassa. Sopii ajassa ja tilassa hajanaiselle aineistolle.",
                    "none": "WMS karttatasosta näkyy karttanäkymässä vain oletuskuva.",
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
                "errorFetchLayerEnduserFailed": "Tason tietojen haku listauksen päivittämistä varten epäonnistui. Tallensithan katseluoikeuden roolille joka sinulla on?",
                "deleteErrorGroupHasSubgroups": "Ryhmä jota yrität poistaa sisältää aliryhmiä. Poista ensin aliryhmät."
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
            "maximumScreenSpaceError": "Maximum screen space error",
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
