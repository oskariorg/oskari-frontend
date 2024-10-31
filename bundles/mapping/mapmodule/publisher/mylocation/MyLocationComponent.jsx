import React from 'react';
import PropTypes from 'prop-types';
import { Radio, Message, Checkbox } from 'oskari-ui';
import styled from 'styled-components';

const Column = styled('div')`
    display: flex;
    flex-direction: column;
`;
export const MyLocationComponent = ({ state, controller }) => {
    const onSelectionChange = (property, value) => {
        controller.updateOptions(property, value);
    };

    const { mode, centerMapAutomatically, mobileOnly } = state;
    return <>
        <Column>
            <Message bundleKey={'MapModule'} messageKey={'publisherTools.MyLocationPlugin.titles.mode'}/>
            <Radio.Group
                value={mode}
                onChange={(evt) => onSelectionChange('mode', evt.target.value)}
            >
                <Radio.Choice value={'continuous'}>
                    <Message bundleKey={'MapModule'} messageKey={'publisherTools.MyLocationPlugin.modes.continuous'}/>
                </Radio.Choice>
                <Radio.Choice value={'single'}>
                    <Message bundleKey={'MapModule'} messageKey={'publisherTools.MyLocationPlugin.modes.single'}/>
                </Radio.Choice>
            </Radio.Group>
        </Column>
        <Column>
            <Checkbox checked={centerMapAutomatically} onChange={evt => onSelectionChange('centerMapAutomatically', evt.target.checked)}>
                <Message bundleKey={'MapModule'} messageKey={'publisherTools.MyLocationPlugin.titles.centerMapAutomatically'}/>
            </Checkbox>
            <Checkbox checked={mobileOnly} onChange={evt => onSelectionChange('mobileOnly', evt.target.checked)}>
                <Message bundleKey={'MapModule'} messageKey={'publisherTools.MyLocationPlugin.titles.mobileOnly'}/>
            </Checkbox>
        </Column>
    </>;
};

MyLocationComponent.propTypes = {
    state: PropTypes.object,
    controller: PropTypes.object
};
