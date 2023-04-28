import React from 'react';
import { FeatureDataContainer } from '../view/FeatureDataContainer';
import { showFlyout } from '../../../../src/react/components/window';

export const showFeatureDataFlyout = (state, controller) => {
    const content = <FeatureDataContainer state = { state } controller = { controller }/>;
    const controls = showFlyout('Feature data flyout', content, () => { controller.closeFlyout(); }, {});

    return {
        ...controls,
        update: (state) => {
            controls.update('Feature data flyout', <FeatureDataContainer state = { state } controller = { controller }/>);
        }
    };
};
