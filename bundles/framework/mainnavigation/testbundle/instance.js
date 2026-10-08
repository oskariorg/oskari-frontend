import { BasicBundleInstance } from 'oskari-ui/BasicBundleInstance';
import { showFlyout } from 'oskari-ui/components/window';

const BUNDLE_ID = 'mainnavigation-testbundle';
const TITLE = 'Test bundle';

export class MainNavigationTestBundleInstance extends BasicBundleInstance {
    constructor () {
        super(BUNDLE_ID);
        this.menuItemId = `${BUNDLE_ID}-item`;
        this.title = TITLE;
        this.badge = 7;
        this.mainNavigationService = null;
        this.flyoutControls = null;
    }

    start (sandbox) {
        super.start(sandbox);
        this.mainNavigationService = sandbox.getService('Oskari.mapframework.bundle.mainnavigation.service.MainNavigationService');
        this.updateMenuItem();
    }

    updateMenuItem () {
        this.mainNavigationService.addMenuItem({
            id: this.menuItemId,
            name: this.title,
            tooltip: `${this.title} menu item`,
            badge: this.badge,
            isActive: Boolean(this.flyoutControls),
            active: () => this.toggleFlyout()
        });
    }

    toggleFlyout () {
        if (this.flyoutControls) {
            this.flyoutControls.close();
            return;
        }
        this.flyoutControls = showFlyout(this.title, `${this.title} flyout`, () => {
            this.flyoutControls = null;
            this.updateMenuItem();
        });
        this.updateMenuItem();
    }

    stop () {
        this.flyoutControls?.close();
        this.mainNavigationService?.removeMenuItem(this.menuItemId);
        this.mainNavigationService = null;
        super.stop();
    }
}
