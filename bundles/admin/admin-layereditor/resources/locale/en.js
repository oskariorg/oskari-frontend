Oskari.registerLocalization(
    {
        "lang": "en",
        "key": "admin-layereditor",
        "value": {
            "wizard": {
                "type": "Map layer type",
                "service": "Service",
                "layers": "Map layers",
                "typeDescription": "Select the type of the service for layer you are adding",
                "serviceDescription": "Fill in the url and version for the service",
                "layersDescription": "These are the layers that are available in the service. Please select one to add as a map layer",
                "details": "Map layer details"
            },
            "layertype": {
                "wmslayer": "WMS",
                "wmtslayer": "WMTS",
                "wfslayer": "WFS/OAPIF",
                "arcgislayer": "ArcGIS cache",
                "arcgis93layer": "ArcGIS Rest",
                "vectortilelayer": "Mapbox vector tiles",
                "tiles3dlayer": "Cesium 3D Tiles",
                "bingmapslayer": "Bing"
            },
            "editor-tool": "Edit layer",
            "flyout-title": "Layer administration",
            "generalTabTitle": "General",
            "visualizationTabTitle": "Visualization",
            "additionalTabTitle": "Additional",
            "permissionsTabTitle": "Permissions",
            "interfaceAddress": "Interface URL",
            "interfaceVersion": "Interface version",
            "interfaceVersionDesc": "Select an appropriate version. Prioritize the newest version that is supported.",
            "apiKey": "Api key",
            "attributions": "Attributions",
            "tileGrid": "Tile grid",
            "username": "Username",
            "password": "Password",
            "usernameAndPassword": "Username and password",
            "uniqueName": "Unique name",
            "generic": {
                "placeholder": "Name in {0}",
                "descplaceholder": "Description in {0}"
            },
            "en": {
                "lang": "English",
                "placeholder": "Name in English",
                "descplaceholder": "Description in English"
            },
            "fi": {
                "lang": "Finnish",
                "placeholder": "Name in Finnish",
                "descplaceholder": "Description in Finnish"
            },
            "sv": {
                "lang": "Swedish",
                "placeholder": "Name in Swedish",
                "descplaceholder": "Description in Swedish"
            },
            "addLayer": "Add a new map layer",
            "dataProvider": "Dataprovider",
            "addDataProvider": "Add dataprovider",
            "editDataProvider": "Edit dataprovider",
            "dataProviderName": "Dataprovider name",
            "themeName": "Theme name",
            "addTheme": "Add theme",
            "editTheme" : "Edit theme",
            "mapLayerGroups": "Maplayer groups",
            "selectMapLayerGroupsButton": "Select groups",
            "cancel": "Cancel",
            "ok": "Ok",
            "add": "Add",
            "save": "Save",
            "delete": "Remove",
            "style": "Default Style",
            "styleDesc": "Select a default style from the list. If there are several options, users can select a theme in the ‘Selected Layers’ menu.",
            "selectedTime": "Selected time",
            "realtime": "Real time layer",
            "realtimeDesc": "Select, if the map layer is updated in real time. The refresh rate is defined in seconds.",
            "refreshRate": "Refresh rate in seconds",
            "capabilities": {
                "show": "Show GetCapabilities response",
                "styleDesc": "The style options are fetched automatically from the GetCapabilities response.",
                "update": "Update now",
                "updateRate": "Capabilities update rate",
                "updateRateDesc": "Update rate in seconds",
                "updatedSuccesfully": "Capabilities re-check succeeded.",
                "updateFailed": "Capablities re-check failed.",
                "updateFailedWithReason": "Capablities re-check failed: {reason}"
            },
            "opacity": "Opacity",
            "scale": "Scale",
            "metadataIdDesc": "The metadata file identifier is an XML file identifier. It is fetched automatically from the GetCapabilities response.",
            "metadataId": "Metadata file identifier",
            "gfiContent": "Additional GFI info",
            "gfiType": "GFI response type",
            "gfiTypeDesc": "Select a format for Get Feature Information (GFI). Possible formats are fetched automatically from the GetCapabilities response.",
            "gfiStyle": "GFI style (XSLT)",
            "gfiStyleDesc": "Define a style for Get Feature Information (GFI) as XSLT transformation.",
            "attributes": "Attributes",
            "clusteringDistance": "Point distance in cluster",
            "legendImage": "Default legend URL",
            "legendImageDesc": "The URL address for map layer legend is fetched automatically from the GetCapabilities response.",
            "legendImagePlaceholder": "Give the URL address of the map legend.",
            "forcedSRS": "Forced SRS",
            "forcedSRSInfo": "View projections override compared to capabilities",
            "supportedSRS": "Supported SRS",
            "missingSRS": "Missing SRS",
            "missingSRSInfo": "App default view projections not supported by layer",
            "renderMode": {
                "title": "Collection type",
                "mvt": "Lots of small objects",
                "geojson": "Big objects",
                "info": "Viewing of small objects has been optimized. This restricts the scale on which the objects are viewed."
            },
            "validation": {
                "styles" : "Invalid JSON syntax in Style definitions.",
                "externalStyles" : "Invalid JSON syntax in 3rd party style definitions.",
                "hover" : "Invalid JSON syntax in Feature highlighting and tooltip.",
                "attributes" : "Invalid Attribute JSON syntax.",
                "attributions" : "Invalid Attributions JSON syntax.",
                "tileGrid" : "Invalid Tile grid JSON syntax."
            },
            "messages": {
                "saveSuccess": "Saved",
                "saveFailed": "A system error occurred. Data has not been updated.",
                "confirmDeleteLayer": "The map layer will be removed. Do you want to continue?",
                "confirmDeleteGroup": "The group will be removed. Do you want to continue?",
                "errorRemoveLayer": "The map layer could not be removed.",
                "errorInsertAllreadyExists": "The new map layer has been added. A map layer with same identifier already exists.",
                "errorFetchUserRolesAndPermissionTypes": "Error occured when fetching user roles and permission types.",
                "errorFetchCapabilities": "Fetching service capabilities failed.",
                "unauthorizedErrorFetchCapabilities": "Username and password are required by the service.",
                "deleteSuccess" : "Deleted",
                "deleteFailed" : "Delete failed"
            },
            "otherLanguages": "Other languages",
            "stylesJSON": "Style definitions (JSON)",
            "externalStylesJSON": "3rd party style definitions (JSON)",
            "externalStyleFormats": "Supported formats: 3D Tiles, Mapbox",
            "deleteGroupLayers" : "Delete the map layers in the group",
            "hover": "Feature highlighting and tooltip (JSON)",
            "ion": {
                "title": "Cesium ion",
                "assetId": "Asset ID",
                "assetServer": "Asset Server",
                "accessToken": "Access Token"
            },
            "rights": {
                "PUBLISH": "Publish",
                "VIEW_LAYER": "View",
                "DOWNLOAD": "Download",
                "VIEW_PUBLISHED": "View in Embedded map",
                "role": "Role"
            }
        }
    }
);
