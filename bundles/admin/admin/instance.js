import { GenericAdminFlyout } from './Flyout.js';
import { BasicBundleInstance } from 'oskari-ui/BasicBundleInstance';
const BUNDLE_NAME = 'GenericAdmin';

export class GenericAdmin extends BasicBundleInstance {
    constructor () {
        super(BUNDLE_NAME);
        this.plugins = {};
    }

    start (sandbox) {
        super.start(sandbox);
        this.on('userinterface.ExtensionUpdatedEvent', (event) => {
            if (event.getExtension().getName() !== this.getName()) {
                return;
            }
            if (event.getViewState() !== 'close') {
                this.getFlyout().createUI();
            }
        });
        const request = Oskari.requestBuilder('userinterface.AddExtensionRequest')(this);
        this.getSandbox().request(this, request);
        this.addRequestHandler('Admin.AddTabRequest', (req) => this.getFlyout().addTab({
            title: req.getTitle(),
            content: req.getContent(),
            priority: req.getPriority(),
            id: req.getId()
        }));
    }

    // Called by divmanazer when AddExtensionRequest is processed
    startExtension () {
        this.locale = Oskari.getLocalization(this.getName());
        this.plugins['Oskari.userinterface.Flyout'] = new GenericAdminFlyout(this);
        this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create(
            'Oskari.userinterface.extension.DefaultTile',
            this,
            this.locale?.tile || {}
        );
    }

    getPlugins () {
        return this.plugins;
    }

    getFlyout () {
        return this.plugins['Oskari.userinterface.Flyout'];
    }

    getTitle () {
        return this.locale?.title;
    }

    getDescription () {
        return this.locale?.desc;
    }

    stop () {
        const removeReq = Oskari.requestBuilder('userinterface.RemoveExtensionRequest')(this);
        this.getSandbox().request(this, removeReq);
        super.stop();
    }
}