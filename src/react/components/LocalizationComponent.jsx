import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Collapse, CollapsePanel, Message } from 'oskari-ui';
import styled from 'styled-components';

const Label = styled('div')`
    display: inline-block;
`;

const getInitialValue = (languages, value, isSingle) => {
    const initialValue = value || {};
    languages.forEach(lang => {
        if (!initialValue[lang]) {
            initialValue[lang] = isSingle ? '' : {};
        }
        if (isSingle && typeof initialValue[lang] === 'object') {
            initialValue[lang] = Object.values(initialValue[lang]).shift();
        }
    });
    return initialValue;
};

const getLabel = (labels, lang, elementName, isSingle) => {
    let label = labels && labels[lang];
    if (label) {
        label = isSingle ? label : (elementName && label[elementName]);
    }
    const isReactComponent = label.$$typeof === Symbol.for('react.element');
    if (!isReactComponent && typeof label === 'object') {
        label = Object.values(label).shift();
    }
    return label;
};
const getElementValueChangeHandler = (values, lang, elementName, isSingle, setValue, onChange) => {
    if (!isSingle && !elementName) {
        return;
    }
    return event => {
        const clone = { ...values };
        if (isSingle) {
            clone[lang] = event.target.value;
        } else {
            clone[lang][elementName] = event.target.value;
        }
        setValue(clone);
        if (typeof onChange === 'function') {
            onChange(clone);
        }
    };
};

export const LocalizationComponent = ({
    languages,
    onChange,
    value,
    labels,
    LabelComponent = Label,
    collapse = true,
    defaultOpen = false,
    single = false,
    children }) => {
    if (!Array.isArray(languages) || languages.length === 0) {
        return null;
    }
    const [internalValue, setInternalValue] = useState(getInitialValue(languages, value, single));
    const nodes = React.Children.toArray(children);
    useEffect(() => {
        setInternalValue(getInitialValue(languages, value, single));
    }, [languages, value, single]);

    const localizedElements = languages.map(lang => {
        return nodes.map((element, index) => {
            if (!React.isValidElement(element)) {
                // Text or some other non-react node.
                return element;
            }
            const { name } = element.props;
            const onElementValueChange =
                getElementValueChangeHandler(internalValue, lang, name, single, setInternalValue, onChange);
            let elementValue = single ? internalValue[lang] : internalValue[lang][name];
            let label = getLabel(labels, lang, name, single);
            return (
                <React.Fragment key={`${lang}_${index}`}>
                    { label &&
                        <LabelComponent>{ label }</LabelComponent>
                    }
                    <element.type {...element.props} value={elementValue} onChange={onElementValueChange} autoComplete='off' />
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
                <CollapsePanel header={<Message bundleKey='oskariui' messageKey='otherLanguages' />} key={panelKey}>
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
    single: PropTypes.bool,
    defaultOpen: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};
