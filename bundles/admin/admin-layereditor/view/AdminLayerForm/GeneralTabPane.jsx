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
    const { mapLayerGroups, dataProviders, layer, service, Message } = props;
    const lang = Oskari.getLang();
    const credentialProps = {
        allowCredentials: true,
        defaultOpen: false,
        usernameValue: layer.username,
        passwordValue: layer.password,
        panelText: <Message messageKey='usernameAndPassword'/>,
        usernameText: <Message messageKey='username'/>,
        passwordText: <Message messageKey='password'/>,
        usernameOnChange: service.setUsername,
        passwordOnChange: service.setPassword
    };
    return (
        <StyledTab>
            <Message messageKey='interfaceAddress' />
            <StyledComponentGroup>
                <StyledComponent>
                    <div>
                        <UrlInput
                            key={layer.id}
                            value={layer.url}
                            onChange={(url) => service.setLayerUrl(url)}
                            credentials={credentialProps}
                        />
                    </div>
                </StyledComponent>
            </StyledComponentGroup>
            <Message messageKey='uniqueName' />
            <StyledComponent>
                <TextInput type='text' value={layer.name} onChange={(evt) => service.setLayerName(evt.target.value)} />
            </StyledComponent>
            <StyledComponentGroup>
                <LocalizedLayerInfo layer={layer} lang={lang} service={service} />
                <StyledComponent>
                    <OtherLanguagesPane layer={layer} lang={lang} service={service} />
                </StyledComponent>
            </StyledComponentGroup>
            <Message messageKey='dataProvider' />
            <StyledComponent>
                <DataProviderSelect key={layer.id}
                    value={layer.organizationName}
                    onChange={(evt) => service.setDataProvider(evt)}
                    dataProviders={dataProviders} />
            </StyledComponent>
            <Message messageKey='mapLayerGroups' />
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
    Message: PropTypes.elementType.isRequired
};

const contextWrap = withLocale(GeneralTabPane);
export { contextWrap as GeneralTabPane };
