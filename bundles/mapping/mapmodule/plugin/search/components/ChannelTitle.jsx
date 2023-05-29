import React from 'react';
import { Message, Tooltip } from 'oskari-ui';
import { InfoIcon } from 'oskari-ui/components/icons';
import styled from 'styled-components';

const Title = styled('span')`
    > span {
        margin-left: 8px;
        margin-right: 3px;
    }
`;
// This component could be used in options popup as well
export const ChannelTitle = ({ channel, showGeneric = false }) => {
    if (showGeneric || !channel.locale?.name) {
        return (<Message messageKey='plugin.SearchPlugin.title' bundleKey='MapModule' />);
    }
    return (<Title>
        {channel.locale.name}
        { channel.locale?.desc &&
            <span><Tooltip title={channel.locale.desc}><InfoIcon /></Tooltip></span>
        }
    </Title>);
};