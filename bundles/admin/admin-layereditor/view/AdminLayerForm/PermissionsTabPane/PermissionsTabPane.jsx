import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { PermissionRow } from './PermissionRow';
import { TabPane, List, ListItem, Checkbox, Message } from 'oskari-ui';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { roleAll } from '../PermissionUtil';

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

const PermissionsTabPane = ({ rolesAndPermissionTypes, permissions = {}, controller }) => {
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
        permissions: permissions[roleAll] || [],
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

    const renderRow = (modelRow) => {
        const role = modelRow.isHeaderRow ? roleAll : modelRow.role.name;
        const rowKey = modelRow.isHeaderRow ? 'header' : modelRow.role.name;

        const checkboxes = modelRow.permissionTypes.map(permission => {
            return <Checkbox key={permission.id + '_' + role}
                permissionDescription={permission.localizedText}
                permission={permission.id}
                role={role}
                checked={modelRow.permissions.includes(permission.id)}
                onChange = {(event) => controller.handlePermission(event.target.checked, event.target.role, event.target.permission)}/>;
        });

        return (
            <StyledListItem>
                <PermissionRow key={rowKey} isHeaderRow={modelRow.isHeaderRow} text={modelRow.text} checkboxes={checkboxes}/>
            </StyledListItem>
        );
    };

    return (
        <TabPane key='permissions' tab={<Message messageKey='permissionsTabTitle'/>}>
            <ListDiv>
                <List bordered={false} dataSource={permissionDataModel} renderItem={renderRow}/>
            </ListDiv>
        </TabPane>
    );
};

PermissionsTabPane.propTypes = {
    rolesAndPermissionTypes: PropTypes.object,
    permissions: PropTypes.object,
    controller: PropTypes.instanceOf(Controller).isRequired
};

const contextWrap = LocaleConsumer(PermissionsTabPane);
export { contextWrap as PermissionsTabPane };
