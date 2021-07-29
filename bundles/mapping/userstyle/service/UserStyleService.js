import { VectorStyle } from '../../mapmodule/domain/VectorStyle';

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

        const { style: featureStyle, title, name } = style;
        const layerStyles = this.getUserStylesForLayer(layerId);
        const index = layerStyles.findIndex(s => s.getName() === name);

        if (index !== -1) {
            style = layerStyles[index];
            style.setTitle(title);
            style.setFeatureStyle(featureStyle);
        } else {
            style = new VectorStyle(name, title, 'user', { featureStyle });
            layerStyles.push(style);
        }
        this.styles.set(layerId, layerStyles);

        const layer = this.sandbox.findMapLayerFromAllAvailable(layerId);
        if (layer) {
            layer.addStyle(style);
            layer.selectStyle(name);
            this.sandbox.postRequestByName('ChangeMapLayerStyleRequest', [layerId, name]);
            this.notifyLayerUpdate();
        }
        this.trigger('update');
    }

    removeUserStyle (layerId, name) {
        if (!layerId || !name) {
            return;
        }
        const layer = this.sandbox.findMapLayerFromAllAvailable(layerId);
        if (layer) {
            layer.removeStyle(name);
            this.notifyLayerUpdate();
        }
        const layerStyles = this.getUserStylesForLayer(layerId);
        const index = layerStyles.findIndex(s => s.getName() === name);
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

    getUserStyle (layerId, name) {
        const layerStyles = this.getUserStylesForLayer(layerId);
        return layerStyles.find(s => s.getName() === name);
    }
}
