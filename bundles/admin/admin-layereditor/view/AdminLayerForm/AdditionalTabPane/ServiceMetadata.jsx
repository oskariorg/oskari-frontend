import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Tooltip } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { MetadataButton } from './styled';

export const ServiceMetadata = ({ capabilities, controller, hasHandler }) => {
    // this is currently 2.7.0-SNAPSHOT:
    /*
    "typeSpecific": {
        "metadataUrl": "the whole url instead of just metadata uuid"
        ...
    */
    // FIXME: parse uuid part to be accessible directly from somewhere under capabilities AND update reference here:
    const { metadataUuid } = capabilities;
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
                <MetadataButton onClick={() => controller.showLayerMetadata(metadataUuid)}/>
            }
        </Tooltip>
    );
};

ServiceMetadata.propTypes = {
    hasHandler: PropTypes.bool.isRequired,
    capabilities: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
