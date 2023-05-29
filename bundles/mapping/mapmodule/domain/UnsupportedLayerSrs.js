import { UnsupportedLayerReason } from './UnsupportedLayerReason';

export class UnsupportedLayerSrs extends UnsupportedLayerReason {
    constructor (severity) {
        super('srs', severity);
        const map = Oskari.getSandbox().getMap();
        this.setLayerCheckFunction(layer => layer.isSupportedSrs(map.getSrsName()) ? true : this);
        this.setDescription(Oskari.getMsg('MapModule', 'layerUnsupported.srs'));
    }
}

Oskari.clazz.defineES('Oskari.mapframework.domain.UnsupportedLayerSrs', UnsupportedLayerSrs);
