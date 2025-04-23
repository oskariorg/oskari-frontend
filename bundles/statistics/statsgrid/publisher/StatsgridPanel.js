import { AbstractPublisherPanel } from '../../../framework/publisher2/tools/AbstractPublisherPanel';
import { BUNDLE_KEY } from '../constants';
// import { StatsGridPanelHandler } from './StatsGridPanelHandler';

export class StatsgridPanel extends AbstractPublisherPanel {
    constructor (...args) {
        super(args);
        this.id = 'statsgrid2';
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
