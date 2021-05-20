import { Message, Slider } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';

const SliderContainer = styled('div')`
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 10px;
    padding-bottom: 10px;

    .ant-slider-mark-text {
        font-size: 11px;
    }
`;

export const TimeSeriesMetadataToggleLevel = ({ layer, disabled, scales, controller }) => {
    const options = layer.options || {};
    const timeseries = options.timeseries || {};
    const metadata = timeseries.metadata || { toggleLevel: -1 };
    const minZoomLevel = -1;
    const maxZoomLevel = scales.length - 1;
    const marks = {
        [minZoomLevel]: <Message messageKey="timeSeries.noToggle" />,
        [maxZoomLevel]: String(maxZoomLevel)
    };
    scales.forEach((scale, index) => {
        if (index % 5 === 0) {
            marks[index] = String(index);
        }
    });
    return (
        <Fragment>
            <Message messageKey="timeSeries.metadataToggleLevel" />
            <SliderContainer>
                <Slider
                    disabled={disabled}
                    step={1}
                    min={-1}
                    max={scales.length - 1}
                    marks={marks}
                    value={metadata.toggleLevel}
                    onChange={(value) => controller.setTimeSeriesMetadataToggleLevel(value)}
                />
            </SliderContainer>
        </Fragment>
    );
};

TimeSeriesMetadataToggleLevel.propTypes = {
    layer: PropTypes.object.isRequired,
    disabled: PropTypes.bool.isRequired,
    scales: PropTypes.arrayOf(PropTypes.number).isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
