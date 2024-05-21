import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Tooltip } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { MetadataButton } from './styled';

export const ServiceMetadata = ({ capabilities, controller, hasHandler, layerId }) => {
    // as of Oskari server 2.8.0-SNAPSHOT:
    /*
    "capabilities": {
        "metadataUrl": "the whole url instead of just metadata uuid"
        "metadataId": "uuid from metadata url"
        ...
    */
    const metadataUuid = capabilities.metadataId;
    if (!metadataUuid) {
        return (
            <Fragment>
                <Message messageKey='metadata.service' />
                <span>:&nbsp;</span>
                <Message messageKey='serviceNotAvailable' />
            </Fragment>
        );
    }
    return (
        <Tooltip title={metadataUuid}>
            <Message messageKey='metadata.service' />
            {hasHandler &&
                <MetadataButton onClick={() => controller.showLayerMetadata(layerId || metadataUuid)}/>
            }
        </Tooltip>
    );
};

ServiceMetadata.propTypes = {
    hasHandler: PropTypes.bool.isRequired,
    capabilities: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    layerId: PropTypes.number
};
