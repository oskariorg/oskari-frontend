import { Message, Option, Select } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { StyledFormField } from './styled';

export const TimeSeriesMetadataAttribute = ({ layer, disabled, controller }) => {
    const options = layer.options || {};
    const timeseries = options.timeseries || {};
    const metadata = timeseries.metadata || {};
    const selectedAttribute = metadata.attribute || '';
    const layerAttributes = metadata.layerAttributes || {};
    return (
        <Fragment>
            <Message messageKey="timeSeries.metadataAttribute" />
            <StyledFormField>
                <Select
                    showSearch
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    value={selectedAttribute}
                    disabled={disabled}
                    onChange={(value) => controller.setTimeSeriesMetadataAttribute(value)}
                >
                    {Object.entries(layerAttributes).map(([identifier, label]) => (
                        <Option key={identifier} value={identifier}>
                            {label}
                        </Option>
                    ))}
                </Select>
            </StyledFormField>
        </Fragment>
    );
};

TimeSeriesMetadataAttribute.propTypes = {
    layer: PropTypes.object.isRequired,
    disabled: PropTypes.bool.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
};
