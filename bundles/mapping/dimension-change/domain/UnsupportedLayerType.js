import { UnsupportedLayerReason } from '../../mapmodule/domain/UnsupportedLayerReason';
const unsupportedIn3D = ['vectortile'];
const unsupportedIn2D = ['tiles3d'];

export class UnsupportedLayerType extends UnsupportedLayerReason {
    constructor (severity) {
        super('dimension', severity);
        const map = Oskari.getSandbox().getMap();
        this.setLayerCheckFunction(layer => {
            if (isLayerSupported(layer, map.getSupports3D())) {
                return true;
            }
            // not supported -> Return an instance of UnsupportedLayerReason
            return this;
        });
    }
}

export const isLayerSupported = (layer, mapSupports3D = false) => {
    if (mapSupports3D && unsupportedIn3D.includes(layer.getLayerType())) {
        return false;
    }
    if (!mapSupports3D && unsupportedIn2D.includes(layer.getLayerType())) {
        return false;
    }
    return true;
};

Oskari.clazz.defineES('Oskari.mapframework.domain.UnsupportedLayerType', UnsupportedLayerType);
