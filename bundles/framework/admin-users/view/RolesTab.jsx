import React, { useState } from 'react';
import { TextInput, Message, Divider } from 'oskari-ui';
import { PrimaryButton } from 'oskari-ui/components/buttons';
import { RoleBlock } from './RoleBlock';
import styled from 'styled-components';

const Content = styled('div')`
    display: flex;
    flex-direction: column;
`;

const Form = styled('div')`
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
    align-self: flex-end;
    align-items: center;
`;

const AddButton = styled(PrimaryButton)`
    margin-left: 15px;
    align-self: flex-end;
`;

const StyledInput = styled(TextInput)`
    margin-left: 10px;
    width: 210px;
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
            <Form>
                <Message messageKey='roles.new' />
                <StyledInput
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    status={status}
                />
                <AddButton
                    type='add'
                    onClick={() => addRole()}
                />
            </Form>
            <Divider orientation="left"><Message messageKey="roles.types.system"/></Divider>
            { systemRoles.map(role => <RoleBlock key={role.id} role={role} controller={controller} isSystemRole/>) }
            <Divider orientation="left"><Message messageKey="roles.types.other"/></Divider>
            { otherRoles.map(role => <RoleBlock key={role.id} role={role} controller={controller} editingRole={editingRole}/>) }
        </Content>
    );
};
