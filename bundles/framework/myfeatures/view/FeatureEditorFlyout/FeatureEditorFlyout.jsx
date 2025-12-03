import React from 'react';
import { showFlyout } from 'oskari-ui/components/window';

const FeatureEditorContainer = ({ layerId }) => {
    return <>
        <div>Editable feature - { layerId }</div>
    </>;
}

export const showFeatureEditorFlyout = (layerId, controller) => {
    const content = <FeatureEditorContainer layerId = { layerId }/>;
    const title = 'Feature editing ';
    const controls = showFlyout(title, content, () => { controller.closeFeatureEditorFlyout(); });

    return {
        ...controls,
        update: (state) => {
            controls.update(title, <FeatureEditorContainer layerId = { layerId }/>);
        }
    };
};
