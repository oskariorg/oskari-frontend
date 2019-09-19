import React from 'react';
import PropTypes from 'prop-types';
import { DataProviderSelect } from './DataProviderSelect';
import { TextInput, UrlInput, Collapse, Panel } from 'oskari-ui';
import { MapLayerGroups } from './MapLayerGroups';
import { StyledTab, StyledComponentGroup, StyledComponent } from './AdminLayerFormStyledComponents';
import { withContext } from 'oskari-ui/util.jsx';

const GeneralTabPane = (props) => {
    const { mapLayerGroups, dataProviders, layer, service, loc } = props;
    const lang = Oskari.getLang();
    const credentialProps = {
        allowCredentials: true,
        defaultOpen: false,
        usernameValue: layer.username,
        passwordValue: layer.password,
        panelText: loc('usernameAndPassword'),
        usernameText: loc('username'),
        passwordText: loc('password'),
        usernameOnChange: service.setUsername,
        passwordOnChange: service.setPassword
    };
    return (
        <StyledTab>
            <label>{loc('interfaceAddress')}</label>
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
            <label>{loc('uniqueName')}</label>
            <StyledComponent>
                <TextInput type='text' value={layer.layerName} onChange={(evt) => service.setLayerName(evt.target.value)} />
            </StyledComponent>
            {lang === 'fi' &&
                <StyledComponentGroup>
                    <label>{loc('fi.placeholder')}</label>
                    <StyledComponent>
                        <TextInput type='text' value={layer.name_fi} onChange={(evt) => service.setLayerNameInFinnish(evt.target.value)} />
                    </StyledComponent>
                    <label>{loc('fi.descplaceholder')}</label>
                    <StyledComponent>
                        <TextInput type='text' value={layer.title_fi} onChange={(evt) => service.setDescriptionInFinnish(evt.target.value)} />
                    </StyledComponent>
                    <StyledComponent>
                        <Collapse>
                            <Panel header={loc('otherLanguages')}>
                                <div>{loc('en.placeholder')} <TextInput type='text' value={layer.name_en} onChange={(evt) => service.setLayerNameInEnglish(evt.target.value)}/></div>
                                <div>{loc('en.descplaceholder')} <TextInput type='text' value={layer.title_en} onChange={(evt) => service.setDescriptionInEnglish(evt.target.value)}/></div>
                                <div>{loc('sv.placeholder')} <TextInput type='text' value={layer.name_sv} onChange={(evt) => service.setLayerNameInSwedish(evt.target.value)}/></div>
                                <div>{loc('sv.descplaceholder')} <TextInput type='text' value={layer.title_sv} onChange={(evt) => service.setDescriptionInSwedish(evt.target.value)}/></div>
                            </Panel>
                        </Collapse>
                    </StyledComponent>
                </StyledComponentGroup>
            }
            {lang === 'en' &&
                <StyledComponentGroup>
                    <label>{loc('en.placeholder')}</label>
                    <StyledComponent>
                        <TextInput type='text' value={layer.name_en} onChange={(evt) => service.setLayerNameInEnglish(evt.target.value)} />
                    </StyledComponent>
                    <label>{loc('en.descplaceholder')}</label>
                    <StyledComponent>
                        <TextInput type='text' value={layer.title_en} onChange={(evt) => service.setDescriptionInEnglish(evt.target.value)} />
                    </StyledComponent>
                    <StyledComponent>
                        <Collapse>
                            <Panel header={loc('otherLanguages')}>
                                <div>{loc('fi.placeholder')} <TextInput type='text' value={layer.name_fi} onChange={(evt) => service.setLayerNameInFinnish(evt.target.value)}/></div>
                                <div>{loc('fi.descplaceholder')} <TextInput type='text' value={layer.title_fi} onChange={(evt) => service.setDescriptionInFinnish(evt.target.value)}/></div>
                                <div>{loc('sv.placeholder')} <TextInput type='text' value={layer.name_sv} onChange={(evt) => service.setLayerNameInSwedish(evt.target.value)}/></div>
                                <div>{loc('sv.descplaceholder')} <TextInput type='text' value={layer.title_sv} onChange={(evt) => service.setDescriptionInSwedish(evt.target.value)}/></div>
                            </Panel>
                        </Collapse>
                    </StyledComponent>
                </StyledComponentGroup>
            }
            {lang === 'sv' &&
                <StyledComponentGroup>
                    <label>{loc('sv.placeholder')}</label>
                    <StyledComponent>
                        <TextInput type='text' value={layer.name_sv} onChange={(evt) => service.setLayerNameInSwedish(evt.target.value)} />
                    </StyledComponent>
                    <label>{loc('sv.descplaceholder')}</label>
                    <StyledComponent>
                        <TextInput type='text' value={layer.title_sv} onChange={(evt) => service.setDescriptionInSwedish(evt.target.value)} />
                    </StyledComponent>
                    <StyledComponent>
                        <Collapse>
                            <Panel header={loc('otherLanguages')}>
                                <div>{loc('fi.placeholder')} <TextInput type='text' value={layer.name_sv} onChange={(evt) => service.setLayerNameInFinnish(evt.target.value)}/></div>
                                <div>{loc('fi.descplaceholder')} <TextInput type='text' value={layer.title_fi} onChange={(evt) => service.setDescriptionInFinnish(evt.target.value)}/></div>
                                <div>{loc('en.placeholder')} <TextInput type='text' value={layer.name_en} onChange={(evt) => service.setLayerNameInEnglish(evt.target.value)}/></div>
                                <div>{loc('en.descplaceholder')} <TextInput type='text' value={layer.title_en} onChange={(evt) => service.setDescriptionInEnglish(evt.target.value)}/></div>
                            </Panel>
                        </Collapse>
                    </StyledComponent>
                </StyledComponentGroup>
            }
            <label>{loc('dataProvider')}</label>
            <StyledComponent>
                <DataProviderSelect key={layer.layer_id}
                    value={layer.organizationName}
                    onChange={(evt) => service.setDataProvider(evt)}
                    dataProviders={dataProviders} />
            </StyledComponent>
            <label>{loc('mapLayerGroups')}</label>
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
    loc: PropTypes.func
};

const contextWrap = withContext(GeneralTabPane);
export { contextWrap as GeneralTabPane };
