Oskari.registerLocalization(
    {
        "lang": "sv",
        "key": "admin-layereditor",
        "value": {
            "wizard": {
                "type": "Kartlagrets typ",
                "service": "Gränssnitt",
                "layers": "Kartlager",
                "typeDescription": "Välj vilken typ av gränssnitt du vill lägga till",
                "serviceDescription": "Ange adress och versionnummer för gränssnittet du vill lägga till",
                "layersDescription": "Från lagren i gränssnittet väljer du det du vill lägga till som kartlager",
                "details": "Uppgifter om kartlagret"
            },
            "layertype": {
                "wmslayer": "WMS",
                "wmtslayer": "WMTS",
                "wfslayer": "WFS/OAPIF",
                "arcgislayer": "ArcGIS cache",
                "arcgis93layer": "ArcGIS Rest",
                "vectortilelayer": "Mapbox vector tiles format",
                "tiles3dlayer": "Cesium 3D Tiles",
                "bingmapslayer": "Bing"
            },
            "fields": {
                "url": "Gränssnittets adress",
                "version": "Gränssnittets version",
                "username": "Användarnamn",
                "password": "Lösenord",
                "name": "Unikt namn för kartlager",
                "options": {
                    "apiKey": "Api key",
                    "tileGrid": "Rutmatris"
                },
                "locale": {
                    "name": "Namn",
                    "description": "Beskrivning"
                },
                "opacity": "Opacitet",
                "params": {
                    "selectedTime": "Vald tid"
                },
                "singleTile": "Single Tile",
                "realtime": "Realtidslager",
                "refreshRate": "Uppdateringsfrekvens (i sekunder)",
                "scale": "Skala",
                "coverage":"Visa kartlagrets täckningsområde på kartan",
                "declutter": "Rita objektnamn separat (declutter).",
                "gfiContent": "Tilläggande text för GFI-dialog",
                "gfiType": "GFI svartyp",
                "role_permissions": "Rättigheter",
                "dataProviderId": "Dataproducent",
                "groups": "Grupp av kartlager",
                "updated": "Detta kartlager var sist uppdaterad",
                "created": "Detta kartlager skapades den",
                "layerId": "Kartlagrets unika kännetecken"
            },
            "editor-tool": "Editera kartlager",
            "flyout-title": "Administrering av kartlager",
            "fieldNoRestriction": "Ingen begränsning",
            "generalTabTitle": "Allmän",
            "visualizationTabTitle": "Visualisering",
            "additionalTabTitle": "Ytterligare",
            "permissionsTabTitle": "Rättigheter",
            "interfaceVersionDesc": "Välj primärt den nyaste versionen som stöds av gränssnittet.",
            "attributions": "Tillskrivningar",
            "usernameAndPassword": "Användarnamn och lösenord",
            "addLayer": "Lägg till ett nytt kartlager",
            "dataProviderName": "Dataproducent namn",
            "addDataProvider": "Lägg till dataproducent",
            "editDataProvider": "Redigera dataproducent",
            "themeName": "Teman namn",
            "addTheme": "Lägg till tema",
            "editTheme": "Redigera tema",
            "addSubtheme": "Lägg undertema",
            "editSubtheme": "Redigera undertema",
            "selectMapLayerGroupsButton": "Välj grupp",
            "cancel": "Tillbaka",
            "close": "Stäng",
            "backToPrevious": "Tillbaka till föregående steg",
            "ok": "Ok",
            "add": "Tillägg",
            "save": "Lagra",
            "skipCapabilities": "Tillägg manuellt",
            "addNewFromSameService": "Lägg till ett nytt lager från samma tjänst",
            "delete": "Ta bort",
            "realtimeDesc": "Klicka för att välja, om det är fråga om ett kartlager, som uppdateras i realtid. Kartlagrets uppfriskningsfrekvens definieras i sekunder.",
            "singleTileDesc": "Då du väljer Single Tile ber tjänsten om data för hela området i stället för en kartruta i taget",
            "serviceNotAvailable": "ej tillgänglig",
            "metadata": {
                "title": "Metadatans filtagg",
                "desc": "Geodataregistrets metadata filtagg, som unikt identifierar metadatans XML beskrivning",
                "service": "Definierad i tjänsten",
                "overridden": "Filtagg för metadatans"
            },
            "capabilities": {
                "parsed": "Utvald information från kartlagrets capabilities",
                "show": "Visa getCapabilities svar",
                "update": "Hämta nu",
                "updateRate": "Capabilities uppdateringsfrekvens",
                "updateRateDesc": "Uppdateringsfrekvens i sekunder",
                "updatedSuccesfully": "Uppdatering lyckades.",
                "updateFailed": "Uppdatering misslyckades.",
                "updateFailedWithReason": "Uppdatering misslyckades: {reason}",
                "rasterStyle" : {
                    "defaultStyle" : "Den valda standardstilen finns inte längre i tjänsten. Vänligen välj en ny standardstil.",
                    "additionalLegend": "För kartlagret finns en teckenförklaring utan giltig stil. Vänligen uppdatera förklaringen. Den icke fungerande stilen är markerad med ( ! ) ",
                    "globalWithStyles": "Till kartlagret har endast en standard teckenförklaring fastställts, men det finns ytterliga stilar med förklaringar tillgängliga på gränssnittet. Du kan ta bort standardvalet för att kunna utnyttja dessa."
                }
            },
            "styles": {
                "default": "Förvald utseende",
                "desc": "Välj en standardstil från listan. Om det finns flera alternativ kan användare välja ett tema i menyn 'Valda lager'.",
                "raster": {
                    "title": "Stilar och kartförklaringar",
                    "styleDesc": "Stilalternativen hämtas automatiskt från GetCapabilities-svaret.",
                    "unavailable": "I tjänsten definierad stil: ej tillgänglig",
                    "legendImage": "Generella kartförklaringar",
                    "serviceLegend": "I tjänsten definierad kartförklaring",
                    "overriddenLegend": "Adress för kartförklaring",
                    "overrideTooltip": "URL adress för kartförklaringar som ersätter kartförklaringar definierad i tjänsten"
                },
                "vector": {
                    "addStyle": "Tillsätt stil",
                    "name": "Stilnamn",
                    "selectDefault": "Välj förvalt stil",
                    "deleteStyle": "Ta bort stilen",
                    "validation": {
                        "name": "Fyll i namnet på stilen",
                        "noStyles": "Inga sparade stilar"
                    }
                }
            },
            "layerStatus": {
                "unsupportedType": "Admin-funktionaliteten stöder inte denna lagertyp",
                "existing": "Lagret är redan registrerat i tjänsten. Genom att välja det lägger du till samma lager flera gånger.",
                "problematic": "Det förekom problem vid tolkningen av lagrets capabilities dokument. Lagret fungerar kanske inte normalt.",
                "unsupported": "Lagret stöder inte de projektioner, som tjänsten använder. Lagret fungerar kanske inte normalt."
            },
            "gfiTypeDesc": "Svarets typ dvs Get Feature Info (GFI)",
            "gfiStyle": "GFI stil",
            "gfiStyleDesc": "GFI stil (XSLT)",
            "attributes": "Attribut",
            "clusteringDistance": "Punktavstånd i kluster",
            "forcedSRS": "Tvingade SRS",
            "forcedSRSInfo": "Tvångs SRS jämfört med GetCapabilites",
            "supportedSRS": "Stödda SRS",
            "missingSRS": "Felande SRS",
            "missingSRSInfo": "Detta kartlager stöder inte vissa applikationens standardprojektioner",
            "renderMode": {
                "title": "Innehållstyp",
                "mvt": "Massor av små objekt",
                "geojson": "Stora objekt",
                "info": "Visning av små objekt har optimerats. Detta begränsar skalanivåerna på vilka objekten visas."
            },
            "timeSeries": {
                "metadataLayer": "Metadatalager",
                "metadataAttribute": "Metadata tidsattribut",
                "metadataToggleLevel": "Zoomnivåer där vektorformaten är aktiverat",
                "metadataVisualize": "Metadatalager synlighet ",
                "noToggle": "Inget val",
                "ui": "Tidsserie användargränssnitt",
                "player": "Animering",
                "range": "Tidsserie",
                "none": "Inget val",
                "tooltip": {
                    "player": "Tidsserien visas animerad en bild på gång.",
                    "range": "Välj tidsserie-kartlagrets intervall med att justera tidslinjen. Metadata kan tilläggas för att visa ytterligare information på tidslinjen. Funktionen tillämpar sig för visning av tid- och platsvis spridda datamängder.",
                    "none": "Endast standardbildet visas av WMS kartlagret.",
                },
                "selectMetadataLayer": "Välj metadatalager"
            },
            "validation": {
                "mandatoryMsg": "Obligatorisk information saknas:",
                "styles": "Stildefinitioner JSON-syntaxen är ogiltig.",
                "externalStyles": "Stildefinitioner av tredjeparts JSON-syntaxen är ogiltig.",
                "hover": "Hover JSON-syntaxen är ogiltig.",
                "attributes": "Attribut JSON-syntaxen är ogiltig.",
                "attributions": "Tillskrivningar JSON-syntaxen är ogiltig.",
                "tileGrid": "Rutmatris JSON-syntaxen är ogiltig."
            },
            "messages": {
                "saveSuccess": "Sparad",
                "saveFailed": "Systemfel. Försök på nytt senare.",
                "confirmDeleteLayer": "Kartlager blir raderad. Fortsätt?",
                "confirmDeleteGroup": "Gruppen kommer att tas bort. Fortsätt?",
                "confirmDuplicatedLayer": "Kartlagret är redan registrerat i tjänsten. Är du säker på du vill lägga till lagret?",
                "errorRemoveLayer": "Kartlager kunde inte tas bort.",
                "errorInsertAllreadyExists": "Kartlager har lagrats men ett kartlager med samma id existeras.",
                "errorFetchUserRolesAndPermissionTypes": "Det gick inte att hämta användarroller och behörigheter.",
                "errorFetchCapabilities": "Det gick inte att hämta gränssnittsinformation.",
                "unauthorizedErrorFetchCapabilities": "Användarnamn och lösenord krävs av tjänsten.",
                "timeoutErrorFetchCapabilities": "Din förfrågan överskred tidsgränsen för anslutning till tjänsten. Kolla gränssnittets URL.",
                "connectionErrorFetchCapabilities": "Anslutning till tjänsten kunde inte etableras. Kolla gränssnittets URL.",
                "parsingErrorFetchCapabilities": "Tjänstens svar kan inte tolkas. Kolla kartlagrets typ och/eller version.",
                "deleteSuccess": "Utgår",
                "deleteFailed": "Borttagningen misslyckades",
                "updateCapabilitiesFail": "Gränssnittet returnerar ingen data. Kartlagrets adress, typ eller version kan vara felaktig eller gränssnittstjänsten är för tilfället ur funktion.",
                "errorFetchLayerFailed": "Kartlagret returnerar ingen data. Kartlagret existerar möjligen inte längre eller du har inte rättigheter att använda det.",
                "errorFetchLayerEnduserFailed": "Listan över kartlagren kan inte uppdateras, eftersom kartlagret inte returnerar någon data. Du kom väl ihåg att uppdatera rättigheterna som tillhör din användarroll?",
                "deleteErrorGroupHasSubgroups": "Gruppen du försöker ta bort innehåller undergrupper. Ta bort undergrupperna först.",
                "errorFetchCoverage": "Kan inte hämtas kartlagrets täckningsområde från tjänsten.",
                "noCoverage": "Kartlagrets täckningsområde är inte begränsat."
            },
            "stylesJSON": "Stildefinitioner (JSON)",
            "externalStylesJSON": "Stildefinitioner av tredjeparts (JSON)",
            "externalStyleFormats": "Stödda format: 3D Tiles, Mapbox",
            "dynamicScreenSpaceErrorOptions": "Dynamic screen space error options",
            "dynamicScreenSpaceError": "Dynamic screen space error",
            "dynamicScreenSpaceErrorDensity": "Dynamic screen space error density",
            "dynamicScreenSpaceErrorFactor": "Dynamic screen space error factor",
            "dynamicScreenSpaceErrorHeightFalloff": "Dynamic screen space error height falloff",
            "maximumScreenSpaceError": "Maximum screen space error",
            "deleteGroupLayers": "Radera kartlagren i gruppen",
            "hover": "Framhävning av objekt och tooltip (JSON)",
            "ion": {
                "title": "Cesium ion",
                "assetId": "Asset ID",
                "assetServer": "Asset Server",
                "accessToken": "Access Token"
            },
            "rights": {
                "PUBLISH": "rätt att publicera",
                "VIEW_LAYER": "rätt att visa",
                "DOWNLOAD": "rätt att ladda ner",
                "VIEW_PUBLISHED": "rätt att visa en publicerat vy",
                "role": "Roll"
            }
        }
    }
);
