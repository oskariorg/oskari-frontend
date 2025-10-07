import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Collapse, CollapsePanel, Message, Divider, Tooltip } from 'oskari-ui';
import { MandatoryIcon } from 'oskari-ui/components/icons';
import styled from 'styled-components';
import { QuestionCircleOutlined } from '@ant-design/icons';

const BUNDLE_KEY = 'oskariui';
const COMPONENT_KEY = 'LocalizationComponent';

const Label = styled('div')`
    display: inline-block;
`;

const StyledTooltip = styled(Tooltip)`
    float: right;
`;

const getMsg = path => <Message messageKey={`${COMPONENT_KEY}.${path}`} bundleKey={BUNDLE_KEY}/>;

const getLangSuffix = lang => {
    const path = `${COMPONENT_KEY}.locale.${lang}`;
    let suffix = Oskari.getMsg(BUNDLE_KEY, path);
    if (suffix === path) {
        suffix = Oskari.getMsg(BUNDLE_KEY, `${COMPONENT_KEY}.locale.generic`, [lang]);
    }
    return suffix;
};

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
const getPlaceholderWithLangSuffix = (placeholder, lang) => {
    if (!placeholder) {
        return '';
    }
    return placeholder + ' ' + getLangSuffix(lang);
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
    return (
        <Divider orientation="left">
            { getLangSuffix(lang) }
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

const validateMandatory = value => typeof value === 'string' && value.trim().length > 0;

export const LocalizationComponent = ({
    languages,
    onChange,
    value,
    labels,
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
        const isDefaultLang = index === 0;
        const addDivider = showDivider && !isDefaultLang; // add dividers only to CollapsePanel
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

            const { mandatory = [], placeholder = '', ...restProps } = element.props; // don't pass mandatory and placeholder to element node
            const placeholderWithSuffix = isDefaultLang ? placeholder : getPlaceholderWithLangSuffix(placeholder, lang);
            let suffix;
            if (mandatory.includes(lang)) {
                suffix = <MandatoryIcon isValid={validateMandatory(elementValue)} />;
            }
            return (
                <React.Fragment key={`${lang}_${index}`}>
                    { label &&
                        <LabelComponent>{ label }</LabelComponent>
                    }
                    <Tooltip key={ `${lang}_${index}_tooltip` } title={ placeholderWithSuffix } trigger={ ['focus', 'hover'] }>
                        <element.type {...restProps} value={elementValue} onChange={onElementValueChange} placeholder={placeholderWithSuffix} autoComplete='off' suffix={suffix}/>
                    </Tooltip>
                </React.Fragment>
            );
        });

        return (
            <div className={`t_localization-${lang}`} key={`${lang}_${index}`}>
                {addDivider && renderDivider(lang)}
                {nodes}
            </div>
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
    LabelComponent: PropTypes.elementType,
    collapse: PropTypes.bool,
    single: PropTypes.bool,
    defaultOpen: PropTypes.bool,
    children: PropTypes.any
};
