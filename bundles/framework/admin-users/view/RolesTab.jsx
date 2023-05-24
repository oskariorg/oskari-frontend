import React, { useState } from 'react';
import { TextInput, Message, Button } from 'oskari-ui';
import { PrimaryButton, DeleteButton, SecondaryButton } from 'oskari-ui/components/buttons';
import styled from 'styled-components';
import { EditOutlined } from '@ant-design/icons';

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

const RoleBlock = styled('div')`
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

const ButtonContainer = styled('div')`
    display: flex;
    flex-direction: row;
`;

const RoleButtons = ({ role, state, controller }) => {
    return (
        <ButtonContainer>
            {state.editingRole && state.editingRole.id === role.id ? (
                <div>
                    <PrimaryButton
                        type='save'
                        onClick={() => controller.updateRole(state.editingRole)}
                    />
                    <SecondaryButton
                        type='cancel'
                        onClick={() => controller.setEditingRole(null)}
                    />
                </div>
            ) : (
                <Button
                    type='edit'
                    onClick={() => controller.setEditingRole(role)}
                >
                    <EditOutlined />
                </Button>
            )}
            <DeleteButton
                type='button'
                title={<Message messageKey='flyout.adminroles.confirm_delete' messageArgs={{ role: role.name }} />}
                onConfirm={() => controller.deleteRole(role.id)}
            />
        </ButtonContainer>
    );
};

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
    return (
        <Content>
            <Form>
                <span><Message messageKey='flyout.adminroles.newrole' /></span>
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
            {roles.map(role => (
                <RoleBlock key={role.id}>
                    {editingRole && editingRole.id === role.id ? (
                        <StyledInput
                            value={editingRole.name}
                            onChange={(e) => controller.updateEditingRole('name', e.target.value)}
                            status={editingRole.status}
                        />
                    ) : (
                        <span>{role.name}</span>
                    )}
                    {!role.systemRole && (
                        <RoleButtons role={role} state={state} controller={controller} />
                    )}
                </RoleBlock>
            ))}
        </Content>
    );
};
