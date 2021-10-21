import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Select, Option } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledFormField } from '../styled';

export const SelectedTime = ({ layer, controller }) => {
    const value = layer.params ? layer.params.selectedTime : '';
    const { capabilities } = layer;
    if (!capabilities.times) {
        return null;
    }
    return (
        <Fragment>
            <Message messageKey='fields.params.selectedTime'/>
            <StyledFormField>
                <Select
                    showSearch
                    allowClear
                    value={value}
                    onChange={value => controller.setSelectedTime(value)}>
                    { capabilities.times.map(time => <Option key={time}>{time}</Option>)}
                </Select>
            </StyledFormField>
        </Fragment>
    );
};
SelectedTime.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
