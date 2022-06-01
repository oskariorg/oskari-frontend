import React, { useState, useEffect } from 'react';
import { Collapse, CollapsePanel, Message, Divider, Tooltip } from 'oskari-ui';
import { MandatoryIcon } from 'oskari-ui/components/icons';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import PropTypes from 'prop-types';

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

const getInitialValue = (languages, value) => {
    const initialValue = value || {};
    languages.forEach(lang => {
        if (!initialValue[lang]) {
            initialValue[lang] = {};
        }
    });
    return initialValue;
};

// React.isValidElement() ?
const isReactComponent = (item) => item.$$typeof === Symbol.for('react.element');
const getLabel = (labels, lang, elementName) => {
    if (!labels) {
        return;
    }
    let label = labels[lang];
    if (label) {
        label = (elementName && label[elementName]);
    }
    if (label) {
        if (!isReactComponent(label) && typeof label === 'object') {
            label = Object.values(label).shift();
        }
    }
    return label;
};
const getPlaceholderWithLangSuffix = (label, lang) => {
    if (!label) {
        return '';
    }
    if (typeof label ==='string') {
        return label + ' ' + getLangSuffix(lang);
    }
    else if (React.isValidElement(label)) {
        // Works with <Message />
        return (<label.type {...label.props}>
            {getLangSuffix(lang)}
        </label.type>);
    }
    return '';
};
const getElementValueChangeHandler = (values, lang, elementName, setValue, onChange) => {
    if (!elementName) {
        return;
    }
    return event => {
        const clone = { ...values };
        clone[lang][elementName] = event.target.value;
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
/**
 * 
 * @param {String[]} languages käytössä olevat kielet
 * @param {Function} onChange 
 * @param {Object} value "locale" object if single { [lang]: [value] } else { [lang]: { key: [value] }}
 * @param {Object} labels samanmallinen object kuin value == vaikuttaa onko single vai ei (placeholder tulee silti children propsina)
 * @param {ReactElement} LabelComponent labelille wrapper
 * @param {Boolean} collapse disabling "other languages" collapse with false
 * @param {Boolean} defaultOpen have "other languages" collapse open by default with true
 * @param {Boolean} showDivider have lang fields separated by divider in "other languages" collapse (useful for grouping languages when there are 3+ fields to localize)
 * @param {ReactElement[]} children name, value, onChange, placeholder, autoComplete, suffix, mandatory
 * 
 * @returns 
 */
export const LocalizationComponent = ({
    languages,
    onChange,
    value,
    labels,
    LabelComponent = Label,
    collapse = true,
    defaultOpen = false,
    showDivider = false,
    children }) => {
    if (!Array.isArray(languages) || languages.length === 0) {
        return null;
    }
    const [internalValue, setInternalValue] = useState(getInitialValue(languages, value));

    useEffect(() => {
        setInternalValue(getInitialValue(languages, value));
    }, [languages, value]);

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
                getElementValueChangeHandler(internalValue, lang, name, setInternalValue, onChange);
            let elementValue = internalValue[lang][name];

            const { mandatory = [], label, placeholder = '', ...restProps } = element.props; // don't pass mandatory and placeholder to element node
            
            let labelSingle = label ? label : getLabel(labels, lang, name);
            if (label && !isDefaultLang) {
                labelSingle = getPlaceholderWithLangSuffix(label, lang);
            }
            const placeholderWithSuffix = isDefaultLang ? placeholder : getPlaceholderWithLangSuffix(placeholder, lang);
            let suffix;
            if (mandatory.includes(lang)) {
                suffix = <MandatoryIcon isValid={validateMandatory(elementValue)} />;
            }
            return (
                <React.Fragment key={`${lang}_${index}`}>
                    { labelSingle &&
                        <LabelComponent>{ labelSingle }</LabelComponent>
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

    // only one language OR "other languages" collapse disabled -> write localizable fields in "one view"
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
    LabelComponent: PropTypes.elementType,
    collapse: PropTypes.bool,
    defaultOpen: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};
