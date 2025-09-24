import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tabs, Message, Tooltip, Spin } from 'oskari-ui';
import { GeneralTab, VisualizationTab } from './';
import { SecondaryButton, PrimaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { ERRORS } from '../../constants';
import { MandatoryIcon } from 'oskari-ui/components/icons';

const Content = styled.div`
    margin: 12px 24px 24px;
`;
const Tab = styled('div')`
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
        <MandatoryIcon isValid={isValid} style={{
            verticalAlign: '-0.25em',
            paddingLeft: '0.5em'
        }}/>
    </Fragment>
);

export const LayerFormContent = ({ values, config, onOk, onCancel, error }) => {
    const { maxSize, unzippedMaxSize, isImport } = config;
    const { style = Oskari.custom.generateBlankStyle(), locale = {} } = values || {};
    const [state, setState] = useState({ style, locale, loading: false, tab: 'general', file: values?.file });

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
            <Tabs
                activeKey={state.tab}
                onChange={tabKey => setTab(tabKey)}
                items={[
                    {
                        key: 'general',
                        label: getGeneralTabTitle(isValid),
                        children: (
                            <Tab>
                                <GeneralTab
                                    languages = {languages}
                                    locale = {state.locale}
                                    file = {state.file}
                                    sourceSrs = {state.sourceSrs}
                                    isImport = {isImport}
                                    maxSize = {maxSize}
                                    unzippedMaxSize = {unzippedMaxSize}
                                    showSrs = {showSrs}
                                    updateState = {updateState}
                                />
                            </Tab>
                        )
                    },
                    {
                        key: 'visualization',
                        label: <Message messageKey='flyout.tabs.visualization'/>,
                        children: <Tab><VisualizationTab updateStyle={updateStyle} style={state.style} /></Tab>
                    }
                ]}
            />
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
