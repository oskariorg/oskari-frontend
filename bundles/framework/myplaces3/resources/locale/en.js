Oskari.registerLocalization(
{
    "lang": "en",
    "key": "MyPlaces3",
    "value": {
        "title": "Places",
        "desc": "",
        "guest": {
            "loginShort": "Log in to add your own places on a map."
        },
        "tab": {
            "title": "Places",
            "categoryTitle": "Map layer",
            "nocategories": "You do not have any saved places yet.", // PersonalData removal
            "maxFeaturesExceeded": "You have too many own places. Please remove some places.", // PersonalData removal
            "publishCategory": {
                "privateTooltip": "This map layer is private. Click here to publish it.",
                "publicTooltip": "This map layer is public. Click here to unpublish it."
            },
            "export": {
                "title":"Export features",
                "tooltip": "Download layer features in GeoJSON-format."
            },
            "addCategoryFormButton": "New map layer", // PersonalData removal
            "addCategory": "Add map layer",
            "editCategory": "Edit map layer",
            "deleteCategory": "Delete map layer",
            "deleteDefault": "The default map layer cannot be deleted.",
            "grid": {
                "name": "Place name",
                "desc": "Place description",
                "createDate": "Created",
                "updateDate": "Updated",
                "measurement": "Size",
                "edit": "Edit",
                "delete": "Delete",
                "actions": "Actions"
            },
            "confirm": {
                "deleteCategory": "Do you want to delete the map layer \"{name}\"?",
                "deleteCategoryWithMove": "You are deleting the map layer \"{name}\". There {count, plural, one {is # place} other {are # places}} on the map layer. Do you want to: <br/> 1. delete the map layer and its {count, plural, one {place} other {places}} <br/> 2. move the {count, plural, one {place} other {places}} to the map layer \"{moveTo}\" before deleting the map layer?",
                "categoryToPrivate": "You are unpublishing the map layer {name}. After that the map layer cannot be shared in public and embedded in another map service. Also other users cannot view the map layer anymore.",
                "categoryToPublic": "You are publishing the map layer {name}. After that the map layer can be shared in public and embedded in another map service. Also other users can view the map layer.",
                "deletePlace": "Do you want to delete place \"{name}\"?"
            }
        },
        "tools": {
            "point": {
                "title": "Add Point",
                "tooltip": "Draw a point and add it to your own places. There can be several points in one feature.",
                "add": "Draw a point by clicking the map.",
                "next": "You can draw several points in one feature.",
                "edit": "You can move points to another location by clicking them with a mouse."
            },
            "line": {
                "title": "Add Line to Own Places",
                "tooltip": "Draw a line and add it to your own places.",
                "add": "Draw a line to the map. Click breaking points. Finally double-click an ending point and click \"Save My Place\".",
                "next": "You can move breaking points to another location by clicking them with a mouse.",
                "edit": "You can move breaking points to another location by clicking them with a mouse.",
                "noResult": "0 m"
            },
            "area": {
                "title": "Add Area to Own Places",
                "tooltip": "Draw an area and add it to your own places.",
                "add": "Draw an area to the map. Click breaking points. Finally double-click an ending point and click \"Save My Place\".",
                "next": "You can draw several areas in one feature.",
                "edit": "You can move breaking points to another location by clicking them with a mouse.",
                "noResult": "0 m²"
            }
        },
        "buttons": {
            "savePlace": "Save My Place",
            "movePlaces": "Move places and delete",
            "deleteCategoryAndPlaces": "Delete with places",
            "changeToPublic": "Publish",
            "changeToPrivate": "Unpublish"
        },
        "placeform": {
            "title": "Place data",
            "tooltip": "Save the feature as your own place. Please give at least a name and a description. Finally select a map layer where the feature will be saved or create a new map layer. Later you can find your own places in the My Data menu.",
            "previewLabel": "Image preview",
            "fields": {
                "name": "Place name",
                "description": "Place description",
                "attentionText": "Text visible on map",
                "link": "Link to additional information",
                "imagelink": "Link to feature image"
            },
            "category": {
                "label": "Map layer",
                "newLayer": "Create new layer",
                "choose": "Select layer for the place:"
            },
            "validation": {
                "mandatoryName": "A place name is missing",
                "invalidName": "The place name contains illegal characters",
                "invalidDesc": "The place description contains illegal characters",
            }
        },
        "categoryform": {
            "title": "Map layer details",
            "layerName": "Map layer name",
            "styleTitle": "Styling",
            "validation": {
                "mandatoryName": "A map layer name is missing",
                "invalidName": "The map layer name contains illegal characters"
            }
        },
        "notification": {
            "place": {
                "saved": "The place has been saved.",
                "deleted": "The place has been deleted.",
                "info": "You can find the place in the menu \"My data\"."
            },
            "category": {
                "saved": "The map layer has been saved.",
                "updated": "The map layer has been updated.",
                "deleted": "The map layer has been deleted."
            }
        },
        "error": {
            "generic": "A system error occurred.",
            "saveCategory": "The map layer could not be saved.",
            "deleteCategory": "The map layer could not be deleted.",
            "savePlace": "The place could not be saved.",
            "deletePlace": "The place could not be deleted. Please try gain later."
        }
    }
});
