import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { WarningIcon, Tooltip, Message } from 'oskari-ui';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import { TimeSerieIcon } from '../../../CustomIcons';
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

const hasSubLayerMetadata = layer => {
    const subLayers = layer.getSubLayers();
    if (!subLayers || subLayers.length === 0) {
        return false;
    }
    return !!subLayers.find(sub => !!sub.getMetadataIdentifier());
};

const getBackendStatus = layer => {
    const backendStatus = layer.getBackendStatus() || 'UNKNOWN';
    const status = {
        addTooltip: backendStatus !== 'UNKNOWN',
        messageKey: `backendStatus.${backendStatus}`,
        color: getStatusColor(backendStatus)
    };
    return status;
};

const getStatusColor = status => {
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
    const backendStatus = getBackendStatus(model);
    const infoIcon = {
        classes: ['layer-info']
    };
    if (model.getMetadataIdentifier() || hasSubLayerMetadata(model)) {
        infoIcon.classes.push('icon-info');
    }
    const map = Oskari.getSandbox().getMap();
    const reasons = !map.isLayerSupported(model) ? map.getUnsupportedLayerReasons(model) : undefined;
    const reason = reasons ? map.getMostSevereUnsupportedLayerReason(reasons) : undefined;
    return (
        <Tools className="layer-tools">
            {reason &&
                <WarningIcon tooltip={reason.getDescription()} />
            }
            {model.hasTimeseries() &&
                <Tooltip title={<Message messageKey='layer.tooltip.timeseries' />}>
                    <TimeSerieIcon />
                </Tooltip>
            }
            <LayerStatus backendStatus={backendStatus} model={model}
                onClick={() => controller.showLayerBackendStatus(model.getId())} />
            <SpriteIcon
                className={infoIcon.classes.join(' ')}
                onClick={() => controller.showLayerMetadata(model)} />
        </Tools>
    );
};

LayerTools.propTypes = {
    model: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};

const LayerStatus = ({ backendStatus, model, onClick }) => {
    const icon = (<LayerIcon
        fill={backendStatus.color}
        type={model.getLayerType()}
        onClick={() => onClick()} />);
    if (backendStatus.addTooltip) {
        return (<Tooltip title={<Message messageKey={backendStatus.messageKey} />}>{icon}</Tooltip>);
    }
    return icon;
};

LayerStatus.propTypes = {
    backendStatus: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
};

const wrapped = LocaleConsumer(LayerTools);
export { wrapped as LayerTools };
