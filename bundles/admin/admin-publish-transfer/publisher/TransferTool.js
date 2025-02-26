import { AbstractPublisherTool } from '../../../framework/publisher2/tools/AbstractPublisherTool';
import { ToolComponent } from './ToolComponent';
import { TransferToolHandler } from './TransferToolHandler';

export const BUNDLE_KEY = 'admin-publish-transfer';

class TransferTool extends AbstractPublisherTool {
    constructor (...args) {
        super(...args);
        // FIXME: need to use existing group as
        //  publisher doesn't allow adding new tabs anymore like it did before
        //  lets try making it possible again
        //  the new panel localization is on publisher, check if we can move it to this bundle
        this.group = 'tools';
        // this.group = 'transfer';

        this.sandbox = Oskari.getSandbox();
        this.lang = Oskari.getLang();
        this.handler = new TransferToolHandler();
    }

    getTool () {
        return {
            id: 'Oskari.admin-publish-transfer.TransferTool',
            // TODO: move localization to this bundles localization
            title: Oskari.getMsg('Publisher2', 'BasicView.transfer.PublishTransfer'), /* Oskari.getMsg('admin-announcements', 'publisher.toolLabel'), */
            config: {} // no config for this
        };
    }

    init () {
        // FIXME: we probably need a ref to the instance so we can get the JSON payload
        // this.publisherInstance = publisherInstance;
        this.setEnabled(true);
    }

    getComponent () {
        return {
            component: ToolComponent,
            handler: this.handler
        };
    }

    getValues () {
        // this never returns anything, its just a way to inject a button to the publisher UI
        return null;
    }

    setEnabled (enabled) {
        this.state.enabled = !!enabled;
        if (!enabled) {
            this.handler.closePopup();
        }
    }

    stop () {
        this.setEnabled(false);
    }
};

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.publisher.TransferTool',
    TransferTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);

export { TransferTool };
