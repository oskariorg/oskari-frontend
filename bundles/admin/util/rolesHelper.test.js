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
const rolesWithId = util.getRolesFromResponse(repsonse);
const rolesWithName = util.getRolesFromResponse(repsonse, 'name');

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
        const sorted = [
            { name: 'Administrator', id: 3 },
            { name: 'Guest', id: 1 },
            { name: 'User', id: 2 },
            { name: 'AdditionalRole', id: 5 },
            { name: 'EtraRole', id: 4 }
        ];
        const expected = sorted.map(role => {
            const type = Object.keys(systemRoles).find(key => systemRoles[key] === role.name) || ADDITIONAL_ROLE_TYPE;
            const isSystem = type !== ADDITIONAL_ROLE_TYPE;
            return { ...role, type, isSystem, getPermissionsKey: expect.anything() };
        });
        expect(util.getRolesFromResponse(repsonse)).toEqual(expected);
        rolesWithId.forEach(role => expect(role.getPermissionsKey()).toBe(role.id.toString()));
        rolesWithName.forEach(role => expect(role.getPermissionsKey()).toBe(role.name));
    });
    test('getRolesByTypeFromResponse', () => {
        const { additional, system } = util.getRolesByTypeFromResponse(repsonse);
        expect(system.length).toBe(3);
        system.forEach(role => expect(role.isSystem).toBe(true));
        system.forEach(role => expect(!!systemRoles[role.type]).toBe(true));
        expect(additional.length).toBe(2);
        additional.forEach(role => expect(role.type).toBe(ADDITIONAL_ROLE_TYPE));
        additional.forEach(role => expect(role.isSystem).toBe(false));
        [...additional, ...system].forEach(role => expect(role.getPermissionsKey()).toBe(role.id.toString()));
    });
});

describe('onlyAdmin function', () => {
    test('only admin permissions', () => {
        expect(util.onlyAdmin(rolesWithId, { 3: SYSTEM_PERMISSIONS })).toBe(true);
        expect(util.onlyAdmin(rolesWithName, { Administrator: SYSTEM_PERMISSIONS })).toBe(true);
    });
    test('admin and guest view published permissions', () => {
        const permissions = {
            Administrator: SYSTEM_PERMISSIONS,
            Guest: [PUBLISHED]
        };
        expect(util.onlyAdmin(rolesWithName, permissions)).toBe(true);
    });
    test('Admin and user permissions', () => {
        const permissions = {
            2: ['extra'],
            3: SYSTEM_PERMISSIONS
        };
        expect(util.onlyAdmin(rolesWithId, permissions)).toBe(false);
    });
    test('Additional role', () => {
        const permissions = {
            EtraRole: SYSTEM_PERMISSIONS
        };
        expect(util.onlyAdmin(rolesWithId, permissions)).toBe(false);
    });
    test('empty permissions', () => {
        expect(util.onlyAdmin(rolesWithId, {})).toBe(false);
        expect(util.onlyAdmin(rolesWithName, {})).toBe(false);
    });
});

describe('default permissions functions', () => {
    const defaultsWithName = util.getDefaultPermisions(rolesWithName);
    const defaultsWithId = util.getDefaultPermisions(rolesWithId);
    const { admin, user, anonymous } = systemRoles;
    test('getDefaultPermisions', () => {
        // Guest
        expect(defaultsWithName[anonymous].length > 0).toBe(true);
        expect(defaultsWithId['1'].length > 0).toBe(true);
        // Logged in
        expect(defaultsWithName[user].length > 0).toBe(true);
        expect(defaultsWithId['2'].length > 0).toBe(true);
        // Admin, default permissions doesn't contain permissions for admin as admin is user
        expect(defaultsWithName[admin].length > 0).toBe(false);
        expect(defaultsWithId['3'].length > 0).toBe(false);
    });

    test('viewPublished', () => {
        // defaults have view published for guest
        expect(util.viewPublished(rolesWithName, defaultsWithName)).toBe(true);
        expect(util.viewPublished(rolesWithId, defaultsWithId)).toBe(true);
        expect(util.viewPublished(rolesWithName, { Administrator: SYSTEM_PERMISSIONS })).toBe(false);
        expect(util.viewPublished(rolesWithId, { 3: SYSTEM_PERMISSIONS })).toBe(false);
    });

    test('hasDefaultPermissions', () => {
        const test = (extra = {}) => util.hasDefaultPermissions(rolesWithName, { ...defaultsWithName, ...extra });
        expect(test()).toBe(true);
        // checks only for default/system permissions, additional are ok
        expect(test({ foo: ['bar'] })).toBe(true);
        // default permissions doesn't contain permissions for admin as admin is user
        expect(test({ [admin]: [PUBLISHED] })).toBe(false);
        expect(test({ [user]: [PUBLISHED] })).toBe(false);
    });

    test('hasDefaultPermissions by id', () => {
        const test = (extra = {}) => util.hasDefaultPermissions(rolesWithId, { ...defaultsWithId, ...extra });
        expect(test()).toBe(true);
        // checks only for default/system permissions, additional are ok
        expect(test({ 134: ['bar'] })).toBe(true);
        // default permissions doesn't contain permissions for admin as admin is user
        const adminId = rolesWithId.find(r => r.type === ROLE_TYPES.ADMIN).id;
        expect(test({ [adminId]: [PUBLISHED] })).toBe(false);
        expect(test({ 1: [PUBLISHED] })).toBe(false);
    });
});
