
const unsupportedIn3D = ['vectortile'];
const unsupportedIn2D = ['tiles3d'];

export class UnsupportedLayerType extends Oskari.clazz.get('Oskari.mapframework.domain.UnsupportedLayerReason') {
    constructor (severity) {
        super('dimension', severity);
        const map = Oskari.getSandbox().getMap();
        this.setLayerCheckFunction(layer => {
            if ((map.getSupports3D() && unsupportedIn3D.includes(layer.getLayerType())) ||
                (!map.getSupports3D() && unsupportedIn2D.includes(layer.getLayerType()))) {
                return this;
            }
            return true;
        });
    }
}

Oskari.clazz.defineES('Oskari.mapframework.domain.UnsupportedLayerType', UnsupportedLayerType);
