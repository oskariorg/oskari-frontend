import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Collapse, CollapsePanel, Message, TextInput, Button, Tooltip } from 'oskari-ui';
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
    const desc = Oskari.getMsg(LOCALE_KEY, 'flyout.description', { maxSize });
    return (
        <React.Fragment>
            <Description dangerouslySetInnerHTML={{ __html: desc }}/>
            <FileInput onFiles={updateFile} maxSize={maxSize} { ...props } />
        </React.Fragment>
    );
};

const getLabels = languages => {
    const getMsg = Oskari.getMsg.bind(null, LOCALE_KEY);
    const getLocale = Oskari.getMsg.bind(null, 'oskariui');
    const labels = {};
    const userLang = Oskari.getLang();
    languages.forEach((lang, index) => {
        const locale = getLocale(`LocalizationComponent.locale.${lang}`);
        const isDefaultLang = index === 0;
        const mandatory = isDefaultLang ? ' (*)' : '';
        // don't add suffix if userLang is first (default) language
        const suffix = isDefaultLang && lang === userLang ? '' : ` ${locale}`;
        labels[lang] = {
            name: getMsg('flyout.layer.name') + suffix + mandatory,
            desc: getMsg('flyout.layer.desc') + suffix,
            source: getMsg('flyout.layer.source') + suffix
        };
    });
    return labels;
};

const getButtonTooltip = (hasName, hasFile) => {
    return (
        <React.Fragment>
            {!hasName && <Message messageKey='flyout.validations.error.name' /> }
            {!hasFile && <Message messageKey='flyout.validations.error.file' /> }
        </React.Fragment>
    );
};

export const LayerFormContent = ({ values, isImport, onOk, maxSize }) => {
    const { style = OSKARI_BLANK_STYLE, locale = {} } = values || {};
    const [state, setState] = useState({ style, locale, loading: false });

    const updateStyle = (style) => setState({ ...state, style });
    const updateLocale = (locale) => setState({ ...state, locale });
    const updateFile = (file) => setState({ ...state, file });

    const okMessageKey = isImport ? 'flyout.actions.submit' : 'tab.buttons.save';
    const languages = Oskari.getSupportedLanguages();
    const defaultLang = languages[0];

    const hasFile = !!state.file;
    const hasName = Oskari.util.keyExists(state.locale, `${defaultLang}.name`) && state.locale[defaultLang].name.trim().length > 0;
    const valid = isImport ? hasName && hasFile : hasName;

    const onClick = () => {
        const { style, locale, file } = state;
        onOk({ style, locale, file });
        setState({ ...state, loading: true });
    };
    const tooltip = valid ? '' : getButtonTooltip(hasName, hasFile);
    return (
        <Content>
            { isImport && renderImport(maxSize, updateFile) }
            <PaddingTop/>
            <LocalizationComponent
                placeholders={getLabels(languages)}
                value={ state.locale }
                languages={languages}
                onChange={ updateLocale }
                LabelComponent={PaddedLabel}
            >
                <TextInput type='text' name='name'/>
                <PaddingTop/>
                <TextInput type='text' name='desc'/>
                <PaddingTop/>
                <TextInput type='text' name='source'/>
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
            <Tooltip key="okButtonTooltip" title={ tooltip }>
                <Button disabled={!valid} type="primary" onClick={onClick} loading={state.loading}>
                    <Message messageKey={okMessageKey} />
                </Button>
            </Tooltip>
        </Content>
    );
};

LayerFormContent.propTypes = {
    values: PropTypes.object,
    maxSize: PropTypes.number,
    isImport: PropTypes.bool.isRequired,
    onOk: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};
