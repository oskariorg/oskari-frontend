import React from 'react';
import { Message, Checkbox, Tooltip } from 'oskari-ui';
import styled from 'styled-components';

const StyledCheckbox = styled(Checkbox)`
    + .ant-checkbox-wrapper {
        margin-left: 0;
    }
`;
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
            <Tooltip title={<Message messageKey='BasicView.maptools.layerselection.noMultipleStyles' />}>
                <StyledCheckbox className='t_allow_style_select' disabled><Message messageKey='BasicView.maptools.layerselection.allowStyleChange' /></StyledCheckbox>
            </Tooltip>);
    }
    return (
        <StyledCheckbox
            className='t_allow_style_select'
            checked={state.isStyleSelectable}
            onChange={(e) => controller.setAllowStyleChange(e.target.checked)}
        >
            <Message messageKey='BasicView.maptools.layerselection.allowStyleChange' />
        </StyledCheckbox>);
};

const MetadataSelect = ({ state, controller }) => {
    if (state.isDisabledMetadata) {
        return (
            <Tooltip title={<Message messageKey='BasicView.maptools.layerselection.noMetadata' />}>
                <StyledCheckbox className='t_show_metalinks' disabled><Message messageKey='BasicView.maptools.layerselection.showMetadata' /></StyledCheckbox>
            </Tooltip>);
    }
    return (
        <StyledCheckbox
            className='t_show_metalinks'
            checked={state.showMetadata}
            onChange={(e) => controller.setShowMetadata(e.target.checked)}
        >
            <Message messageKey='BasicView.maptools.layerselection.showMetadata' />
        </StyledCheckbox>);
};
