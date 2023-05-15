import React from 'react';
import { FeatureDataContainer } from './FeatureDataContainer';
import { showFlyout } from 'oskari-ui/components/window';

export const showFeatureDataFlyout = (state, controller) => {
    const content = <FeatureDataContainer state = { state } controller = { controller }/>;
    const title = Oskari.getMsg('FeatureData', 'title');
    const controls = showFlyout(title, content, () => { controller.closeFlyout(); }, {});

    return {
        ...controls,
        update: (state) => {
            controls.update(title, <FeatureDataContainer state = { state } controller = { controller }/>);
        }
    };
};
