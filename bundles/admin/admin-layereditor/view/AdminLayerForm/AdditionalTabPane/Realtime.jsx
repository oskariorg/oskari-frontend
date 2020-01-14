import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Switch, Message, NumberInput } from 'oskari-ui';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { InfoTooltip } from '../InfoTooltip';
import { InlineFlex } from '../InlineFlex';
import { StyledComponent } from '../StyledFormComponents';
import styled from 'styled-components';

const SpacedLabel = styled('div')`
    display: inline-block;
    margin-left: 10px;
`;

export const Realtime = LocaleConsumer(({ layer, controller, getMessage }) => (
    <Fragment>
        <StyledComponent>
            <label>
                <Switch size='small' checked={layer.realtime} onChange={checked => controller.setRealtime(checked)} />
                <Message messageKey='realtime' LabelComponent={SpacedLabel} />
            </label>
            <InfoTooltip messageKeys='realtimeDesc'/>
        </StyledComponent>
        { layer.realtime &&
            <StyledComponent>
                <InlineFlex>
                    <NumberInput
                        placeholder={getMessage('refreshRate')}
                        value={layer.refreshRate}
                        onChange={value => controller.setRefreshRate(value)}
                        formatter={value => value && value > 0 ? `${value}s` : '' }
                        parser={value => value.replace('s', '')} />
                </InlineFlex>
            </StyledComponent>
        }
    </Fragment>
));
Realtime.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
