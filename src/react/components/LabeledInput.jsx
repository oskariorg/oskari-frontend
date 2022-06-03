import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tooltip } from 'oskari-ui';
import { MandatoryIcon } from 'oskari-ui/components/icons';
import { Input } from 'antd';

const Label = styled.div`
    display: inline-block;
    padding-bottom: 5px;
`;
const Component = styled.div`
    margin-bottom: 10px;
`;
const Textarea = styled(Input.TextArea)`
    font-family: inherit;
`

const validateMandatory = value => typeof value === 'string' && value.trim().length > 0;
// This checks if the param is a React component. React.isValidElement() checks if it's a valid element that might not be a component
const isReactComponent = (el) => el && el.$$typeof === Symbol.for('react.element');

const getMandatoryIcon = (mandatory, elementValue) => {
    if (typeof mandatory === 'boolean') {
        // generate default check for mandatory field
        return (<MandatoryIcon isValid={validateMandatory(elementValue)} />);
    } else if (isReactComponent(mandatory)) {
        // use icon send through props
        // Admin-layereditor has custom mandatory context with own mechanism for validation
        return (<mandatory.type {...mandatory.props}/>);
    }
    return null;
};

export const LabeledInput = ({
    label,
    mandatory,
    minimal,
    ...inputProps
}) => {
    const { value, type } = inputProps;
    const InputNode = type === 'textarea' ? Textarea : Input;
    if (minimal) {
        let labelStr = label;
        if (typeof label !== 'string') {
            labelStr = '';
            Oskari.log('React/LabeledInput').error('Minimal input requires label as string');
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
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired,
    mandatory: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.bool
    ]),
    minimal: PropTypes.bool
};
