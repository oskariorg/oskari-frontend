import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { CesiumIon } from './CesiumIon';
import { StyledFormField } from '../AdminLayerForm/styled';
import { ApiKey } from './ApiKey';
import { ServiceUrlInput } from './ServiceUrlInput';
import { MandatoryIcon } from '../AdminLayerForm/Mandatory';

const {
    API_KEY,
    CESIUM_ION,
    URL
} = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

const protocols = ['http://', 'https://'];

export const ServiceEndPoint = ({ layer, propertyFields, disabled, credentialsCollapseOpen, controller }) => {
    let serviceUrlInput = null;
    const ionAssetSelected = propertyFields.includes(CESIUM_ION) && !!layer.options.ionAssetId;
    if (propertyFields.includes(URL) && !ionAssetSelected) {
        serviceUrlInput = (
            <ServiceUrlInput
                layer={layer}
                credentialsCollapseOpen={credentialsCollapseOpen}
                controller={controller}
                disabled={disabled}
                propertyFields={propertyFields} />
        );
    }
    let cesiumIonSettings = null;
    const urlSelected = propertyFields.includes(URL) && !!layer.url && !protocols.includes(layer.url);
    if (propertyFields.includes(CESIUM_ION) && !urlSelected) {
        cesiumIonSettings = <CesiumIon layer={layer} controller={controller} />;
    }
    return (
        <Fragment>
            { (serviceUrlInput || cesiumIonSettings) &&
                <Fragment>
                    <Message messageKey='interfaceAddress' /> (<Message messageKey={`layertype.${layer.type}`} defaultMsg={layer.type} />) <MandatoryIcon isValid={!!layer.url} />
                    <StyledFormField>
                        {serviceUrlInput}
                        {cesiumIonSettings}
                    </StyledFormField>
                </Fragment>
            }
            { propertyFields.includes(API_KEY) &&
                <ApiKey layer={layer} controller={controller} />
            }
        </Fragment>
    );
};
ServiceEndPoint.propTypes = {
    layer: PropTypes.object.isRequired,
    propertyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    disabled: PropTypes.bool,
    credentialsCollapseOpen: PropTypes.bool,
    controller: PropTypes.instanceOf(Controller).isRequired
};
