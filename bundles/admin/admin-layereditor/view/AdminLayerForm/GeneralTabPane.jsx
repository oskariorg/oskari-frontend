import React from 'react';
import PropTypes from 'prop-types';
import { DataProviderSelect } from './DataProviderSelect';
import { TextInput, UrlInput, Message } from 'oskari-ui';
import { MapLayerGroups } from './MapLayerGroups';
import { StyledTab, StyledComponentGroup, StyledComponent } from './StyledFormComponents';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { LocalizedLayerInfo } from './LocalizedLayerInfo';
import { OtherLanguagesPane } from './OtherLanguagesPane';

const GeneralTabPane = (props) => {
    const { mapLayerGroups, dataProviders, layer, controller } = props;
    const lang = Oskari.getLang();
    const credentialProps = {
        allowCredentials: true,
        defaultOpen: false,
        usernameValue: layer.username,
        passwordValue: layer.password,
        panelText: <Message messageKey='usernameAndPassword'/>,
        usernameText: <Message messageKey='username'/>,
        passwordText: <Message messageKey='password'/>,
        usernameOnChange: controller.setUsername,
        passwordOnChange: controller.setPassword
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
                            onChange={(url) => controller.setLayerUrl(url)}
                            credentials={credentialProps}
                        />
                    </div>
                </StyledComponent>
            </StyledComponentGroup>
            <Message messageKey='uniqueName' />
            <StyledComponent>
                <TextInput type='text' value={layer.name} onChange={(evt) => controller.setLayerName(evt.target.value)} />
            </StyledComponent>
            <StyledComponentGroup>
                <LocalizedLayerInfo layer={layer} lang={lang} controller={controller} />
                <StyledComponent>
                    <OtherLanguagesPane layer={layer} lang={lang} controller={controller} />
                </StyledComponent>
            </StyledComponentGroup>
            <Message messageKey='dataProvider' />
            <StyledComponent>
                <DataProviderSelect key={layer.id}
                    value={layer.organizationName}
                    onChange={(evt) => controller.setDataProvider(evt)}
                    dataProviders={dataProviders} />
            </StyledComponent>
            <Message messageKey='mapLayerGroups' />
            <StyledComponent>
                <MapLayerGroups layer={layer} mapLayerGroups={mapLayerGroups} controller={controller} lang={lang} />
            </StyledComponent>
        </StyledTab>
    );
};

GeneralTabPane.propTypes = {
    mapLayerGroups: PropTypes.array.isRequired,
    dataProviders: PropTypes.array.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    layer: PropTypes.object
};

const contextWrap = LocaleConsumer(GeneralTabPane);
export { contextWrap as GeneralTabPane };
