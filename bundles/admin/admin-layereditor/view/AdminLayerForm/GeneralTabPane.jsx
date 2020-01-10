import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { DataProviderSelect } from './DataProviderSelect';
import { LocalizationComponent, TextInput, UrlInput, Message } from 'oskari-ui';
import { MapLayerGroups } from './MapLayerGroups';
import { StyledTab, StyledComponentGroup, StyledComponent } from './StyledFormComponents';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import styled from 'styled-components';
import { SrsSettings } from './GeneralTabPane/SrsSettings';

const LayerComposingModel = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

const PaddedLabel = styled('div')`
    padding-bottom: 5px;
`;
const Padding = styled('div')`
    padding-top: 10px;
`;

const GeneralTabPane = (props) => {
    const { mapLayerGroups, dataProviders, layer, capabilities, propertyFields, bundleKey, controller } = props;
    const credentialProps = {
        allowCredentials: propertyFields.includes(LayerComposingModel.CREDENTIALS),
        defaultOpen: false,
        usernameValue: layer.username,
        passwordValue: layer.password,
        panelText: <Message messageKey='usernameAndPassword'/>,
        usernameText: <Message messageKey='username'/>,
        passwordText: <Message messageKey='password'/>,
        usernameOnChange: controller.setUsername,
        passwordOnChange: controller.setPassword
    };
    const getMsg = Oskari.getMsg.bind(null, bundleKey);
    const localized = {
        labels: {},
        values: {}
    };
    Oskari.getSupportedLanguages().forEach(language => {
        const langPrefix = typeof getMsg(language) === 'object' ? language : 'generic';
        localized.labels[language] = {
            name: getMsg(`${langPrefix}.placeholder`, [language]),
            description: getMsg(`${langPrefix}.descplaceholder`, [language])
        };
        localized.values[language] = {
            name: layer[`name_${language}`],
            description: layer[`title_${language}`]
        };
    });

    const urlInput =
        <Fragment>
            <Message messageKey='interfaceAddress' />
            <StyledComponentGroup>
                <StyledComponent>
                    <div>
                        <UrlInput
                            key={layer.id}
                            value={layer.url}
                            onChange={(url) => controller.setLayerUrl(url)}
                            credentials={credentialProps}
                        />
                    </div>
                </StyledComponent>
            </StyledComponentGroup>
        </Fragment>;

    const nameInput =
        <Fragment>
            <Message messageKey='uniqueName' />
            <StyledComponent>
                <TextInput type='text' value={layer.name} onChange={(evt) => controller.setLayerName(evt.target.value)} />
            </StyledComponent>
        </Fragment>;

    const localizedNamesInput =
        <StyledComponentGroup>
            <LocalizationComponent
                labels={localized.labels}
                value={localized.values}
                languages={Oskari.getSupportedLanguages()}
                onChange={controller.setLocalizedNames}
                LabelComponent={PaddedLabel}
            >
                {/*
                    The inputs have to be on direct children for LocalizationComponent.
                    Can't wrap them to <StyledComponent>.
                */}
                <TextInput type='text' name='name'/>
                <Padding/>
                <TextInput type='text' name='description'/>
                <Padding/>
            </LocalizationComponent>
        </StyledComponentGroup>;

    const dataProviderInput =
        <Fragment>
            <Message messageKey='dataProvider' />
            <StyledComponent>
                <DataProviderSelect key={layer.id}
                    value={layer.organizationName}
                    onChange={(evt) => controller.setDataProvider(evt)}
                    dataProviders={dataProviders} />
            </StyledComponent>
        </Fragment>;

    const mapGroupsInput =
        <Fragment>
            <Message messageKey='mapLayerGroups' />
            <StyledComponent>
                <MapLayerGroups layer={layer} mapLayerGroups={mapLayerGroups} controller={controller} lang={Oskari.getLang()} />
            </StyledComponent>
        </Fragment>;

    return (
        <StyledTab>
            { propertyFields.includes(LayerComposingModel.URL) && urlInput }
            { propertyFields.includes(LayerComposingModel.SRS) &&
                <SrsSettings
                    layer={layer}
                    propertyFields={propertyFields}
                    capabilities={capabilities}
                    onChange={forcedSRS => controller.setForcedSRS(forcedSRS)} />
            }
            { propertyFields.includes(LayerComposingModel.NAME) && nameInput }
            { propertyFields.includes(LayerComposingModel.LOCALIZED_NAMES) && localizedNamesInput }
            { propertyFields.includes(LayerComposingModel.ORGANIZATION_NAME) && dataProviderInput }
            { propertyFields.includes(LayerComposingModel.GROUPS) && mapGroupsInput }
        </StyledTab>
    );
};

GeneralTabPane.propTypes = {
    mapLayerGroups: PropTypes.array.isRequired,
    dataProviders: PropTypes.array.isRequired,
    propertyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    layer: PropTypes.object.isRequired,
    capabilities: PropTypes.object,
    bundleKey: PropTypes.string.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};

const contextWrap = LocaleConsumer(GeneralTabPane);
export { contextWrap as GeneralTabPane };
