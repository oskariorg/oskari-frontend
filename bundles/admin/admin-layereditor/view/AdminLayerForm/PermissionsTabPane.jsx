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
        background-color: ${props => props.children.props.even ? '#ffffff' : '#f3f3f3'};
    }
`;

const ListDiv = styled.div`
    padding-bottom: 20px;
`;

const renderRow = (row) => {
    return (
        <StyledListItem>
            {row}
        </StyledListItem>
    );
};

const PermissionsTabPane = (props) => {
    const { getMessage, rolesAndPermissionTypes } = props;
    if (!rolesAndPermissionTypes) {
        return;
    }

    const permissionTypes = [...rolesAndPermissionTypes.permissionTypes];
    const roles = [...rolesAndPermissionTypes.roles];

    const checkboxOnChangeHandler = (event) => {
        // TODO: Replace console.log with service mutator call to mutate state of selected permissions
        const role = event.target.role;
        const permission = event.target.permission;
        console.log('Checkbox with role ' + role + ' and permission ' + permission);
    };

    const headerCheckboxes = permissionTypes.map(permission => {
        return <Checkbox key={permission.id + '_' + 'all'}
            selectionText={getMessage('rights.' + permission.id)}
            permission={permission.id} role={'all'}
            onChange = {checkboxOnChangeHandler}/>;
    });

    const header = <PermissionRow key={'header'} even={false} isHeaderRow={true} text={getMessage('rights.role')} checkboxes={headerCheckboxes}/>;

    const rolePermissionRows = roles.map((role, index) => {
        const rolePermissionCheckboxes = permissionTypes.map((permission) => {
            return <Checkbox key={permission.id + '_' + role.id}
                selectionText={getMessage('rights.' + permission.id)}
                permission={permission.id} role={role.id}
                onChange = {checkboxOnChangeHandler}/>;
        });
        return <PermissionRow key={role.id} even={index % 2 === 0} isHeaderRow={false} text={role.name} checkboxes={rolePermissionCheckboxes}/>;
    });
    const permissionDataModel = [header, ...rolePermissionRows];

    return (
        <ListDiv><List bordered={false} dataSource={permissionDataModel} renderItem={renderRow}/></ListDiv>
    );
};

PermissionsTabPane.propTypes = {
    rolesAndPermissionTypes: PropTypes.object,
    getMessage: PropTypes.func.isRequired
};

const contextWrap = withLocale(PermissionsTabPane);
export { contextWrap as PermissionsTabPane };
