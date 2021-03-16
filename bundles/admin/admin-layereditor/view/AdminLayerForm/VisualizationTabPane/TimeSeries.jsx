import { Message, Radio, Tooltip } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { StyledFormField } from './styled';
import { TimeSeriesMetadataAttribute } from './TimeSeriesMetadataAttribute';
import { TimeSeriesMetadataLayerSelect } from './TimeSeriesMetadataLayerSelect';
import { TimeSeriesMetadataToggleLevel } from './TimeSeriesMetadataToggleLevel';

const TIME_SERIES_UI = {
    PLAYER: 'player',
    RANGE: 'range',
    NONE: 'none'
};

const TimeSeriesContainer = styled('div')`
    border: 1px solid #d9d9d9;
    padding: 10px;
    margin-top: 5px;
    margin-bottom: 10px;
`;

export const TimeSeries = ({ layer, scales, controller }) => {
    const options = layer.options || {};
    const timeseries = options.timeseries || { ui: TIME_SERIES_UI.PLAYER };
    const metadata = timeseries.metadata || { layer: '' };
    const playerTooltip = <Message messageKey="timeSeries.tooltip.player" />;
    const rangeTooltip = <Message messageKey="timeSeries.tooltip.range" />;
    const noneTooltip = <Message messageKey="timeSeries.tooltip.range" />;
    return (
        <TimeSeriesContainer>
            <Message messageKey="timeSeries.ui" />
            <StyledFormField>
                <Radio.Group
                    value={timeseries.ui}
                    buttonStyle="solid"
                    onChange={(evt) => controller.setTimeSeriesUI(evt.target.value)}
                >
                    <Tooltip title={playerTooltip}>
                        <Radio.Button value={TIME_SERIES_UI.PLAYER}>
                            <Message messageKey="timeSeries.player" />
                        </Radio.Button>
                    </Tooltip>
                    <Tooltip title={rangeTooltip}>
                        <Radio.Button value={TIME_SERIES_UI.RANGE}>
                            <Message messageKey="timeSeries.range" />
                        </Radio.Button>
                    </Tooltip>
                    <Tooltip title={noneTooltip}>
                        <Radio.Button value={TIME_SERIES_UI.NONE}>
                            <Message messageKey="timeSeries.none" />
                        </Radio.Button>
                    </Tooltip>
                </Radio.Group>
            </StyledFormField>
            {timeseries.ui === TIME_SERIES_UI.RANGE && (
                <Fragment>
                    <TimeSeriesMetadataLayerSelect
                        layer={layer}
                        value={metadata.layer}
                        controller={controller}
                    ></TimeSeriesMetadataLayerSelect>
                    <TimeSeriesMetadataAttribute
                        layer={layer}
                        disabled={metadata.layer === ''}
                        controller={controller}
                    ></TimeSeriesMetadataAttribute>
                    <TimeSeriesMetadataToggleLevel
                        layer={layer}
                        disabled={metadata.layer === ''}
                        scales={scales}
                        controller={controller}
                    ></TimeSeriesMetadataToggleLevel>
                </Fragment>
            )}
        </TimeSeriesContainer>
    );
};

TimeSeries.propTypes = {
    layer: PropTypes.object.isRequired,
    scales: PropTypes.array.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
