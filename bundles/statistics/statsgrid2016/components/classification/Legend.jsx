import React from 'react';
import PropTypes from 'prop-types';
import { PointsLegend, ChoroplethLegend, InactiveLegend } from './legend/';
import './legend.scss';

export const Legend = ({
    transparency,
    mapStyle,
    classifiedDataset
}) => {
    const { error } = classifiedDataset;
    if (error) {
        const errorKey = error === 'general' ? 'cannotCreateLegend' : error;
        return (<InactiveLegend error = {errorKey} />);
    }
    if (mapStyle === 'points') {
        return (
            <PointsLegend classifiedDataset={classifiedDataset} transparency={transparency}/>
        );
    }
    return (
        <ChoroplethLegend classifiedDataset={classifiedDataset} transparency={transparency}/>
    );
};

Legend.propTypes = {
    transparency: PropTypes.number.isRequired,
    mapStyle: PropTypes.string.isRequired,
    classifiedDataset: PropTypes.object.isRequired
};
