import React from 'react';
import { showFlyout } from 'oskari-ui/components/window';
import { getHeaderTheme } from 'oskari-ui/theme/ThemeHelper';
import { MetadataContainer } from './MetadataContainer';
import { LocaleProvider } from 'oskari-ui/util';

const BUNDLE_ID = 'catalogue.metadata';

const theme = getHeaderTheme(Oskari.app.getTheming().getTheme());

export const showMetadataFlyout = (state, controller, onClose) => {
    const content = (
        <LocaleProvider value={{ bundleKey: BUNDLE_ID }}>
            <MetadataContainer {...state} controller = { controller }/>
        </LocaleProvider>
    );
    const title = Oskari.getMsg(BUNDLE_ID, 'title');
    const controls = showFlyout(title, content, onClose, { theme, id: BUNDLE_ID });
    return {
        ...controls,
        update: (state) => {
            controls.update(
                title,
                <LocaleProvider value={{ bundleKey: BUNDLE_ID }}>
                    <MetadataContainer { ...state } controller = { controller }/>
                </LocaleProvider>
            );
        }
    };
};
