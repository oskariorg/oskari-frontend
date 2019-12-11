export class UserStyleService {
    constructor () {
        this.styles = new Map();
        Oskari.makeObservable(this);
    }

    saveUserStyle (layerId, style) {
        if (!layerId || !style) {
            return;
        }
        const layerStyles = this.styles.get(layerId);
        if (layerStyles) {
            const index = layerStyles.findIndex(s => s.id === style.id);

            if (index !== -1) {
                layerStyles[index] = style;
            } else {
                layerStyles.push(style);
            }
            this.styles.set(layerId, layerStyles);
        } else {
            this.styles.set(layerId, [style]);
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
            const s = layerStyles.filter(style => style.id === styleId);
            style = s ? s[0] : undefined;
        }
        return style;
    }
}
