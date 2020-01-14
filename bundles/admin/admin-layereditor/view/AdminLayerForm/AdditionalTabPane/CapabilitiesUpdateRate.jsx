import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, NumberInput } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { InfoTooltip } from '../InfoTooltip';
import { InlineFlex } from '../InlineFlex';
import { StyledComponent } from '../StyledFormComponents';

export const CapabilitiesUpdateRate = ({ layer, controller }) => (
    <Fragment>
        <Message messageKey='capabilitiesUpdateRate'/>
        <InfoTooltip messageKeys='capabilitiesUpdateRateDesc'/>
        <StyledComponent>
            <InlineFlex>
                <NumberInput
                    value={layer.capabilitiesUpdateRate}
                    onChange={value => controller.setCapabilitiesUpdateRate(value)}
                    formatter={value => value && value > 0 ? `${value}s` : '' }
                    parser={value => value.replace('s', '')} />
            </InlineFlex>
        </StyledComponent>
    </Fragment>
);
CapabilitiesUpdateRate.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
