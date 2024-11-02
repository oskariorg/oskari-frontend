import { validateSystemRoles, onlyAdmin, getDefaultPermisions, hasDefaultPermissions, hasDefaultPermissionsByRoleId } from './rolesHelper';
import { SYSTEM_PERMISSIONS, PUBLISHED, ROLE_TYPES } from './constants';

const systemRoles = {
    anonymous: 'Guest',
    admin: 'Administrator',
    user: 'User'
};
const roles = [
    { name: 'Guest', id: 1, type: 'anonymous' },
    { name: 'User', id: 2, type: 'user' },
    { name: 'Administrator', id: 3, type: 'admin' },
    { name: 'EtraRole', id: 4, type: 'other' }
];

describe('validateSystemRoles function', () => {
    test('valid', () => {
        validateSystemRoles(systemRoles, roles);
    });
    test('throws error on invalid', () => {
        const func = () => validateSystemRoles({ admin: 'admin' }, roles);
        expect(func).toThrow(Error);
    });
    test('throws error on missing role', () => {
        const func = () => validateSystemRoles(systemRoles, roles.slice(1));
        expect(func).toThrow(Error);
    });
});

describe('onlyAdmin function', () => {
    const { admin, anonymous } = systemRoles;
    test('only admin permissions', () => {
        const permissions = {
            Administrator: SYSTEM_PERMISSIONS
        };
        const response = onlyAdmin(permissions, admin);
        expect(response).toBe(true);
    });
    test('admin and guest view published permissions', () => {
        const permissions = {
            Administrator: SYSTEM_PERMISSIONS,
            Guest: [PUBLISHED]
        };
        const response = onlyAdmin(permissions, admin, anonymous);
        expect(response).toBe(true);
    });
    test('Admin and user permissions', () => {
        const permissions = {
            Administrator: SYSTEM_PERMISSIONS,
            User: ['extra']
        };
        const response = onlyAdmin(permissions, admin, anonymous);
        expect(response).toBe(false);
    });
    test('Additional role', () => {
        const permissions = {
            EtraRole: SYSTEM_PERMISSIONS
        };
        const response = onlyAdmin(permissions, admin, anonymous);
        expect(response).toBe(false);
    });
    test('empty permissions', () => {
        const response = onlyAdmin({}, admin, anonymous);
        expect(response).toBe(false);
    });
});

describe('default permissions functions', () => {
    const defaults = getDefaultPermisions(systemRoles);
    const { admin, user, anonymous } = systemRoles;
    test('getDefaultPermisions', () => {
        expect(defaults[anonymous].length > 0).toBe(true);
        expect(defaults[user].length > 0).toBe(true);
        // default permissions doesn't contain permissions for admin as admin is user
        expect(defaults[admin].length > 0).toBe(false);
    });
    test('hasDefaultPermissions', () => {
        const test = (extra = {}) => hasDefaultPermissions(systemRoles, { ...defaults, ...extra });
        expect(test()).toBe(true);
        // checks only for default/system permissions, additional are ok
        expect(test({ foo: ['bar'] })).toBe(true);
        // default permissions doesn't contain permissions for admin as admin is user
        expect(test({ [admin]: [PUBLISHED] })).toBe(false);
        expect(test({ [user]: [PUBLISHED] })).toBe(false);
    });
    const defaultsWithId = {};
    Object.keys(defaults).forEach(roleName => {
        const { id } = roles.find(r => r.name === roleName);
        defaultsWithId[id] = defaults[roleName];
    });
    const adminId = roles.find(r => r.type === ROLE_TYPES.ADMIN).id;
    test('hasDefaultPermissionsByRoleId', () => {
        const test = (extra = {}) => hasDefaultPermissionsByRoleId(roles, { ...defaultsWithId, ...extra });
        expect(test()).toBe(true);
        // checks only for default/system permissions, additional are ok
        expect(test({ 134: ['bar'] })).toBe(true);
        // default permissions doesn't contain permissions for admin as admin is user
        expect(test({ [adminId]: [PUBLISHED] })).toBe(false);
        expect(test({ 1: [PUBLISHED] })).toBe(false);
    });
});
