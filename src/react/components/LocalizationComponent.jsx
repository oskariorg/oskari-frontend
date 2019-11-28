import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Label = styled('div')`
    display: inline-block;
`;

export const LocalizationComponent = ({ languages, onChange, value, labels, LabelComponent = Label, children }) => {
    if (languages.length === 0) {
        return null;
    }
    const [internalValue, setInternalValue] = useState(value);
    const nodes = React.Children.toArray(children);
    const getElementValueChangeHandler = (lang, name) => {
        if (!name) {
            return null;
        }
        return event => {
            const clone = { ...internalValue };
            clone[lang][name] = event.target.value;
            setInternalValue(clone);
            if (typeof onChange === 'function') {
                onChange(internalValue);
            }
        };
    };
    useEffect(() => {
        setInternalValue(value);
    }, [value]);
    return (
        <React.Fragment>
            {
                languages.map(lang => nodes.map((element, index) => {
                    if (!React.isValidElement(element)) {
                        // Text or some other non-react node.
                        return element;
                    }
                    const { name } = element.props;
                    const elementValue = (internalValue && internalValue[lang] && internalValue[lang][name]) || '';
                    const onElementValueChange = getElementValueChangeHandler(lang, name);
                    return (
                        <React.Fragment key={`${lang}_${index}`}>
                            { name && labels && labels[lang] && labels[lang][name] &&
                                <LabelComponent>{ labels[lang][name] }</LabelComponent>
                            }
                            <element.type {...element.props} value={elementValue} onChange={onElementValueChange}/>
                        </React.Fragment>
                    );
                }))
            }
        </React.Fragment>
    );
};

LocalizationComponent.propTypes = {
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func,
    value: PropTypes.object,
    labels: PropTypes.object,
    LabelComponent: PropTypes.instanceOf(React.Component),
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};
