import React from 'react';
import { Message, Checkbox } from 'oskari-ui';
import styled from 'styled-components';

const ExtraOptions = styled('div')`
    display:flex;
    flex-direction: column;
`;

export const SwipeToolComponent = ({ state, controller }) => {
    return (
        <ExtraOptions>
            <AutoStartSelect state={state} controller={controller} />
            <HideUISelect state={state} controller={controller} />
        </ExtraOptions>);
};

const AutoStartSelect = ({ state, controller }) => {
    return (
        <Checkbox
            className='t_swipe_auto_start'
            checked={state.autoStart}
            onChange={(e) => controller.setAutoStart(e.target.checked)}
        >
            <Message messageKey='BasicView.maptools.swipe.autoStart' />
        </Checkbox>);
};

const HideUISelect = ({ state, controller }) => {
    return (
        <Checkbox
            className='t_swipe_hide_plugin'
            checked={state.hideUI}
            onChange={(e) => controller.setHideUI(e.target.checked)}
        >
            <Message messageKey='BasicView.noUI' />
        </Checkbox>);
};
