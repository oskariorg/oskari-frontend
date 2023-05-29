import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Message, Switch } from 'oskari-ui';
import { StyledFormField, SpacedLabel } from '../styled';

export const Declutter = ({ layer, controller }) => {
    const options = layer.options || {};
    const value = options.declutter || false;
    return (
        <StyledFormField>
            <label>
                <Switch size='small' checked={value} onChange={checked => controller.toggleDeclutter(checked)} />
                <Message messageKey='fields.declutter' LabelComponent={SpacedLabel} />
            </label>
        </StyledFormField>
    );
};

Declutter.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
