export const handlePermissionForAllRoles = (checked, permissionsForAllRoles, permission) => {
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
