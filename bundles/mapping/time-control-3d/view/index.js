import React from 'react';
import { LocaleProvider } from 'oskari-ui/util';
import { TimeControl3d } from './TimeControl3d';
import { showMovableContainer } from 'oskari-ui/components/window';

export { TimeControl3dHandler } from './TimeControl3dHandler';

const BUNDLE_KEY = 'TimeControl3d';

export const showTimeControl3dContainer = (state, controller, options, onClose) => {
    const isMobile = Oskari.util.isMobile();
    const getComponent = state => (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <TimeControl3d
                { ...state }
                isMobile={isMobile}
                controller={controller}
                onClose={onClose}/>
        </LocaleProvider>
    );

    const controls = showMovableContainer(getComponent(state), onClose, options);
    return {
        ...controls,
        update: (state) => {
            controls.update(getComponent(state));
        }
    };
};
