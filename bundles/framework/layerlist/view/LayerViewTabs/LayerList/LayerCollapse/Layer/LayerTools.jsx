import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { WarningIcon, Message } from 'oskari-ui';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import { LayerIcon } from 'oskari-ui/components/icons';
import { MetadataIcon } from 'oskari-ui/components/icons';
import { BACKEND_STATUS_AVAILABLE } from '../../../../../constants';

const Tools = styled('div')`
    display: flex;
    align-items: center;
    > * {
        margin-left: 3px;
    }
`;

const getBackendStatus = (layer) => {
    const backendStatus = layer.getBackendStatus() || 'UNKNOWN';
    const status = {
        status: backendStatus,
        messageKey: `backendStatus.${backendStatus}`,
        color: getStatusColor(backendStatus)
    };
    return status;
};

const getStatusColor = (status) => {
    switch (status) {
    case 'OK':
        return '#369900';
    case 'DOWN':
    case 'ERROR':
        return '#e30001';
    case 'MAINTENANCE':
    case 'UNSTABLE':
        return '#ffc700';
    }
};

const LayerTools = ({ model, controller, opts }) => {
    const backendAvailable = opts[BACKEND_STATUS_AVAILABLE];
    const { unsupported } = model.getVisibilityInfo();
    const backendStatus = backendAvailable ? getBackendStatus(model) : {};
    const statusOnClick =
        backendAvailable && backendStatus.status !== 'UNKNOWN' ? () => controller.showLayerBackendStatus(model.getId()) : undefined;
    return (
        <Tools className="layer-tools">
            {unsupported && <WarningIcon tooltip={unsupported.getDescription()} />}
            <LayerStatus backendStatus={backendStatus} model={model} onClick={statusOnClick} />
            <MetadataIcon
                metadataId={model.getMetadataIdentifier()}
                layerId={model.getId()}
                style={{ marginBottom: '1px', marginLeft: '5px' }}
            />
        </Tools>
    );
};

LayerTools.propTypes = {
    model: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    opts: PropTypes.object.isRequired
};

const LayerStatus = ({ backendStatus, model, onClick }) => {
    return <LayerIcon
        fill={ backendStatus.color }
        type={ model.getLayerType() }
        hasTimeseries={ model.hasTimeseries() }
        onClick={ onClick ? () => onClick() : undefined }
        additionalTooltip={ <Message messageKey={backendStatus.messageKey} /> }
    />;
};

LayerStatus.propTypes = {
    backendStatus: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onClick: PropTypes.func
};

const wrapped = LocaleConsumer(LayerTools);
export { wrapped as LayerTools };
