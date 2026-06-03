/* eslint-disable react/prop-types */
import React from 'react';
import { styled } from 'styled-components';
import { showPopup } from 'oskari-ui/components/window';
import { FeatureEditorPanel } from 'oskari-ui/components/FeatureEditor';
import { Message } from 'oskari-ui';
import { BUNDLE_KEY } from '../../constants';
import { LayerSelectionPanel } from './LayerSelectionPanel';

const StyledContainer = styled('div')`
    min-width: 100%;
    width: 25vw;
`;

const FeatureEditorContainer = ({ layerId, featureId, layers = null, savedFeature, controller }) => {
    return <StyledContainer>
        {!layerId && <LayerSelectionPanel
            layers={ layers }
            setCurrentLayer={(layerId) => controller.setFeatureEditorLayer(layerId)}
            addNewLayer={() => controller.showLayerDialog({isNew: true})}

        />}
        {layerId && <FeatureEditorPanel
            layerId = { layerId }
            featureId = { featureId }
            savedFeature = { savedFeature }
            loading = {false}
            onSave = {(layer, feature) => {
                controller.saveFeature(layer, feature);
            }}
            onDelete = {(layer, featureId) => {
                controller.deleteFeature(layer.id, featureId);
            }}
            onClose = {() => {
                controller.closeFeatureEditorFlyout();
            }}
            onCancel = {() => {
                controller.closeFeatureEditorFlyout();
            }}
            showGeoJSONPanel={false}
            showGeometryNotRecognizedAlert={false}
        />}
    </StyledContainer>;
};

export const showFeatureEditorFlyout = (layerId, featureId, layers = null, controller, savedFeature) => {
    const content = <FeatureEditorContainer
        layers = { layers }
        layerId = { layerId }
        featureId = { featureId }
        savedFeature = { savedFeature }
        controller = { controller }
    />;
    const title = <Message bundleKey={BUNDLE_KEY} messageKey={'featureEditor.title'}/>;
    const controls = showPopup(title, content, () => { controller.closeFeatureEditorFlyout(); }, { isDraggable: true });

    return {
        ...controls,
        update: (layerId, featureId, layers, controller, savedFeature) => {
            controls.update(title,
                <FeatureEditorContainer
                    layers={layers}
                    layerId={layerId}
                    featureId={featureId}
                    savedFeature={savedFeature}
                    controller={controller} />);
        }
    };
};
