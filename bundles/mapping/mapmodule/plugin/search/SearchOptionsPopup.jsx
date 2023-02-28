import React from 'react';
import { showPopup } from 'oskari-ui/components/window';
import styled from 'styled-components';
import { Switch, Message, Tooltip } from 'oskari-ui';
import { InfoIcon } from 'oskari-ui/components/icons';
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
    > div {
        margin-left: 8px;
        margin-right: 3px;
    }
`;
const StylizedSwitch = styled(Switch)`
    &.ant-switch-checked {
        background-color: ${props => props.$color};
    }
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
            <div>{channel.locale.name}</div>
            { channel.locale.desc &&
                <div><Tooltip title={channel.locale.desc}><InfoIcon /></Tooltip></div>
            }
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
