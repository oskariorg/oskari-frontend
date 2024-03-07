
import React from 'react';
import { showPopup } from 'oskari-ui/components/window';
import { Message } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import { MetadataCollapse } from './MetadataCollapse';

const BUNDLE_KEY = 'StatsGrid';
const POPUP_OPTIONS = {
    id: BUNDLE_KEY + '-metadata'
};

export const showMedataPopup = (indicators, onClose) => {
    const controls = showPopup(
        <Message messageKey="metadataPopup.title" bundleKey={BUNDLE_KEY} messageArgs={{indicators: indicators.length}}/>,
        (<LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <MetadataCollapse indicators={indicators}/>
        </LocaleProvider>), onClose, POPUP_OPTIONS);
    return {
        ...controls,
        update: (indicators) => {
            controls.update(
                <Message messageKey="metadataPopup.title" bundleKey={BUNDLE_KEY} messageArgs={{indicators: indicators.length}}/>,
                (<LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
                    <MetadataCollapse indicators={indicators} />
                </LocaleProvider>)
            );
            controls.bringToTop();
        }
    };
};
