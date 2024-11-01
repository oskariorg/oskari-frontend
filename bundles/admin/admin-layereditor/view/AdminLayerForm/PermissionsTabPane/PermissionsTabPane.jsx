import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { PermissionRow, TEXT_COLUMN_SIZE, PERMISSION_TYPE_COLUMN_SIZE } from './PermissionRow';
import { DefaultPermissions } from './DefaultPermissions';
import { List, ListItem, Checkbox, Message, Tooltip } from 'oskari-ui';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { UnorderedListOutlined, EyeOutlined, ImportOutlined, ExportOutlined } from '@ant-design/icons';

const StyledListItem = styled(ListItem)`
    &:not(:first-child) {
        &:nth-child(even) {
            background-color: #ffffff;
        }
        &:nth-child(odd) {
            background-color: #f3f3f3;
        }
    }
`;
const StyledIcon = styled('div')`
    font-size: 18px;
`;

// Overflow makes additional/customized permission types available by scrolling
// It is not ideal at least when there are both many roles and additional permission types
// But most instances don't have them so it's not a huge issue for first version of the UI
const ListDiv = styled.div`
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    max-height: 50vh;
`;

const ListDivHeader = styled('div')`
    flex 0 0 auto;
`;

const ListDivContent = styled('div')`
    flex 1 1 auto;
    overflow-y: auto;
`;

const getPermissionTableHeader = (permission) => {
    const translation = <Message messageKey={`rights.${permission.id}`} defaultMsg={permission.name} bundleKey='admin-layereditor' />;
    switch (permission.id) {
    case 'VIEW_LAYER':
        return <Tooltip title={translation}><StyledIcon><UnorderedListOutlined /></StyledIcon></Tooltip>;
    case 'VIEW_PUBLISHED':
        return <Tooltip title={translation}><StyledIcon><EyeOutlined /></StyledIcon></Tooltip>;
    case 'PUBLISH':
        return <Tooltip title={translation}><StyledIcon><ImportOutlined /></StyledIcon></Tooltip>;
    case 'DOWNLOAD':
        return <Tooltip title={translation}><StyledIcon><ExportOutlined /></StyledIcon></Tooltip>;
    default:
        // permissions might have server side localization as "name" that defaults to id if not given
        return translation;
    }
};

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

    // TODO: mutates permissionTypes. dataRows uses it but header uses localized => both uses localizedText
    // => use mutated or variable but don't mix
    const localizedPermissionTypes = permissionTypes.map(permission => {
        permission.localizedText = getPermissionTableHeader(permission);
        return permission;
    });

    const dataRows = roles.map(role => {
        return {
            isHeaderRow: false,
            permissions: permissions[role.name] || [],
            permissionTypes,
            role
        };
    });

    const headerRow = {
        isHeaderRow: true,
        permissions: getHeaderPermissions(dataRows, roles),
        permissionTypes: localizedPermissionTypes
    };
    const headerDataModel = [headerRow];
    const permissionDataModel = [...dataRows];

    const renderRow = (modelRow) => {
        const checkboxes = modelRow.permissionTypes.map(permission => {
            if (modelRow.isHeaderRow) {
                // header row with special functionality (select all/none)
                return <Checkbox key={permission.id + '_headerRow'}
                    description={permission.localizedText}
                    checked={modelRow.permissions.includes(permission.id)}
                    onChange = {(event) => controller.setPermissionForAll(permission.id, event.target.checked) }/>;
            }
            // the actual role-based rows
            const role = modelRow.role.name;
            const tooltip = <span>{role}: <Message messageKey={`rights.${permission.id}`} defaultMsg={permission.name} /></span>;
            return (
                <Tooltip key={permission.id + '_' + role} title={tooltip}>
                    <Checkbox
                        description={permission.localizedText}
                        checked={modelRow.permissions.includes(permission.id)}
                        onChange = {() => controller.togglePermission(role, permission.id)}/>
                </Tooltip>
            );
        });

        const rowKey = modelRow.isHeaderRow ? 'header' : modelRow.role.name;
        // calculate width in case there are additional permission types the background isn't colored properly without it
        // 195 for role name column and 90/permission type
        const rowWidth = TEXT_COLUMN_SIZE.width + (PERMISSION_TYPE_COLUMN_SIZE.width * headerRow.permissionTypes.length);
        return (
            <StyledListItem style={{ width: rowWidth + 'px' }}>
                <PermissionRow key={rowKey} isHeaderRow={modelRow.isHeaderRow} role={modelRow.role} checkboxes={checkboxes}/>
            </StyledListItem>
        );
    };

    return (
        <ListDiv>
            <DefaultPermissions
                metadata={rolesAndPermissionTypes}
                permissions={permissions}
                controller={controller}/>
            <ListDivHeader>
                <List bordered={false} dataSource={headerDataModel} renderItem={renderRow}/>
            </ListDivHeader>
            <ListDivContent>
                <List bordered={false} dataSource={permissionDataModel} renderItem={renderRow}/>
            </ListDivContent>
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
