import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LAYER_TYPE, ICON_CLASS, TOOLTIP } from './constants';

const Tools = styled('div')`
    float: right;
`;
const UnsupportedWarning = styled('div')`
    float: right;
    width: 16px;
    height: 16px;
    margin-left: 5px;
`;
const BackendStatus = styled('div')`
    float: left;
    width: 20px;
    height: 16;
    margin-right: 4px;
    background-repeat: no-repeat;
    ${props => ICON_CLASS.hasOwnProperty(props.layer.getBackendStatus()) && `
        height: 20px !important;
        margin-bottom: 2px;
        margin-top: -2px;
        cursor: pointer;
    `}
`;
const LayerIcon = styled('div')`
    float: left;
    width: 16px;
    height: 16px;
    background-repeat: no-repeat;   
`;
const SecondaryIcon = styled('div')`
    float: left;
    ${props => props.layer.hasTimeseries() && 'margin-right: 2px;'}
`;
const InfoIcon = styled('div')`
    float: right;
    width: 16px;
    height: 16px;
    margin-left: 5px;
`;

const getBackendStatusIcon = layer => {
    const props = {
        layer
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
    return <LayerIcon {...props}/>;
};

const getInfoIcon = layer => {
    let subLayers = null;
    let subLmeta = false;
    // TODO: Check this logic.
    if (!layer.getMetadataIdentifier()) {
        subLayers = layer.getSubLayers();
        if (subLayers && subLayers.length > 0) {
            subLmeta = true;
            for (let s = 0; s < subLayers.length; s += 1) {
                const subUuid = subLayers[s].getMetadataIdentifier();
                if (!subUuid || subUuid === '') {
                    subLmeta = false;
                    break;
                }
            }
        }
    }
    const classes = ['layer-info'];
    if (layer.getMetadataIdentifier() || subLmeta) {
        classes.push('icon-info');
    }
    const props = {
        className: classes.join(' ')
    };
    return <InfoIcon {...props}/>;
};

export const LayerTools = ({model, mapSrs}) => {
    return (
        <Tools className="layer-tools">
            {
                !model.isSupported(mapSrs) &&
                <UnsupportedWarning className="layer-not-supported icon-warning-light" />
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
