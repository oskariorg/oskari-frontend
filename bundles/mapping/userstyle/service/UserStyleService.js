export class UserStyleService {
    constructor (sandbox) {
        this.styles = new Map();
        this.sandbox = sandbox;
        Oskari.makeObservable(this);
    }

    saveUserStyle (layerId, style) {
        if (!style.name) {
            // styles are stored only for runtime, use time to get unique name
            style.name = 's_' + Date.now().toString();
        }
        if (!style.title) {
            const existing = this.getUserStylesForLayer(layerId);
            style.title = Oskari.getMsg('userstyle', 'defaultName') + ' ' + (existing.length + 1);
        }
        let { style: styleDef } = style;
        const layer = this.sandbox.findMapLayerFromSelectedMapLayers(layerId);
        if (layer) {
            layer.saveUserStyle(style);
            layer.setCustomStyle(styleDef);
            layer.selectStyle(style.name);
            this.notifyLayerUpdate();
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

    removeUserStyle (layerId, styleName) {
        if (!layerId || !styleName) {
            return;
        }
        const layer = this.sandbox.findMapLayerFromSelectedMapLayers(layerId);
        if (layer) {
            layer.removeStyle(styleName);
            this.notifyLayerUpdate();
        }
        const layerStyles = this.getUserStylesForLayer(layerId);
        const index = layerStyles.findIndex(s => s.name === styleName);
        if (index !== -1) {
            layerStyles.splice(index, 1);
            this.styles.set(layerId, layerStyles);
        }
        this.trigger('update');
    }

    notifyLayerUpdate (layerId) {
        const event = Oskari.eventBuilder('MapLayerEvent')(layerId, 'update');
        this.sandbox.notifyAll(event);
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
