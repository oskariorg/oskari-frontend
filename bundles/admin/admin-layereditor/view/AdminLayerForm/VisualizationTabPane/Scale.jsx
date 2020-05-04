import React from 'react';
import PropTypes from 'prop-types';
import { Message, Slider, Icon } from 'oskari-ui';
import { Numeric } from '../Numeric';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
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

const Scale = ({ layer, scales = [], controller, getMessage }) => {
    const locNoLimit = getMessage('fieldNoRestriction');
    let { minscale, maxscale } = normalizeScales(layer);
    const mapScales = scales.slice(0);
    // console.log(getMinZoom(minscale, scales), getMaxZoom(maxscale, scales));
    const maxZoomLevel = mapScales.length - 1;
    const layerMaxZoom = getMaxZoom(maxscale, mapScales);
    const layerMinZoom = getMinZoom(minscale, mapScales);
    return (
        <React.Fragment>
            <VerticalComponent>
                <table>
                    <tbody>
                        <tr>
                            <td width="15%">Max scale</td>
                            <td><Numeric
                                prefix="1:"
                                placeholder={locNoLimit}
                                value={ maxscale }
                                allowNegative={false}
                                allowZero={false}
                                onChange={value => controller.setMinAndMaxScale([minscale, value])} /> {layerMaxZoom}</td>
                        </tr>
                        <tr>
                            <td width="15%">Min scale</td>
                            <td><Numeric
                                prefix="1:"
                                placeholder={locNoLimit}
                                value={ minscale }
                                allowNegative={false}
                                allowZero={false}
                                onChange={value => controller.setMinAndMaxScale([value, maxscale])} /> {layerMinZoom}</td>
                        </tr>
                    </tbody>
                </table>
            </VerticalComponent>
            <VerticalComponent>
                <Message messageKey='fields.scale' LabelComponent={CenteredLabel} />
                <Icon type='plus-circle'/>
                <SliderContainer>
                    <Slider
                        vertical
                        range
                        reversed
                        tipFormatter={createTooltipFormatter(mapScales, locNoLimit)}
                        step={1}
                        marks={createSliderLabels(mapScales, locNoLimit)}
                        min={-1}
                        max={maxZoomLevel + 1}
                        value={ [layerMinZoom, layerMaxZoom] }
                        onChange={values => {
                            console.log(...values);
                            controller.setMinAndMaxScale(values.map(zoomLevel => mapScales[zoomLevel]));
                        }} />
                </SliderContainer>
                <Icon type='minus-circle'/>
            </VerticalComponent>
        </React.Fragment>
    );
};

Scale.propTypes = {
    layer: PropTypes.object.isRequired,
    scales: PropTypes.array.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    getMessage: PropTypes.func.isRequired
};

function normalizeScales (layer) {
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

function getMinZoom (minscale, scales) {
    return getZoomLevel(minscale, scales, -1);
}

function getMaxZoom (maxscale, scales) {
    return getZoomLevel(maxscale, scales, scales.length);
}

// assumes scales go from big to small as they do on mapmodule
function getZoomLevel (scale, mapScales, defaultValue) {
    if (scale < 0) {
        return defaultValue;
    }
    const index = mapScales.findIndex(s => scale >= s);
    if (index === -1) {
        return defaultValue;
    }
    return index;
}

function createSliderLabels (scales = [], locNoLimit) {
    // labels every 5 levels
    const marks = {
        '-1': locNoLimit,
        [scales.length]: locNoLimit
    };
    scales.forEach((scale, index) => {
        if (index % 5 === 0) {
            marks[index] = '' + index;
        }
    });
    const maxZoomLevel = scales.length - 1;
    // add label to the last one as well
    if (maxZoomLevel % 5 !== 0) {
        marks[maxZoomLevel] = maxZoomLevel;
    }
    return marks;
}

function createTooltipFormatter (scales, locNoLimit) {
    const maxZoom = scales.length - 1;
    return function (value) {
        if (value === -1 || value > maxZoom) {
            return locNoLimit;
        }
        return `${value} / ${maxZoom}`;
    };
}
const contextWrap = LocaleConsumer(Scale);
export { contextWrap as Scale };
