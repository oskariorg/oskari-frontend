import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { WarningIcon } from 'oskari-ui';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import { LayerIcon } from '../../../LayerIcon';

const SpriteIcon = styled('div')`
    width: 16px;
    height: 16px;
    background-repeat: no-repeat;
`;

const Tools = styled('div')`
    display: flex;
    align-items: center;
    > * {
        margin-left: 3px;
    }
`;

const hasSubLayerMetadata = (layer) => {
    const subLayers = layer.getSubLayers();
    if (!subLayers || subLayers.length === 0) {
        return false;
    }
    return !!subLayers.find((sub) => !!sub.getMetadataIdentifier());
};

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

const LayerTools = ({ model, controller }) => {
    const infoIcon = {
        classes: ['layer-info']
    };
    if (model.getMetadataIdentifier() || hasSubLayerMetadata(model)) {
        infoIcon.classes.push('icon-info');
    }
    const map = Oskari.getSandbox().getMap();
    const reasons = !map.isLayerSupported(model) ? map.getUnsupportedLayerReasons(model) : undefined;
    const reason = reasons ? map.getMostSevereUnsupportedLayerReason(reasons) : undefined;
    const backendStatus = getBackendStatus(model);
    const statusOnClick =
        backendStatus.status !== 'UNKNOWN' ? () => controller.showLayerBackendStatus(model.getId()) : undefined;

    return (
        <Tools className="layer-tools">
            {reason && <WarningIcon tooltip={reason.getDescription()} />}
            <LayerStatus backendStatus={backendStatus} model={model} onClick={statusOnClick} />
            <SpriteIcon className={infoIcon.classes.join(' ')} onClick={() => controller.showLayerMetadata(model)} />
        </Tools>
    );
};

LayerTools.propTypes = {
    model: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};

const LayerStatus = ({ backendStatus, model, onClick }) => {
    return <LayerIcon
        fill={ backendStatus.color }
        type={ model.getLayerType() }
        hasTimeseries={ model.hasTimeseries() }
        onClick={ onClick ? () => onClick() : undefined }
        backendStatus={ backendStatus.messageKey }
    />;
};

LayerStatus.propTypes = {
    layerType: PropTypes.string,
    backendStatus: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onClick: PropTypes.func
};

const wrapped = LocaleConsumer(LayerTools);
export { wrapped as LayerTools };
