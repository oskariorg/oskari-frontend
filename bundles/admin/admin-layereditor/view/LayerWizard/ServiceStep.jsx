import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { Header, Paragraph, StyledButton } from './styled';
import { ServiceEndPoint } from '../ServiceEndPoint/ServiceEndPoint';

const {
    URL,
    CESIUM_ION,
    API_KEY
} = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

const hasServiceEndpoint = ({ url, options}, propertyFields) => {
    if (propertyFields.includes(URL) && url) {
        return true;
    }
    if (propertyFields.includes(CESIUM_ION) && options.ionAssetId) {
        return true;
    }
    if (propertyFields.includes(API_KEY) && options.apiKey) {
        return true;
    }
    return false;
};

export const ServiceStep = ({ layer, controller, versions, propertyFields, loading, credentialsCollapseOpen }) => (
    <Fragment>
        <Message messageKey='wizard.service' LabelComponent={Header}/>
        <Message messageKey='wizard.serviceDescription' LabelComponent={Paragraph}/>
        <ServiceEndPoint
            layer={layer}
            controller={controller}
            disabled={loading}
            credentialsCollapseOpen={credentialsCollapseOpen}
            propertyFields={propertyFields}
        />
        { versions.map((version, i) => (
            <StyledButton
                type="primary"
                key={i}
                onClick={() => controller.setVersion(version)}
                disabled={!hasServiceEndpoint(layer, propertyFields) || loading}
            >
                {version}
            </StyledButton>
        ))}
    </Fragment>
);
ServiceStep.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    propertyFields: PropTypes.array.isRequired,
    versions: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    credentialsCollapseOpen: PropTypes.bool.isRequired
};
