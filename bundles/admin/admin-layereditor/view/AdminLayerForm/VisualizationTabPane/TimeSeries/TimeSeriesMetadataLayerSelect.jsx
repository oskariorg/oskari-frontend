import { Message, Option, Select } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { StyledFormField } from '../styled';

export const TimeSeriesMetadataLayerSelect = ({ layer, controller }) => {
    const options = layer.options || {};
    const timeseries = options.timeseries || {};
    const metadata = timeseries.metadata || { layer: undefined };
    const mapLayerService = Oskari.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
    const wfsLayers = mapLayerService.getAllLayers().filter((l) => l.isLayerOfType('WFS'));
    // add an empty option to make it possible to unlink metadata layer (by selecting the empty option)
    const placeholder = <Message messageKey="timeSeries.selectMetadataLayer" />;
    const metadataOptions = [{ value: '', name: '--------' }].concat(
        wfsLayers.map((layer) => ({ value: layer.getId(), name: layer.getName() }))
    );
    return (
        <Fragment>
            <Message messageKey="timeSeries.metadataLayer" />
            <StyledFormField>
                <Select
                    showSearch
                    placeholder={placeholder}
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    value={metadata.layer}
                    onChange={(value) => controller.setTimeSeriesMetadataLayer(value)}
                >
                    {metadataOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                            {option.name}
                        </Option>
                    ))}
                </Select>
            </StyledFormField>
        </Fragment>
    );
};

TimeSeriesMetadataLayerSelect.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
