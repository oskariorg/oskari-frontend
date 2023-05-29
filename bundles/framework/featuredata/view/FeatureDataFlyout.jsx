import React from 'react';
import { FEATUREDATA_BUNDLE_ID, FeatureDataContainer } from './FeatureDataContainer';
import { showFlyout } from 'oskari-ui/components/window';
import { getHeaderTheme } from 'oskari-ui/theme/ThemeHelper';
const theme = getHeaderTheme(Oskari.app.getTheming().getTheme());
export const showFeatureDataFlyout = (state, controller) => {
    const content = <FeatureDataContainer state = { state } controller = { controller }/>;
    const title = Oskari.getMsg(FEATUREDATA_BUNDLE_ID, 'title');
    const controls = showFlyout(title, content, () => { controller.closeFlyout(); }, { theme });

    return {
        ...controls,
        update: (state) => {
            controls.update(title, <FeatureDataContainer state = { state } controller = { controller }/>);
        }
    };
};
