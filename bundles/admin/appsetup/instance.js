import React from 'react';
import { BasicBundleInstance } from 'oskari-ui/BasicBundleInstance';
import { AppSetupTab } from './AppSetupTab.js';

const BUNDLE_KEY = 'AdminAppSetup';
const TAB_ID = 'appsetup';

export class AppSetupBundleInstance extends BasicBundleInstance {
    constructor () {
        super(BUNDLE_KEY);
    }

    start (sandbox) {
        super.start(sandbox);
        if (!sandbox.hasHandler('Admin.AddTabRequest')) {
            return;
        }
        const reqBuilder = Oskari.requestBuilder('Admin.AddTabRequest');
        sandbox.request(this, reqBuilder(Oskari.getMsg(BUNDLE_KEY, 'title'), <AppSetupTab />, 3, TAB_ID));
    }
}
