import React from 'react';
import { Select, Message } from 'oskari-ui';
import styled from 'styled-components';

const Content = styled('div')`
    display: flex;
    flex-direction: column;
`;

const UserBlock = styled('div')`
    display: flex;
    flex-direction: row;
    border: 1px solid #999;
    min-height: 50px;
    align-items: center;
    padding: 0 5px;
    justify-content: space-between;
    font-size: 16px;
    background-color: #F3F3F3;
`;

const StyledSelect = styled(Select)`
    margin-bottom: 20px;
`;

export const UsersByRoleTab = ({ state, controller }) => {
    const { usersByRole, roles } = state;
    const { users = [], roleId } = usersByRole;

    const roleOptions = roles.map(role => ({
        label: role.name,
        value: role.id
    }));
    const showNoUsers = roleId && users.length === 0;
    return (
        <Content>
            <StyledSelect
                className='t_roles'
                onChange={(value) => controller.showUsersByRole(value)}
                defaultValue={roleId}
                options={roleOptions}/>
            {users.map(item => {
                const { id, user, firstName, lastName } = item;
                const details = firstName || lastName ? ` (${firstName} ${lastName})` : '';
                return (
                    <UserBlock key={id}>
                        <span>{user}{details}</span>
                    </UserBlock>
                )})
            }
            {showNoUsers && <Message messageKey='flyout.usersByRole.noUsers' />}
        </Content>
    );
};
