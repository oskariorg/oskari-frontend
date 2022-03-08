import React from 'react';
import PropTypes from 'prop-types';
import { PointsLegend, ChoroplethLegend, InactiveLegend } from './legend/';
import './legend.scss';

export const Legend = ({
    classification,
    values
}) => {
    const { transparency, mapStyle } = values;
    const { error } = classification;
    if (error) {
        const errorKey = error === 'general' ? 'cannotCreateLegend' : error;
        return (<InactiveLegend error = {errorKey} />);
    }
    if (mapStyle === 'points') {
        return (
            <PointsLegend classification={classification} transparency={transparency}/>
        );
    }
    return (
        <ChoroplethLegend classification={classification} transparency={transparency}/>
    );
};

Legend.propTypes = {
    classification: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired
};
