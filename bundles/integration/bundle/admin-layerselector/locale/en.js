Oskari.registerLocalization(
{
    "lang": "en",
    "key": "admin-layerselector",
    "value": {
        "title": "Map Layer Administration",
        "desc": "",
        "flyout": {
            "title": "Map Layer Administration",
            "fetchingLayers": "Fetching the map layers."
        },
        "tile": {
            "title": "Map Layer Administration",
            "tooltip": "."
        },
        "view": {
            "title": "",
            "prompt": "",
            "templates": {}
        },
        "errors": {
            "title": "Error!",
            "generic": "A system error occurred. Please try again later.",
            "loadFailed": "An error occurred while loading map layers. Please reload the page and choose map layers again.",
            "noResults": "The search returned no results.",
            "layerTypeNotSupported": "The map layer type is not yet supported:",
            "not_empty": "There are map layers associated to the theme you're trying to remove. Please select another theme for the map layers and try again."
        },
        "loading": "Loading...",
        "filter": {
            "text": "Search map layers",
            "inspire": "By theme",
            "organization": "By data provider",
            "published": "Users"
        },
        "published": {
            "organization": "Published map layer",
            "inspire": "Published map layer"
        },
        "tooltip": {
            "type-base": "Background map",
            "type-wms": "Map layer",
            "type-wfs": "Data product"
        },
        "backendStatus": {
            "OK": {
                "tooltip": "The map layer is currently available.",
                "iconClass": "backendstatus-ok"
            },
            "DOWN": {
                "tooltip": "The map layer is currently not available.",
                "iconClass": "backendstatus-down"
            },
            "MAINTENANCE": {
                "tooltip": "There will be short breaks in the map layer's availability during the next few days.",
                "iconClass": "backendstatus-maintenance"
            },
            "UNKNOWN": {
                "tooltip": "",
                "iconClass": "backendstatus-ok"
            }
        },
        "admin": {
            "capabilitiesLabel": "Capabilities",
            "confirmResourceKeyChange": "You have changed the unique name or  the interface address for this map layer. For security reasons the user rights for this map layer will be removed and you must set them again. Do you want to continue?",
            "confirmDeleteLayerGroup": "This map layer group will be deleted. Do you want to continue?",
            "confirmDeleteLayer": "This map layer will be deleted. Do you want to continue?",
            "layertypes": {
                "wms": "WMS layer",
                "wfs": "WFS layer",
                "wmts": "WMTS layer",
                "arcgis": "ArcGIS layer"
            },
            "selectLayer": "Select a map layer.",
            "selectSubLayer": "Select a sublayer for this map layer.",
            "addOrganization": "Add an organization",
            "addOrganizationDesc": "Add a new data producer / organization.",
            "addInspire": "Add a theme",
            "addInspireDesc": "Add a new INSPIRE theme.",
            "addLayer": "Add a map layer",
            "addLayerDesc": "Add a map layer to this theme.",
            "edit": "Edit",
            "editDesc": "Edit map layer's name.",
            "layerType": "Layer type",
            "layerTypeDesc": "Select a layer type. The current options are WMS (Web Map Service), WFS (Web Feature Service) and WMTS (Web Map Tile Service).",
            "type": "Layer type",
            "typePlaceholder": "Choose layer type",
            "baseLayer": "Background map layer",
            "groupLayer": "Map layer group",
            "interfaceVersion": "Interface version",
            "interfaceVersionDesc": "Interface version",
            "wms1_1_1": "WMS 1.1.1",
            "wms1_3_0": "WMS 1.3.0",
            "getInfo": "Get info",
            "selectClass": "Select a theme",
            "selectClassDesc": "Select a Inspire theme",
            "baseName": "Background layer name",
            "groupName": "Map layer group name",
            "subLayers": "Sublayers",
            "addSubLayer": "Add sublayer",
            "editSubLayer": "Edit sublayer",
            "wmsInterfaceAddress": "Interface URL",
            "wmsUrl": "Interface URL",
            "wmsInterfaceAddressDesc": "Give one or more URL addresses for the interface separated by a comma.",
            "wmsServiceMetaId": "Service metadata identifier",
            "wmsServiceMetaIdDesc": "Give a file identifier for the metadata describing the interface.",
            "layerNameAndDesc": "Layer name and description",
            "metaInfoIdDesc": "The metadata file identifier in the metadata service (Paikkatietohakemisto) to identify the XML file containing metadata.",
            "metaInfoId": "Metadata file identifier",
            "wmsName": "Unique name",
            "wmsNameDesc": "The unique name that identifies the map layer.",
            "username": "User name",
            "password": "Password",
            "addInspireName": "Theme name",
            "addInspireNameTitle": "The name of the Inspire theme.",
            "addOrganizationName": "Organization",
            "addOrganizationNameTitle": "Name of the organization producing the map layer.",
            "addNewClass": "Add a new theme",
            "addNewLayer": "Add a new map layer",
            "addNewGroupLayer": "Add a new map layer group",
            "addNewBaseLayer": "Add a new background map layer",
            "addNewOrganization": "Add a new organization",
            "addInspireTheme": "Add a new theme",
            "addInspireThemeDesc": "Add a new INSPIRE theme.",
            "opacity": "Opacity",
            "opacityDesc": "Define the layer opacity. If the setting is 0%, the layer will be completely transparent.",
            "style": "Default style",
            "styleDesc": "Default style",
            "minScale": "Minimum scale",
            "minScaleDesc": "Minimum scale",
            "minScalePlaceholder": "Minimum scale",
            "maxScale": "Maximum scale",
            "maxScaleDesc": "Maximum scale",
            "maxScalePlaceholder": "Maximum scale",
            "srsName": "Coordinate system",
            "srsNamePlaceholder": "Coordinate system",
            "legendImage": "Map legend URL",
            "legendImageDesc": "The URL address of the map legend describing the map layer.",
            "legendImagePlaceholder": "Give the URL address of the map legend.",
            "gfiContent": "Additional content for \"Get Feature Info\"-dialog.",
            "gfiResponseType": "GFI response type",
            "gfiResponseTypeDesc": "Response type for Get Feature Info (GFI)",
            "gfiStyle": "GFI style (XSLT)",
            "gfiStyleDesc": "GFI style (XSLT)",
            "matrixSetId": "WMTS TileMatrixSet ID",
            "matrixSetIdDesc": "The identifier for WMTS TileMatrixSet",
            "matrixSet": "JSON for WMTS layer",
            "matrixSetDesc": "JSON content for WMTS layer",
            "realtime": "Real time layer",
            "refreshRate": "Refresh rate (in seconds)",
            "generic": {
                "placeholder": "Name in {0}",
                "descplaceholder": "Description in {0}"
            },
            "en": {
                "lang": "English:",
                "title": "En",
                "placeholder": "Name in English",
                "descplaceholder": "Description in English"
            },
            "fi": {
                "lang": "Finnish:",
                "title": "Fi",
                "placeholder": "Name in Finnish",
                "descplaceholder": "Description in Finnish"
            },
            "sv": {
                "lang": "Swedish:",
                "title": "Sv",
                "placeholder": "Name in Swedish",
                "descplaceholder": "Description in Swedish"
            },
            "interfaceAddress": "Interface URL",
            "interfaceAddressDesc": "Give the interface address (URL) without ?-mark and parameters after that.",
            "viewingRightsRoles": "Rights to view for roles",
            "metadataReadFailure": "Fetching layer metadata failed.",
            "mandatory_field_missing": "Field is required:",
            "invalid_field_value": "Invalid value:",
            "operation_not_permitted_for_layer_id": "You don't have privileges to change layer data or add a layer",
            "no_layer_with_id": "The layer doesn't exist."
        },
        "cancel": "Cancel",
        "add": "Add",
        "save": "Save",
        "delete": "Remove"
    }
}
);