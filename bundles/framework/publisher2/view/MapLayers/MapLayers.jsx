import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Message, Tooltip, Card } from 'oskari-ui';
import { ButtonContainer, IconButton } from 'oskari-ui/components/buttons';
import { PublisherToolsList } from '../form/PublisherToolsList';
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

const LayerContainer = styled('div')`
    display: flex;
    flex-direction: column;
`;

export const MapLayers = ({ layers, baseLayers, tools, layerListPluginActive, controller }) => {
    return (
        <Content className='t_layers'>
            <Card size='small' title={<Message messageKey='BasicView.layers.tools' />}>
                <PublisherToolsList tools={tools} controller={controller} groupId='layers' />
            </Card>
            {layerListPluginActive && (
                <Card size='small' title={<Message messageKey='BasicView.layers.baseLayers' />}>
                    <LayerContainer>
                        {baseLayers.map((layer) => {
                            const disabled = !layer.isVisible();
                            return (
                                <LayerBox key={layer.getId()} disabled={disabled}>
                                    <LayerTitle>{layer.getName()}</LayerTitle>
                                    {!disabled && (
                                        <IconButton
                                            icon={<DownCircleOutlined />}
                                            onClick={() => controller.removeBaseLayer(layer)}
                                        />
                                    )}
                                </LayerBox>
                            );
                        })}
                    </LayerContainer>
                    {layerListPluginActive && baseLayers?.length < 1 && (
                        <Message messageKey='BasicView.layers.noBaseLayers' />
                    )}
                </Card>
            )}
            <Card size='small' title={<Message messageKey='BasicView.layers.otherLayers' />}>
                <LayerContainer>
                    <div className='ant-card-head-title'></div>
                    {layers.map((layer) => {
                        const disabled = !layer.isVisible();
                        return (
                            <LayerBox key={layer.getId()} disabled={disabled}>
                                <LayerTitle>{layer.getName()}</LayerTitle>
                                {!disabled && layerListPluginActive && (
                                    <Tooltip getPopupContainer={(triggerNode) => triggerNode.parentElement} title={<Message messageKey='BasicView.layers.selectAsBaselayer' />}>
                                        <IconButton
                                            icon={<UpCircleOutlined />}
                                            onClick={() => controller.addBaseLayer(layer)}
                                        />
                                    </Tooltip>
                                )}
                            </LayerBox>
                        );
                    })}
                </LayerContainer>
                {layers?.length < 1 && (
                    <Message messageKey='BasicView.layers.noLayers' />
                )}
            </Card>
            <ButtonContainer>
                <Button onClick={() => controller.openSelectedLayerList()}>
                    <Message messageKey='BasicView.layers.layersDisplay' />
                </Button>
                <Button onClick={() => controller.openLayerList()}>
                    <Message messageKey='BasicView.layers.selectLayers' />
                </Button>
            </ButtonContainer>
        </Content>
    );
};

MapLayers.propTypes = {
    layers: PropTypes.array.isRequired,
    baseLayers: PropTypes.array.isRequired,
    tools: PropTypes.array.isRequired,
    layerListPluginActive: PropTypes.bool.isRequired,
    controller: PropTypes.object.isRequired
};
