import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Collapse, CollapsePanel, Message, Divider, Tooltip } from 'oskari-ui';
import styled from 'styled-components';
import { QuestionCircleOutlined } from '@ant-design/icons';

const Label = styled('div')`
    display: inline-block;
`;

const StyledTooltip = styled(Tooltip)`
    float: right;
`;

const getMsg = path => <Message messageKey={`LocalizationComponent.${path}`} bundleKey='oskariui'/>;

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
    if (!labels) {
        return;
    }
    let label = labels[lang];
    if (label) {
        label = isSingle ? label : (elementName && label[elementName]);
    }
    if (label) {
        const isReactComponent = label.$$typeof === Symbol.for('react.element');
        if (!isReactComponent && typeof label === 'object') {
            label = Object.values(label).shift();
        }
    }
    return label;
};
const getPlaceholder = (placeholders, lang, elementName, isSingle) => {
    if (!placeholders) {
        return '';
    }
    let value = placeholders[lang];
    if (value && !isSingle) {
        value = value[elementName];
    }
    return value || '';
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

const renderDivider = lang => {
    const msg = getMsg(`locale.${lang}`);
    // TODO how to fallback to generic message. Add fallback key or fail if missing optional prop to Message. or Oskari.getMsg()
    // Message messageKey={`LocalizationComponent.locale.generic`} bundleKey='oskariui' messageArgs={[lang]}/>
    return (
        <Divider orientation="left">
            {msg}
        </Divider>
    );
};

const getCollapseHeader = () => {
    return (
        <React.Fragment>
            {getMsg('otherLanguages')}
            <StyledTooltip title={ getMsg('othersTip') }>
                <QuestionCircleOutlined/>
            </StyledTooltip>
        </React.Fragment>
    );
};



export const LocalizationComponent = ({
    languages,
    onChange,
    value,
    labels,
    placeholders,
    LabelComponent = Label,
    collapse = true,
    defaultOpen = false,
    single = false,
    showDivider = false,
    children }) => {
    if (!Array.isArray(languages) || languages.length === 0) {
        return null;
    }
    const [internalValue, setInternalValue] = useState(getInitialValue(languages, value, single));

    useEffect(() => {
        setInternalValue(getInitialValue(languages, value, single));
    }, [languages, value, single]);

    const localizedElements = languages.map((lang, index) => {
        const addDivider = index !== 0 && showDivider;
        const nodes = React.Children.toArray(children).map((element, index) => {
            if (!React.isValidElement(element)) {
                // Text or some other non-react node.
                return element;
            }
            const { name } = element.props;
            const onElementValueChange =
                getElementValueChangeHandler(internalValue, lang, name, single, setInternalValue, onChange);
            let elementValue = single ? internalValue[lang] : internalValue[lang][name];
            let label = getLabel(labels, lang, name, single);
            const placeholder = getPlaceholder(placeholders, lang, name, single);
            return (
                <React.Fragment key={`${lang}_${index}`}>
                    { label &&
                        <LabelComponent>{ label }</LabelComponent>
                    }
                    <Tooltip key={ `${lang}_${index}_tooltip` } title={ placeholder } trigger={ ['focus', 'hover'] }>
                        <element.type {...element.props} value={elementValue} onChange={onElementValueChange} placeholder={placeholder} autoComplete='off' />
                    </Tooltip>
                </React.Fragment>
            );
        });

        return (
            <React.Fragment>
                {addDivider && renderDivider(lang)}
                {nodes}
            </React.Fragment>
        );
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
                <CollapsePanel header={getCollapseHeader()} key={panelKey}>
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
    placeholders: PropTypes.object,
    LabelComponent: PropTypes.elementType,
    collapse: PropTypes.bool,
    single: PropTypes.bool,
    defaultOpen: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};
