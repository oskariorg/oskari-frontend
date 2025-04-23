import { AbstractPublisherPanel } from '../../../framework/publisher2/tools/AbstractPublisherPanel';
import { BUNDLE_KEY } from '../constants';
import { StatsgridPanelHandler } from './StatsgridPanelHandler';

export class StatsgridPanel extends AbstractPublisherPanel {
    constructor (...args) {
        super(args);
        this.id = 'statsgrid';
        this.handlerImpl = StatsgridPanelHandler;
    }

    getLabel () {
        return Oskari.getMsg(BUNDLE_KEY, 'publisher.label');
    }

    getTooltip () {
        return Oskari.getMsg(BUNDLE_KEY, 'publisher.tooltip');
    }
}

Oskari.clazz.defineES('Oskari.mapframework.publisher.StatsgridPanel',
    StatsgridPanel,
    {
        protocol: ['Oskari.mapframework.publisher.Panel']
    }
);
