import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { PermissionRow } from './PermissionTabPane/PermissionRow';
import { List, ListItem, Spin } from 'oskari-ui';
import { withLocale } from 'oskari-ui/util';

const StyledListItem = styled(ListItem)`
    &:first-child > div {
        padding-top: 5px;
        font-weight: bold;
    }
    &:last-child > div {
        padding-bottom: 20px;
    }
`;

const SpinnerDiv = styled.div`
   padding: 20px;
`;

const renderRow = (rowModel) => {
    return (
        <StyledListItem>
            <PermissionRow {...rowModel}/>
        </StyledListItem>
    );
};

const PermissionsTabPane = (props) => {
    const { getMessage, rolesAndPermissionTypes } = props;
    var permissionDataModel;
    if (rolesAndPermissionTypes) {
        // TODO: Refactor data model in next iteration
        const permissionTypes = [...rolesAndPermissionTypes.permissionTypes];
        const headerSelections = permissionTypes.map(permission => {
            const copy = JSON.parse(JSON.stringify(permission));
            copy.selectionText = getMessage('rights.' + permission.id);
            copy.header = true;
            return copy;
        });

        const header = {
            rowId: 'header',
            rowText: getMessage('rights.role'),
            permissionTypes: headerSelections,
            isHeaderRow: true
        };

        const data = rolesAndPermissionTypes.roles.map(role => {
            return {
                rowId: role.id,
                rowText: role.name,
                role: role,
                permissionTypes: rolesAndPermissionTypes.permissionTypes,
                isHeaderRow: false
            };
        });
        permissionDataModel = [header, ...data];
    }

    return (
        permissionDataModel
            ? <List bordered={false} dataSource={permissionDataModel} renderItem={renderRow}/>
            : <SpinnerDiv><Spin/></SpinnerDiv>
    );
};

PermissionsTabPane.propTypes = {
    rolesAndPermissionTypes: PropTypes.object.isRequired,
    getMessage: PropTypes.func.isRequired
};

const contextWrap = withLocale(PermissionsTabPane);
export { contextWrap as PermissionsTabPane };
