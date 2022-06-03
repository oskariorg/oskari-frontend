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
        let labelStr = label;
        if (typeof label !== 'string') {
            const isReactComponent = label.$$typeof === Symbol.for('react.element');
            if (isReactComponent) {
                // FIXME: doesn't work properly. Would need to get the actual content rendered by the tag instead
                labelStr = React.Children.toArray(label.props.children).filter(c => typeof c === 'string').join(' ');
            } else {
                labelStr = '';
            }
        }
        if (mandatory) {
            inputProps.suffix = (<MandatoryIcon isValid={isValid}/>);
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
                {label} { mandatory && <MandatoryIcon isValid={isValid}/> }
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
    mandatory: PropTypes.bool,
    minimal: PropTypes.bool
};
