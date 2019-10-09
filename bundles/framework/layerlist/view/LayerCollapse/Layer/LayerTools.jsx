import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LAYER_TYPE } from '../constants';
import { WarningIcon } from 'oskari-ui';

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
    position: absolute;
    display: inline-block;
    right: 5px;
`;

const getBackendStatusIconProps = (layer, locale) => {
    const classes = ['layer-backendstatus-icon'];
    let iconClass = null;
    let tooltip = null;
    const status = locale.backendStatus[layer.getBackendStatus() || 'UNKNOWN'];
    if (status) {
        iconClass = status.iconClass;
        tooltip = status.tooltip;
    }
    if (iconClass) {
        classes.push(iconClass);
    }
    const props = {
        className: classes.join(' '),
        hasStatus: !!(layer.getBackendStatus() && iconClass),
        title: tooltip
    };
    return props;
};

const getSecondaryIconProps = (layer, locale) => {
    const classes = ['layer-icon-secondary'];
    let title = '';
    if (layer.hasTimeseries()) {
        classes.push('layer-timeseries-disabled');
        title = locale.tooltip[LAYER_TYPE.TIMESERIES];
    }
    const props = {
        className: classes.join(' '),
        title,
        layer
    };
    return props;
};

const getLayerIconProps = (layer, locale) => {
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
    const title = layerType ? '' : locale.tooltip[layerType];
    const classes = ['layer-icon', layer.getIconClassname()];
    const props = {
        className: classes.join(' '),
        title
    };
    return props;
};

const hasSubLayerMetadata = layer => {
    const subLayers = layer.getSubLayers();
    if (!subLayers || subLayers.length === 0) {
        return false;
    }
    return !!subLayers.find(sub => !!sub.getMetadataIdentifier());
};

const getInfoIconClasses = layer => {
    const classes = ['layer-info'];
    if (layer.getMetadataIdentifier() || hasSubLayerMetadata(layer)) {
        classes.push('icon-info');
    }
    return classes;
};

export const LayerTools = ({ model, mapSrs, mutator, locale }) => {
    const infoClasses = getInfoIconClasses(model, locale);
    const layerIconProps = getLayerIconProps(model, locale);
    const secondaryIconProps = getSecondaryIconProps(model, locale);
    const backendStatusProps = getBackendStatusIconProps(model, locale);
    const map = Oskari.getSandbox().getMap();
    const reasons = !map.isLayerSupported(model) ? map.getUnsupportedLayerReasons(model) : undefined;
    const reason = reasons ? map.getMostSevereUnsupportedLayerReason(reasons) : undefined;
    return (
        <Tools className="layer-tools">
            {
                reason &&
                <LeftFloatingIcon>
                    <WarningIcon tooltip={reason.getDescription()}/>
                </LeftFloatingIcon>
            }
            <BackendStatus {...backendStatusProps} onClick={() => mutator.showLayerBackendStatus(model.getId())}/>
            <SecondaryIcon {...secondaryIconProps}/>
            <LeftFloatingIcon {...layerIconProps}/>
            <RightFloatingIcon className={infoClasses.join(' ')} onClick={() => mutator.showLayerMetadata(model)}/>
        </Tools>
    );
};

LayerTools.propTypes = {
    model: PropTypes.any.isRequired,
    mapSrs: PropTypes.string.isRequired,
    mutator: PropTypes.any.isRequired,
    locale: PropTypes.any.isRequired
};
