import React from 'react';
import PropTypes from 'prop-types';
import { ImageLayerIcon, DataLayerIcon, UserDataIcon, ThreeDIcon } from './CustomIcons';

// TODO replace logic with layer plugins registering their icons.
export const LayerIcon = ({ type, ...rest }) => {
    if (['wmts', 'wms'].includes(type)) {
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
    type: PropTypes.string
};
