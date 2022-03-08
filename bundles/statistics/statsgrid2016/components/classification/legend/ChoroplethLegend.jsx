import React from 'react';
import PropTypes from 'prop-types';
import { InactiveLegend } from './';
import { hexToRGBA } from './util';

export const ChoroplethLegend = ({
    classification,
    transparency
}) => {
    const opacity = transparency / 100 || 1;
    const colors = classification.groups.map(group => opacity !== 1 ? hexToRGBA(group.color, opacity) : group.color);
    const legend = classification.getHtmlLegend(colors);
    if (!legend) {
        return (<InactiveLegend error="cannotCreateLegend" />);
    }
    return (
        <div className="active-legend" dangerouslySetInnerHTML={{ __html: legend }}/>
    );
};

ChoroplethLegend.propTypes = {
    transparency: PropTypes.number.isRequired,
    classification: PropTypes.object.isRequired
};
