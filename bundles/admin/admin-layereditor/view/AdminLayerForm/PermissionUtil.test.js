import { handlePermissionForAllRoles, handlePermissionForSingleRole } from './PermissionUtil';

describe('handlePermissionForAllRoles', () => {
    test('sets permission correctly to all roles', () => {
        const checked = true;
        const permissionsForAllRoles = {
            role1: ['permission 1', 'permission 2'],
            role2: ['permission 1']
        };
        const permission = 'permission 3';

        handlePermissionForAllRoles(checked, permissionsForAllRoles, permission);
        expect(permissionsForAllRoles['role1']).toEqual(['permission 1', 'permission 2', 'permission 3']);
        expect(permissionsForAllRoles['role2']).toEqual(['permission 1', 'permission 3']);
    });
    test('removes permission correctly from all roles', () => {
        const checked = false;
        const permissionsForAllRoles = {
            role1: ['permission 1', 'permission 2'],
            role2: ['permission 1']
        };
        const permission = 'permission 1';

        handlePermissionForAllRoles(checked, permissionsForAllRoles, permission);
        expect(permissionsForAllRoles['role1']).toEqual(['permission 2']);
        expect(permissionsForAllRoles['role2']).toEqual([]);
    });
});

describe('handlePermissionForSingleRole sets permission correctly when', () => {
    test('permission is not set in layer', () => {
        const permissionsForAllRoles = {
            role1: ['permission 1', 'permission 2'],
            role2: ['permission 1']
        };
        const role = 'role1';
        const permission = 'permission 3';
        handlePermissionForSingleRole(permissionsForAllRoles, permission, role);

        const permissionsOfRole = permissionsForAllRoles[role];
        expect(permissionsOfRole).toEqual(['permission 1', 'permission 2', 'permission 3']);
    });
    test('permission is set in layer', () => {
        const permissionsForAllRoles = {
            role1: ['permission 1', 'permission 2'],
            role2: ['permission 1']
        };
        const role = 'role1';
        const permission = 'permission 1';
        handlePermissionForSingleRole(permissionsForAllRoles, permission, role);

        const permissionsOfRole = permissionsForAllRoles[role];
        expect(permissionsOfRole).toEqual(['permission 2']);
    });
});
