import React from 'react';
import PropTypes from 'prop-types';
import { Message, Select } from 'oskari-ui';
import { PrimaryButton, SecondaryButton, DeleteButton, ButtonContainer } from 'oskari-ui/components/buttons';
import styled from 'styled-components';
import { UserField } from './UserField';
import { Content, LabelledField, StyledLabel } from './styled';

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
    const { errors = [], passwordErrors = {}, id, password } = userFormState;
    const passwordRequired = !id || password.length > 0;
    return (
        <Content>
            {FIELDS.map(field =>
                <UserField key={field} field={field} controller={controller} readonly={isExternal}
                    value={userFormState[field]} error={errors.includes(field)}/>
            )}
            {!isExternal && PASS_FIELDS.map(field =>
                <UserField key={field} field={field} controller={controller} mandatory={passwordRequired} type='password'
                    value={userFormState[field]} error={!!passwordErrors[field]}/>
            )}
            <LabelledField>
                <StyledLabel><Message messageKey='users.addRole' /></StyledLabel>
                <StyledSelect
                    className='t_roles'
                    mode='multiple'
                    allowClear
                    onChange={(value) => controller.updateUserFormState('roles', value)}
                    defaultValue={userFormState.roles}
                    status={errors.includes('roles') ? 'error' : null}
                    options={[
                        {
                            label: <Message messageKey='roles.types.system' />,
                            options: getRoleOptions(roles, true)
                        },
                        {
                            label: <Message messageKey='roles.types.other' />,
                            options: getRoleOptions(roles, false)
                        }
                    ]}
                />
            </LabelledField>
            <ButtonContainer>
                <SecondaryButton
                    type='cancel'
                    onClick={() => controller.closeUserForm()}
                />
                {(!isExternal) && (
                    <DeleteButton
                        type='label'
                        onConfirm={() => controller.deleteUser(id)}
                    />
                )}
                <PrimaryButton
                    type='save'
                    onClick={() => controller.saveUser()}
                />
            </ButtonContainer>
        </Content>
    );
};
UserForm.propTypes = {
    userFormState: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired,
    roles: PropTypes.array.isRequired,
    isExternal: PropTypes.bool
};
