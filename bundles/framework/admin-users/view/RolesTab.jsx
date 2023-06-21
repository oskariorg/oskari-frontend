import React, { useState } from 'react';
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
        setStatus('');
        controller.addRole(roleName);
        // TODO: clear roleName or move back to handler state
    }
    const { roles, editingRole } = state;
    const systemRoles = roles.filter(role => role.systemRole === true);
    const otherRoles = roles.filter(role => role.systemRole === false);
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
            { systemRoles.map(role => <RoleBlock key={role.id} role={role} controller={controller} isSystemRole/>) }
            <Margin />
            { otherRoles.map(role => <RoleBlock key={role.id} role={role} controller={controller} editingRole={editingRole}/>) }
        </Content>
    );
};
