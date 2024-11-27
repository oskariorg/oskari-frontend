import React from 'react';
import { Message, Checkbox, Tooltip } from 'oskari-ui';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ExtraOptions = styled('div')`
    display:flex;
    flex-direction: column;
`;

export const MapLayerListToolComponent = ({ state, controller }) => {
    return (
        <ExtraOptions>
            <StyleSelect state={state} controller={controller} />
            <MetadataSelect state={state} controller={controller} />
        </ExtraOptions>);
};

const StyleSelect = ({ state, controller }) => {
    if (state.isDisabledStyleChange) {
        return (
            <Tooltip title={<Message bundleKey='MapModule' messageKey='publisherTools.LayerSelection.noMultipleStyles' />}>
                <Checkbox className='t_allow_style_select' disabled><Message bundleKey='MapModule' messageKey='publisherTools.LayerSelection.allowStyleChange' /></Checkbox>
            </Tooltip>);
    }
    return (
        <Checkbox
            className='t_allow_style_select'
            checked={state.isStyleSelectable}
            onChange={(e) => controller.setAllowStyleChange(e.target.checked)}
        >
            <Message bundleKey='MapModule' messageKey='publisherTools.LayerSelection.allowStyleChange' />
        </Checkbox>);
};

const MetadataSelect = ({ state, controller }) => {
    if (state.isDisabledMetadata) {
        return (
            <Tooltip title={<Message bundleKey='MapModule' messageKey='publisherTools.LayerSelection.noMetadata' />}>
                <Checkbox className='t_show_metalinks' disabled><Message bundleKey='MapModule' messageKey='publisherTools.LayerSelection.showMetadata' /></Checkbox>
            </Tooltip>);
    }
    return (
        <Checkbox
            className='t_show_metalinks'
            checked={state.showMetadata}
            onChange={(e) => controller.setShowMetadata(e.target.checked)}
        >
            <Message bundleKey='MapModule' messageKey='publisherTools.LayerSelection.showMetadata' />
        </Checkbox>);
};

MapLayerListToolComponent.propTypes = {
    state: PropTypes.object,
    controller: PropTypes.object
};

StyleSelect.propTypes = {
    state: PropTypes.object,
    controller: PropTypes.object
};

MetadataSelect.propTypes = {
    state: PropTypes.object,
    controller: PropTypes.object
};
