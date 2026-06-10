import React from 'react';
import { showFlyout } from 'oskari-ui/components/window';
import { LocaleProvider } from 'oskari-ui/util';
import { UserGuideView } from './UserGuideView';

const BUNDLE_KEY = 'userinterface.UserGuide';

export const showUserGuideFlyout = (state, onClose) => {
    const title = Oskari.getMsg(BUNDLE_KEY, 'flyout.title');
    const getContent = (currentState) => (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <UserGuideView {...currentState} />
        </LocaleProvider>
    );
    const controls = showFlyout(title, getContent(state), onClose, { id: BUNDLE_KEY, resizable: true });
    return {
        ...controls,
        update: (newState) => controls.update(title, getContent(newState))
    };
};
