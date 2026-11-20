const EXTENSION_UPDATED_EVENT = 'userinterface.ExtensionUpdatedEvent';
const DIVMANAZER_MODULE = 'userinterface.DivManazer';
const UPDATE_EXTENSION_REQUEST = 'userinterface.UpdateExtensionRequest';
const ATTACHED_EXTENSION_STATES = ['attach', 'hide'];
const ATTACH = 'attach';
const CLOSE = 'close';

/**
 * Keeps mainnavigation menu items and legacy divmanazer extensions mutually exclusive
 * while both navigation systems coexist: opening one side closes whatever is open on the other.
 *
 * Bundles that have not been migrated to mainnavigation do not use NavigationAdapter,
 * so this coordination cannot live in the adapter. It needs a single owner that sees
 * every legacy extension and every menu item, which is the mainnavigation bundle.
 * Remove this class once all bundles have been migrated away from divmanazer.
 */
export class LegacyExtensionSwitchCoordinator {
    constructor (instance, mainNavigationService) {
        this.instance = instance;
        this.mainNavigationService = mainNavigationService;
        // Ids that were active on the previous change, used to detect newly activated menu items
        this.activeMenuItemIds = new Set();
    }

    // Starts listening both directions: legacy extension events and menu item changes
    start () {
        this.mainNavigationService.addListener(this);
        this.instance.on(EXTENSION_UPDATED_EVENT, (event) => this.handleExtensionUpdated(event));
    }

    stop () {
        this.instance.off(EXTENSION_UPDATED_EVENT);
        this.mainNavigationService.removeListener(this);
        this.activeMenuItemIds.clear();
    }

    // Legacy -> mainnavigation: a legacy extension was opened, so close the active menu items.
    // Menu items with keepActive stay open, following the same policy as switching between menu items.
    handleExtensionUpdated (event) {
        if (event.getViewState() === ATTACH) {
            this.mainNavigationService.deactivateForSwitch();
        }
    }

    // Mainnavigation -> legacy: called by MainNavigationService on every menu item change.
    // Only a newly activated menu item closes legacy extensions, not deactivations or badge updates.
    handleMenuItemsChanged () {
        const activeIds = this.mainNavigationService.getActiveMenuItemIds();
        const activated = activeIds.some((id) => !this.activeMenuItemIds.has(id));
        this.activeMenuItemIds = new Set(activeIds);
        if (activated) {
            this.closeAttachedExtensions();
        }
    }

    // Closes every legacy extension that divmanazer reports as open, using the same request a tile click would send
    closeAttachedExtensions () {
        const sandbox = this.instance.getSandbox();
        const divmanazer = sandbox.findRegisteredModuleInstance(DIVMANAZER_MODULE);
        const states = divmanazer?.getState().extensionStatesByName || {};
        Object.entries(states)
            .forEach(([name, { state }]) => {
                if (ATTACHED_EXTENSION_STATES.includes(state)) {
                    sandbox.postRequestByName(UPDATE_EXTENSION_REQUEST, [null, CLOSE, name]);
                }
            });
    }
}
