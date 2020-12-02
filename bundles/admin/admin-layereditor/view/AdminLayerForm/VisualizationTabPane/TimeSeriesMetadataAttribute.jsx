import { Message, TextInput } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { StyledFormField } from './styled';

export const TimeSeriesMetadataAttribute = ({ layer, disabled, controller }) => {
    const options = layer.options || {};
    const timeseries = options.timeseries || {};
    const metadata = timeseries.metadata || { attribute: '' };
    return (
        <Fragment>
            <Message messageKey="timeSeries.metadataAttribute" />
            <StyledFormField>
                <TextInput
                    value={metadata.attribute}
                    disabled={disabled}
                    type="text"
                    onChange={(evt) => controller.setTimeSeriesMetadataAttribute(evt.target.value)}
                />
            </StyledFormField>
        </Fragment>
    );
};

TimeSeriesMetadataAttribute.propTypes = {
    layer: PropTypes.object.isRequired,
    disabled: PropTypes.bool.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
};
