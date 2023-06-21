import React from 'react';
import { Message, Label } from 'oskari-ui';
import { getMandatoryIcon } from 'oskari-ui/util/validators';
import { LabelledField, StyledInput } from './styled';

export const UserField = ({ field, value, controller, error, readonly = false, type = 'text', mandatory = true }) => {
    // No need to render mandatory icon for read-only field
    const icon = readonly ? null : getMandatoryIcon(mandatory, value);
    const onChange = value => {
        if (readonly) {
            return;
        }
        controller.updateUserFormState(field, value);
    };
    return (
        <LabelledField>
            <Label><Message messageKey={`users.${field}`} />&nbsp;{icon}</Label>
            <StyledInput
                className={`t_${field}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                status={error ? 'error' : null}
                type={type}
                autoComplete='nope'
            />
        </LabelledField>
    );
};
