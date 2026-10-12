import { BasicBundleInstance } from 'oskari-ui/BasicBundleInstance';
import { MenuItem } from '../component/MenuItem';
import { showFlyout } from 'oskari-ui/components/window';

const BUNDLE_ID = 'maplayers';
const TITLE = 'Map layers';
const MAIN_NAVIGATION_SERVICE = 'Oskari.mapframework.bundle.mainnavigation.service.MainNavigationService';
const BORDER_COLORS = {
    decreased: 'red',
    increased: 'green'
};
const MAP_LAYER_EVENTS = [
    'MapLayerEvent',
    'AfterMapLayerAddEvent',
    'AfterMapLayerRemoveEvent'
];

export class MapLayersBundleInstance extends BasicBundleInstance {
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
        this.updateBadge();
        MAP_LAYER_EVENTS.forEach((eventName) => {
            this.on(eventName, () => this.updateBadge());
        });
    }

    updateMenuItem () {
        const updateBorder = (item) => {
            if (!item.badgeChange) {
                return;
            }
            const color = item.badgeChange < 0 ? BORDER_COLORS.decreased : BORDER_COLORS.increased;
            item.options.style = {
                ...item.options.style,
                border: `2px solid ${color}`,
                boxSizing: 'border-box'
            };
        };
        this.mainNavigationService.addMenuItem(new MenuItem({
            id: this.menuItemId,
            name: this.title,
            tooltip: `${this.title} menu item`,
            setActive (isActive) {
                this.isActive = isActive;
                updateBorder(this);
                if (!isActive) {
                    const controls = this.flyoutControls;
                    this.flyoutControls = null;
                    controls?.close();
                    return;
                }
                if (this.flyoutControls) {
                    return;
                }
                const controls = showFlyout(this.name, `${this.name} flyout`, () => {
                    if (this.flyoutControls !== controls) {
                        return;
                    }
                    this.flyoutControls = null;
                    this.onClose?.(this.id);
                });
                this.flyoutControls = controls;
            },
            setBadge (badge) {
                if (this.badge === badge) {
                    return false;
                }
                this.badgeChange = typeof this.badge === 'number' ? badge - this.badge : 0;
                this.badge = badge;
                updateBorder(this);
                this.onChange?.();
                return true;
            }
        }));
    }

    updateBadge () {
        const layers = this.getSandbox().findAllSelectedMapLayers();
        this.mainNavigationService.setBadge(this.menuItemId, layers.length);
    }

    stop () {
        this.mainNavigationService?.removeMenuItem(this.menuItemId);
        this.mainNavigationService = null;
        super.stop();
    }
}
