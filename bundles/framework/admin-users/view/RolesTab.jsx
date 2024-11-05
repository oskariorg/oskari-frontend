import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { PrimaryButton } from 'oskari-ui/components/buttons';
import { RoleBlock } from './RoleBlock';
import styled from 'styled-components';
import { Content, LabelledField, StyledInput, StyledLabel } from './styled';

const Margin = styled.div`
    margin-bottom: 20px;
`;

const AddButton = styled(PrimaryButton)`
    margin-left: 10px;
`;

export const RolesTab = ({ state, controller }) => {
    const [roleName, setRoleName] = useState('');
    const [status, setStatus] = useState('');
    const addRole = () => {
        if (roleName.trim().length === 0) {
            setStatus('error');
            return;
        }
        controller.addRole(roleName);
        setStatus('');
        setRoleName('');
    };
    const { roles, editingRole } = state;
    const { system, additional } = roles;

    return (
        <Content>
            <LabelledField>
                <StyledLabel><Message messageKey='roles.new' /></StyledLabel>
                <StyledInput
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    status={status}
                />
                <AddButton
                    type='add'
                    onClick={() => addRole()}
                />
            </LabelledField>
            <Margin />
            { additional.map(role => <RoleBlock key={role.id} role={role} controller={controller} editingRole={editingRole}/>) }
            <Margin />
            <StyledLabel><Message messageKey='roles.types.system' /></StyledLabel>
            { system.map(role => <RoleBlock key={role.id} role={role} controller={controller} isSystemRole/>) }
        </Content>
    );
};
RolesTab.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired
};
