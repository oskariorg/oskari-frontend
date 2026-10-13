import { BasicBundleInstance } from 'oskari-ui/BasicBundleInstance';
import { MenuItem } from '../component/MenuItem';

const BUNDLE_ID = 'explicit-close-testbundle';
const TITLE = 'Explicit close';
const TOOLTIP = 'Stays active until explicitly closed';
const MAIN_NAVIGATION_SERVICE = 'Oskari.mapframework.bundle.mainnavigation.service.MainNavigationService';

export class ExplicitCloseTestBundleInstance extends BasicBundleInstance {
    constructor () {
        super(BUNDLE_ID);
        this.menuItemId = `${BUNDLE_ID}-item`;
        this.title = TITLE;
        this.mainNavigationService = null;
    }

    start (sandbox) {
        super.start(sandbox);
        this.mainNavigationService = sandbox.getService(MAIN_NAVIGATION_SERVICE);
        this.updateMenuItem();
    }

    updateMenuItem () {
        this.mainNavigationService.addMenuItem(new MenuItem({
            id: this.menuItemId,
            name: this.title,
            tooltip: TOOLTIP,
            badge: 5,
            keepActive: true
        }));
    }

    stop () {
        this.mainNavigationService?.removeMenuItem(this.menuItemId);
        this.mainNavigationService = null;
        super.stop();
    }
}
