import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Message, Slider } from 'oskari-ui';
import { Numeric } from '../Numeric';
import { LocaleConsumer, Controller, Messaging } from 'oskari-ui/util';
import styled from 'styled-components';
import { getZoomLevelHelper } from '../../../../../mapping/mapmodule/util/scale';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';

const VerticalComponent = styled('div')`
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;
    margin-left: 25%;
    align-items: start;
`;

const FieldLabel = styled('div')`
    padding-bottom: 5px;
`;

const SliderContainer = styled('div')`
    height: 200px;
    padding-top: 15px;
    padding-bottom: 15px;
`;

const ScaleInput = styled(Numeric)`
    width: 90%;
    margin: 10px 0;
`;

const PlusIcon = styled(PlusCircleOutlined)`
    text-align: left;
    margin-left: 10px;
`;
const MinusIcon = styled(MinusCircleOutlined)`
    text-align: left;
    margin-left: 10px;
`;

const Scale = ({ layer, scales = [], controller, getMessage }) => {
    const [layerChecked, setLayerChecked] = useState(false);

    const locNoLimit = getMessage('fieldNoRestriction');
    const { minscale, maxscale } = normalizeScales(layer);
    const zoomLevelHelper = getZoomLevelHelper(scales);
    const mapScales = scales.slice(0);
    const maxZoomUnrestrictedValue = mapScales.length;

    const layerMinZoom = zoomLevelHelper.getMinZoom(minscale);
    let layerMaxZoom = zoomLevelHelper.getMaxZoom(maxscale);
    if (layerMaxZoom === -1) {
        // if max zoom is undefined the slider needs to be at the max value
        layerMaxZoom = maxZoomUnrestrictedValue;
    }

    useEffect(() => {
        if (layer && !layerChecked) {
            setLayerChecked(true);
            const {minscale = -1, maxscale = -1} = layer;
            if (minscale === maxscale && minscale !== -1) {
                Messaging.warn(<Message messageKey='messages.invalidScale' bundleKey='admin-layereditor' />);
            }
        }
    }, [layer]);

    const onValueChange = ([min, max]) => {
        if (min < 0) {
            min = -1;
        } else {
            min = mapScales[min];
        }
        if (max > mapScales.length - 1) {
            max = -1;
        } else {
            max = mapScales[max];
        }
        controller.setMinAndMaxScale([min, max]);
    };
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
            <PlusIcon />
            <SliderContainer>
                <Slider
                    vertical
                    range
                    reversed
                    tooltip={{
                        formatter: createTooltipFormatter(mapScales, locNoLimit)
                    }}
                    step={1}
                    marks={createSliderLabels(mapScales, locNoLimit)}
                    min={-1}
                    max={maxZoomUnrestrictedValue}
                    value={ [layerMinZoom, layerMaxZoom] }
                    onChange={onValueChange} />
            </SliderContainer>
            <MinusIcon />
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
    let { minscale = -1, maxscale = -1 } = layer;
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
