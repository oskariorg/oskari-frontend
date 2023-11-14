import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { hexToRGBA } from './util';
import { PointSvg } from './PointSvg';

const Row = styled.div`
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    padding: 5px 0px;
`;

const Color = styled.div`
    border: 1px solid #555555;
    height: 16px;
    width: 24px;
    margin-left: 10px;
    background-color: ${props => props.fillColor}
`;
const Icon = styled.div`
`;
const Count = styled.span`
    margin-left: 4px;
    font-size: 0.8em;
    color: #666;
    font-style: italic;
`;
const Range = styled.span`
    margin-left: 10px;
`;

export const LegendRow = ({
    mapStyle,
    range,
    regionIds,
    color,
    sizePx,
    maxSizePx,
    opacity
}) => {
    const fillColor = opacity !== 1 ? hexToRGBA(color, opacity) : color;
    const count = regionIds.length;
    const icon = mapStyle === 'points'
        ? <PointSvg sizePx={sizePx} maxSizePx={maxSizePx} fillColor={fillColor}/>
        : <Color fillColor={fillColor}/>;
    return (
        <Row>
            <Icon>{icon}</Icon>
            <Range>{range}</Range>
            <Count>{`(${count})`}</Count>
        </Row>
    );
};

LegendRow.propTypes = {
    mapStyle: PropTypes.string.isRequired,
    regionIds: PropTypes.array.isRequired,
    opacity: PropTypes.number.isRequired,
    range: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    sizePx: PropTypes.number,
    maxSizePx: PropTypes.number
};
