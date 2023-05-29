import { UnsupportedLayerReason } from '../../mapmodule/domain/UnsupportedLayerReason';
const unsupportedIn3D = ['vectortile'];
const unsupportedIn2D = ['tiles3d'];

export class UnsupportedLayerType extends UnsupportedLayerReason {
    constructor (severity) {
        super('dimension', severity);
        const mapSupports3D = Oskari.getSandbox().getMap().getSupports3D();
        this.setLayerCheckFunction(layer => {
            if (isLayerSupported(layer, mapSupports3D)) {
                return true;
            }
            // not supported -> Return an instance of UnsupportedLayerReason
            return this;
        });
        const dimension = mapSupports3D ? '3D' : '2D';
        this.setDescription(Oskari.getMsg('MapModule', 'layerUnsupported.dimension', { dimension }));
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
