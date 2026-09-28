import { BasicBundleInstance } from 'oskari-ui/BasicBundleInstance';

export class MainNavigationTestBundleInstance extends BasicBundleInstance {
    constructor () {
        super('mainnavigation-testbundle');
        this.mainNavigationService = null;
    }

    start (sandbox) {
        super.start(sandbox);
        this.mainNavigationService = sandbox.getService('Oskari.mapframework.bundle.mainnavigation.service.MainNavigationService');
        this.mainNavigationService.addMenuItem({
            id: 'mainnavigation-testbundle-item',
            name: 'Test bundle',
            tooltip: 'Test bundle menu item',
            badge: 7,
            active: () => {
                // no-op for test bundle
            }
        });
    }
}
