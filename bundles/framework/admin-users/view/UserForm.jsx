import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { PrimaryButton, SecondaryButton, DeleteButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { UserField } from './UserField';
import { RoleSelect } from './RoleSelect';
import { Content, LabelledField, StyledLabel } from './styled';

const FIELDS = ['user', 'firstName', 'lastName', 'email'];
const PASS_FIELDS = ['password', 'rePassword'];

export const UserForm = ({ state, controller, isExternal }) => {
    const { userFormState } = state;
    const { errors = [], passwordErrors = {}, id, password, roles } = userFormState;
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
                <RoleSelect
                    multiple
                    state={state}
                    value={roles}
                    error={errors.includes('roles')}
                    onChange={value => controller.updateUserFormState('roles', value)}/>
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
    state: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired,
    isExternal: PropTypes.bool
};
