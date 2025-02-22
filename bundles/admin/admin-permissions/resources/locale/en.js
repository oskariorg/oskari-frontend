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
            "instruction": "Start by selecting a summary or role",
            "unsavedChangesConfirm": "Your unsaved changes will be lost, do you want to continue?",
            "name": "Map Layer",
            "select": {
                "label": "Select",
                "placeholder": "summary or role",
                "summary": "Summaries",
                "permissions": "Permissions of the roles",
                "layer": "Map layers details"
            },
            "summary": {
                "published": "Published",
                "publishedTooltip": "Guest user permission to view the map layer in embedded map.",
                "anonymous": "Guest",
                "user": "Logged in",
                "admin": "Admin",
                "otherRoles": "Additional roles",
                "otherRigthts": "{roles} additional roles have {permissions} permissions",
                "otherTooltip": "Permissions set for roles: {names}",
                "filter": {
                    "adminOnly": "Admin only",
                    "default": "Defaut permissions",
                    "hasOthers": "Additional roles",
                    "systemOnly": "System roles only",
                    'unpublished': "Unpublished"
                }
            },
            "layer": {
                "name": "Name",
                "type": "Type",
                "version": "Version",
                "fi": "Finnish",
                "en": "English",
                "sv": "Swedish",
                "provider": "Source",
                "groups": "Theme",
                "opacity": "Opacity",
                "legend": "Legend",
                "filter": {
                    "localization": "Localization missing",
                    "metadata": "Metadata missing",
                    "legend": "Legend missing",
                    "scale": "Invalid scale"
                }
            }
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
            "type": {
                "system": "System roles",
                "other": "Additional roles"
            },
            "error": {
                "fetch": "Failed to get roles."
            }
        }
    }
});
