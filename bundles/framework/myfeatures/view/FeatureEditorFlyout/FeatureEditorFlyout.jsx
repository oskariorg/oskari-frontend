/* eslint-disable react/prop-types */
import React from 'react';
import { showFlyout } from 'oskari-ui/components/window';
import { FeatureEditorPanel } from 'oskari-ui/components/FeatureEditor';
import { Message } from 'oskari-ui';
import { BUNDLE_KEY } from '../../constants';
import { LayerSelectionPanel } from './LayerSelectionPanel';
const FeatureEditorContainer = ({ layerId, featureId, layers = null, savedFeature, controller }) => {
    return <>
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
        />}
    </>;
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
    const controls = showFlyout(title, content, () => { controller.closeFeatureEditorFlyout(); });

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
