import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LAYER_TYPE } from '../constants';
import { WarningIcon } from 'oskari-ui';
import { Mutator } from 'oskari-ui/util';
import { Tooltip } from 'antd';

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

const SecondaryIcon = styled('div')`
    float: left;
    ${props => props.layer.hasTimeseries() && 'margin-right: 2px;'}
`;
const Tools = styled('div')`
    position: absolute;
    display: inline-block;
    right: 5px;
`;

const getLayerType = layer => {
    if (layer.isBaseLayer()) {
        return LAYER_TYPE.BASE;
    }
    switch (layer.getLayerType()) {
    case 'wms': return LAYER_TYPE.WMS;
    case 'wmts': return LAYER_TYPE.WMTS;
    case 'wfs': return LAYER_TYPE.WFS;
    case 'vector' : return LAYER_TYPE.WMS;
    }
};

const getLayerIconTooltip = (layer, locale) => {
    const layerType = getLayerType(layer);
    const tooltips = layerType ? [locale.tooltip[layerType]] : [];
    const status = locale.backendStatus[layer.getBackendStatus() || 'UNKNOWN'];
    if (status && status.tooltip) {
        tooltips.push(status.tooltip);
    }
    const tooltipLineBreak = '&#013;&#010;';
    return tooltips.join(tooltipLineBreak);
};

const hasSubLayerMetadata = layer => {
    const subLayers = layer.getSubLayers();
    if (!subLayers || subLayers.length === 0) {
        return false;
    }
    return !!subLayers.find(sub => !!sub.getMetadataIdentifier());
};

export const LayerTools = ({ model, mutator, locale }) => {
    const layerIcon = {
        classes: ['layer-icon', model.getIconClassname()],
        tooltip: getLayerIconTooltip(model, locale)
    };
    const secondaryIcon = {
        classes: ['layer-icon-secondary'],
        tooltips: []
    };
    const infoIcon = {
        classes: ['layer-info']
    };
    if (model.hasTimeseries()) {
        secondaryIcon.classes.push('layer-timeseries-disabled');
        secondaryIcon.tooltip.push(locale.tooltip[LAYER_TYPE.TIMESERIES]);
    }
    if (model.getMetadataIdentifier() || hasSubLayerMetadata(model)) {
        infoIcon.classes.push('icon-info');
    }
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
            <Tooltip title={secondaryIcon.tooltip}>
                <SecondaryIcon layer={model} className={secondaryIcon.classes.join(' ')}/>
            </Tooltip>
            <Tooltip title={layerIcon.tooltip}>
                <LeftFloatingIcon
                    className={layerIcon.classes.join(' ')}
                    onClick={() => mutator.showLayerBackendStatus(model.getId())}/>
            </Tooltip>
            <RightFloatingIcon
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
