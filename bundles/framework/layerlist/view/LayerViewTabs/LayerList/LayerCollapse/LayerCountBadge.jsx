
import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'oskari-ui';

export const LayerCountBadge = ({ layerCount = 0, unfilteredLayerCount }) => {
    const badgeText = unfilteredLayerCount
        ? layerCount + ' / ' + unfilteredLayerCount
        : layerCount;
    return <Badge count={badgeText} />;
};

LayerCountBadge.propTypes = {
    layerCount: PropTypes.number,
    unfilteredLayerCount: PropTypes.number
};
