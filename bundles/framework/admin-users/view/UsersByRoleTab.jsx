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

export const UsersByRoleTab = ({ state, controller }) => {
    const { usersByRole, roles } = state;
    console.log(roles);
    const { users = [], roleId } = usersByRole;
    const roleName = roles.find(r => r.id === roleId)?.name || '';

    const roleOptions = roles.map(role => ({
        label: role.name,
        value: role.id
    }));

    return (
        <Content>
            <Select
                className='t_roles'
                onChange={(value) => console.log(value)}
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
        </Content>
    );
};
