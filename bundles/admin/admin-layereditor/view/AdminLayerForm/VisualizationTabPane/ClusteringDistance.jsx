import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Numeric } from '../Numeric';

export const ClusteringDistance = ({ layer, controller }) => {
    const options = layer.options || {};
    return (
        <Numeric
            value={options.clusteringDistance}
            messageKey='clusteringDistance'
            suffix='px'
            allowNegative={false}
            allowZero={false}
            onChange={value => controller.setClusteringDistance(value)} />
    );
};
ClusteringDistance.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
