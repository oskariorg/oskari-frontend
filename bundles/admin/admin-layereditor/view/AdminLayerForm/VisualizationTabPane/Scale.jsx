import React from 'react';
import PropTypes from 'prop-types';
import { Message, Slider, Icon } from 'oskari-ui';
import { Numeric } from '../Numeric';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import styled from 'styled-components';
import { getZoomLevelHelper } from '../../../../../mapping/mapmodule/util/scale';

const VerticalComponent = styled('div')`
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;
    margin-left: 25%;
`;

const FieldLabel = styled('div')`
    padding-bottom: 5px;
`;

const SliderContainer = styled('div')`
    padding-left: 20%;
    height: 200px;
    padding-top: 15px;
    padding-bottom: 15px;

    .ant-slider-mark-text {
        padding-bottom: 3px;
        font-size: 11px;
    }
`;

const ScaleInput = styled(Numeric)`
    width: 90%;
    margin: 10px 0;
`;

const StyledIcon = styled(Icon)`
text-align: left;
padding-left: 16%;
`;

const Scale = ({ layer, scales = [], controller, getMessage }) => {
    const locNoLimit = getMessage('fieldNoRestriction');
    let { minscale, maxscale } = normalizeScales(layer);
    const zoomLevelHelper = getZoomLevelHelper(scales);
    const mapScales = scales.slice(0);
    const maxZoomUnrestrictedValue = mapScales.length;

    const layerMinZoom = zoomLevelHelper.getMinZoom(minscale);
    let layerMaxZoom = zoomLevelHelper.getMaxZoom(maxscale);
    if (layerMaxZoom === -1) {
        // if max zoom is undefined the slider needs to be at the max value
        layerMaxZoom = maxZoomUnrestrictedValue;
    }
    return (
        <VerticalComponent>
            <Message messageKey='fields.scale' LabelComponent={FieldLabel} />
            <ScaleInput
                prefix="1:"
                placeholder={locNoLimit}
                value={ maxscale }
                allowNegative={false}
                allowZero={false}
                onChange={value => controller.setMinAndMaxScale([minscale, value])} />
            <StyledIcon type='plus-circle'/>
            <SliderContainer>
                <Slider
                    vertical
                    range
                    reversed
                    tipFormatter={createTooltipFormatter(mapScales, locNoLimit)}
                    step={1}
                    marks={createSliderLabels(mapScales, locNoLimit)}
                    min={-1}
                    max={maxZoomUnrestrictedValue}
                    value={ [layerMinZoom, layerMaxZoom] }
                    onChange={values => controller.setMinAndMaxScale(values.map(zoomLevel => mapScales[zoomLevel]))} />
            </SliderContainer>
            <StyledIcon type='minus-circle'/>
            <ScaleInput
                prefix="1:"
                placeholder={locNoLimit}
                value={ minscale }
                allowNegative={false}
                allowZero={false}
                onChange={value => controller.setMinAndMaxScale([value, maxscale])} />
        </VerticalComponent>
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

function createSliderLabels (scales = [], locNoLimit) {
    // Not restricted at each end
    const marks = {
        '-1': locNoLimit,
        [scales.length]: locNoLimit
    };
    // labels every 5 levels
    scales.forEach((scale, index) => {
        if (index % 5 === 0) {
            marks[index] = '' + index;
        }
    });
    const maxZoomLevel = scales.length - 1;
    // add label for the last zoom level as well
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
