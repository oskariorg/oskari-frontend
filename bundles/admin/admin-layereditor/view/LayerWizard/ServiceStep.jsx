import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, TextInput } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { Header, Paragraph } from './styled';
import { ServiceUrlInput } from '../ServiceUrlInput';
import { CesiumIon } from '../CesiumIon';

const {
    URL,
    CESIUM_ION,
    API_KEY
} = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

export const ServiceStep = ({ layer, controller, versions, propertyFields, credentialsCollapseOpen }) => {
    const ionAssetSelected = propertyFields.includes(CESIUM_ION) && !!layer.options.assetId;
    return (
        <Fragment>
            <Message messageKey='wizard.service' LabelComponent={Header}/>
            <Message messageKey='wizard.serviceDescription' LabelComponent={Paragraph}/>
            { propertyFields.includes(URL) && !ionAssetSelected &&
                <ServiceUrlInput
                    layer={layer}
                    controller={controller}
                    propertyFields={propertyFields}
                    credentialsCollapseOpen={credentialsCollapseOpen} />
            }
            { propertyFields.includes(API_KEY) &&
                <Fragment>
                    <Message messageKey='apiKey' LabelComponent={Header}/>
                    <TextInput value={layer.apiKey} onChange={evt => controller.setApiKey(evt.target.value)} />
                </Fragment>
            }
            { propertyFields.includes(CESIUM_ION) &&
                <CesiumIon layer={layer} controller={controller} defaultOpen />
            }
        </Fragment>
    );
};
ServiceStep.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    propertyFields: PropTypes.array,
    versions: PropTypes.array.isRequired,
    credentialsCollapseOpen: PropTypes.bool.isRequired
};
