import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, TextInput } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledComponent } from '../StyledFormComponents';

export const SelectedTime = ({ layer, controller }) => {
    const value = layer.params ? layer.params.selectedTime : '';
    return (
        <Fragment>
            <Message messageKey='selectedTime' />
            <StyledComponent>
                <TextInput type='text' value={value} onChange={(evt) => controller.setSelectedTime(evt.target.value)} />
            </StyledComponent>
        </Fragment>
    );
};
SelectedTime.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
