import { Message, Switch } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import PropTypes from 'prop-types';
import React from 'react';
import { StyledFormField, SpacedLabel } from '../../styled';

export const TimeSeriesMetadataVisualization = ({ layer, disabled, controller }) => {
    const options = layer.options || {};
    const timeseries = options.timeseries || {};
    const metadata = timeseries.metadata || { visualize: false };
    return (
        <StyledFormField>
            <label>
                <Switch
                    disabled={disabled}
                    size='small'
                    checked={!!metadata.visualize}
                    onChange={checked => controller.setTimeSeriesMetadataVisualize(checked)} />
                <Message messageKey='timeSeries.metadataVisualize' LabelComponent={SpacedLabel} />
            </label>
        </StyledFormField>
    );
};

TimeSeriesMetadataVisualization.propTypes = {
    layer: PropTypes.object.isRequired,
    disabled: PropTypes.bool.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
