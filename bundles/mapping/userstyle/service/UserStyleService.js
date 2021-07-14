export class UserStyleService {
    constructor () {
        this.styles = new Map();
        Oskari.makeObservable(this);
    }

    saveUserStyle (layerId, styleWithMetadata) {
        if (!layerId || !styleWithMetadata) {
            return;
        }
        const layerStyles = this.getUserStylesForLayer(layerId);
        const index = layerStyles.findIndex(s => s.name === styleWithMetadata.name);

        if (index !== -1) {
            layerStyles[index] = styleWithMetadata;
        } else {
            layerStyles.push(styleWithMetadata);
        }
        this.styles.set(layerId, layerStyles);
        this.trigger('update');
    }

    removeStyle (layerId, styleName) {
        this.removeUserStyle(layerId, styleName);
        this.removeUserStyleFromLayer(layerId, styleName);
    }

    removeUserStyle (layerId, styleName) {
        if (!layerId || !styleName) {
            return;
        }
        const layerStyles = this.getUserStylesForLayer(layerId);
        const index = layerStyles.findIndex(s => s.name === styleName);
        if (index !== -1) {
            layerStyles.splice(index, 1);
            this.styles.set(layerId, layerStyles);
            this.trigger('update');
        }
    }

    removeUserStyleFromLayer (layerId, styleName) {
        const layer = Oskari.getSandbox().findMapLayerFromSelectedMapLayers(layerId);
        if (!layer) {
            return;
        }
        layer.removeStyle(styleName);
    }
    getQName () {
        return 'Oskari.mapframework.bundle.mapwfs2.service.UserStyleService';
    }

    getUserStylesForLayer (layerId) {
        return this.styles.get(layerId) || [];
    }

    getUserStyle (layerId, styleName) {
        const layerStyles = this.getUserStylesForLayer(layerId);
        return layerStyles.find(s => s.name === styleName);
    }
}
