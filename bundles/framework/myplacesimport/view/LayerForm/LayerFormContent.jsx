import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tabs, TabPane, Message, Tooltip, Spin } from 'oskari-ui';
import { GeneralTab, VisualizationTab } from './';
import { SecondaryButton, PrimaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { ERRORS } from '../../constants';
import { OSKARI_BLANK_STYLE } from 'oskari-ui/components/StyleEditor/index';
import { MandatoryIcon } from 'oskari-ui/components/icons';

const Content = styled.div`
    margin: 12px 24px 24px;
`;
const Tab = styled(TabPane)`
    width: 500px;
`;

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
const getGeneralTabTitle = isValid => (
    <Fragment>
        <Message messageKey='flyout.tabs.general'/>
        <MandatoryIcon isValid={isValid} />
    </Fragment>
);

export const LayerFormContent = ({ values, config, onOk, onCancel, error }) => {
    const { maxSize, isImport } = config;
    const { style = OSKARI_BLANK_STYLE, locale = {} } = values || {};
    const [state, setState] = useState({ style, locale, loading: false, tab: 'general' });

    const showSrs = isImport && error === ERRORS.NO_SRS;

    const updateStyle = (style) => setState({ ...state, style });
    const setTab = (tab) => setState({ ...state, tab });
    const updateState = (newState) => setState({ ...state, ...newState });
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
    const isValid = validationKeys.length === 0;
    const Component = (
        <Content>
            <Tabs activeKey={state.tab} onChange={tabKey => setTab(tabKey)}>
                <Tab key='general' tab={getGeneralTabTitle(isValid)} >
                    <GeneralTab
                        languages = {languages}
                        locale = {state.locale}
                        file = {state.file}
                        sourceSrs = {state.sourceSrs}
                        isImport = {isImport}
                        maxSize = {maxSize}
                        showSrs = {showSrs}
                        updateState = {updateState}
                    />
                </Tab>
                <Tab key='visualization' tab={<Message messageKey='flyout.tabs.visualization'/>}>
                    <VisualizationTab updateStyle={updateStyle} style={state.style} />
                </Tab>
            </Tabs>
            <ButtonContainer>
                <SecondaryButton type='cancel' onClick={() => onCancel()}/>
                <Tooltip key="okButtonTooltip" title={ getValidationMessage(validationKeys) }>
                    <PrimaryButton disabled={!isValid} type={okBtnType} onClick={onOkClick}/>
                </Tooltip>
            </ButtonContainer>
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
