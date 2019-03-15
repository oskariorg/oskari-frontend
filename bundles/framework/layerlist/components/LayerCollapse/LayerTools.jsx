import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LAYER_TYPE, ICON_CLASS, TOOLTIP } from './constants';

const getIconDiv = float => styled('div')`
    float: ${float};
    width: 16px;
    height: 16px;
    background-repeat: no-repeat;
    ${float === 'right' && `
        margin-left: 5px;
    `}
`;
const RightFloatingIcon = getIconDiv('right');
const LeftFloatingIcon = getIconDiv('left');

const BackendStatus = styled('div')`
    float: left;
    background-repeat: no-repeat;
    width: 20px;
    margin-right: 4px;
    height: ${props => props.hasStatus ? '20px' : '16px'};
    ${props => props.hasStatus && `
        margin-bottom: 2px;
        margin-top: -2px;
        cursor: pointer;
    `}
`;
const SecondaryIcon = styled('div')`
    float: left;
    ${props => props.layer.hasTimeseries() && 'margin-right: 2px;'}
`;
const Tools = styled('div')`
    float: right;
`;

const getBackendStatusIcon = layer => {
    const props = {
        layer,
        hasStatus: ICON_CLASS.hasOwnProperty(layer.getBackendStatus())
    };
    return <BackendStatus {...props}/>;
};

const getSecondaryIcon = layer => {
    const classes = ['layer-icon-secondary'];
    let title = '';
    if (layer.hasTimeseries()) {
        classes.push('layer-timeseries-disabled');
        title = TOOLTIP[LAYER_TYPE.TIMESERIES];
    }
    const props = {
        className: classes.join(' '),
        title,
        layer
    };
    return <SecondaryIcon {...props}/>;
};

const getLayerIcon = layer => {
    let layerType = null;
    if (layer.isBaseLayer()) {
        layerType = LAYER_TYPE.BASE;
    }
    switch (layer.getLayerType()) {
    case 'wms':
        layerType = LAYER_TYPE.WMS;
        break;
    case 'wmts':
        layerType = LAYER_TYPE.WMTS;
        break;
    case 'wfs':
        layerType = layer.isManualRefresh ? LAYER_TYPE.WFS_MANUAL : LAYER_TYPE.WFS;
        break;
    case 'vector' :
        layerType = LAYER_TYPE.WMS;
        break;
    }
    const title = layerType ? '' : TOOLTIP[layerType];
    const classes = ['layer-icon', layer.getIconClassname()];
    const props = {
        className: classes.join(' '),
        title
    };
    return <LeftFloatingIcon {...props}/>;
};

const hasSubLayerMetadata = layer => {
    const subLayers = layer.getSubLayers();
    if (!subLayers || subLayers.length === 0) {
        return false;
    }
    return !!subLayers.find(sub => !!sub.getMetadataIdentifier());
};

const getInfoIcon = layer => {
    const classes = ['layer-info'];
    if (layer.getMetadataIdentifier() || hasSubLayerMetadata(layer)) {
        classes.push('icon-info');
    }
    const props = {
        className: classes.join(' ')
    };
    return <RightFloatingIcon {...props}/>;
};

export const LayerTools = ({model, mapSrs}) => {
    return (
        <Tools className="layer-tools">
            {
                !model.isSupported(mapSrs) &&
                <RightFloatingIcon className="layer-not-supported icon-warning-light" />
            }
            {getBackendStatusIcon(model)}
            {getSecondaryIcon(model)}
            {getLayerIcon(model)}
            {getInfoIcon(model)}
        </Tools>
    );
};

LayerTools.propTypes = {
    model: PropTypes.any,
    mapSrs: PropTypes.string
};
