import React from 'react';
import PropTypes from 'prop-types';
import { Message, Slider, Icon } from 'oskari-ui';
import { Numeric } from '../Numeric';
import { Controller } from 'oskari-ui/util';
import styled from 'styled-components';

const VerticalComponent = styled('div')`
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;
    margin-left: 25%;
`;

const CenteredLabel = styled('div')`
    text-align: center;
    padding-bottom: 5px;
`;

const SliderContainer = styled('div')`
    padding-left: calc(50% - 2px);
    height: 200px;
    padding-top: 15px;
    padding-bottom: 15px;
`;

const getClosestMatch = (arr, value) => (
    arr.reduce((best, cur) => (Math.abs(cur - value) < Math.abs(best - value) ? cur : best))
);

const getLevel = (scale, levelToScale) => {
    const level = Object.keys(levelToScale).find(key => levelToScale[key] === scale);
    return parseInt(level);
};

const getLayerValues = (layer, levelToScale, defaultValues) => {
    const { minscale, maxscale } = layer;
    const scaleOptions = Object.values(levelToScale);
    let [ min, max ] = defaultValues;
    if (minscale > 0) {
        min = getClosestMatch(scaleOptions, minscale);
        min = getLevel(min, levelToScale);
    }
    if (maxscale > 0) {
        max = getClosestMatch(scaleOptions, maxscale);
        max = getLevel(max, levelToScale);
    }
    return [ min, max ];
};

// Allow user to set values outside the system scale array.
const maxScaleOption = 1; // 1:1
const halfALevel = 0.5;

function getScales (layer) {
    let { minscale, maxscale } = layer;
    if (minscale === -1) {
        minscale = '';
    }
    if (maxscale === -1) {
        maxscale = '';
    }
    return {
        minscale,
        maxscale
    };
}

// assumes scales go from big to small as they do on mapmodule
function getMinZoom (minscale, scales) {
    if (!minscale || minscale < 0) {
        return 0;
    }
    const index = scales.findIndex(s => minscale >= s);
    if (index === -1) {
        return 0;
    }
    return index;
}

// assumes scales go from big to small as they do on mapmodule
function getMaxZoom (maxscale, scales) {
    const maxZoom = scales.length - 1;
    if (!maxscale || maxscale < 0) {
        return maxZoom;
    }
    const index = scales.findIndex(s => maxscale >= s) - 1;
    if (index < 0) {
        return maxZoom;
    }
    return index;
}

export const Scale = ({ layer, scales, controller }) => {
    let { minscale, maxscale } = getScales(layer);
    // console.log(getMinZoom(minscale, scales), getMaxZoom(maxscale, scales));
    const maxScale = scales[scales.length - 1];
    let maxZoomLevel = scales.length - 1;
    const levelToScale = {};
    const marks = {
        0: '0',
        5: '5',
        10: '10'
    };
    if (maxZoomLevel > 10) {
        marks[maxZoomLevel] = maxZoomLevel;
    }
    if (scales[maxZoomLevel] !== maxScaleOption) {
        // Allow one step over the max level
        maxZoomLevel += halfALevel;
        levelToScale[maxZoomLevel] = maxScaleOption;
    }
    scales.forEach((scale, i) => {
        levelToScale[i] = scale;
        if (scale === maxScale) {
            return;
        }
        const nextScale = scales[i + 1];
        // Add one option to the middle of zoom levels
        levelToScale[i + halfALevel] = Math.round(scale - (scale - nextScale) / 2);
    });
    return (
        <React.Fragment>
            <VerticalComponent>
                <Message messageKey='fields.scale' LabelComponent={CenteredLabel} />
                <Icon type='plus-circle'/>
                <SliderContainer>
                    <Slider
                        vertical
                        range
                        reversed
                        tipFormatter={value => `1:${levelToScale[value].toLocaleString()}`}
                        step={halfALevel}
                        marks={marks}
                        min={0}
                        max={maxZoomLevel}
                        defaultValue={getLayerValues(layer, levelToScale, [0, maxZoomLevel])}
                        onChange={values => controller.setMinAndMaxScale(values.map(zoomLevel => levelToScale[zoomLevel]))} />
                </SliderContainer>
                <Icon type='minus-circle'/>
                <table>
                    <tbody>
                        <tr>
                            <td width="15%">Min scale</td>
                            <td><Numeric
                                prefix="1:"
                                placeholder="Ei rajoitusta"
                                value={ minscale }
                                allowNegative={false}
                                allowZero={false}
                                onChange={value => controller.setMinAndMaxScale([value, maxscale])} /> {getMinZoom(minscale, scales)}</td>
                        </tr>
                        <tr>
                            <td width="15%">Max scale</td>
                            <td><Numeric
                                prefix="1:"
                                placeholder="Ei rajoitusta"
                                value={ maxscale }
                                allowNegative={false}
                                allowZero={false}
                                onChange={value => controller.setMinAndMaxScale([minscale, value])} /> {getMaxZoom(maxscale, scales)}</td>
                        </tr>
                    </tbody>
                </table>
            </VerticalComponent>
        </React.Fragment>
    );
};
Scale.propTypes = {
    layer: PropTypes.object.isRequired,
    scales: PropTypes.array.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
