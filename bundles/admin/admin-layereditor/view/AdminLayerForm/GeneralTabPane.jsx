import React from 'react';
import PropTypes from 'prop-types';
import {DataProviderSelect} from './DataProviderSelect';
import {TextInput} from '../../components/TextInput';
import {UrlInput} from '../../components/UrlInput';
import {Collapse, Panel} from '../../components/Collapse';
import {MapLayerGroups} from './MapLayerGroups';
import {StyledTab, StyledComponentGroup, StyledComponent} from './AdminLayerFormStyledComponents';
import {GenericContext} from '../../../../../src/react/util.jsx';

export const GeneralTabPane = ({layer, service}) => {
    return (
        <GenericContext.Consumer>
            {value => {
                const loc = value.loc;
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
                            <DataProviderSelect value={layer.organizationName} onChange={(evt) => service.setDataProvider(evt)} dataProviders={layer.dataProviders} />
                        </StyledComponent>
                        <label>{loc('mapLayerGroups')}</label>
                        <StyledComponent>
                            <MapLayerGroups allGroups={layer.allGroups} service={service} lang={lang} />
                        </StyledComponent>
                    </StyledTab>
                );
            }}
        </GenericContext.Consumer>
    );
};

GeneralTabPane.propTypes = {
    service: PropTypes.any,
    layer: PropTypes.object
};
