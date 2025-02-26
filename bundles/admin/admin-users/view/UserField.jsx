import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { getMandatoryIcon } from 'oskari-ui/util/validators';
import { LabelledField, StyledLabel, StyledInput } from './styled';

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
            <StyledLabel><Message messageKey={`users.${field}`} />&nbsp;{icon}</StyledLabel>
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
UserField.propTypes = {
    field: PropTypes.string.isRequired,
    value: PropTypes.string,
    controller: PropTypes.object.isRequired,
    type: PropTypes.string,
    error: PropTypes.bool,
    readonly: PropTypes.bool,
    mandatory: PropTypes.bool
};
