import React from 'react';
import { Message, Label, Select } from 'oskari-ui';
import { PrimaryButton, SecondaryButton, DeleteButton } from 'oskari-ui/components/buttons';
import styled from 'styled-components';
import { UserField } from './UserField';

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

const StyledSelect = styled(Select)`
    width: 210px;
`;

const FIELDS = ['user', 'firstName', 'lastName', 'email'];
const PASS_FIELDS = ['password', 'rePassword'];

const getRoleOptions = (roles, systemRole) => {
    const filtered = roles.filter(role => role.systemRole === systemRole);
    return filtered.map(role => ({
        label: role.name,
        value: role.id
    }));
};

export const UserForm = ({ userFormState, roles, controller, isExternal }) => {
    const { errors, id, password } = userFormState;
    const passwordRequired = !id || password.length > 0;
    return (
        <Content>
            {FIELDS.map(field =>
                <UserField key={field} field={field} controller={controller} readonly={isExternal}
                    value={userFormState[field]} error={errors.includes(field)}/>
            )}
            {!isExternal && PASS_FIELDS.map(field =>
                <UserField key={field} field={field} controller={controller} mandatory={passwordRequired} type='password'
                    value={userFormState[field]} error={errors.includes(field)}/>
            )}
            <LabelledField>
                <Label><Message messageKey='flyout.adminusers.addRole' /></Label>
                <StyledSelect
                    className='t_roles'
                    mode='multiple'
                    allowClear
                    onChange={(value) => controller.updateUserFormState('roles', value)}
                    defaultValue={userFormState.roles}
                    status={errors.includes('roles') ? 'error' : null}
                    options={[
                        {
                            label: <Message messageKey='flyout.adminroles.roles.system' />,
                            options: getRoleOptions(roles, true)
                        },
                        {
                            label: <Message messageKey='flyout.adminroles.roles.other' />,
                            options: getRoleOptions(roles, false)
                        }
                    ]}
                />
            </LabelledField>
            <Buttons>
                <RightButtons>
                    <SaveButton
                        type='save'
                        onClick={() => controller.saveUser()}
                    />
                    {(!isExternal) && (
                        <DeleteButton
                            type='label'
                            title={<Message messageKey='flyout.adminusers.confirm_delete' messageArgs={{ user: userFormState.user }} />}
                            onConfirm={() => controller.deleteUser(id)}
                        />
                    )}
                </RightButtons>
                <SecondaryButton
                    type='cancel'
                    onClick={() => controller.closeUserForm()}
                />
            </Buttons>
        </Content>
    );
};
