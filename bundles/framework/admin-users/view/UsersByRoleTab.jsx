import React from 'react';
import PropTypes from 'prop-types';
import { Select, Message } from 'oskari-ui';
import styled from 'styled-components';
import { Block, Content } from './styled';

const StyledSelect = styled(Select)`
    margin-bottom: 20px;
`;
const ADMIN = 'admin';

const getOptionGroup = (type, roles) => {
    const options = roles.map(({ name, id }) => ({ label: name, value: id }));
    return {
        title: type,
        label: <Message messageKey={`roles.types.${type}`} />,
        options
    };
};

export const UsersByRoleTab = ({ state, controller }) => {
    const { usersByRole, roles, systemRoles } = state;
    const { users = [], roleId } = usersByRole;

    const showNoUsers = roleId && users.length === 0;
    const onlyAdmin = systemRoles.filter(role => role.type === ADMIN);
    const options = [
        getOptionGroup('system', onlyAdmin),
        getOptionGroup('other', roles)
    ];
    return (
        <Content>
            <StyledSelect
                className='t_roles'
                onChange={(value) => controller.showUsersByRole(value)}
                placeholder={<Message messageKey='usersByRole.selectRole' />}
                defaultValue={roleId}
                options={options}/>
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
UsersByRoleTab.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired
};
