import { BasicBundleInstance } from 'oskari-ui/BasicBundleInstance';
import { showFlyout } from 'oskari-ui/components/window';

const BUNDLE_ID = 'testbundle3';
const TITLE = 'Test bundle 3';
const MAIN_NAVIGATION_SERVICE = 'Oskari.mapframework.bundle.mainnavigation.service.MainNavigationService';

export class TestBundle3Instance extends BasicBundleInstance {
    constructor () {
        super(BUNDLE_ID);
        this.menuItemId = `${BUNDLE_ID}-item`;
        this.mainNavigationService = null;
        this.flyoutControls = null;
    }

    start (sandbox) {
        super.start(sandbox);
        this.mainNavigationService = sandbox.getService(MAIN_NAVIGATION_SERVICE);
        this.updateMenuItem();
    }

    updateMenuItem () {
        this.mainNavigationService.addMenuItem({
            id: this.menuItemId,
            name: TITLE,
            tooltip: `${TITLE} menu item`,
            badge: 3,
            setActive: (isActive) => this.setActive(isActive)
        });
    }

    setActive (isActive) {
        if (!isActive) {
            this.flyoutControls?.close();
            return;
        }
        if (this.flyoutControls) {
            return;
        }
        this.flyoutControls = showFlyout(TITLE, `${TITLE} flyout`, () => {
            this.flyoutControls = null;
            this.mainNavigationService?.setActive(this.menuItemId, false);
        });
    }

    stop () {
        this.flyoutControls?.close();
        this.mainNavigationService?.removeMenuItem(this.menuItemId);
        this.mainNavigationService = null;
        super.stop();
    }
}