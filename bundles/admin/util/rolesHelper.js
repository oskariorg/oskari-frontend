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
export const getRolesFromResponse = ({ systemRoles = {}, roles, rolelist }) => {
    const list = rolelist || roles || [];
    validateSystemRoles(systemRoles, list);
    const getType = name => Object.keys(systemRoles).find(key => systemRoles[key] === name) || ADDITIONAL_ROLE_TYPE;

    return list.map(role => {
        const type = getType(role.name);
        return { ...role, type, isSystem: type !== ADDITIONAL_ROLE_TYPE };
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

/* --- PERMISSIONS --- */
// TODO: admin-layereditor uses role 'name' and admin-permissions role 'id' as key in permissions object

export const onlyAdmin = (roles, permissions, key = 'id') => {
    const adminKey = roles.find(r => r.type === ROLE_TYPES.ADMIN)[key].toString();
    const guestKey = roles.find(r => r.type === ROLE_TYPES.GUEST)[key].toString();
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

export const getDefaultPermisions = (roles, key = 'id') => {
    return roles
        .filter(role => role.isSystem)
        .reduce((permissions, role) => {
            const permKey = role[key];
            permissions[permKey] = [...DEFAULT_PERMISSIONS[role.type]];
            return permissions;
        }, {});
};
export const hasDefaultPermissions = (roles, permissions, key = 'id') => {
    const defaults = getDefaultPermisions(roles, key);
    return Object.keys(defaults).every(role => {
        const roles = defaults[role];
        const defined = permissions[role] || [];
        if (roles.length !== defined.length) {
            return false;
        }
        return roles.every(role => defined.includes(role));
    });
};

export const viewPublished = (roles, permissions, key = 'id') => {
    const guest = roles.find(r => r.type === ROLE_TYPES.GUEST)?.[key];
    return permissions[guest]?.includes(PUBLISHED) || false;
};
