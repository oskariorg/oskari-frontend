import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { CesiumIon } from './CesiumIon';
import { StyledFormField } from '../AdminLayerForm/styled';
import { ApiKey } from './ApiKey';
import { ServiceUrlInput } from './ServiceUrlInput';

const {
    API_KEY,
    CESIUM_ION,
    URL
} = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

const protocols = ['http://', 'https://'];

export const ServiceEndPoint = ({ layer, propertyFields, disabled, credentialsCollapseOpen, controller }) => {
    const urlSelected = propertyFields.includes(URL) && !!layer.url && !protocols.includes(layer.url);
    const ionAssetSelected = propertyFields.includes(CESIUM_ION) && !!layer.options.ionAssetId;
    return (
        <Fragment>
            <Message messageKey='interfaceAddress' />
            <StyledFormField>
                { propertyFields.includes(URL) && !ionAssetSelected &&
                    <ServiceUrlInput
                        layer={layer}
                        credentialsCollapseOpen={credentialsCollapseOpen}
                        controller={controller}
                        disabled={disabled}
                        propertyFields={propertyFields} />
                }
                { propertyFields.includes(CESIUM_ION) && !urlSelected &&
                    <CesiumIon layer={layer} controller={controller} />
                }
            </StyledFormField>
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
