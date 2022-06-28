import React from 'react';
import PropTypes from 'prop-types';
import { showPopup, PLACEMENTS } from 'oskari-ui/components/window';
import { MetadataIcon } from 'oskari-ui/components/icons';
import styled from 'styled-components';
import { Checkbox, Message, Radio, Label } from 'oskari-ui';

const BUNDLE_NAME = 'MapModule';

const POPUP_OPTIONS = {
    id: 'LayerSelection',
    placement: PLACEMENTS.TL
};

const Content = styled('div')`
    margin: 12px 24px 24px;
`;

const LayerRow = styled('div')`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const StyledCheckbox = styled(Checkbox)`
    margin-right: 5px;
`;

const LayerSelectionPopup = ({ baseLayers, layers, showMetadata, setLayerVisibility }) => {
    const normalLayers = layers.filter(layer => baseLayers.findIndex(bl => bl.getId() === layer.getId()) < 0);
    return (
        <Content>
            <Label><Message bundleKey={BUNDLE_NAME} messageKey='plugin.LayerSelectionPlugin.chooseDefaultBaseLayer' /></Label>
            <Radio.Group
                value={baseLayers.find(l => l.isVisible())}
                onChange={e => setLayerVisibility(e.target.value, e.target.checked, true)}
            >
                {baseLayers.map(layer => {
                    return (
                        <div key={layer.getId()}>
                            <LayerRow>
                                <Radio.Choice value={layer}>
                                    {layer.getName()}
                                </Radio.Choice>
                                {showMetadata && (<MetadataIcon metadataId={layer.getMetadataIdentifier()} />)}
                            </LayerRow>
                        </div>
                    );
                })}
            </Radio.Group>
            <Label><Message bundleKey={BUNDLE_NAME} messageKey='plugin.LayerSelectionPlugin.chooseOtherLayers' /></Label>
            {normalLayers.map(layer => {
                return (
                    <LayerRow key={layer.getId()}>
                        <div>
                            <StyledCheckbox
                                checked={layer.isVisible()}
                                onChange={e => setLayerVisibility(layer, e.target.checked, false)}
                            />
                            <span>{layer.getName()}</span>
                        </div>
                        {showMetadata && (<MetadataIcon metadataId={layer.getMetadataIdentifier()} />)}
                    </LayerRow>
                );
            })}
        </Content>
    );
};

export const showLayerSelectionPopup = (baseLayers, layers, onClose, showMetadata, setLayerVisibility) => {
    const controls = showPopup(
        <Message bundleKey={BUNDLE_NAME} messageKey='plugin.LayerSelectionPlugin.title' />,
        <LayerSelectionPopup baseLayers={baseLayers} layers={layers} showMetadata={showMetadata} setLayerVisibility={setLayerVisibility} />,
        onClose,
        POPUP_OPTIONS
    );

    return {
        ...controls,
        update: (baseLayerData, layerData, showMetadata, setLayerVisibility) => controls.update(
            <Message bundleKey={BUNDLE_NAME} messageKey='plugin.LayerSelectionPlugin.title' />,
            <LayerSelectionPopup baseLayers={baseLayerData} layers={layerData} showMetadata={showMetadata} setLayerVisibility={setLayerVisibility} />
        )
    };
};

LayerSelectionPopup.propTypes = {
    baseLayers: PropTypes.arrayOf(PropTypes.object),
    layers: PropTypes.arrayOf(PropTypes.object),
    showMetadata: PropTypes.bool.isRequired,
    setLayerVisibility: PropTypes.func.isRequired
};
