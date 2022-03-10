import React from 'react';
import PropTypes from 'prop-types';
import { InactiveLegend } from './';
import { hexToRGBA } from './util';

export const ChoroplethLegend = ({
    classifiedDataset,
    transparency
}) => {
    const { getHtmlLegend, groups } = classifiedDataset;
    const opacity = transparency / 100 || 1;
    const colors = groups.map(group => opacity !== 1 ? hexToRGBA(group.color, opacity) : group.color);
    const legend = getHtmlLegend(colors);
    if (!legend) {
        return (<InactiveLegend error="cannotCreateLegend" />);
    }
    return (
        <div className="active-legend" dangerouslySetInnerHTML={{ __html: legend }}/>
    );
};

ChoroplethLegend.propTypes = {
    transparency: PropTypes.number.isRequired,
    classifiedDataset: PropTypes.object.isRequired
};
