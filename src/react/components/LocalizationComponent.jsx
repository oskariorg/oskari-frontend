import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Collapse, CollapsePanel } from 'oskari-ui';
import styled from 'styled-components';

const Label = styled('div')`
    display: inline-block;
`;

const getMsg = Oskari.getMsg.bind(null, 'oskariui');

export const LocalizationComponent = ({ languages, onChange, value, labels, LabelComponent = Label, collapse = true, defaultOpen = false, children }) => {
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

    const localizedElements = languages.map(lang => {
        return nodes.map((element, index) => {
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
        });
    });
    if (localizedElements.length === 1 || !collapse) {
        return (
            <React.Fragment>
                { localizedElements }
            </React.Fragment>
        );
    }
    const firstLocalizedElement = localizedElements.shift();
    const panelKey = 'otherLanguages';
    return (
        <React.Fragment>
            { firstLocalizedElement }
            <Collapse bordered defaultActiveKey={defaultOpen === true ? panelKey : null}>
                <CollapsePanel header={getMsg('otherLanguages')} key={panelKey}>
                    { localizedElements }
                </CollapsePanel>
            </Collapse>
        </React.Fragment>
    );
};

LocalizationComponent.propTypes = {
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func,
    value: PropTypes.object,
    labels: PropTypes.object,
    LabelComponent: PropTypes.elementType,
    collapse: PropTypes.bool,
    defaultOpen: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};
