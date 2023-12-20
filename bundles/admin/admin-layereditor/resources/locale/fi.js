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
                "details": "Tason tiedot",
                "toggleFlatView": "Listanäkymä",
                "toggleTreeView": "Puunäkymä"
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
                    "name": "Nimi",
                    "description": "Kuvaus"
                },
                "opacity": "Peittävyys",
                "params": {
                    "selectedTime": "Valittu aika"
                },
                "singleTile": "Single Tile",
                "realtime": "Reaaliaikataso",
                "refreshRate": " Virkistystaajuus sekunteina",
                "scale": "Mittakaava",
                "coverage":"Näytä karttatason kattavuusalue kartalla",
                "declutter": "Piirrä kohteiden nimet erikseen (declutter).",
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
                "updateRateDesc": "Päivitystiheys minuutteina.",
                "updateRateCronMsg": "Päivitys ajastettu cronilla: {cron}, voit muuttaa päivitystiheyttä oskari-ext.propertiesin 'oskari.scheduler.job.UpdateCapabilitiesJob.cronLine' arvolla.",
                "updatedSuccesfully": "GetCapabilities päivitys onnistui.",
                "updateFailed": "GetCapabilities päivitys epäonnistui.",
                "updateFailedWithReason": "GetCapabilities päivitys epäonnistui: {reason}",
                "validate": "Tason tiedot eivät vastaa rajapinnan määrityksiä",
                "rasterStyle" : {
                    "defaultStyle" : "Nyt valittua oletustyyliä ei löydy palvelusta. Valitse uusi oletustyyli.",
                    "additionalLegend": "Tasolle on tallennettu erikseen rajapintapalvelun oman karttaselitteen yliajava karttaselite, jolle ei löydy tyyliä. Päivitä karttaselitteen tiedot. Poistuneen/ei-toimivan karttaselitteen nimessä on ( ! )-merkki.",
                    "globalWithStyles": "Tasolle on määritetty vain yksi yleinen oletuskarttaselite, vaikka sillä olisi rajapintapalvelusta useita tyylejä käytettävissä. Poista oletuskarttaselite ja määritä mahdolliset tyylikohtaiset karttaselitteet."
                }
            },
            "attributes": {
                "label": "Attribuutit",
                "properties": "Kohteiden ominaisuuksien käyttö",
                "presentation": "Esitystapa",
                "presentationTooltip": "Esitystapa vaikuttaa kohdetietojen kyselyyn ja kohdetietotaulukkoon.",
                "showAll": "Näytä kaikki ominaisuustiedot",
                "idProperty": "Käytä ominaisuustietoa kohteiden yksilöimiseen",
                "idPropertyTooltip": "Rajapinnan tulee palauttaa yksilöivä tunniste kohteille. Pyydä ensisijaisesti palveluntarjoajaa ottamaan käyttöön yksilöivät tunnisteet. Toimii vain 'Suuria kohteita' tyypille (GeoJSON).",
                "geometryType": {
                    "label": "Geometriatyyppi",
                    "sourceAttributes": "Lähde: tason attribuutit",
                    "sourceCapabilities": "Lähde: tason Capabilities-tiedot",
                    "unknown":"Ei tiedossa",
                    "point": "Piste",
                    "line": "Viiva",
                    "area":"Alue",
                    "collection":"Kaikki"
                },
                "featureFilter": {
                    "title": "Suodata rajapinnasta haettavia kohteita ominaisuuksien mukaan",
                    "button": "Kohteiden suodatus"
                },
                "filter": {
                    "title": "Kohteiden ominaisuuksien näyttäminen",
                    "lang": "Valitse tason kohteille näytettävät ominaisuudet ja niiden järjestys",
                    "default": "oletussuodattimelle",
                    "fromDefault": "Valitulle kielelle ei ole lisätty suodatinta. Valitulla kielellä käytetään oletussuodatinta. Muokkaa valintoja luodaksesi kielelle oman suodattimen.",
                    "button": "Valitse kentät"
                },
                "locale": {
                    "title": "Nimet käyttöliittymässä ominaisuuksille",
                    "button": "Nimeäminen"
                },
                "format": {
                    "title": "Kohteiden ominaisuuksien arvojen muotoilu",
                    "button": "Muotoilu",
                    "type": {
                        "label": "Tyyppi",
                        "typeFormats": "Arvon tyyppi",
                        "textFormats": "Tekstin muotoilu",
                        "link": "Linkki",
                        "image": "Kuva",
                        "number": "Numero",
                        "phone": "Puhelinnumero"
                    },
                    "options": {
                        "noLabel": "Näytä vain arvo",
                        "skipEmpty": "Älä näytä tyhjää"
                    },
                    "params": {
                        "link": "Näytä linkkinä",
                        "fullUrl": "Näytä koko osoite",
                        "label": "Linkin label"
                    }
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
                    "newStyleName": "Uusi tyyli",
                    "name": "Tyylin nimi",
                    "selectDefault": "Valitse oletustyyli",
                    "deleteStyle": "Poista tyyli",
                    "optionalStyles": "Tyylittely ominaisuuksien mukaan",
                    "optionalStylesFilter": "Valitse tyyliä käyttävät kohteet ominaisuuksien mukaan",
                    "featureStyle": "Tyylimääritykset",
                    "cesium": "3D Tiles/Cesium tyylimääritykset",
                    "mapbox": "Mapbox tyylimääritykset",
                    "edit": {
                        "editor": "Muokkaa editorilla",
                        "json": "Muokkaa JSON"
                    },
                    "add": {
                        "editor": "Lisää editorilla",
                        "json": "Lisää JSON",
                        "mapbox": "Lisää Mapbox JSON",
                        "cesium": "Lisää Cesium JSON"
                    },
                    "validation": {
                        "name": "Täytä nimi tyylille",
                        "noStyles": "Ei tallennettuja tyylejä",
                        "json": "Tyylimääritysten JSON-syntaksi on virheellinen.",
                        "optionalStyles": "Tyylille ei ole sopivaa suodatinta."
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
                "deleteErrorGroupHasSubgroups": "Ryhmä jota yrität poistaa sisältää aliryhmiä. Poista ensin aliryhmät.",
                "errorFetchCoverage": "Palvelusta ei saatu haettua karttatason kattavuusaluetta.",
                "noCoverage": "Karttatason kattavuutta ei ole rajoitettu.",
                "invalidScale": "Tarkista tason mittakaavarajat.",
                "noFeatureProperties": "Kohteiden ominaisuustietoja ei ole saatavilla tasolle."
            },
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
