import React from 'react';
import { getReactRoot } from 'oskari-ui/components/window';
import { LocaleProvider, ThemeProvider } from 'oskari-ui/util';
import { BasicBundleInstance } from 'oskari-ui/BasicBundleInstance';
import { AppSetupTab } from './AppSetupTab.js';

const BUNDLE_KEY = 'AdminAppSetup';

export class AppSetupBundleInstance extends BasicBundleInstance {
    constructor () {
        super(BUNDLE_KEY);
    }

    start (sandbox) {
        super.start(sandbox);
        if (!sandbox.hasHandler('Admin.AddTabRequest')) {
            return;
        }
        const container = document.createElement('div');
        getReactRoot(container).render(
            <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
                <ThemeProvider>
                    <AppSetupTab />
                </ThemeProvider>
            </LocaleProvider>
        );
        const reqBuilder = Oskari.requestBuilder('Admin.AddTabRequest');
        sandbox.request(this, reqBuilder(Oskari.getMsg(BUNDLE_KEY, 'title'), container, 3, 'appsetup'));
    }
}
