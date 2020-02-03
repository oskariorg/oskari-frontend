// constant used as 'role' to indicate that permission should be set to or removed from all roles
export const roleAll = 'all';

export const handlePermissionForAllRoles = (checked, permissionsForAllRoles, permission) => {
    // TODO: remove roleAll and just update permission for all roles that are available.
    // TODO: change UI to for example 2 links with all / none
    Object.values(permissionsForAllRoles).forEach(permissionsOfRole => {
        if (checked && !permissionsOfRole.includes(permission)) {
            permissionsOfRole.push(permission);
        } else if (!checked && permissionsOfRole.includes(permission)) {
            permissionsOfRole.splice(
                permissionsOfRole.indexOf(permission), 1);
        }
    });
};

export const handlePermissionForSingleRole = (permissionsForAllRoles, permission, role) => {
    let permissionsOfRole = permissionsForAllRoles[role];
    if (!permissionsOfRole) {
        permissionsOfRole = [];
        permissionsForAllRoles[role] = permissionsOfRole;
    }
    if (permissionsOfRole.includes(permission)) {
        permissionsOfRole.splice(
            permissionsOfRole.indexOf(permission), 1);
    } else {
        permissionsOfRole.push(permission);
    }
};
