export class UserStyleService {
    constructor () {
        this.styles = new Map();
        Oskari.makeObservable(this);
    }

    saveUserStyle (layerId, styleWithMetadata) {
        if (!layerId || !styleWithMetadata) {
            return;
        }
        const layerStyles = this.styles.get(layerId) || [];
        const index = layerStyles.findIndex(s => s.id === styleWithMetadata.id);

        if (index !== -1) {
            layerStyles[index] = styleWithMetadata;
        } else {
            layerStyles.push(styleWithMetadata);
        }
        this.styles.set(layerId, layerStyles);
        this.trigger('update');
    }

    removeStyle (layerId, styleId) {
        this.removeUserStyle(layerId, styleId);
        this.removeUserStyleFromLayer(layerId, styleId);
    }

    removeUserStyle (layerId, styleId) {
        if (!layerId || !styleId) {
            return;
        }

        const layerStyles = this.styles.get(layerId);
        if (layerStyles) {
            const index = layerStyles.findIndex(s => s.id === styleId);
            if (index !== -1) {
                layerStyles.splice(index, 1);
                this.styles.set(layerId, layerStyles);
                this.trigger('update');
            }
        }
    }

    removeUserStyleFromLayer (layerId, styleId) {
        const layer = Oskari.getSandbox().findMapLayerFromSelectedMapLayers(layerId);
        if (!layer) {
            return;
        }
        layer.removeStyle(styleId);
    }
    getQName () {
        return 'Oskari.mapframework.bundle.mapwfs2.service.UserStyleService';
    }

    getUserStylesForLayer (layerId) {
        return this.styles.get(layerId);
    }

    getUserStyle (layerId, styleId) {
        const layerStyles = this.styles.get(layerId);
        if (!layerStyles) {
            return;
        }
        return layerStyles.find(s => s.style.id === styleId);
    }
}
