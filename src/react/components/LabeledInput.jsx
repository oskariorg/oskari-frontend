import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tooltip } from 'oskari-ui';
import { MandatoryIcon } from 'oskari-ui/components/icons';
import { Input } from 'antd';

const Label = styled.div`
    display: inline-block;
`;
const Component = styled.div`
    margin-bottom: 10px;
`;
const Textarea = styled(Input.TextArea)`
    font-family: inherit;
`
export const LabeledInput = ({
    label,
    mandatory,
    minimal,
    ...inputProps
}) => {
    const { value, type } = inputProps;
    const InputNode = type === 'textarea' ? Textarea : Input;
    const isValid = mandatory ? typeof value !== 'undefined' && value.trim().length > 0 : true;
    if (minimal) {
        const suffix = mandatory ? <MandatoryIcon isValid={isValid}/> : <span />;
        return (
            <Component>
                <Tooltip title={ label } trigger={ ['focus', 'hover'] }>
                    <InputNode placeholder={label} suffix={suffix} {...inputProps}/>
                </Tooltip>
            </Component>
        );
    }
    return (
        <Component>
            <Label>
                {label}
                { mandatory && <MandatoryIcon isValid={isValid}/> }
            </Label>
            <InputNode {...inputProps}/>
        </Component>
    );
};

LabeledInput.propTypes = {
    label: PropTypes.string.isRequired,
    mandatory: PropTypes.bool,
    minimal: PropTypes.bool
};
