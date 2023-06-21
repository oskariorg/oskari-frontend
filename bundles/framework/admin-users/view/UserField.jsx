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
    margin-left: 10px;
    width: 210px;
`;
const Padding = styled.span`
    padding-left: 5px;
`;

export const UserField = ({ field, value, controller, error, readonly = false, type = 'text', mandatory = true }) => {
    // No need to render mandatory icon for read-only field
    // TODO: or &nbsp;
    const icon = readonly ? null : <Padding>{getMandatoryIcon(mandatory, value)}</Padding>;
    const onChange = value => {
        if (readonly) {
            return;
        }
        controller.updateUserFormState(field, value);
    };
    return (
        <LabelledField>
            <Label><Message messageKey={`flyout.adminusers.${field}`} />{icon}</Label>
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
