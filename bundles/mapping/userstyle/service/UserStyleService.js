export class UserStyleService {
    constructor () {
        this.styles = new Map();
        Oskari.makeObservable(this);
    }

    saveUserStyle (layerId, style) {
        if (!layerId || !style) {
            return;
        }
        const layerStyles = this.getUserStylesForLayer(layerId);
        const index = layerStyles.findIndex(s => s.name === style.name);

        if (index !== -1) {
            layerStyles[index] = style;
        } else {
            layerStyles.push(style);
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
        return 'Oskari.mapframework.userstyle.service.UserStyleService';
    }

    getUserStylesForLayer (layerId) {
        return this.styles.get(layerId) || [];
    }

    getUserStyle (layerId, styleName) {
        const layerStyles = this.getUserStylesForLayer(layerId);
        return layerStyles.find(s => s.name === styleName);
    }
}
