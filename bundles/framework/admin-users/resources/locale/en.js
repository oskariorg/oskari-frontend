Oskari.registerLocalization(
{
    "lang": "en",
    "key": "AdminUsers",
    "value": {
        "title": "A: Users",
        "desc": "",
        "tile": {
            "title": "A: Users"
        },
        "flyout": {
            "title": "User management",
            "adminusers": {
                "title": "Users",
                "firstName": "First name",
                "lastName": "Last name",
                "user": "Username",
                "password": "Password",
                "email": "E-mail",
                "rePassword": "Retype password",
                "addRole": "Select role(s)",
                "password_mismatch": "Passwords don't match.",
                "password_too_short": "Password should be at least eight characters long.",
                "passwordRequirements": {
                    "title": "Password requirements: ",
                    "length": "Minimum length:  {length}",
                    "case": "Must include lower and UPPER case characters"
                },
                "form_invalid": "Values are missing or invalid.",
                "field_required": "Field \"{fieldName}\" is required.",
                "confirm_delete": "Are you sure you wish to delete user {user}?",
                "delete_failed": "The user could not be deleted.",
                "fetch_failed": "Users could not be fetched.",
                "save_failed": "User could not be saved.",
                "save_failed_message": "This username is already reserved. Please try a different one.",
                "noMatch": "No results matched",
                "selectRole": "Select role",
                "searchResults": "Search results"
            },
            "adminroles": {
                "title": "Roles",
                "newrole": "Add role:",
                "confirm_delete": "Are you sure you wish to delete role {role}?",
                "delete_failed": "The user could not be deleted.",
                "doSave_failed": "The new role could not be saved.",
                "showUsers": "Show users",
                "roles": {
                    "system": "System roles",
                    "other": "Additional roles"
                }
            },
            "usersByRole": {
                "title": "Users by role",
                "fetchFailed": "Users could not be fetched for the role.",
                "noUsers": "The role doesn't have any users."
            }
        },
        "save": "save",
        "failed_to_get_roles_title": "Failed to get roles",
        "failed_to_get_roles_message": "Failed to get roles (ManageRoles), perhaps oskari-control-admin is not available?"
    }
});
