import React from 'react';
import PropTypes from 'prop-types';
import { DataProviderSelect } from './DataProviderSelect';
import { TextInput, UrlInput, Collapse, CollapsePanel } from 'oskari-ui';
import { MapLayerGroups } from './MapLayerGroups';
import { StyledTab, StyledComponentGroup, StyledComponent } from './StyledFormComponents';
import { withLocale } from 'oskari-ui/util';

const getLocalizedLabels = (lang, getMessage) => {
    let prefix = typeof getMessage(lang) === 'object' ? lang : 'generic';
    return {
        name: getMessage(`${prefix}.placeholder`, [lang]),
        description: getMessage(`${prefix}.descplaceholder`, [lang])
    };
};

const LocalizedLayerInfo = ({ layer, lang, service, getMessage }) => {
    const selectedLang = Oskari.getLang();
    const name = layer[`name_${lang}`];
    const description = layer[`title_${lang}`];
    const labels = getLocalizedLabels(lang, getMessage);
    const onNameChange = evt => service.setLocalizedLayerName(lang, evt.target.value);
    const onDescriptionChange = evt => service.setLocalizedLayerDescription(lang, evt.target.value);
    const nameInput = <TextInput type='text' value={name} onChange={onNameChange} />;
    const descInput = <TextInput type='text' value={description} onChange={onDescriptionChange} />;
    if (selectedLang === lang) {
        return (
            <React.Fragment>
                <label>{labels.name}</label>
                <StyledComponent>
                    {nameInput}
                </StyledComponent>
                <label>{labels.description}</label>
                <StyledComponent>
                    {descInput}
                </StyledComponent>
            </React.Fragment>
        );
    }
    return (
        <React.Fragment>
            <div>{labels.name}{nameInput}</div>
            <div>{labels.description}{descInput}</div>
        </React.Fragment>
    );
};
LocalizedLayerInfo.propTypes = {
    lang: PropTypes.string.isRequired,
    service: PropTypes.object.isRequired,
    layer: PropTypes.object.isRequired,
    getMessage: PropTypes.func.isRequired
};

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
                            value={layer.layerUrl}
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
                    <Collapse>
                        <CollapsePanel header={getMessage('otherLanguages')}>
                            {
                                Oskari.getSupportedLanguages()
                                    .filter(supportedLang => supportedLang !== lang)
                                    .map(lang => <LocalizedLayerInfo
                                        key={layer.layer_id + lang}
                                        layer={layer}
                                        lang={lang}
                                        service={service}
                                        getMessage={getMessage} />)
                            }
                        </CollapsePanel>
                    </Collapse>
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
