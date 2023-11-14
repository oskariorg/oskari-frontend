import { AbstractPublisherTool } from '../../../framework/publisher2/tools/AbstractPublisherTool';

const BUNDLE_ID = 'metadatasearch';
class MetadataSearchTool extends AbstractPublisherTool {
    constructor (...args) {
        super(...args);
        this.index = 9;
        this.group = 'rpc';
    }

    getTool () {
        return {
            id: 'metadatasearch.MetadataSearchRPCTool',
            title: Oskari.getMsg('catalogue.bundle.metadatasearch', 'tool.label'),
            config: {},
            hasNoPlugin: true
        };
    }

    getComponent () {
        return {};
    }

    init (data) {
        const conf = data?.configuration[BUNDLE_ID]?.conf || {};
        this.setEnabled(!!conf.noUI);
    }

    getValues () {
        if (!this.isEnabled()) {
            return null;
        }
        return {
            configuration: {
                [BUNDLE_ID]: {
                    conf: {
                        noUI: true
                    }
                }
            }
        };
    }
}

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.publisher.MetadataSearchTool',
    MetadataSearchTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);
