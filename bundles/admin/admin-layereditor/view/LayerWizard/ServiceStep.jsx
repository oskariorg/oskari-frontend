import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { Header, StyledButton } from './styled';
import { ServiceEndPoint } from '../ServiceEndPoint/ServiceEndPoint';

const {
    URL,
    CESIUM_ION,
    API_KEY
} = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

const hasServiceEndpoint = ({ url, options }, propertyFields) => {
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

const VersionButton = ({ version, controller, ...rest }) => (
    <StyledButton type="primary" onClick={() => controller.setVersion(version)} { ...rest }>
        { version && version }
        { !version && <Message messageKey='ok'/> }
    </StyledButton>
);
VersionButton.propTypes = {
    version: PropTypes.string.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};

export const ServiceStep = ({ layer, controller, versions, propertyFields, loading, credentialsCollapseOpen }) => {
    const versionsDisabled = !hasServiceEndpoint(layer, propertyFields) || loading;
    if (versions.length === 0) {
        versions.push('');
    }
    return (
        <Fragment>
            <Message messageKey='wizard.service' LabelComponent={Header}>
                : <Message messageKey='wizard.serviceDescription'/>
            </Message>
            <ServiceEndPoint
                layer={layer}
                controller={controller}
                disabled={loading}
                credentialsCollapseOpen={credentialsCollapseOpen}
                propertyFields={propertyFields}
            />
            { versions.map((version, i) => (
                <VersionButton key={i} version={version} controller={controller} disabled={versionsDisabled} />
            )) }
        </Fragment>
    );
};
ServiceStep.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    propertyFields: PropTypes.array.isRequired,
    versions: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    credentialsCollapseOpen: PropTypes.bool.isRequired
};
