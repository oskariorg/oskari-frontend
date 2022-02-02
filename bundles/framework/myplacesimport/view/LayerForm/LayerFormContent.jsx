import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Collapse, CollapsePanel, Message, TextInput, Tooltip, Spin } from 'oskari-ui';
import { SecondaryButton, PrimaryButton } from 'oskari-ui/components/buttons';
import { FileInput } from 'oskari-ui/components/FileInput';
import { LocalizationComponent } from 'oskari-ui/components/LocalizationComponent';
import { StyleEditor } from 'oskari-ui/components/StyleEditor';
import { OSKARI_BLANK_STYLE } from 'oskari-ui/components/StyleEditor/index';
import { BUNDLE_NAME, ERRORS, FILE_INPUT_PROPS } from '../../constants';

const Content = styled('div')`
    padding: 24px;
    width: 550px;
`;
const Buttons = styled('div')`
    display: flex;
    justify-content: flex-end;
    button {
        margin-left: 5px;
    }
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

const SrsInput = styled(TextInput)`
    margin-top: 10px;
`;

const renderImport = (file, maxSize, updateFile) => {
    const files = file ? [file] : [];
    return (
        <React.Fragment>
            <Description>
                <Message messageKey='flyout.description' messageArgs={{ maxSize }} allowHTML={true} />
            </Description>
            <FileInput onFiles={updateFile} maxSize={maxSize} files={files} { ...FILE_INPUT_PROPS } />
        </React.Fragment>
    );
};
const getPlaceholder = name => Oskari.getMsg(BUNDLE_NAME, `flyout.layer.${name}`);

const getValidationMessage = keys => {
    if (!keys.length) {
        return '';
    }
    return (
        <ul>
            { keys.map(key =>
                <li key={key}><Message messageKey={`flyout.validations.${key}`} /></li>) }
        </ul>
    );
};

export const LayerFormContent = ({ values, config, onOk, onCancel, error }) => {
    const { maxSize, isImport } = config;
    const { style = OSKARI_BLANK_STYLE, locale = {} } = values || {};
    const [state, setState] = useState({ style, locale, loading: false });

    const showSrs = isImport && error === ERRORS.NO_SRS;

    const updateStyle = (style) => setState({ ...state, style });
    const updateLocale = (locale) => setState({ ...state, locale });
    const updateFile = (files) => setState({ ...state, file: files[0] });
    const updateSrs = (sourceSrs) => setState({ ...state, sourceSrs });
    const onOkClick = () => {
        const values = {
            style: state.style,
            locale: state.locale,
            file: state.file
        };
        if (showSrs) {
            // add sourceSrs only if field is visible
            values.sourceSrs = state.sourceSrs;
        }
        onOk(values);
        setState({ ...state, loading: true });
    };

    const okBtnType = isImport ? 'import' : 'save';
    const languages = Oskari.getSupportedLanguages();
    const defaultLang = languages[0];
    const hasMandatoryName = Oskari.util.keyExists(state.locale, `${defaultLang}.name`) && state.locale[defaultLang].name.trim().length > 0;

    const validationKeys = isImport && !state.file ? ['file'] : [];
    if (!hasMandatoryName) {
        validationKeys.push('name');
    };
    if (showSrs && state.sourceSrs) {
        const { sourceSrs: srs } = state;
        // check that existing value is valid
        if (isNaN(srs) || srs.length < 4 || srs.length > 6) {
            validationKeys.push('epsg');
        }
    }
    const Component = (
        <Content>
            { isImport && renderImport(state.file, maxSize, updateFile) }
            { showSrs &&
                <SrsInput placeholder={getPlaceholder('srs')} value={state.sourceSrs} onChange={e => updateSrs(e.target.value) }/> }
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
            <Buttons>
                <SecondaryButton type='cancel' onClick={() => onCancel()}/>
                <Tooltip key="okButtonTooltip" title={ getValidationMessage(validationKeys) }>
                    <PrimaryButton disabled={validationKeys.length > 0} type={okBtnType} onClick={onOkClick}/>
                </Tooltip>
            </Buttons>
        </Content>
    );
    if (!error && state.loading) {
        return <Spin showTip={true}>{Component}</Spin>;
    }
    return Component;
};

LayerFormContent.propTypes = {
    values: PropTypes.object,
    config: PropTypes.object.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    error: PropTypes.string
};
