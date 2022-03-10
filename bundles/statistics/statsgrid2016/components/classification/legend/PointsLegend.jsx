import React from 'react';
import PropTypes from 'prop-types';
import { PointSvg } from './PointSvg';

const POINT_MARGIN = 10;

const getSizes = groups => {
    let y = POINT_MARGIN;
    const pointsY = [];
    groups.forEach((group, i) => {
        const size = group.sizePx;
        pointsY[i] = y;
        y += size + POINT_MARGIN;
    });
    const maxSize = groups[groups.length - 1].sizePx;
    return { maxSize, pointsY, height: y };
};

export const PointsLegend = ({
    classifiedDataset,
    transparency
}) => {
    const opacity = transparency / 100 || 1;
    const { groups, ...rest } = classifiedDataset;
    const { maxSize, height, pointsY } = getSizes(groups);

    return (
        <div className="statsgrid-svg-legend">
            <svg className="symbols" height={height}>
                { groups.map((group, i) => <PointSvg key={`point-${i}`} opacity={opacity} maxSize={maxSize} pointY={pointsY[i]} { ...group } { ...rest } />) }
            </svg>
        </div>
    );
};

PointsLegend.propTypes = {
    transparency: PropTypes.number.isRequired,
    classifiedDataset: PropTypes.object.isRequired
};
