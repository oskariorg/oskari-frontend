import { BasicBundleInstance } from 'oskari-ui/BasicBundleInstance';
import { showFlyout } from 'oskari-ui/components/window';

const BUNDLE_ID = 'maplayers';
const TITLE = 'Map layers';
const MAIN_NAVIGATION_SERVICE = 'Oskari.mapframework.bundle.mainnavigation.service.MainNavigationService';
const MAP_LAYER_EVENTS = [
    'MapLayerEvent',
    'AfterMapLayerAddEvent',
    'AfterMapLayerRemoveEvent'
];

export class MapLayersBundleInstance extends BasicBundleInstance {
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
        this.updateBadge();
        MAP_LAYER_EVENTS.forEach((eventName) => {
            this.on(eventName, () => this.updateBadge());
        });
    }

    updateMenuItem () {
        this.mainNavigationService.addMenuItem({
            id: this.menuItemId,
            name: TITLE,
            tooltip: `${TITLE} menu item`,
            setActive: (isActive) => this.setActive(isActive)
        });
    }

    updateBadge () {
        const layers = this.getSandbox()
            .findAllSelectedMapLayers();
        this.mainNavigationService.setBadge(this.menuItemId, layers.length);
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