import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Message, Switch } from 'oskari-ui';
import { StyledFormField, SpacedLabel } from '../styled';

export const Declutter = ({ layer, controller }) => {
    const [checked, setChecked] = useState(layer.options && layer.options.declutter ? layer.options.declutter : false);
    const toggle = checked => {
        controller.toggleDeclutter(checked);
        setChecked(checked);
    };

    return (
        <StyledFormField>
            <label>
                <Switch size='small' checked={checked} onChange={checked => toggle(checked)} />
                <Message messageKey='fields.declutter' LabelComponent={SpacedLabel} />
            </label>
        </StyledFormField>
    );
};

Declutter.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
