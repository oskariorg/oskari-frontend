import { MapLayerBase } from './MapLayerBase';

export class MapLayerWMS extends MapLayerBase {
    constructor () {
        super(...arguments);
        this.type = 'WMS';
    }
}
