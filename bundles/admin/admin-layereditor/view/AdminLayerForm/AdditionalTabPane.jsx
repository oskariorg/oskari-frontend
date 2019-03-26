import React from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '../../components/TextInput';
import { TextAreaInput } from '../../components/TextAreaInput';
import { StyledTab, StyledComponent } from './AdminLayerFormStyledComponents';
import {GenericContext} from '../../../../../src/react/util.jsx';

export const AdditionalTabPane = ({layer, service}) => {
    return (
        <GenericContext.Consumer>
            {value => {
                const loc = value.loc;
                return (
                    <StyledTab>
                        <label>{loc('metaInfoId')}</label>
                        <StyledComponent>
                            <TextInput placeholder={loc('metaInfoIdDesc')}
                                value={layer.metadataIdentifier} onChange={(evt) => service.setMetadataIdentifier(evt.target.value)} />
                        </StyledComponent>
                        <label>{loc('gfiContent')}</label>
                        <StyledComponent>
                            <TextAreaInput rows={6} value={layer.gfiContent} onChange={(evt) => service.setGfiContent(evt.target.value)} />
                        </StyledComponent>
                        <label>{loc('attributes')}</label>
                        <StyledComponent>
                            <TextAreaInput rows={6} value={layer.attributes} onChange={(evt) => service.setAttributes(evt.target.value)} />
                        </StyledComponent>
                    </StyledTab>
                );
            }}
        </GenericContext.Consumer>
    );
};

AdditionalTabPane.propTypes = {
    layer: PropTypes.object,
    service: PropTypes.any,
    additionalProps: PropTypes.any
};
