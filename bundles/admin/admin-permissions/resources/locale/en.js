Oskari.registerLocalization(
{
    "lang": "en",
    "key": "admin-permissions",
    "value": {
        "title": "Map Layer Permissions",
        "desc": "",
        "tile": {
            "title": "Map Layer Permissions"
        },
        "flyout": {
            "title": "Map Layer Permissions Management",
            "instruction": "Start by selecting a role",
            "unsavedChangesConfirm": "Your unsaved changes will be lost, do you want to continue?",
            "name": "Map Layer"
        },
        "permissions": {
            "type": {
                "PUBLISH": "Publish",
                "VIEW_LAYER": "View",
                "DOWNLOAD": "Download",
                "VIEW_PUBLISHED": "View in Embedded map"
            },
            "success": {
                "save": "Map layer permissions have been updated."
            },
            "error": {
                "fetch": "Failed to get map layer permissions",
                "save": "Map layer permissions could not been updated."
            }
        },
        "roles": {
            "title": "Role",
            "placeholder": "Select role",
            "types": {
                "system": "System roles",
                "other": "Additional roles"
            },
            "error": {
                "fetch": "Failed to get roles."
            }
        }
    }
});
