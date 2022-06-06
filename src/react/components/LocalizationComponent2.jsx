import React, { useState, useEffect } from 'react';
import { Collapse, CollapsePanel, Message, Divider, Tooltip } from 'oskari-ui';
import { getMandatoryIcon } from '../util/validators';
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

            {/*
                The inputs have to be on direct children for LocalizationComponent.
                Can't wrap them to <StyledFormField>.
            */}
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
    mandatoryLanguages = [languages[0]],
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
            // TODO: specify fields that we require from inputs for localized content: name, label?, mandatory?, onChange? etc
            const { name } = element.props;
            const onElementValueChange =
                getElementValueChangeHandler(internalValue, lang, name, setInternalValue, onChange);
            let elementValue = internalValue[lang][name];

            const { mandatory = false, label, placeholder = '', ...restProps } = element.props; // don't pass mandatory and placeholder to element node
            
            let fieldLabel = isDefaultLang ? label : getPlaceholderWithLangSuffix(label, lang);
            const currentMandatory = mandatory && mandatoryLanguages.includes(lang);
            const elProps = {
                label: fieldLabel,
                value: elementValue,
                onChange: onElementValueChange,
                autoComplete: 'off',
                ...restProps
            };
            const elementDeclaredProps = {...element.type.propTypes};
            const elementRendersLabel = !!elementDeclaredProps.label;
            if (!elementRendersLabel && currentMandatory) {
                elProps.suffix = getMandatoryIcon(mandatory, elementValue);
            }
            // detect if the element we are rendering declares supporting "mandatory" as prop.
            if (elementDeclaredProps.mandatory && currentMandatory) {
                elProps.mandatory = mandatory;
            }
            return (
                <React.Fragment key={`${lang}_${index}`}>
                    { !elementRendersLabel && <LabelComponent>{ fieldLabel }</LabelComponent>}
                    <element.type {...elProps} />
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
    mandatoryLanguages: PropTypes.arrayOf(PropTypes.string),
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
