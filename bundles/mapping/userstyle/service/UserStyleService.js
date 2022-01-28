export class UserStyleService {
    constructor (sandbox) {
        this.styles = new Map();
        this.sandbox = sandbox;
        Oskari.makeObservable(this);
    }

    saveUserStyle (layerId, style) {
        if (!style.getName()) {
            // styles are stored only for runtime, use time to get unique name
            style.setName('s_' + Date.now().toString());
        }
        const layerStyles = this.getUserStylesForLayer(layerId);
        if (!style.getTitle()) {
            const nextVal = Oskari.getSeq('userstyle').nextVal();
            style.setTitle(Oskari.getMsg('userstyle', 'defaultName') + ' ' + nextVal);
        }
        const name = style.getName();
        const index = layerStyles.findIndex(s => s.getName() === name);
        if (index !== -1) {
            layerStyles[index] = style;
        } else {
            layerStyles.push(style);
        }
        this.styles.set(layerId, layerStyles);

        const layer = this.sandbox.findMapLayerFromAllAvailable(layerId);
        if (layer) {
            layer.addStyle(style);
            layer.selectStyle(name);
            this.sandbox.postRequestByName('ChangeMapLayerStyleRequest', [layerId, name]);
            this.notifyLayerUpdate(layerId);
        }
        this.notify(layerId);
    }

    removeUserStyle (layerId, name) {
        if (!layerId || !name) {
            return;
        }
        const layer = this.sandbox.findMapLayerFromAllAvailable(layerId);
        if (layer) {
            layer.removeStyle(name);
            this.notifyLayerUpdate(layerId);
        }
        const layerStyles = this.getUserStylesForLayer(layerId);
        const index = layerStyles.findIndex(s => s.getName() === name);
        if (index !== -1) {
            layerStyles.splice(index, 1);
            this.styles.set(layerId, layerStyles);
        }
        this.notify(layerId);
    }

    notify (layerId) {
        this.trigger('update', layerId);
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
