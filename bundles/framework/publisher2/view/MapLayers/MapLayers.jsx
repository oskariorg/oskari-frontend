import React from 'react';
import styled from 'styled-components';
import { Button, Message, Checkbox, Tooltip } from 'oskari-ui';
import { ButtonContainer, IconButton } from 'oskari-ui/components/buttons';
import { UpCircleOutlined, DownCircleOutlined } from '@ant-design/icons';

const Content = styled('div')`
    display: flex;
    flex-direction: column;
    margin-right: 10px;
`;

const LayerBox = styled('div')`
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    min-height: 32px;
    background-color: ${props => props.disabled ? '#999999' : '#ffffff'};
    opacity: ${props => props.disabled ? '0.5' : '1'};
    padding: 3px 10px 3px 5px;
    margin-top: 5px;
    box-shadow: ${props => props.disabled ? 'none' : '1px 1px 2px rgb(0 0 0 / 60%)'};
`;

const LayerTitle = styled('span')`
    margin-right: 5px;
`;

const StyledCheckbox = styled(Checkbox)`
    + .ant-checkbox-wrapper {
        margin-left: 0;
    }
`;

const LayerContainer = styled('div')`
    display: flex;
    flex-direction: column;
    margin-top: 20px;
`;

const ExtraOptions = styled('div')`
    display:flex;
    flex-direction: column;
    margin-left: 15px;
`;

export const MapLayers = ({ state, controller }) => {
    const layers = state.showLayerSelection ? state.layers.filter(l => !state.baseLayers.some(bl => bl.getId() === l.getId())) : state.layers;
    return (
        <Content>
            <StyledCheckbox
                checked={state.showLayerSelection}
                onChange={(e) => controller.setShowLayerSelection(e.target.checked)}
            >
                <Message messageKey='BasicView.layerselection.label' />
            </StyledCheckbox>
            {state.showLayerSelection && (
                <ExtraOptions>
                    <StyledCheckbox
                        checked={state.showMetadata}
                        onChange={(e) => controller.setShowMetadata(e.target.checked)}
                    >
                        <Message messageKey='BasicView.maptools.layerselection.showMetadata' />
                    </StyledCheckbox>
                    <StyledCheckbox
                        checked={state.allowStyleChange}
                        onChange={(e) => controller.setAllowStyleChange(e.target.checked)}
                    >
                        <Message messageKey='BasicView.maptools.layerselection.allowStyleChange' />
                    </StyledCheckbox>
                </ExtraOptions>
            )}
            {state.externalOptions.map((tool, index) => {
                return (
                    <tool.component
                        key={index}
                        state={tool.handler.getState()}
                        controller={tool.handler.getController()}
                    />
                )
            })}
            {state.showLayerSelection && (
                <LayerContainer>
                    <h3><Message messageKey='BasicView.mapLayers.baseLayers' /></h3>
                    {state.baseLayers.reverse().map((layer, index) => {
                        const disabled = !layer.isVisible();
                        return (
                            <LayerBox key={index} disabled={disabled}>
                                <LayerTitle>{layer.getName()}</LayerTitle>
                                {!disabled && (
                                    <IconButton
                                        icon={<DownCircleOutlined />}
                                        onClick={() => controller.removeBaseLayer(layer)}
                                    />
                                )}
                            </LayerBox>
                        )
                    })}
                </LayerContainer>
            )}
            {state.showLayerSelection && state.baseLayers?.length < 1 && (
                <Message messageKey='BasicView.mapLayers.noBaseLayers' />
            )}
            <LayerContainer>
                <h3><Message messageKey='BasicView.mapLayers.label' /></h3>
                {layers.map((layer, index) => {
                    const disabled = !layer.isVisible();
                    return (
                        <LayerBox key={index} disabled={disabled}>
                            <LayerTitle>{layer.getName()}</LayerTitle>
                            {!disabled && state.showLayerSelection && (
                                <Tooltip title={<Message messageKey='BasicView.maptools.layerselection.selectAsBaselayer' />}>
                                    <IconButton
                                        icon={<UpCircleOutlined />}
                                        onClick={() => controller.addBaseLayer(layer)}
                                    />
                                </Tooltip>
                            )}
                        </LayerBox>
                    )
                })}
            </LayerContainer>
            {layers?.length < 1 && (
                <Message messageKey='BasicView.mapLayers.noLayers' />
            )}
            <ButtonContainer>
                <Button onClick={() => controller.openSelectedLayerList()}>
                    <Message messageKey='BasicView.mapLayers.layersDisplay' />
                </Button>
                <Button onClick={() => controller.openLayerList()}>
                    <Message messageKey='BasicView.mapLayers.selectLayers' />
                </Button>
            </ButtonContainer>
        </Content>
    );
};
