import React from 'react';
import { showPopup } from 'oskari-ui/components/window';
import styled from 'styled-components';
import { Switch, Message, Tooltip } from 'oskari-ui';
import { ChannelTitle } from './components/ChannelTitle';
import { getPopupOptions } from '../pluginPopupHelper';

const StyledContent = styled('div')`
    margin: 12px 24px 24px;
    min-width: 300px;
    display: flex;
    flex-direction: column;
`;

const Label = styled('label')`
    display: flex;
    padding-top: 5px;
    align-items: center;
    cursor: pointer;
`;
const StylizedSwitch = styled(Switch)`
    &.ant-switch-checked {
        background-color: ${props => props.$color};
    }
    margin-right: 10px;
`;
const PopupContent = ({ state, controller }) => {
    return (
        <StyledContent>
            <h4><Message messageKey='plugin.SearchPlugin.options.description' bundleKey='MapModule' /></h4>
            { state.channels.map(c => channelRenderer(c, state, controller)) }
        </StyledContent>
    )
};

// toggle color is changed if the channel is default or not
const getColor = (channel) => {
    if (channel.isDefault) {
        return 'green';
    }
    return 'orange';
};

/*
Channel:
{
    "isDefault":true,
    "id":"WFSSEARCH_CHANNEL_27",
    "locale":{
        "name":"Kiinteistöt, määräalat, kaavayksiköt ja vuokratontit ",
        "desc":"Kiinteistöt, määräalat, kaavayksiköt ja vuokratontit "
    }
}
*/
const channelRenderer = (channel, state, controller) => {
    const selected = state.selectedChannels.includes(channel.id);
    return (
        <Label
            key={channel.id}>
            <StylizedSwitch $color={getColor(channel)} size="small" checked={selected}
                onChange={checked => controller.setChannelEnabled(channel.id, checked)} />
            <ChannelTitle channel={channel} />
        </Label>);
};

export const showOptionsPopup = (title, state, controller, onClose, pluginLocation) => {
    const options = getPopupOptions({
        getName: () => 'searchOptions',
        getLocation: () => pluginLocation
    });
    const opts = showPopup(title, <PopupContent state={state} controller={controller} />, onClose, options);
    return {
        // pass close as is
        ...opts,
        // override update so we can update content by just passing new state
        update: (state) => opts.update(title, <PopupContent state={state} controller={controller} />)
    };
};
