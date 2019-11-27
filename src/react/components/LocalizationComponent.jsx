import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const LocalizationComponent = ({ languages, onChange, value, labels, children }) => {
    if (languages.length === 0) {
        return null;
    }
    const [internalValue, setInternalValue] = useState(value);
    const nodes = React.Children.toArray(children);
    const getElementValueChangeHandler = (lang, name) => {
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
                    const { name } = element.props;
                    const elementValue = (internalValue && internalValue[lang] && internalValue[lang][name]) || '';
                    const onElementValueChange = getElementValueChangeHandler(lang, name);
                    return (
                        <div key={`${lang}_${index}`}>
                            { name && labels && labels[lang] && labels[lang][name] &&
                                <div>{ labels[lang][name] }</div>
                            }
                            <element.type {...element.props} value={elementValue} onChange={onElementValueChange}/>
                        </div>
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
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};
