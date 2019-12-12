export class UserStyleService {
    constructor () {
        this.styles = new Map();
        Oskari.makeObservable(this);
    }

    saveUserStyle (layerId, styleWithMetadata) {
        if (!layerId || !styleWithMetadata) {
            return;
        }
        const layerStyles = this.styles.get(layerId);
        if (layerStyles) {
            const index = layerStyles.findIndex(s => s.style.id === styleWithMetadata.style.id);

            if (index !== -1) {
                layerStyles[index] = styleWithMetadata;
            } else {
                layerStyles.push(styleWithMetadata);
            }
            this.styles.set(layerId, layerStyles);
        } else {
            this.styles.set(layerId, [styleWithMetadata]);
        }
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
            const index = layerStyles.findIndex(s => s.style.id === styleId);
            if (index !== -1) {
                layerStyles.splice(index, 1);
                this.styles.set(layerId, layerStyles);
                this.trigger('update');
            }
        }
    }

    removeUserStyleFromLayer (layerId, styleId) {
        const layer = Oskari.getSandbox().findMapLayerFromSelectedMapLayers(layerId);
        if (layer && layer.getCustomStyle() && layer.getCustomStyle().id === styleId) {
            layer.resetStyleToDefault();
            Oskari.getSandbox().postRequestByName('ChangeMapLayerStyleRequest', [layerId]);
        }
    }

    getQName () {
        return 'Oskari.mapframework.bundle.mapwfs2.service.UserStyleService';
    }

    getUserStylesForLayer (layerId) {
        return this.styles.get(layerId);
    }

    getUserStyle (layerId, styleId) {
        const layerStyles = this.styles.get(layerId);
        var style;
        if (layerStyles) {
            const s = layerStyles.filter(s => s.style.id === styleId);
            style = s ? s[0] : undefined;
        }
        return style;
    }
}
