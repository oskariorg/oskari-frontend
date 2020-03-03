import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { PermissionRow } from './PermissionRow';
import { List, ListItem, Checkbox, Message, Tooltip } from 'oskari-ui';
import { LocaleConsumer, Controller } from 'oskari-ui/util';

const StyledListItem = styled(ListItem)`
    &:first-child > div {
        font-weight: bold;
    }
    &:not(:first-child) {
        &:nth-child(even) {
            background-color: #ffffff;
        }
        &:nth-child(odd) {
            background-color: #f3f3f3;
        }
    }
`;

const ListDiv = styled.div`
    padding-bottom: 20px;
`;

function getHeaderPermissions (dataRows, roles) {
    // key == permission, value == set of roles having the permission
    const allPermissions = {};
    dataRows.forEach(row => {
        const role = row.text;
        const rolePermissions = row.permissions;
        rolePermissions.forEach(permissionName => {
            let permissionRoles = allPermissions[permissionName];
            if (!permissionRoles) {
                permissionRoles = new Set();
                allPermissions[permissionName] = permissionRoles;
            }
            permissionRoles.add(role);
        });
    });
    return Object.keys(allPermissions).map(permission => {
        if (allPermissions[permission].size === roles.length) {
            return permission;
        }
        return null;
    }).filter(value => !!value);
}

const PermissionsTabPane = ({ rolesAndPermissionTypes, permissions = {}, controller }) => {
    if (!rolesAndPermissionTypes) {
        return;
    }
    const { roles, permissionTypes } = rolesAndPermissionTypes;

    const localizedPermissionTypes = permissionTypes.map(permission => {
        permission.localizedText = <Message messageKey={`rights.${permission.id}`} defaultMsg={permission.id} />;
        return permission;
    });

    const dataRows = roles.map(role => {
        return {
            isHeaderRow: false,
            text: role.name,
            permissions: permissions[role.name] || [],
            permissionTypes: permissionTypes,
            role: role
        };
    });

    const headerRow = {
        isHeaderRow: true,
        text: <Message messageKey='rights.role'/>,
        permissions: getHeaderPermissions(dataRows, roles),
        permissionTypes: localizedPermissionTypes
    };

    const permissionDataModel = [headerRow, ...dataRows];

    const renderRow = (modelRow) => {
        const checkboxes = modelRow.permissionTypes.map(permission => {
            if (modelRow.isHeaderRow) {
                // header row with special functionality (select all/none)
                return <Checkbox key={permission.id + '_headerRow'}
                    permissionDescription={permission.localizedText}
                    permission={permission.id}
                    role={'N/A'}
                    checked={modelRow.permissions.includes(permission.id)}
                    onChange = {(event) => controller.setPermissionForAll(event.target.permission, event.target.checked) }/>;
            }
            // the actual role-based rows
            const role = modelRow.role.name;
            return (<Tooltip key={permission.id + '_' + role}
                title={permission.localizedText}>
                <Checkbox
                    permissionDescription={permission.localizedText}
                    permission={permission.id}
                    role={role}
                    checked={modelRow.permissions.includes(permission.id)}
                    onChange = {(event) => controller.togglePermission(event.target.role, event.target.permission)}/>
            </Tooltip>);
        });

        const rowKey = modelRow.isHeaderRow ? 'header' : modelRow.role.name;
        return (
            <StyledListItem>
                <PermissionRow key={rowKey} isHeaderRow={modelRow.isHeaderRow} text={modelRow.text} checkboxes={checkboxes}/>
            </StyledListItem>
        );
    };

    return (
        <ListDiv>
            <List bordered={false} dataSource={permissionDataModel} renderItem={renderRow}/>
        </ListDiv>
    );
};

PermissionsTabPane.propTypes = {
    rolesAndPermissionTypes: PropTypes.object,
    permissions: PropTypes.object,
    controller: PropTypes.instanceOf(Controller).isRequired
};

const contextWrap = LocaleConsumer(PermissionsTabPane);
export { contextWrap as PermissionsTabPane };
