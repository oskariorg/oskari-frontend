import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Tooltip, Message } from 'oskari-ui';
import { DataLayerIcon, ImageLayerIcon, ThreeDIcon, TimeSerieIcon, UserDataIcon } from './CustomIcons';

// TODO replace logic with layer plugins registering their icons.
export const LayerIcon = ({ type, hasTimeseries = false, additionalTooltipKey, ...rest }) => {
    const getIcon = (type, rest) => {
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

    let tooltipTitle = (<Message messageKey={ `layerTooltipTitle.${type}` } />);
    if (additionalTooltipKey) {
        tooltipTitle = (<Fragment>
            { tooltipTitle }. <Message messageKey={ additionalTooltipKey } />
        </Fragment>);
    }

    return (
        <Tooltip title={ tooltipTitle }>
            { getIcon(type, rest) }
        </Tooltip>
    );
};

LayerIcon.propTypes = {
    type: PropTypes.string.isRequired,
    additionalTooltipKey: PropTypes.string,
    hasTimeseries: PropTypes.bool
};
