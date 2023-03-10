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
            "fields": {
                "url": "Interface URL",
                "version": "Interface version",
                "username": "Username",
                "password": "Password",
                "name": "Unique name",
                "options": {
                    "apiKey": "Api key",
                    "tileGrid": "Tile grid"
                },
                "locale": {
                    "name": "Name",
                    "description": "Description"
                },
                "opacity": "Opacity",
                "params": {
                    "selectedTime": "Selected time"
                },
                "singleTile": "Single Tile",
                "realtime": "Real time layer",
                "refreshRate": "Refresh rate in seconds",
                "scale": "Scale",
                "coverage":"Show map layer coverage on the map",
                "declutter": "Draw object names separately (declutter).",
                "gfiContent": "Additional GFI info",
                "gfiType": "GFI response type",
                "role_permissions": "Permissions",
                "dataProviderId": "Dataprovider",
                "groups": "Maplayer groups",
                "updated": "This layer was last edited on",
                "created": "This layer was created on",
                "layerId": "Layers unique identifier"
            },
            "editor-tool": "Edit layer",
            "flyout-title": "Layer administration",
            "fieldNoRestriction": "No restriction",
            "generalTabTitle": "General",
            "visualizationTabTitle": "Visualization",
            "additionalTabTitle": "Additional",
            "permissionsTabTitle": "Permissions",
            "interfaceVersionDesc": "Select an appropriate version. Prioritize the newest version that is supported.",
            "attributions": "Attributions",
            "usernameAndPassword": "Username and password",
            "addLayer": "Add a new map layer",
            "dataProviderName": "Dataprovider name",
            "addDataProvider": "Add dataprovider",
            "editDataProvider": "Edit dataprovider",
            "themeName": "Theme name",
            "addTheme": "Add theme",
            "editTheme": "Edit theme",
            "addSubtheme": "Add subtheme",
            "editSubtheme": "Edit subtheme",
            "selectMapLayerGroupsButton": "Select groups",
            "cancel": "Cancel",
            "close": "Close",
            "backToPrevious": "Back to previous step",
            "ok": "Ok",
            "add": "Add",
            "save": "Save",
            "skipCapabilities": "Add manually",
            "addNewFromSameService": "Add a new layer from same service",
            "delete": "Remove",
            "realtimeDesc": "Select, if the map layer is updated in real time. The refresh rate is defined in seconds.",
            "singleTileDesc": "Single Tile -setting controls whether the GetMap-requests are sent to the service tiled or as a single tile for the whole view.",
            "serviceNotAvailable": "not available",
            "metadata": {
                "title": "Metadata file identifier",
                "desc": "The metadata file identifier is an XML file identifier. It is fetched automatically from the GetCapabilities response.",
                "service": "File identifier defined in the service",
                "overridden": "Replaced file identifier"
            },
            "capabilities": {
                "parsed": "Capabilities parsed for layer",
                "show": "Show GetCapabilities response",
                "update": "Update now",
                "updateRate": "Capabilities update rate",
                "updateRateDesc": "Update rate in seconds",
                "updatedSuccesfully": "Capabilities re-check succeeded.",
                "updateFailed": "Capablities re-check failed.",
                "updateFailedWithReason": "Capablities re-check failed: {reason}",
                "validate": "Layer definitions doesn't respond to service's capabilities",
                "rasterStyle" : {
                    "defaultStyle" : "Selected default style doesn't exist anymore. Please select a new default style.",
                    "additionalLegend": "The map layer has been given a legend that overrides the default legend provided by the service. The overriding legend was linked to a style that is no longer available. Please update the layer legend. The problematic style is marked with a ( ! ).",
                    "globalWithStyles": "The layer has more than one style available in the service. However, the layer has been defined with a single default legend. Consider removing the current default legend to be able to use the style based legends."
                }
            },
            "styles": {
                "default": "Default style",
                "desc": "Select a default style from the list. If there are several options, users can select a theme in the ‘Selected Layers’ menu.",
                "raster": {
                    "title": "Styles and map legends",
                    "styleDesc": "The style options are fetched automatically from the GetCapabilities response.",
                    "unavailable": "Style defined in the service: not available",
                    "legendImage": "Default legend",
                    "serviceLegend": "Map legend defined in the service",
                    "overriddenLegend": "Replaced legend URL",
                    "overrideTooltip": "The URL address of the map legend which overrides the legend defined in the service"
                },
                "vector": {
                    "newStyleName": "New style",
                    "name": "Style name",
                    "selectDefault": "Select default style",
                    "deleteStyle": "Delete style",
                    "edit": {
                        "editor": "Edit by using editor",
                        "json": "Edit JSON"
                    },
                    "add": {
                        "editor": "Add by using editor",
                        "json": "Add JSON",
                        "mapbox": "Add Mapbox JSON",
                        "cesium": "Add Cesium JSON"
                    } ,
                    "validation": {
                        "name": "Please enter a name for the style",
                        "noStyles": "No saved styles",
                        "json": "Invalid JSON syntax in Style definitions."
                    },
                    "json": {
                        "featureStyle": "Style definitions (JSON)",
                        "optionalStyles": "Property based style definitions (JSON)",
                        "cesium": "3D Tiles/Cesium style definitions (JSON)",
                        "mapbox": "Mapbox style definitions (JSON)"
                    }
                }
            },
            "layerStatus": {
                "unsupportedType": "Admin functionality doesn't support the layer type",
                "existing": "The map layer is already registered to this service. By selecting this you will be adding a duplicate layer.",
                "problematic": "There were some issues parsing the capabilities for this layer. This layer might not work properly if added.",
                "unsupported": "According to capabilities this layer doesn't support projections used on this service. This layer might not work properly if added."
            },
            "gfiTypeDesc": "Select a format for Get Feature Information (GFI). Possible formats are fetched automatically from the GetCapabilities response.",
            "gfiStyle": "GFI style (XSLT)",
            "gfiStyleDesc": "Define a style for Get Feature Information (GFI) as XSLT transformation.",
            "attributes": "Attributes",
            "clusteringDistance": "Point distance in cluster",
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
            "timeSeries": {
                "metadataLayer": "Metadata layer",
                "metadataAttribute": "Timeline attribute",
                "metadataToggleLevel": "Zoom levels at which metadata layer will be active",
                "metadataVisualize": "Metadata layer visibility",
                "noToggle": "No toggle",
                "ui": "Time series UI",
                "player": "Player/animation",
                "range": "Date and range",
                "none": "None selected",
                "tooltip": {
                    "player": "Time series data can be viewed in an animation.",
                    "range": "Single date or date range can be selected on a slider. Metadata can be added to tell which dates have data. Suitable for data scattered in time and space.",
                    "none": "The WMS will show only the default image in map view.",
                },
                "selectMetadataLayer": "Select metadata layer"
            },
            "validation": {
                "mandatoryMsg": "Mandatory fields missing:",
                "hover": "Invalid JSON syntax in Feature highlighting and tooltip.",
                "attributes": "Invalid Attribute JSON syntax.",
                "attributions": "Invalid Attributions JSON syntax.",
                "tileGrid": "Invalid Tile grid JSON syntax."
            },
            "messages": {
                "saveSuccess": "Saved",
                "saveFailed": "A system error occurred. Data has not been updated.",
                "confirmDeleteLayer": "The map layer will be removed. Do you want to continue?",
                "confirmDeleteGroup": "The group will be removed. Do you want to continue?",
                "confirmDuplicatedLayer": "The map layer has been registered previously. Are you sure you want to duplicate it?",
                "errorRemoveLayer": "The map layer could not be removed.",
                "errorInsertAllreadyExists": "The new map layer has been added. A map layer with same identifier already exists.",
                "errorFetchUserRolesAndPermissionTypes": "Error occured when fetching user roles and permission types.",
                "errorFetchCapabilities": "Fetching service capabilities failed.",
                "unauthorizedErrorFetchCapabilities": "Username and password are required by the service.",
                "timeoutErrorFetchCapabilities": "Request timed out before getting response from service. Check the interface URL.",
                "connectionErrorFetchCapabilities": "Connection could not be established to the service. Check the interface URL.",
                "parsingErrorFetchCapabilities": "The response from the service didn't match the requested standard. Check the map layer type and/or version.",
                "deleteSuccess": "Deleted",
                "deleteFailed": "Delete failed",
                "updateCapabilitiesFail": "Fetching service capabilities failed. Interface URL, type or version could be wrong or the service is currently down.",
                "errorFetchLayerFailed": "Fetching layer details failed. The layer might have been removed or you don't have permission for the layer.",
                "errorFetchLayerEnduserFailed": "Fetching layer details for the layer listing failed. Did you add 'View' permission for a role that you have?",
                "deleteErrorGroupHasSubgroups": "The group you are trying to remove contains subgroups. Delete the subgroups first.",
                "errorFetchCoverage": "Failed to get the map layer coverage from the service.",
                "noCoverage": "The map layer coverage isn't restricted."
            },
            "dynamicScreenSpaceErrorOptions": "Dynamic screen space error options",
            "dynamicScreenSpaceError": "Dynamic screen space error",
            "dynamicScreenSpaceErrorDensity": "Dynamic screen space error density",
            "dynamicScreenSpaceErrorFactor": "Dynamic screen space error factor",
            "dynamicScreenSpaceErrorHeightFalloff": "Dynamic screen space error height falloff",
            "maximumScreenSpaceError": "Maximum screen space error",
            "deleteGroupLayers": "Delete the map layers in the group",
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
