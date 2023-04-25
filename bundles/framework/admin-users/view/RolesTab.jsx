import React from 'react';
import { TextInput, Confirm, Message } from 'oskari-ui';
import { PrimaryButton, DeleteButton } from 'oskari-ui/components/buttons';
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
    width: 50px;
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

export const RolesTab = ({ state, controller }) => {
    let roles = state.roles;
    return (
        <Content>
            <Form>
                <span><Message messageKey='flyout.adminroles.newrole' /></span>
                <StyledInput
                    value={state.roleFormState.name}
                    onChange={(e) => controller.updateRoleFormState(e.target.value)}
                    status={state.roleFormError ? 'error' : null}
                />
                <AddButton
                    type='add'
                    onClick={() => controller.addRole()}
                />
            </Form>
            {roles.map(role => (
                <RoleBlock key={role.id}>
                    <span>{role.name}</span>
                    {state.systemRoles.findIndex(r => r === role.name) < 0 && (
                        <DeleteButton
                            type='button'
                            title={<Message messageKey='flyout.adminroles.confirm_delete' messageArgs={{ role: role.name }} />}
                            onConfirm={() => controller.deleteRole(role.id)}
                        />
                    )}
                </RoleBlock>
            ))}
        </Content>
    );
};
