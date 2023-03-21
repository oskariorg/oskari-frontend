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
    margin-left: 15px;
`;


export const MapLayerListToolComponent = ({ state, controller }) => {
    const StyleSelect = (
        <StyledCheckbox
            checked={state.allowStyleChange}
            onChange={(e) => controller.setAllowStyleChange(e.target.checked)}
            disabled={state.isDisabledStyleChange}
        >
            <Message messageKey='BasicView.maptools.layerselection.allowStyleChange' />
        </StyledCheckbox>
    );
    const MetadataSelect = (
        <StyledCheckbox
            checked={state.showMetadata}
            onChange={(e) => controller.setShowMetadata(e.target.checked)}
            disabled={state.isDisabledMetadata}
        >
            <Message messageKey='BasicView.maptools.layerselection.showMetadata' />
        </StyledCheckbox>
    );
    return (
        <React.Fragment>
            <StyledCheckbox
                checked={state.showLayerSelection}
                onChange={(e) => controller.setShowLayerSelection(e.target.checked)}
            >
                <Message messageKey='BasicView.layerselection.label' />
            </StyledCheckbox>
            {state.showLayerSelection && (
                <ExtraOptions>
                    {state.isDisabledMetadata ? (
                        <Tooltip title={<Message messageKey='BasicView.maptools.layerselection.noMetadata' />}>
                            {MetadataSelect}
                        </Tooltip>
                    ) : (
                        MetadataSelect
                    )}
                    {state.isDisabledStyleChange ? (
                        <Tooltip title={<Message messageKey='BasicView.maptools.layerselection.noMultipleStyles' />}>
                            {StyleSelect}
                        </Tooltip>
                    ) : (
                        StyleSelect
                    )}
                </ExtraOptions>
            )}
        </React.Fragment>);

};