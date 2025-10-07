import React, { useState, useEffect } from 'react';
import { Collapse, CollapsePanel, Message, Divider, Tooltip } from 'oskari-ui';
import { InfoIcon } from 'oskari-ui/components/icons';
import { Label } from './Label';
import { getMandatoryIcon } from '../util/validators';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const BUNDLE_KEY = 'oskariui';
const COMPONENT_KEY = 'LocalizationComponent';

const HeaderWrapper = styled.div`
    display: flex;
    justify-content: space-between;
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

const getWithLangSuffix = (label, lang) => {
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
        <HeaderWrapper>
            {getMsg('otherLanguages')}
            <InfoIcon title={ getMsg('othersTip') }/>
        </HeaderWrapper>
    );
};

/**
 * This component generates an UI for inputing localized content. It duplicates fields that are as children for each language and works for example with LabeledInput components as children.
 * The children of this component have some requirements:
 * - the input-components must be DIRECT children of this component (this can be worked around for styling by wrapping the children in a component that supports mentioned props and redistributes them to actual inputs)
 * - The children must have the following props:
 * -> name (name of the field that is used to map individual field value from value param)
 * -> value (value of an individual field)
 * -> label (optional but usually defined for localization purposes, string or React-component that will be shown as field label, defaults to name-prop)
 * -> onChange (function to call when user changes the value of the input)
 * -> mandatory (optional, boolean or React-component for custom validation)
 *
 * Example usage:
 *   <LocalizationComponent
 *      value={localeValue}
 *       languages={Oskari.getSupportedLanguages()}
 *       onChange={(values) => controller.setLocalizedValues(values)}
 *   >
 *       <LabeledInput type='text' label={getMessage('fields.locale.name')} name='name' mandatory={true} />
 *       <LabeledInput type='text' label={<Message messageKey='fields.locale.description' />} name='desc' />
 *   </LocalizationComponent>
 *
 * @param {String[]} languages Commonly Oskari.getSupportedLanguages() ie. the languages that are supported by the instance. Example: ["en", "fi", "sv"] (required)
 * @param {Function} onChange Callback function to get a new "locale" value for user input. Example: (newValue) => doStuff(newValue)
 * @param {Object} value "locale" object like this { "en": { "name": "user input" }} means that there's a value for field "name" for the "en" (english) language
 * @param {String[]} mandatoryLanguages If a mandatory is required for more than default language, you can specify the languages that are required. Example: ["fi"]. Defaults to first language in languages array (optional)
 * @param {ReactElement} LabelComponent For custom label tag when not using LabeledInput (used when the input components DON'T define label prop in PropTypes). Example: const Label = ({children}) => <div>{children}</div>
 * @param {Boolean} collapse "false" to show "other languages" directly and not in a collapse element (useful when there's only one field to localize)
 * @param {Boolean} defaultOpen have "other languages" collapse open by default with true
 * @param {Boolean} showDivider have lang fields separated by divider in "other languages" collapse (useful for grouping languages when there are 3+ fields to localize and when using with <LabeledInput minimal=true />)
 * @param {ReactElement[]} children name, value, onChange, placeholder, autoComplete, suffix, mandatory
 *
 * @returns an input collection where child inputs are duplicated for each of the languages
 */
export const LocalizationComponent = ({
    languages = Oskari.getSupportedLanguages(),
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
    const CURRENT_LANG = Oskari.getLang();
    const DEFAULT_LANG = languages[0];

    const localizedElements = languages.map((lang, index) => {
        const isDefaultLang = DEFAULT_LANG === lang;
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

            const { mandatory = false, label = name, ...restProps } = element.props; // don't pass mandatory and placeholder to element node
            const attachSuffix = !isDefaultLang || CURRENT_LANG !== DEFAULT_LANG;
            const fieldLabel = attachSuffix ? getWithLangSuffix(label, lang) : label;
            const currentMandatory = mandatory && mandatoryLanguages.includes(lang);
            const elProps = {
                label: fieldLabel,
                value: elementValue,
                onChange: onElementValueChange,
                autoComplete: 'off',
                ...restProps
            };
            // detect if the child component declares handling a "label" prop in it's propTypes
            const elementDeclaredProps = {...element.type.propTypes};
            const elementRendersLabel = !!elementDeclaredProps.label;
            if (!elementRendersLabel && currentMandatory) {
                // if element doesn't render a label -> bake the mandatory icon as field suffix when needed
                elProps.suffix = getMandatoryIcon(mandatory, elementValue);
            }
            // detect if the element we are rendering declares supporting "mandatory" as prop.
            if (elementDeclaredProps.mandatory && currentMandatory) {
                // pass in mandatory value IF the child component declares it handles "mandatory" in it's propTypes
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
    const items = [{
        key: panelKey,
        label: getCollapseHeader(),
        children: localizedElements
    }];
    return (
        <React.Fragment>
            { firstLocalizedElement }
            <Collapse bordered defaultActiveKey={defaultOpen === true ? panelKey : null} items={items}/>
        </React.Fragment>
    );
};

LocalizationComponent.propTypes = {
    languages: PropTypes.arrayOf(PropTypes.string),
    mandatoryLanguages: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func,
    value: PropTypes.object,
    LabelComponent: PropTypes.elementType,
    collapse: PropTypes.bool,
    defaultOpen: PropTypes.bool,
    children: PropTypes.any
};
