import PropTypes from 'prop-types';
import React from 'react';
import { DataLayerIcon, ImageLayerIcon, ThreeDIcon, TimeSerieIcon, UserDataIcon } from './CustomIcons';

// TODO replace logic with layer plugins registering their icons.
export const LayerIcon = ({ type, hasTimeseries = false, ...rest }) => {
    if (hasTimeseries) {
        return <TimeSerieIcon {...rest} />;
    }
    if (['wmts', 'wms', 'arcgis93', 'arcgis'].includes(type)) {
        return <ImageLayerIcon {...rest} />;
    }
    if (['wfs'].includes(type)) {
        return <DataLayerIcon {...rest} />;
    }
    if (['userlayer', 'myplaces', 'analysislayer'].includes(type)) {
        return <UserDataIcon {...rest} />;
    }
    if (['tiles3d'].includes(type)) {
        return <ThreeDIcon {...rest} />;
    }
    return <DataLayerIcon {...rest} />;
};

LayerIcon.propTypes = {
    type: PropTypes.string,
    hasTimeseries: PropTypes.bool
};
