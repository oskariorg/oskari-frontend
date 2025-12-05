import React from 'react';
import { showFlyout } from 'oskari-ui/components/window';
import { ContentEditorPanel } from '../../../myfeatures-content-editor/view/ContentEditorPanel';
import { Message } from 'oskari-ui';
import { BUNDLE_KEY } from '../../constants';
const FeatureEditorContainer = ({ layerId, controller }) => {
    return <>
        <ContentEditorPanel
            layerId = { layerId }
            feature = { null }
            loading = {false}
            onSave = {() => {}}
            onDelete = {() => {}}
            onClose = {() => {
                controller.closeFeatureEditorFlyout();
            }}
            onCancel = {() => {
                controller.closeFeatureEditorFlyout();
            }}
            startNewFeature = {() => {}}
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
