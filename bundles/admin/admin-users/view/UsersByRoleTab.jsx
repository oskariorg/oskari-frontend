import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import styled from 'styled-components';
import { Block, Content, Button } from './styled';
import { RoleSelect } from './RoleSelect';

const Margin = styled.div`
    margin-bottom: 20px;
`;

export const UsersByRoleTab = ({ state, controller }) => {
    const { users = [], roleId } = state.usersByRole;
    const showNoUsers = roleId && users.length === 0;
    return (
        <Content>
            <RoleSelect
                onlyAdmin
                state={state}
                value={roleId}
                onChange={controller.showUsersByRole}/>
            <Margin />
            {users.map(item => {
                const { id, user, firstName, lastName } = item;
                const details = firstName || lastName ? ` (${firstName} ${lastName})` : '';
                return (
                    <Block key={id}>
                        <span>{user}{details}</span>
                        <Button type='edit' onClick={() => controller.editUserFromRoles(id, user)} />
                    </Block>
                );
            })}
            {showNoUsers && <Message messageKey='usersByRole.noUsers' />}
        </Content>
    );
};
UsersByRoleTab.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired
};
