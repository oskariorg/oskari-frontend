import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Message } from 'oskari-ui';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { InfoTooltip } from '../InfoTooltip';
import { InlineFlex } from '../InlineFlex';
import { StyledComponent } from '../StyledFormComponents';
import { Numeric } from '../Numeric';
import styled from 'styled-components';

const SpacedLabel = styled('div')`
    display: inline-block;
    margin-left: 10px;
`;

const Expand = styled('div')`
    transition: max-height 0.3s ease;
    max-height: ${({ showRefreshRate }) => showRefreshRate ? '120px' : '40px'}
`;

const RefreshRate = styled(InlineFlex)`
    margin-top: 8px;
`;

export const Realtime = LocaleConsumer(({ layer, controller, getMessage }) => (
    <Expand showRefreshRate={!!layer.realtime}>
        <StyledComponent>
            <label>
                <Switch size='small' checked={layer.realtime} onChange={checked => controller.setRealtime(checked)} />
                <Message messageKey='realtime' LabelComponent={SpacedLabel} />
            </label>
            <InfoTooltip messageKeys='realtimeDesc'/>
            { layer.realtime &&
                <RefreshRate>
                    <Numeric
                        placeholder={getMessage('refreshRate')}
                        value={layer.refreshRate}
                        suffix='s'
                        allowNegative={false}
                        allowZero={false}
                        onChange={value => controller.setRefreshRate(value)} />
                </RefreshRate>
            }
        </StyledComponent>
    </Expand>
));
Realtime.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
