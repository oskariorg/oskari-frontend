import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { PermissionRow } from './PermissionTabPane/PermissionRow';
import { List, ListItem, Checkbox } from 'oskari-ui';
import { withLocale } from 'oskari-ui/util';

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

const checkboxOnChangeHandler = (event) => {
    // TODO: Replace console.log with service mutator call to mutate state of selected permissions
    const role = event.target.role;
    const permission = event.target.permission;
    console.log('Checkbox with role ' + role + ' and permission ' + permission);
};

const renderRow = (modelRow) => {
    const role = modelRow.isHeaderRow ? 'all' : modelRow.role.id;
    const rowKey = modelRow.isHeaderRow ? 'header' : modelRow.role.id;

    const checkboxes = modelRow.permissionTypes.map(permission => {
        return <Checkbox key={permission.id + '_' + role}
            permissionDescription={permission.localizedText}
            permission={permission.id}
            role={role}
            checked={modelRow.permissions.includes(permission.id)}
            onChange = {checkboxOnChangeHandler}/>;
    });

    return (
        <StyledListItem>
            <PermissionRow key={rowKey} isHeaderRow={modelRow.isHeaderRow} text={modelRow.text} checkboxes={checkboxes}/>
        </StyledListItem>
    );
};

const PermissionsTabPane = ({ rolesAndPermissionTypes, permissions = {}, Message }) => {
    if (!rolesAndPermissionTypes) {
        return;
    }
    const { roles, permissionTypes } = rolesAndPermissionTypes;

    const localizedPermissionTypes = permissionTypes.map(permission => {
        permission.localizedText = <Message messageKey={`rights.${permission.id}`}/>;
        return permission;
    });

    const headerRow = {
        isHeaderRow: true,
        text: <Message messageKey='rights.role'/>,
        permissions: [],
        permissionTypes: localizedPermissionTypes
    };

    const dataRows = roles.map(role => {
        return {
            isHeaderRow: false,
            text: role.name,
            permissions: permissions[role.name] || [],
            permissionTypes: permissionTypes,
            role: role
        };
    });

    const permissionDataModel = [headerRow, ...dataRows];

    return (
        <ListDiv><List bordered={false} dataSource={permissionDataModel} renderItem={renderRow}/></ListDiv>
    );
};

PermissionsTabPane.propTypes = {
    rolesAndPermissionTypes: PropTypes.object,
    permissions: PropTypes.object,
    Message: PropTypes.elementType.isRequired
};

const contextWrap = withLocale(PermissionsTabPane);
export { contextWrap as PermissionsTabPane };
