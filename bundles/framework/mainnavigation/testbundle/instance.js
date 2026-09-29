import { BasicBundleInstance } from 'oskari-ui/BasicBundleInstance';
import { showFlyout } from 'oskari-ui/components/window';

const MENU_ITEM_ID = 'mainnavigation-testbundle-item';

export class MainNavigationTestBundleInstance extends BasicBundleInstance {
    constructor () {
        super('mainnavigation-testbundle');
        this.mainNavigationService = null;
        this.flyoutControls = null;
    }

    start (sandbox) {
        super.start(sandbox);
        this.mainNavigationService = sandbox.getService('Oskari.mapframework.bundle.mainnavigation.service.MainNavigationService');
        this.mainNavigationService.addMenuItem({
            id: MENU_ITEM_ID,
            name: 'Test bundle',
            tooltip: 'Test bundle menu item',
            badge: 7,
            active: () => this.toggleFlyout()
        });
    }

    toggleFlyout () {
        if (this.flyoutControls) {
            this.flyoutControls.close();
            return;
        }
        this.flyoutControls = showFlyout('Test bundle', 'Test bundle flyout', () => {
            this.flyoutControls = null;
        });
    }

    stop () {
        this.flyoutControls?.close();
        this.mainNavigationService?.removeMenuItem(MENU_ITEM_ID);
        this.mainNavigationService = null;
        super.stop();
    }
}
