import { ROLE_TYPES, PUBLISHED, DEFAULT_PERMISSIONS, ADDITIONAL_ROLE_TYPE } from './constants';

/* --- ROLES--- */
export const validateSystemRoles = (systemRoles, roles) => {
    const systemTypes = Object.keys(systemRoles);
    if (Object.values(ROLE_TYPES).some(type => !systemTypes.includes(type))) {
        throw new Error('System roles is misconfigured');
    }
    const systemNames = Object.values(systemRoles);
    if (systemNames.some(name => !roles.find(r => r.name === name))) {
        throw new Error('Role list does not include all system roles');
    }
};

// admin-layereditor uses role 'name' and admin-permissions role 'id' as key in permissions object
// store getter to roles for easier permissions handling
export const getRolesFromResponse = ({ systemRoles = {}, roles, rolelist }, permissionsKey = 'id') => {
    const list = rolelist || roles || [];
    validateSystemRoles(systemRoles, list);

    return list.map(role => {
        const type = Object.keys(systemRoles).find(key => systemRoles[key] === role.name) || ADDITIONAL_ROLE_TYPE;
        // convert to string (used for object keys comparison and get permissons for role)
        const getPermissionsKey = () => role[permissionsKey].toString();
        return { ...role, type, isSystem: type !== ADDITIONAL_ROLE_TYPE, getPermissionsKey };
    })
        .sort((a, b) => Oskari.util.naturalSort(a.name, b.name))
        .sort((a, b) => {
            if (a.isSystem === b.isSystem) return 0;
            return a.isSystem ? -1 : 1;
        });
};

export const getRolesByTypeFromResponse = (response) => {
    const roles = getRolesFromResponse(response);
    const additional = roles.filter(role => role.type === ADDITIONAL_ROLE_TYPE);
    const system = roles.filter(role => role.type !== ADDITIONAL_ROLE_TYPE);
    return { additional, system };
};

/* --- PERMISSIONS used with getRolesFromResponse mapped and validated roles --- */
export const onlyAdmin = (roles, permissions) => {
    const adminKey = roles.find(r => r.type === ROLE_TYPES.ADMIN).getPermissionsKey();
    const guestKey = roles.find(r => r.type === ROLE_TYPES.GUEST).getPermissionsKey();
    const hasAdmin = permissions[adminKey]?.length > 0 || false;
    const hasOthers = Object.keys(permissions).some(key => {
        if (key === adminKey) {
            return false;
        }
        const defined = permissions[key];
        if (key === guestKey && defined.length === 1 && defined[0] === PUBLISHED) {
            // exclude guest view published
            return false;
        }
        return permissions[key]?.length > 0;
    });
    return hasAdmin && !hasOthers;
};

export const getDefaultPermisions = (roles) => {
    return roles
        .filter(role => role.isSystem)
        .reduce((permissions, role) => {
            const key = role.getPermissionsKey();
            permissions[key] = [...DEFAULT_PERMISSIONS[role.type]];
            return permissions;
        }, {});
};
export const hasDefaultPermissions = (roles, permissions) => {
    const defaults = getDefaultPermisions(roles);
    return Object.keys(defaults).every(role => {
        const roles = defaults[role];
        const defined = permissions[role] || [];
        if (roles.length !== defined.length) {
            return false;
        }
        return roles.every(role => defined.includes(role));
    });
};

export const viewPublished = (roles, permissions) => {
    const key = roles.find(r => r.type === ROLE_TYPES.GUEST).getPermissionsKey();
    return permissions[key]?.includes(PUBLISHED) || false;
};
