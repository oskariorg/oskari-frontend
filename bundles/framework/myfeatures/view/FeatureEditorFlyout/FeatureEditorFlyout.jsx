/* eslint-disable react/prop-types */
import React from 'react';
import { showFlyout } from 'oskari-ui/components/window';
import { FeatureEditorPanel } from 'oskari-ui/components/FeatureEditor';
import { Message } from 'oskari-ui';
import { BUNDLE_KEY } from '../../constants';
const FeatureEditorContainer = ({ layerId, featureId, controller }) => {
    return <>
        <FeatureEditorPanel
            layerId = { layerId }
            featureId = { featureId }
            loading = {false}
            onSave = {(layer, feature) => {
                controller.saveFeature(layer, feature);
            }}
            onDelete = {(layer, featureId) => {
                controller.deleteFeature(layer, featureId);
            }}
            onClose = {() => {
                controller.closeFeatureEditorFlyout();
            }}
            onCancel = {() => {
                controller.closeFeatureEditorFlyout();
            }}
        />
    </>;
};

export const showFeatureEditorFlyout = (layerId, featureId, controller) => {
    const content = <FeatureEditorContainer
        layerId = { layerId }
        featureId = { featureId }
        controller = { controller }
    />;
    const title = <Message bundleKey={BUNDLE_KEY} messageKey={'featureEditor.title'}/>;
    const controls = showFlyout(title, content, () => { controller.closeFeatureEditorFlyout(); });

    return {
        ...controls,
        update: (layerId, featureId, controller) => {
            controls.update(title, <FeatureEditorContainer layerId = { layerId } featureId = { featureId } controller = { controller }/>);
        }
    };
};
