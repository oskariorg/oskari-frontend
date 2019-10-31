import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LAYER_TYPE } from '../constants';
import { WarningIcon, Tooltip } from 'oskari-ui';
import { Mutator } from 'oskari-ui/util';
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

const getBackendStatus = (layer, locale) => {
    const backendStatus = layer.getBackendStatus() || 'UNKNOWN';
    const status = {
        text: locale.backendStatus[backendStatus],
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

export const LayerTools = ({ model, mutator, locale }) => {
    const backendStatus = getBackendStatus(model, locale);
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
                <Tooltip title={locale.tooltip[LAYER_TYPE.TIMESERIES]}>
                    <TimeSerieIcon />
                </Tooltip>
            }
            <Tooltip title={backendStatus.text}>
                <LayerIcon
                    fill={backendStatus.color}
                    type={model.getLayerType()}
                    onClick={() => mutator.showLayerBackendStatus(model.getId())}/>
            </Tooltip>
            <SpriteIcon
                className={infoIcon.classes.join(' ')}
                onClick={() => mutator.showLayerMetadata(model)}/>
        </Tools>
    );
};

LayerTools.propTypes = {
    model: PropTypes.object.isRequired,
    mutator: PropTypes.instanceOf(Mutator).isRequired,
    locale: PropTypes.any.isRequired
};
