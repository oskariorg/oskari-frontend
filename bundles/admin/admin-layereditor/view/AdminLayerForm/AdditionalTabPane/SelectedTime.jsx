import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Select, Option } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledComponent } from '../StyledFormComponents';

export const SelectedTime = ({ layer, capabilities, controller }) => {
    const value = layer.params ? layer.params.selectedTime : '';
    if (!capabilities.times) {
        return null;
    }
    return (
        <Fragment>
            <Message messageKey='selectedTime'/>
            <StyledComponent>
                <Select
                    showSearch
                    value={value}
                    onChange={value => controller.setSelectedTime(value)}>
                    { capabilities.times.map(time => <Option key={time}>{time}</Option>)}
                </Select>
            </StyledComponent>
        </Fragment>
    );
};
SelectedTime.propTypes = {
    layer: PropTypes.object.isRequired,
    capabilities: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
