/* eslint-disable react/prop-types */
import React from 'react';
import { showFlyout } from 'oskari-ui/components/window';
import { ContentEditorPanel } from '../../../myfeatures-content-editor/view/ContentEditorPanel';
import { Message } from 'oskari-ui';
import { BUNDLE_KEY } from '../../constants';
const FeatureEditorContainer = ({ layerId, controller }) => {
    return <>
        <ContentEditorPanel
            layerId = { layerId }
            loading = {false}
            onSave = {(layer, feature) => {
                controller.saveFeature(layer, feature);
            }}
            onDelete = {() => {}}
            onClose = {() => {
                controller.closeFeatureEditorFlyout();
            }}
            onCancel = {() => {
                controller.closeFeatureEditorFlyout();
            }}
        />
    </>;
};

export const showFeatureEditorFlyout = (layerId, controller) => {
    const content = <FeatureEditorContainer layerId = { layerId } controller = { controller }/>;
    const title = <Message bundleKey={BUNDLE_KEY} messageKey={'featureEditor.title'}/>;
    const controls = showFlyout(title, content, () => { controller.closeFeatureEditorFlyout(); });

    return {
        ...controls,
        update: (layerId, controller) => {
            controls.update(title, <FeatureEditorContainer layerId = { layerId } controller = { controller }/>);
        }
    };
};
