import React from 'react';
import styled from 'styled-components';
import { Message, TextInput, Label } from 'oskari-ui';
import { getMandatoryIcon } from 'oskari-ui/util/validators';

const LabelledField = styled('div')`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 5px;
`;

const StyledInput = styled(TextInput)`
    width: 210px;
`;

export const UserField = ({ field, value, error, disabled = false, type = 'text', mandatory = true }) => {
    // No need to render mandatory icon for disabled field
    const icon = disabled ? null : getMandatoryIcon(mandatory, value);
    return (
        <LabelledField>
            <Label><Message messageKey={`flyout.adminusers.${field}`} />{icon}</Label>
            <StyledInput
                className={`t_${field}`}
                value={value}
                onChange={(e) => controller.updateUserFormState(field, e.target.value)}
                status={error ? 'error' : null}
                disabled={disabled}
                type={type}
                autoComplete='nope'
            />
        </LabelledField>
    );
};
