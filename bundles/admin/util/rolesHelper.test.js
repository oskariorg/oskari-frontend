import * as util from './rolesHelper';
import { SYSTEM_PERMISSIONS, PUBLISHED, ROLE_TYPES, ADDITIONAL_ROLE_TYPE } from './constants';

const systemRoles = {
    anonymous: 'Guest',
    admin: 'Administrator',
    user: 'User'
};
const rolelist = [
    { name: 'Guest', id: 1 },
    { name: 'User', id: 2 },
    { name: 'EtraRole', id: 4 },
    { name: 'Administrator', id: 3 },
    { name: 'AdditionalRole', id: 5 }
];

const repsonse = { systemRoles, rolelist };

describe('validateSystemRoles function', () => {
    test('valid', () => {
        util.validateSystemRoles(systemRoles, rolelist);
    });
    test('throws error on invalid', () => {
        const func = () => util.validateSystemRoles({ admin: 'admin' }, rolelist);
        expect(func).toThrow(Error);
    });
    test('throws error on missing role', () => {
        const func = () => util.validateSystemRoles(systemRoles, rolelist.slice(1));
        expect(func).toThrow(Error);
    });
    test('getRolesFromResponse', () => {
        // system roles first and in alphabetic order
        const expected = [
            { name: 'Administrator', id: 3, type: ROLE_TYPES.ADMIN, isSystem: true },
            { name: 'Guest', id: 1, type: ROLE_TYPES.GUEST, isSystem: true },
            { name: 'User', id: 2, type: ROLE_TYPES.USER, isSystem: true },
            { name: 'AdditionalRole', id: 5, type: ADDITIONAL_ROLE_TYPE, isSystem: false },
            { name: 'EtraRole', id: 4, type: ADDITIONAL_ROLE_TYPE, isSystem: false }
        ];
        expect(util.getRolesFromResponse(repsonse)).toEqual(expected);
    });
    test('getRolesByTypeFromResponse', () => {
        const { additional, system } = util.getRolesByTypeFromResponse(repsonse);
        expect(system.length).toBe(3);
        system.forEach(role => expect(role.isSystem).toBe(true));
        system.forEach(role => expect(!!systemRoles[role.type]).toBe(true));
        expect(additional.length).toBe(2);
        additional.forEach(role => expect(role.type).toBe(ADDITIONAL_ROLE_TYPE));
        additional.forEach(role => expect(role.isSystem).toBe(false));
    });
});

describe('onlyAdmin function', () => {
    const roles = util.getRolesFromResponse(repsonse);
    test('only admin permissions', () => {
        expect(util.onlyAdmin(roles, { 3: SYSTEM_PERMISSIONS })).toBe(true);
        expect(util.onlyAdmin(roles, { Administrator: SYSTEM_PERMISSIONS }, 'name')).toBe(true);
    });
    test('admin and guest view published permissions', () => {
        const permissions = {
            Administrator: SYSTEM_PERMISSIONS,
            Guest: [PUBLISHED]
        };
        expect(util.onlyAdmin(roles, permissions, 'name')).toBe(true);
    });
    test('Admin and user permissions', () => {
        const permissions = {
            2: ['extra'],
            3: SYSTEM_PERMISSIONS
        };
        expect(util.onlyAdmin(roles, permissions)).toBe(false);
    });
    test('Additional role', () => {
        const permissions = {
            EtraRole: SYSTEM_PERMISSIONS
        };
        expect(util.onlyAdmin(roles, permissions, 'name')).toBe(false);
    });
    test('empty permissions', () => {
        expect(util.onlyAdmin(roles, {})).toBe(false);
    });
});

describe('default permissions functions', () => {
    const roles = util.getRolesFromResponse(repsonse);
    const defaults = util.getDefaultPermisions(roles, 'name');
    const { admin, user, anonymous } = systemRoles;
    test('getDefaultPermisions by name', () => {
        expect(defaults[anonymous].length > 0).toBe(true);
        expect(defaults[user].length > 0).toBe(true);
        // default permissions doesn't contain permissions for admin as admin is user
        expect(defaults[admin].length > 0).toBe(false);
    });
    test('hasDefaultPermissions', () => {
        const test = (extra = {}) => util.hasDefaultPermissions(roles, { ...defaults, ...extra }, 'name');
        expect(test()).toBe(true);
        // checks only for default/system permissions, additional are ok
        expect(test({ foo: ['bar'] })).toBe(true);
        // default permissions doesn't contain permissions for admin as admin is user
        expect(test({ [admin]: [PUBLISHED] })).toBe(false);
        expect(test({ [user]: [PUBLISHED] })).toBe(false);
    });
    const defaultsWithId = util.getDefaultPermisions(roles);
    test('getDefaultPermisions by id', () => {
        expect(defaultsWithId['1'].length > 0).toBe(true);
        expect(defaultsWithId['2'].length > 0).toBe(true);
        // default permissions doesn't contain permissions for admin as admin is user
        expect(defaultsWithId['3'].length > 0).toBe(false);
    });

    test('hasDefaultPermissions by id', () => {
        const roles = util.getRolesFromResponse(repsonse);
        const test = (extra = {}) => util.hasDefaultPermissions(roles, { ...defaultsWithId, ...extra });
        expect(test()).toBe(true);
        // checks only for default/system permissions, additional are ok
        expect(test({ 134: ['bar'] })).toBe(true);
        // default permissions doesn't contain permissions for admin as admin is user
        const adminId = roles.find(r => r.type === ROLE_TYPES.ADMIN).id;
        expect(test({ [adminId]: [PUBLISHED] })).toBe(false);
        expect(test({ 1: [PUBLISHED] })).toBe(false);
    });
});
