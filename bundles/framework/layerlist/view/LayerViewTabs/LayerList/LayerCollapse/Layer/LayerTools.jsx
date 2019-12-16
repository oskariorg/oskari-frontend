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
            { reason &&
                <WarningIcon tooltip={reason.getDescription()}/>
            }
            { model.hasTimeseries() &&
                <Tooltip title={<Message messageKey='layer.tooltip.timeseries'/>}>
                    <TimeSerieIcon />
                </Tooltip>
            }
            <Tooltip title={<Message messageKey={backendStatus.messageKey}/>}>
                <LayerIcon
                    fill={backendStatus.color}
                    type={model.getLayerType()}
                    onClick={() => controller.showLayerBackendStatus(model.getId())}/>
            </Tooltip>
            <SpriteIcon
                className={infoIcon.classes.join(' ')}
                onClick={() => controller.showLayerMetadata(model)}/>
        </Tools>
    );
};

LayerTools.propTypes = {
    model: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};

const wrapped = LocaleConsumer(LayerTools);
export { wrapped as LayerTools };
