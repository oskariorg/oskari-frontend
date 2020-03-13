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
                "vectortilelayer": "!!!!Mapbox vektoritiili",
                "tiles3dlayer": "Cesium 3D Tiles",
                "bingmapslayer": "Bing"
            },
            "fields": {
                "url": "Gränssnitten address",
                "version": "Gränss&shy;nittets version",
                "username": "Användarsnamn",
                "password": "Lösenord",
                "name": "Unik namn för kartlager",
                "options": {
                    "apiKey": "Api key",
                    "tileGrid": "Rutmatris"
                },
                "locale": {
                    "generic": {
                        "name": "Namn på {0}",
                        "descplaceholder": "Beskrivning på {0}"
                    },
                    "en": {
                        "lang": "Engelska",
                        "name": "Namn på engelska",
                        "descplaceholder": "Beskrivning på engelska"
                    },
                    "fi": {
                        "lang": "Finska",
                        "name": "Namn på finska",
                        "descplaceholder": "Beskrivning på finska"
                    },
                    "sv": {
                        "lang": "Svenska",
                        "name": "Namn på svenska",
                        "descplaceholder": "Beskrivning på svenska"
                    }
                },
                "opacity": "Opacitet",
                "style": "Förvald utseende",
                "params": {
                    "selectedTime": "Vald tid"
                },
                "realtime": "Realtidslager",
                "refreshRate": "Uppdateringsfrekvens (i sekunder)",
                "scale": "Skala",
                "metadataId": "Metadatans filtagg",
                "gfiContent": "Tilläggande text för GFI-dialog",
                "gfiType": "GFI svartyp",
                "role_permissions": "Permissions",
                "dataProviderId": "Dataprovider",
                "groups": "Maplayer-grupper"
            },
            "editor-tool": "Edit layer",
            "flyout-title": "Layer administration",
            "generalTabTitle": "General",
            "visualizationTabTitle": "Visualization",
            "additionalTabTitle": "Additional",
            "permissionsTabTitle": "Permissions",
            "interfaceVersionDesc": "!!!!Valitse ensisijaisesti uusin rajapinnan tukema versio.",
            "attributions": "Tillskrivningar",
            "usernameAndPassword": "Användarsnamn och lösenord",
            "addLayer": "Lägg till ett nytt kartlager",
            "dataProviderName": "Dataprovider namn",
            "addDataProvider": "Lägg till dataprovider",
            "editDataProvider": "Redigera dataprovider",
            "themeName": "Teman namn",
            "addTheme": "Lägg till tema",
            "editTheme" : "Redigera tema",
            "selectMapLayerGroupsButton": "Välj grupper",
            "cancel": "Tillbaka",
            "close": "Stäng",
            "backToPrevious": "Tillbaka till föregående steg",
            "ok": "Ok",
            "add": "Tillägg",
            "save": "Lagra",
            "skipCapabilities": "Tillägg manuellt",
            "addNewFromSameService": "Lägg till ett nytt lager från samma tjänst",
            "delete": "Ta bort",
            "styleDesc": "Välj en standardstil från listan. Om det finns flera alternativ kan användare välja ett tema i menyn 'Valda lager'.",
            "realtimeDesc": "!!!!Klikkaa valituksi, jos kyseessä on reaaliaikaisesti päivittyvä karttataso. Karttatason virkistystaajuus määritellään sekunteina.",
            "capabilities": {
                "show": "Visa getCapabilities svar",
                "styleDesc": "Stilalternativen hämtas automatiskt från GetCapabilities-svaret.",
                "update": "Hämta nu",
                "updateRate": "Capabilities uppdateringsfrekvens",
                "updateRateDesc": "Uppdateringsfrekvens i sekunder",
                "updatedSuccesfully": "Uppdatering lyckades.",
                "updateFailed": "Uppdatering misslyckades.",
                "updateFailedWithReason": "Uppdatering misslyckades: {reason}"
            },
            "layerStatus": {
                "existing": "Lagret är redan registrerat i tjänsten. Genom att välja det lägger du till samma lager flera gånger.",
                "problematic": "Det förekom problem vid tolkningen av lagrets capabilities dokument. Lagret fungerar kanske inte normalt.",
                "unsupported": "Lagret stöder inte de projektioner, som tjänsten använder. Lagret fungerar kanske inte normalt."
            },
            "metadataIdDesc": "Geodataregistrets metadata filtagg, som unikt identifierar metadatans XML beskrivning",
            "gfiTypeDesc": "Svarets typ dvs Get Feature Info (GFI)",
            "gfiStyle": "GFI stil",
            "gfiStyleDesc": "GFI stil (XSLT)",
            "attributes": "Attribut",
            "clusteringDistance": "Punktavstånd i kluster",
            "legendImage": "URL adress för kartförklaringar",
            "legendImageDesc": "URL adress för kartförklaringar beskriver kartlager.",
            "legendImagePlaceholder": "Ge ett ny adress för kartförklaring.",
            "forcedSRS": "Tvingade SRS",
            "forcedSRSInfo": "Tvångs SRS jämfört med GetCapabilites",
            "supportedSRS": "Stöd SRS",
            "missingSRS": "Saknade SRS",
            "missingSRSInfo": "Denna kartlager stöder inte vissa applikationens standardprojektioner",
            "renderMode": {
                "title": "Innehållstyp",
                "mvt": "Massor av små objekt",
                "geojson": "Stora objekt",
                "info": "Visning av små objekt har optimerats. Detta begränsar skalanivåerna på vilka objekten visas."
            },
            "validation": {
                "mandatoryMsg": "!!!!Mandatory fields missing:",
                "styles" : "Stildefinitioner JSON-syntaxen är ogiltig.",
                "externalStyles" : "Stildefinitioner av tredjeparts JSON-syntaxen är ogiltig.",
                "hover" : "Hover JSON-syntaxen är ogiltig.",
                "attributes" : "Attribut JSON-syntaxen är ogiltig.",
                "attributions" : "Tillskrivningar JSON-syntaxen är ogiltig.",
                "tileGrid" : "Rutmatris JSON-syntaxen är ogiltig."
            },
            "messages": {
                "saveSuccess": "Fel!",
                "saveFailed": "Systemfel. Försök på nytt senare.",
                "confirmDeleteLayer": "Kartlager blir raderad. Fortsätt?",
                "confirmDeleteGroup": "Gruppen kommer att tas bort. Fortsätt?",
                "confirmDuplicatedLayer": "!!!!Taso on jo rekisteröity palveluun. Haluatko varmasti lisätä saman tason moneen kertaan?",
                "errorRemoveLayer": "Kartlager kunde inte tas bort.",
                "errorInsertAllreadyExists": "Kartlager har lagrats men ett kartlager med samma id existeras.",
                "errorFetchUserRolesAndPermissionTypes": "Det gick inte att hämta användarroller och behörigheter.",
                "errorFetchCapabilities": "Det gick inte att hämta gränssnittsinformation.",
                "unauthorizedErrorFetchCapabilities": "Användarnamn och lösenord krävs av tjänsten.",
                "timeoutErrorFetchCapabilities": "Din förfrågan överskred tidsgränsen för anslutning till tjänsten. Kolla gränssnittets URL.",
                "connectionErrorFetchCapabilities": "Anslutning till tjänsten kunde inte etableras. Kolla gränssnittets URL.",
                "parsingErrorFetchCapabilities": "Tjänstens svar kan inte tolkas. Kolla kartlagrets typ och/eller version.",
                "deleteSuccess" : "Utgår",
                "deleteFailed" : "Borttagningen misslyckades"
            },
            "otherLanguages": "Other languages",
            "stylesJSON": "Stildefinitioner (JSON)",
            "externalStylesJSON": "Stildefinitioner av tredjeparts (JSON)",
            "externalStyleFormats": "Stödda format: 3D Tiles, Mapbox",
            "deleteGroupLayers" : "Radera kartlagren i gruppen",
            "hover": "Hover (JSON)",
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
