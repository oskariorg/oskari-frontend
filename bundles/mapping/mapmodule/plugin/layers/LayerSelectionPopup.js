import React from 'react';
import PropTypes from 'prop-types';
import { showPopup, PLACEMENTS } from 'oskari-ui/components/window';
import { MetadataIcon } from 'oskari-ui/components/icons';
import styled from 'styled-components';
import { Checkbox, Message } from 'oskari-ui';

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

const LayerSelectionPopup = ({ layers, showMetadata, setLayerVisibility }) => {
    return (
        <Content>
            {layers.map(layer => {
                return (
                    <LayerRow key={layer.getId()}>
                        <div>
                            <StyledCheckbox
                                checked={layer.isVisible()}
                                onChange={e => setLayerVisibility(layer, e.target.checked)}
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

export const showLayerSelectionPopup = (layers, onClose, showMetadata, setLayerVisibility) => {
    const controls = showPopup(
        <Message bundleKey={BUNDLE_NAME} messageKey='plugin.LayerSelectionPlugin.title' />,
        <LayerSelectionPopup layers={layers} showMetadata={showMetadata} setLayerVisibility={setLayerVisibility} />,
        onClose,
        POPUP_OPTIONS
    );

    return {
        ...controls,
        update: (layerData, showMetadata, setLayerVisibility) => controls.update(
            <Message bundleKey={BUNDLE_NAME} messageKey='plugin.LayerSelectionPlugin.title' />,
            <LayerSelectionPopup layers={layerData} showMetadata={showMetadata} setLayerVisibility={setLayerVisibility} />
        )
    };
};

LayerSelectionPopup.propTypes = {
    layers: PropTypes.arrayOf(PropTypes.object),
    showMetadata: PropTypes.bool.isRequired,
    setLayerVisibility: PropTypes.func.isRequired
};
