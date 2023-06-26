import React from 'react';
import { Select, Message } from 'oskari-ui';
import styled from 'styled-components';
import { Block, Content } from './styled';

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
                placeholder={<Message messageKey='usersByRole.selectRole' />}
                defaultValue={roleId}
                options={roleOptions}/>
            {users.map(item => {
                const { id, user, firstName, lastName } = item;
                const details = firstName || lastName ? ` (${firstName} ${lastName})` : '';
                return (
                    <Block key={id}>
                        <span>{user}{details}</span>
                    </Block>
                )})
            }
            {showNoUsers && <Message messageKey='usersByRole.noUsers' />}
        </Content>
    );
};
