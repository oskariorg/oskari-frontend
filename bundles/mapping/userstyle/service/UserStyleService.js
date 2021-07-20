import { VectorStyle } from '../../mapmodule/domain/VectorStyle';
const VisualizationForm = Oskari.clazz.get('Oskari.userinterface.component.VisualizationForm');

export class UserStyleService {
    constructor () {
        this.styles = new Map();
        Oskari.makeObservable(this);
    }

    saveUserStyle (layerId, name) {
        const sb = Oskari.getSandbox();
        if (!name) {
            // styles are stored only for runtime, use time to get unique name
            name = 's_' + Date.now().toString();
        }
        let title = this.visualizationForm.getOskariStyleName();
        if (!title) {
            const existing = this.getUserStylesForLayer(layerId);
            title = Oskari.getMsg('userstyle', 'defaultName') + ' ' + (existing.length + 1);
        }

        let style;
        const featureStyle = this.visualizationForm.getOskariStyle();
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

        const layer = sb.findMapLayerFromAllAvailable(layerId);
        if (layer) {
            layer.addStyle(style);
            layer.selectStyle(name);
            sb.postRequestByName('ChangeMapLayerStyleRequest', [layerId, name]);
        }
        this.notifyUpdate();
    }

    removeUserStyle (layerId, name) {
        if (!layerId || !name) {
            return;
        }
        const layer = Oskari.getSandbox().findMapLayerFromAllAvailable(layerId);
        if (layer) {
            layer.removeStyle(name);
        }
        const layerStyles = this.getUserStylesForLayer(layerId);
        const index = layerStyles.findIndex(s => s.getName() === name);
        if (index !== -1) {
            layerStyles.splice(index, 1);
            this.styles.set(layerId, layerStyles);
        }
        this.notifyUpdate();
    }

    notifyUpdate (layerId) {
        const event = Oskari.eventBuilder('MapLayerEvent')(layerId, 'update');
        Oskari.getSandbox().notifyAll(event);
        this.trigger('update');
    }

    getQName () {
        return 'Oskari.mapframework.userstyle.service.UserStyleService';
    }

    getUserStylesForLayer (layerId) {
        return this.styles.get(layerId) || [];
    }

    getUserStyle (layerId, styleName) {
        const layerStyles = this.getUserStylesForLayer(layerId);
        return layerStyles.find(s => s.getName() === styleName);
    }

    /**
     * @method getCustomStyleEditorForm To get editor ui element for custom style.
     * @param {VectorStyle} style
     * @return VisualizationForm's form element
     */
    getCustomStyleEditorForm (style) {
        if (!style) {
            this.visualizationForm = new VisualizationForm({ name: '' });
        } else {
            this.visualizationForm.setOskariStyleValues(style.getFeatureStyle(), style.getTitle());
        }
        return this.visualizationForm.getForm();
    }
}
