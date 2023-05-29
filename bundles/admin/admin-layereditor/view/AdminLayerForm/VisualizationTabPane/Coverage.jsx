import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Message, Switch } from 'oskari-ui';
import { StyledFormField, SpacedLabel } from '../styled';

export const Coverage = ({ id, controller }) => {
    const [checked, setChecked] = useState(false);
    const toggle = checked => {
        if (checked) {
            controller.showLayerCoverage(id);
        } else {
            controller.clearLayerCoverage();
        }
        setChecked(checked);
    };

    return (
        <StyledFormField>
            <label>
                <Switch size='small' checked={checked} onChange={checked => toggle(checked)} />
                <Message messageKey='fields.coverage' LabelComponent={SpacedLabel} />
            </label>
        </StyledFormField>
    );
};

Coverage.propTypes = {
    id: PropTypes.number.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
