import { ROLE_TYPES, PUBLISHED, DEFAULT_PERMISSIONS } from './constants';

export const validateSystemRoles = (systemRoles, roles) => {
    const systemTypes = Object.keys(systemRoles);
    const types = Object.values(ROLE_TYPES);
    if (types.some(type => !systemTypes.includes(type))) {
        throw new Error('System roles is misconfigured');
    }
    const systemNames = Object.values(systemRoles);
    if (systemNames.some(name => !roles.find(r => r.name === name))) {
        throw new Error('Role list does not include all system roles');
    }
};
export const getRolesFromResponse = (response) => {
    const { systemRoles, roles } = response;
    validateSystemRoles(systemRoles, roles);
    const getType = name => Object.keys(systemRoles).find(key => systemRoles[key] === name) || ROLE_TYPES.ADDITIONAL;
    return roles.map(role => ({ ...role, type: getType(role.name) }))
        .sort((a, b) => Oskari.util.naturalSort(a.name, b.name));
};

// TODO: admin-layereditor uses role 'name' and admin-permissions role 'id' as key in permissions object
export const onlyAdmin = (permissions, admin, guest) => {
    const hasAdmin = permissions[admin]?.length > 0 || false;
    const hasOthers = Object.keys(permissions).some(role => {
        if (role === admin) {
            return false;
        }
        const defined = permissions[role];
        if (role === guest && defined.length === 1 && defined[0] === PUBLISHED) {
            // exclude guest view published
            return false;
        }
        return permissions[role]?.length > 0;
    });
    return hasAdmin && !hasOthers;
};

export const getDefaultPermisions = (systemRoles) => {
    const permissions = {};
    Object.keys(systemRoles).forEach(type => {
        const roleName = systemRoles[type];
        permissions[roleName] = [...DEFAULT_PERMISSIONS[type]];
    });
    return permissions;
};
// TODO: admin-layereditor uses role 'name' and admin-permissions role 'id' as key in permissions object
export const hasDefaultPermissions = (systemRoles, permissions) => {
    const defaults = getDefaultPermisions(systemRoles);
    return Object.keys(defaults).every(role => {
        const roles = defaults[role];
        const defined = permissions[role] || [];
        if (roles.length !== defined.length) {
            return false;
        }
        return roles.every(role => defined.includes(role));
    });
};
export const hasDefaultPermissionsByRoleId = (roles, permissions) => {
    return Object.keys(DEFAULT_PERMISSIONS).every(type => {
        const roleId = roles.find(r => r.type === type).id;
        const defaults = DEFAULT_PERMISSIONS[type];
        const defined = permissions[roleId] || [];
        if (defaults.length !== defined.length) {
            return false;
        }
        return defaults.every(p => defined.includes(p));
    });
};

export const viewPublished = (roles, permissions) => {
    const guest = roles.find(r => r.type === ROLE_TYPES.GUEST).id;
    return permissions[guest]?.includes(PUBLISHED) || false;
};
