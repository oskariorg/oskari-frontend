import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tooltip } from 'oskari-ui';
import { Label } from './Label';
import { getMandatoryIcon } from '../util/validators';
import { Input } from 'antd';

const Component = styled.div`
    margin-bottom: 10px;
`;
const Textarea = styled(Input.TextArea)`
    font-family: inherit;
    // We need this to get the tooltip to calculate it's position correctly
    display: block;
`;

export const LabeledInput = ({
    label,
    mandatory,
    minimal,
    ...inputProps
}) => {
    const { value, type } = inputProps;
    const InputNode = type === 'textarea' ? Textarea : Input;
    if (type === 'textarea') {
        inputProps.autoSize = {minRows: 2, maxRows: 10};
    }
    if (minimal) {
        let labelStr = label;
        if (typeof label !== 'string') {
            labelStr = '';
            Oskari.log('React/LabeledInput').error('Minimal input requires label as string. Got:', label);
        }
        if (mandatory) {
            inputProps.suffix = getMandatoryIcon(mandatory, value);
        }
        return (
            <Component>
                <Tooltip title={ labelStr } trigger={ ['focus', 'hover'] }>
                    <InputNode placeholder={labelStr} {...inputProps}/>
                </Tooltip>
            </Component>
        );
    }
    return (
        <Component>
            <Label>
                {label} { mandatory && getMandatoryIcon(mandatory, value) }
            </Label>
            <InputNode {...inputProps}/>
        </Component>
    );
};

LabeledInput.propTypes = {
    // label MUST be string IF minimal=true as it's placed on the field placeholder
    label: PropTypes.any.isRequired,
    // boolean to have simple String.isEmpty() validation, component for controlling isValid-check for more complex validation
    mandatory: PropTypes.any,
    // true to show label as placeholder inside the field instead of on top of the field
    minimal: PropTypes.bool
};
