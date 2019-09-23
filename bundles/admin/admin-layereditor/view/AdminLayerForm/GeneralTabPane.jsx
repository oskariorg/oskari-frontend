import React from 'react';
import PropTypes from 'prop-types';
import { DataProviderSelect } from './DataProviderSelect';
import { TextInput, UrlInput, Collapse, CollapsePanel } from 'oskari-ui';
import { MapLayerGroups } from './MapLayerGroups';
import { StyledTab, StyledComponentGroup, StyledComponent } from './StyledFormComponents';
import { withLocale } from 'oskari-ui/util';

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
            {lang === 'fi' &&
                <StyledComponentGroup>
                    <label>{getMessage('fi.placeholder')}</label>
                    <StyledComponent>
                        <TextInput type='text' value={layer.name_fi} onChange={(evt) => service.setLayerNameInFinnish(evt.target.value)} />
                    </StyledComponent>
                    <label>{getMessage('fi.descplaceholder')}</label>
                    <StyledComponent>
                        <TextInput type='text' value={layer.title_fi} onChange={(evt) => service.setDescriptionInFinnish(evt.target.value)} />
                    </StyledComponent>
                    <StyledComponent>
                        <Collapse>
                            <CollapsePanel header={getMessage('otherLanguages')}>
                                <div>{getMessage('en.placeholder')} <TextInput type='text' value={layer.name_en} onChange={(evt) => service.setLayerNameInEnglish(evt.target.value)}/></div>
                                <div>{getMessage('en.descplaceholder')} <TextInput type='text' value={layer.title_en} onChange={(evt) => service.setDescriptionInEnglish(evt.target.value)}/></div>
                                <div>{getMessage('sv.placeholder')} <TextInput type='text' value={layer.name_sv} onChange={(evt) => service.setLayerNameInSwedish(evt.target.value)}/></div>
                                <div>{getMessage('sv.descplaceholder')} <TextInput type='text' value={layer.title_sv} onChange={(evt) => service.setDescriptionInSwedish(evt.target.value)}/></div>
                            </CollapsePanel>
                        </Collapse>
                    </StyledComponent>
                </StyledComponentGroup>
            }
            {lang === 'en' &&
                <StyledComponentGroup>
                    <label>{getMessage('en.placeholder')}</label>
                    <StyledComponent>
                        <TextInput type='text' value={layer.name_en} onChange={(evt) => service.setLayerNameInEnglish(evt.target.value)} />
                    </StyledComponent>
                    <label>{getMessage('en.descplaceholder')}</label>
                    <StyledComponent>
                        <TextInput type='text' value={layer.title_en} onChange={(evt) => service.setDescriptionInEnglish(evt.target.value)} />
                    </StyledComponent>
                    <StyledComponent>
                        <Collapse>
                            <CollapsePanel header={getMessage('otherLanguages')}>
                                <div>{getMessage('fi.placeholder')} <TextInput type='text' value={layer.name_fi} onChange={(evt) => service.setLayerNameInFinnish(evt.target.value)}/></div>
                                <div>{getMessage('fi.descplaceholder')} <TextInput type='text' value={layer.title_fi} onChange={(evt) => service.setDescriptionInFinnish(evt.target.value)}/></div>
                                <div>{getMessage('sv.placeholder')} <TextInput type='text' value={layer.name_sv} onChange={(evt) => service.setLayerNameInSwedish(evt.target.value)}/></div>
                                <div>{getMessage('sv.descplaceholder')} <TextInput type='text' value={layer.title_sv} onChange={(evt) => service.setDescriptionInSwedish(evt.target.value)}/></div>
                            </CollapsePanel>
                        </Collapse>
                    </StyledComponent>
                </StyledComponentGroup>
            }
            {lang === 'sv' &&
                <StyledComponentGroup>
                    <label>{getMessage('sv.placeholder')}</label>
                    <StyledComponent>
                        <TextInput type='text' value={layer.name_sv} onChange={(evt) => service.setLayerNameInSwedish(evt.target.value)} />
                    </StyledComponent>
                    <label>{getMessage('sv.descplaceholder')}</label>
                    <StyledComponent>
                        <TextInput type='text' value={layer.title_sv} onChange={(evt) => service.setDescriptionInSwedish(evt.target.value)} />
                    </StyledComponent>
                    <StyledComponent>
                        <Collapse>
                            <CollapsePanel header={getMessage('otherLanguages')}>
                                <div>{getMessage('fi.placeholder')} <TextInput type='text' value={layer.name_sv} onChange={(evt) => service.setLayerNameInFinnish(evt.target.value)}/></div>
                                <div>{getMessage('fi.descplaceholder')} <TextInput type='text' value={layer.title_fi} onChange={(evt) => service.setDescriptionInFinnish(evt.target.value)}/></div>
                                <div>{getMessage('en.placeholder')} <TextInput type='text' value={layer.name_en} onChange={(evt) => service.setLayerNameInEnglish(evt.target.value)}/></div>
                                <div>{getMessage('en.descplaceholder')} <TextInput type='text' value={layer.title_en} onChange={(evt) => service.setDescriptionInEnglish(evt.target.value)}/></div>
                            </CollapsePanel>
                        </Collapse>
                    </StyledComponent>
                </StyledComponentGroup>
            }
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
