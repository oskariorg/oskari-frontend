import React from 'react';
import PropTypes from 'prop-types';
import { Message, Checkbox } from 'oskari-ui';
import styled from 'styled-components';

const ExtraOptions = styled('div')`
    display:flex;
    flex-direction: column;
`;

export const SwipeToolComponent = ({ state, controller }) => {
    return (
        <ExtraOptions>
            <Checkbox
                className='t_swipe_auto_start'
                checked={state.active}
                onChange={(e) => controller.setActive(e.target.checked)}>
                <Message bundleKey="LayerSwipe" messageKey='tool.autoStart' />
            </Checkbox>
            <Checkbox
                className='t_swipe_hide_plugin'
                checked={state.noUI}
                onChange={(e) => controller.setHideUI(e.target.checked)}>
                <Message bundleKey="Publisher2" messageKey='BasicView.noUI' />
            </Checkbox>
        </ExtraOptions>
    );
};

SwipeToolComponent.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired
};
