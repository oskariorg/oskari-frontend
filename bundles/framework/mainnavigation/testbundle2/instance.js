import { BasicBundleInstance } from 'oskari-ui/BasicBundleInstance';
import { MenuItem } from '../component/MenuItem';

const BUNDLE_ID = 'testbundle2';
const TITLE = 'Test bundle 2';
const MAIN_NAVIGATION_SERVICE = 'Oskari.mapframework.bundle.mainnavigation.service.MainNavigationService';

export class TestBundle2Instance extends BasicBundleInstance {
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
            tooltip: `${this.title} menu item`,
            badge: 2
        }));
    }

    stop () {
        this.mainNavigationService?.removeMenuItem(this.menuItemId);
        this.mainNavigationService = null;
        super.stop();
    }
}
