import { ToolPanelHandler } from '../handler/ToolPanelHandler';
import { StateHandler } from 'oskari-ui/util';

export class AbstractPublisherPanel {
    constructor (sandbox) {
        this.sandbox = sandbox;
        // override (included tools should have id as group)
        this.id = null;
        // override to use own custom StateHandler (must implement init and getPanelComponent functions)
        this.handlerImpl = ToolPanelHandler;
        this.handler = null;
    }

    getId () {
        return this.id;
    }

    getLabel () {
        return '<override panel getLabel>';
    }

    getTooltip () {
        return null;
    }

    getPanel () {
        return {
            id: this.getId(),
            label: this.getLabel(),
            tooltip: this.getTooltip(),
            HandlerImpl: this.handlerImpl
        };
    }

    initHandler (tools) {
        const Handler = this.handlerImpl;
        try {
            const handler = new Handler(this.sandbox, tools);
            if (!(handler instanceof StateHandler) || typeof handler.init !== 'function' || typeof handler.getPanelComponent !== 'function') {
                throw new Error('Incompatible handler');
            }
            this.handler = handler;
        } catch (error) {
            Oskari.log('Oskari.mapframework.publisher.Panel').error('Failed to init handler for:', this.getId());
        }
    }

    getHandler () {
        return this.handler;
    }
};

/* --- USAGE ---

// Attach protocol to make this discoverable by Oskari publisher

Oskari.clazz.defineES('Oskari.publisher.MyPanel',
    MyPanel,
    {
        protocol: ['Oskari.mapframework.publisher.Panel']
    }
);
*/
