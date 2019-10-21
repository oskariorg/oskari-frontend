import React from 'react';
import PropTypes from 'prop-types';
import { DataProviderSelect } from './DataProviderSelect';
import { TextInput, UrlInput } from 'oskari-ui';
import { MapLayerGroups } from './MapLayerGroups';
import { StyledTab, StyledComponentGroup, StyledComponent } from './StyledFormComponents';
import { withLocale } from 'oskari-ui/util';
import { LocalizedLayerInfo } from './LocalizedLayerInfo';
import { OtherLanguagesPane } from './OtherLanguagesPane';

const GeneralTabPane = (props) => {
    const { mapLayerGroups, dataProviders, layer, service, getMessage } = props;
    const lang = Oskari.getLang();
    const credentialProps = {
        allowCredentials: true,
        defaultOpen: false,
        usernameValue: layer.username,
        passwordValue: layer.password,
        panelText: getMessage('usernameAndPassword'),
        usernameText: getMessage('username'),
        passwordText: getMessage('password'),
        usernameOnChange: service.setUsername,
        passwordOnChange: service.setPassword
    };
    return (
        <StyledTab>
            <label>{getMessage('interfaceAddress')}</label>
            <StyledComponentGroup>
                <StyledComponent>
                    <div>
                        <UrlInput
                            key={layer.layer_id}
                            value={layer.url}
                            onChange={(url) => service.setLayerUrl(url)}
                            credentials={credentialProps}
                        />
                    </div>
                </StyledComponent>
            </StyledComponentGroup>
            <label>{getMessage('uniqueName')}</label>
            <StyledComponent>
                <TextInput type='text' value={layer.layerName} onChange={(evt) => service.setLayerName(evt.target.value)} />
            </StyledComponent>
            <StyledComponentGroup>
                <LocalizedLayerInfo layer={layer} lang={lang} service={service} getMessage={getMessage} />
                <StyledComponent>
                    <OtherLanguagesPane layer={layer} lang={lang} service={service} getMessage={getMessage} />
                </StyledComponent>
            </StyledComponentGroup>
            <label>{getMessage('dataProvider')}</label>
            <StyledComponent>
                <DataProviderSelect key={layer.layer_id}
                    value={layer.organizationName}
                    onChange={(evt) => service.setDataProvider(evt)}
                    dataProviders={dataProviders} />
            </StyledComponent>
            <label>{getMessage('mapLayerGroups')}</label>
            <StyledComponent>
                <MapLayerGroups layer={layer} mapLayerGroups={mapLayerGroups} service={service} lang={lang} />
            </StyledComponent>
        </StyledTab>
    );
};

GeneralTabPane.propTypes = {
    mapLayerGroups: PropTypes.array.isRequired,
    dataProviders: PropTypes.array.isRequired,
    service: PropTypes.any,
    layer: PropTypes.object,
    getMessage: PropTypes.func
};

const contextWrap = withLocale(GeneralTabPane);
export { contextWrap as GeneralTabPane };