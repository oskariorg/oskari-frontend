import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Numeric } from '../Numeric';

export const CapabilitiesUpdateRate = ({ layer, controller }) => (
    <Numeric
        value={layer.capabilitiesUpdateRate}
        messageKey='capabilitiesUpdateRate'
        infoKeys='capabilitiesUpdateRateDesc'
        suffix='s'
        allowNegative={false}
        allowZero={false}
        onChange={value => controller.setCapabilitiesUpdateRate(value)} />
);
CapabilitiesUpdateRate.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
