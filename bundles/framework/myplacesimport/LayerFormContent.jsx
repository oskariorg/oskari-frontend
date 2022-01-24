import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Collapse, CollapsePanel, Message, TextInput, Button, Tooltip, Spin } from 'oskari-ui';
import { FileInput } from 'oskari-ui/components/FileInput';
import { LocalizationComponent } from 'oskari-ui/components/LocalizationComponent';
import { StyleEditor } from 'oskari-ui/components/StyleEditor';
import { OSKARI_BLANK_STYLE } from 'oskari-ui/components/StyleEditor/index';
import { LOCALE_KEY, FILE_INPUT_PROPS } from './constants';

const Content = styled('div')`
    padding: 24px;
    width: 550px;
`;

const PaddedLabel = styled('div')`
    padding-bottom: 10px;
`;

const PaddingTop = styled('div')`
    padding-top: 10px;
`;
const Description = styled('div')`
    padding-bottom: 20px;
    ul {
        list-style: disc inside none;
        margin-left: 12px
    }
`;

const renderImport = (confMaxSize, updateFile) => {
    const { maxSize: defaultMaxSize, ...props } = FILE_INPUT_PROPS;
    const maxSize = confMaxSize || defaultMaxSize;
    return (
        <React.Fragment>
            <Description>
                <Message messageKey='flyout.description' messageArgs={{ maxSize }} allowHTML={true} />
            </Description>
            <FileInput onFiles={updateFile} maxSize={maxSize} { ...props } />
        </React.Fragment>
    );
};
const getPlaceholder = name => Oskari.getMsg(LOCALE_KEY, `flyout.layer.${name}`);

const getValidationMessage = errorKeys => {
    if (!errorKeys.length) {
        return '';
    }
    return (
        <ul>
            { errorKeys.map(key =>
                <li key={key}><Message messageKey={`flyout.validations.error.${key}`} /></li>) }
        </ul>
    );
};

export const LayerFormContent = ({ values, isImport, onOk, maxSize }) => {
    const { style = OSKARI_BLANK_STYLE, locale = {} } = values || {};
    const [state, setState] = useState({ style, locale, loading: false });

    const updateStyle = (style) => setState({ ...state, style });
    const updateLocale = (locale) => setState({ ...state, locale });
    const updateFile = (files) => setState({ ...state, file: files[0] });
    const onClick = () => {
        const { style, locale, file } = state;
        onOk({ style, locale, file });
        setState({ ...state, loading: true });
    };

    const okMessageKey = isImport ? 'flyout.actions.submit' : 'tab.buttons.save';
    const languages = Oskari.getSupportedLanguages();
    const defaultLang = languages[0];
    const hasName = Oskari.util.keyExists(state.locale, `${defaultLang}.name`) && state.locale[defaultLang].name.trim().length > 0;

    const validationKeys = !state.file ? ['file'] : [];
    if (!hasName) {
        validationKeys.push('name');
    };
    const Component = (
        <Content>
            { isImport && renderImport(maxSize, updateFile) }
            <PaddingTop/>
            <LocalizationComponent
                value={ state.locale }
                languages={languages}
                onChange={ updateLocale }
                showDivider={true}
                LabelComponent={PaddedLabel}
            >
                <TextInput type='text' name='name' placeholder={getPlaceholder('name')} mandatory={[defaultLang]}/>
                <PaddingTop/>
                <TextInput type='text' name='desc' placeholder={getPlaceholder('desc')}/>
                <PaddingTop/>
                <TextInput type='text' name='source' placeholder={getPlaceholder('source')}/>
                <PaddingTop/>
            </LocalizationComponent>
            <PaddingTop/>
            <Collapse bordered defaultActiveKey={isImport ? null : 'editor'}>
                <CollapsePanel header={<Message messageKey={ 'flyout.layer.style' }/>} key={'editor'} >
                    <StyleEditor
                        oskariStyle={ state.style }
                        onChange={ updateStyle }
                    />
                </CollapsePanel>
            </Collapse>
            <PaddingTop/>
            <Tooltip key="okButtonTooltip" title={ getValidationMessage(validationKeys) }>
                <Button disabled={validationKeys.length > 0} type="primary" onClick={onClick}>
                    <Message messageKey={okMessageKey} />
                </Button>
            </Tooltip>
        </Content>
    );
    if (state.loading) {
        return <Spin showTip={true}>{Component}</Spin>;
    }
    return Component;
};

LayerFormContent.propTypes = {
    values: PropTypes.object,
    maxSize: PropTypes.number,
    isImport: PropTypes.bool.isRequired,
    onOk: PropTypes.func.isRequired
};
