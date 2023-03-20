import React from 'react';
import { Message, TextInput, Label, Select, Confirm } from 'oskari-ui';
import { getMandatoryIcon } from 'oskari-ui/util/validators';
import { PrimaryButton, SecondaryButton } from 'oskari-ui/components/buttons';
import styled from 'styled-components';

const Content = styled('div')`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
`;

const Buttons = styled('div')`
    display flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 5px;
`;

const RightButtons = styled('div')`
    display: flex;
    flex-direction: row;
`;

const SaveButton = styled(PrimaryButton)`
    margin-right: 5px;
`;

const LabelledField = styled('div')`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 5px;
`;

const StyledInput = styled(TextInput)`
    width: 210px;
`;

const StyledSelect = styled(Select)`
    width: 210px;
`;

export const UserForm = ({ state, controller, isExternal }) => {
    return (
        <Content>
            <LabelledField>
                <Label><Message messageKey='flyout.adminusers.firstName' /> {getMandatoryIcon(true, state.userFormState.firstName)}</Label>
                <StyledInput
                    className='t_firstName'
                    value={state.userFormState.firstName}
                    onChange={(e) => controller.updateUserFormState('firstName', e.target.value)}
                    status={state.userFormErrors.includes('firstName') ? 'error' : null}
                    disabled={isExternal}
                />
            </LabelledField>
            <LabelledField>
                <Label><Message messageKey='flyout.adminusers.lastName' /> {getMandatoryIcon(true, state.userFormState.lastName)}</Label>
                <StyledInput
                    className='t_lastName'
                    value={state.userFormState.lastName}
                    onChange={(e) => controller.updateUserFormState('lastName', e.target.value)}
                    status={state.userFormErrors.includes('lastName') ? 'error' : null}
                    disabled={isExternal}
                />
            </LabelledField>
            <LabelledField>
                <Label><Message messageKey='flyout.adminusers.user' /> {getMandatoryIcon(true, state.userFormState.username)}</Label>
                <StyledInput
                    className='t_username'
                    value={state.userFormState.username}
                    onChange={(e) => controller.updateUserFormState('username', e.target.value)}
                    status={state.userFormErrors.includes('username') ? 'error' : null}
                    disabled={isExternal}
                />
            </LabelledField>
            <LabelledField>
                <Label><Message messageKey='flyout.adminusers.email' /> {getMandatoryIcon(true, state.userFormState.email)}</Label>
                <StyledInput
                    className='t_email'
                    value={state.userFormState.email}
                    onChange={(e) => controller.updateUserFormState('email', e.target.value)}
                    status={state.userFormErrors.includes('email') ? 'error' : null}
                    disabled={isExternal}
                />
            </LabelledField>
            {!isExternal && (
                <>
                    <LabelledField>
                        <Label><Message messageKey='flyout.adminusers.pass' /> {!state.editingUserId && (getMandatoryIcon(true, state.userFormState.password))}</Label>
                        <StyledInput
                            className='t_password'
                            type='password'
                            value={state.userFormState.password}
                            onChange={(e) => controller.updateUserFormState('password', e.target.value)}
                            status={state.userFormErrors.includes('password') ? 'error' : null}
                        />
                    </LabelledField>
                    <LabelledField>
                        <Label><Message messageKey='flyout.adminusers.pass_retype' /> {!state.editingUserId && (getMandatoryIcon(true, state.userFormState.rePassword))}</Label>
                        <StyledInput
                            className='t_re_password'
                            type='password'
                            value={state.userFormState.rePassword}
                            onChange={(e) => controller.updateUserFormState('rePassword', e.target.value)}
                            status={state.userFormErrors.includes('password') ? 'error' : null}
                        />
                    </LabelledField>
                </>
            )}
            <LabelledField>
                <Label><Message messageKey='flyout.adminusers.addRole' /></Label>
                <StyledSelect
                    className='t_roles'
                    mode='multiple'
                    allowClear
                    onChange={(value) => controller.updateUserFormState('roles', value)}
                    defaultValue={state.userFormState.roles}
                    status={state.userFormErrors.includes('roles') ? 'error' : null}
                    options={state.roles.map(role => (
                        {
                            label: role.name,
                            value: role.id
                        }
                    ))}
                />
            </LabelledField>
            <Buttons>
                <RightButtons>
                    <SaveButton
                        type='save'
                        onClick={() => controller.saveUser()}
                    />
                    <Confirm
                        title={<Message messageKey='flyout.adminusers.confirm_delete' messageArgs={{ user: state.userFormState.username }} />}
                        onConfirm={() => controller.deleteUser(state.editingUserId)}
                        okText={<Message messageKey='buttons.delete' bundleKey='oskariui'/>}
                        cancelText={<Message messageKey='buttons.cancel' bundleKey='oskariui'/>}
                    >
                        <SecondaryButton
                            type='delete'
                        />
                    </Confirm>
                </RightButtons>
                <SecondaryButton
                    type='cancel'
                    onClick={() => controller.closeUserForm()}
                />
            </Buttons>
        </Content>
    );
};
