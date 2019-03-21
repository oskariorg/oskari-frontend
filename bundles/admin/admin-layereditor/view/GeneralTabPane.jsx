import React from 'react';
import PropTypes from 'prop-types';
import { DataProviderSelect } from './DataProviderSelect';
import { TextInput } from '../components/TextInput';
import { UrlInput } from '../components/UrlInput';
import { Collapse, Panel } from '../components/Collapse';
import { MapLayerGroups } from './MapLayerGroups';
import { StyledTab, StyledComponentGroup, StyledComponent } from './AdminLayerFormStyledComponents';

export const GeneralTabPane = ({layer, service, generalProps}) => {
    return (
        <StyledTab>
            <label>Interface URL</label>
            <StyledComponentGroup>
                <StyledComponent>
                    <div>
                        <UrlInput value={layer.layerUrl} onChange={(url) => service.setLayerUrl(url)} />
                    </div>
                </StyledComponent>
                <StyledComponent>
                    <Collapse>
                        <Panel header='Username and password'>
                            <div>
                                <label>Username</label>
                                <div><TextInput value={layer.username} type='text' onChange={(evt) => service.setUsername(evt.target.value)} /></div>
                            </div>
                            <div>
                                <label>Password</label>
                                <div><TextInput value={layer.password} type='password' onChange={(evt) => service.setPassword(evt.target.value)} /></div>
                            </div>
                        </Panel>
                    </Collapse>
                </StyledComponent>
            </StyledComponentGroup>
            <label>Unique name</label>
            <StyledComponent>
                <TextInput type='text' value={layer.layerName} onChange={(evt) => service.setLayerName(evt.target.value)} />
            </StyledComponent>
            <StyledComponentGroup>
                <label>Layer name in Finnish</label>
                <StyledComponent>
                    <TextInput type='text' value={layer.name_fi} onChange={(evt) => service.setLayerNameInFinnish(evt.target.value)} />
                </StyledComponent>
                <StyledComponent>
                    <Collapse>
                        <Panel header='Other languages'>
                            <div>In English <TextInput type='text' value={layer.name_en} onChange={(evt) => service.setLayerNameInEnglish(evt.target.value)}/></div>
                            <div>In Swedish <TextInput type='text' value={layer.name_sv} onChange={(evt) => service.setLayerNameInSwedish(evt.target.value)}/></div>
                        </Panel>
                    </Collapse>
                </StyledComponent>
            </StyledComponentGroup>
            <label>Data provider</label>
            <StyledComponent>
                <DataProviderSelect defaultValue={layer.dataProvider} onChange={(evt) => service.setDataProvider(evt)} dataProviders={generalProps.dataProviders} />
            </StyledComponent>
            <label>Maplayer groups</label>
            <StyledComponent>
                <MapLayerGroups groups={generalProps.mapLayerGroups} service={service} />
            </StyledComponent>
        </StyledTab>
    );
};

GeneralTabPane.propTypes = {
    service: PropTypes.any,
    layer: PropTypes.any,
    generalProps: PropTypes.any
};
