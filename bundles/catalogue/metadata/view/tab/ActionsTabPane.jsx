import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Link, Button } from 'oskari-ui';
import { Content, Label } from './';

const LayerList = styled.ul`
    list-style-type: none;
`;

const Margin = styled.div`
    margin-bottom: 1em;
`;

export const ActionsTabPane = ({ metadataURL, controller, layers, hideLink }) => {
    const hasLayers = layers.length > 0;
    return (
        <Content>
            { !hideLink &&
                <Margin>
                    <Link url={metadataURL}><Message messageKey='flyout.actions.xml' /></Link>
                </Margin>
            }
            { hasLayers && <Label labelKey='layerList'/> }
            <LayerList>
                { layers.map(layer => (
                    <li key={layer.layerId}>
                        {layer.name}
                        <Button type='link' onClick={() => controller.toggleMapLayerVisibility(layer)}>
                            <Message messageKey={`flyout.actions.${layer.isSelected && layer.isVisible ? 'hide' : 'show'}`} />
                        </Button>
                    </li>
                ))}
            </LayerList>
        </Content>
    );
};

ActionsTabPane.propTypes = {
    metadataURL: PropTypes.string,
    controller: PropTypes.object.isRequired,
    layers: PropTypes.array.isRequired,
    hideLink: PropTypes.bool.isRequired
};
