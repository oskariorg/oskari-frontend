Oskari.registerLocalization({
    "lang": "en",
    "key": "admin-layerselector",
    "value": {
        "title": "admin: Map layers",
        "desc": "",
        "flyout": {
            "title": "admin: Map layers",
            "fetchingLayers" : "Fetching layers."
        },
        "tile": {
            "title": "A: Map layers",
            "tooltip": "."
        },
        "view": {
            "title": "",
            "prompt": "",
            "templates": {}
        },
        "errors": {
            "title": "Error!",
            "generic": "There was an error in the system. Try again later.",
            "loadFailed": "Error loading map layers. Reload the page and choose admin map layers.",
            "noResults": "The search found no results.."
        },
        "loading": "Loading...",
        "filter": {
            "text": "Search map layers",
            "inspire": "By theme",
            "organization": "By data providers",
            "published": "Users"
        },
        "published": {
            "organization": "Published layers",
            "inspire": "Published layer"
        },
        "tooltip": {
            "type-base": "Base",
            "type-wms": "Map layer",
            "type-wfs": "Data product"
        },
        "backendStatus": {
            "OK": {
                "tooltip": "Map layer is currently available.",
                "iconClass": "backendstatus-ok"
            },
            "DOWN": {
                "tooltip": "Map layer is currently not available.",
                "iconClass": "backendstatus-down"
            },
            "MAINTENANCE": {
                "tooltip": "Interruptions in the availability of map levels is expected during the next few days.",
                "iconClass": "backendstatus-maintenance"
            },
            "UNKNOWN": {
                "tooltip": "",
                "iconClass": "backendstatus-ok"
            }
        },
        "admin": {
            "capabilitiesLabel" : "Capabilities",
            "confirmResourceKeyChange" : "For security reasons, changing the values of Map layer unique name or Interface URL will reset the layer permissions and they need to be set again using the Layer rights management tool. Continue?",
            "confirmDeleteLayerGroup" : "You're about to delete the layer group. Continue?",
            "confirmDeleteLayer" : "You're about to delete the layer. Continue?",
            "layertypes" : {
                "wms": "WMS layer",
                "wfs": "WFS layer",
                "wmts": "WMTS layer"
            },
            "selectLayer": "Select layer",
            "selectSubLayer": "Select sublayer",

            "addOrganization": "Add organization",
            "addOrganizationDesc": "Add organization i.e. new content producer",
            "addInspire": "Add class",
            "addInspireDesc": "Add class i.e. a new Inspire theme",
            "addLayer": "Add layer",
            "addLayerDesc": "Add layer into this Inspire theme",
            "edit": "Edit",
            "editDesc": "Edit name",
            "layerType": "Layer type",
            "layerTypeDesc": "Layer type: WMS, WFS, WMTS",
            "type": "Layer type",
            "typePlaceholder": "Choose layer type",
            "baseLayer": "Base layer",
            "groupLayer": "Group layer",
            "interfaceVersion": "Interface version",
            "interfaceVersionDesc": "Interface version",
            "wms1_1_1": "WMS 1.1.1",
            "wms1_3_0": "WMS 1.3.0",
            "getInfo": "Get info",
            "selectClass": "Select class",
            "selectClassDesc": "Select Inspire theme",

            "baseName": "Base layer name",
            "groupName": "Group layer name",
            "subLayers": "Sublayers",
            "addSubLayer": "Add sublayer",
            "editSubLayer": "Edit sublayer",

            "wmsInterfaceAddress": "Interface URL",
            "wmsUrl": "Interface URL or URLs",
            "wmsInterfaceAddressDesc": "A single interface URL or a comma-separated list of interface URLs",
            "wmsServiceMetaId": "Service metadata identification",
            "wmsServiceMetaIdDesc": "Service metadata identification string",
            "layerNameAndDesc": "Name and description of the layer",

            "metaInfoIdDesc": "Metadata id to identify xml description of this metadata",
            "metaInfoId": "Metadata Id",
            "wmsName": "Map layer unique name",
            "wmsNameDesc": "Map layer unique or technical name",

            "addInspireName": "Class name",
            "addInspireNameTitle": "Name of the Inspire class",
            "addOrganizationName": "Organization",
            "addOrganizationNameTitle": "Name of the organization",
            "addNewClass": "Add new class",
            "addNewLayer": "Add new layer",
            "addNewGroupLayer": "Add new group layer",
            "addNewBaseLayer": "Add new base layer",
            "addNewOrganization": "Add new organization",
            "addInspireThemes": "Add class",
            "addInspireThemesDesc": "Add classes (Inspire themes)",
            "opacity": "Opacity",
            "opacityDesc": "Layer opacity (0% will make the layer transparent)",
            "style": "Default style",
            "styleDesc": "Default style",

            "minScale": "Minimum scale",
            "minScaleDesc": "Layer's minimum scale",
            "minScalePlaceholder": "Layer's minimum scale",
            "maxScale": "Maximum scale",
            "maxScaleDesc": "Layer's maximum scale",
            "maxScalePlaceholder": "Layer's maximum scale",
            "srsName": "Coordinate system",
            "srsNamePlaceholder": "Coordinate system",
            "legendImage": "Legend image",
            "legendImageDesc": "URL for legend image",
            "legendImagePlaceholder": "URL for legend image",

            "gfiContent": "Additional content for GFI dialog",
            "gfiResponseType": "GFI response type",
            "gfiResponseTypeDesc": "Response type for Get Feature Info (GFI)",
            "gfiStyle": "GFI style",
            "gfiStyleDesc": "GFI style (XSLT)",

            "matrixSetId" : "WMTS TileMatrixSet id",
            "matrixSetIdDesc" : "WMTS TileMatrixSet identification",
            "matrixSet" : "WMTS layer JSON",
            "matrixSetDesc" : "WMTS layer JSON content",

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

            "interfaceAddress": "interface URL",
            "interfaceAddressDesc": "Interface URL without ?-character and succeeding parameters",
            "viewingRightsRoles": "Viewing Rights roles",
            "metadataReadFailure": "Fetching layer metadata failed.",
            "mandatory_field_missing": "Field is required: ",
            "invalid_field_value": "Invalid value: ",
            "operation_not_permitted_for_layer_id": "Operation not permitted for layer ",
            "no_layer_with_id": "Layer not found with id "
        },
        "cancel": "Cancel",
        "add": "Add",
        "delete": "Remove"
    }
});