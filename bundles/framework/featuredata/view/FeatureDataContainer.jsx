import React from 'react';
import PropTypes from 'prop-types';

export const FeatureDataContainer = ({ featureData }) => {
    return (<h1>{featureData}</h1>);
};

FeatureDataContainer.propTypes = {
    featureData: PropTypes.any
};
