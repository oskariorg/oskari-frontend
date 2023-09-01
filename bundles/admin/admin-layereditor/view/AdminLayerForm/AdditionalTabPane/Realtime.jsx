import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Message } from 'oskari-ui';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { InfoIcon } from 'oskari-ui/components/icons';
import { InlineFlex } from '../InlineFlex';
import { StyledFormField, SpacedLabel } from '../styled';
import { Numeric } from '../Numeric';
import styled from 'styled-components';

const Expand = styled('div')`
    transition: max-height 0.3s ease;
    max-height: ${({ showRefreshRate }) => showRefreshRate ? '120px' : '40px'}
`;

const RefreshRate = styled(InlineFlex)`
    margin-top: 8px;
`;

export const Realtime = LocaleConsumer(({ layer, controller, getMessage }) => (
    <Expand showRefreshRate={!!layer.realtime}>
        <StyledFormField>
            <label>
                <Switch size='small' checked={layer.realtime} onChange={checked => controller.setRealtime(checked)} />
                <Message messageKey='fields.realtime' LabelComponent={SpacedLabel} />
            </label>
            <InfoIcon title={<Message messageKey='realtimeDesc'/>} />
            { layer.realtime &&
                <RefreshRate>
                    <Numeric
                        placeholder={getMessage('fields.refreshRate')}
                        value={layer.refreshRate}
                        suffix='s'
                        allowNegative={false}
                        allowZero={false}
                        onChange={value => controller.setRefreshRate(value)} />
                </RefreshRate>
            }
        </StyledFormField>
    </Expand>
));

Realtime.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
