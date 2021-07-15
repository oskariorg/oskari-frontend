const VisualizationForm = Oskari.clazz.get('Oskari.userinterface.component.VisualizationForm');

export class UserStyleService {
    constructor () {
        this.styles = new Map();
        Oskari.makeObservable(this);
    }

    saveUserStyle (layerId, name) {
        if (!name) {
            // styles are stored only for runtime, use time to get unique name
            name = 's_' + Date.now().toString();
        }
        let title = this.visualizationForm.getOskariStyleName();
        if (!title) {
            const existing = this.getUserStylesForLayer(layerId);
            title = Oskari.getMsg('userstyle', 'defaultName') + ' ' + (existing.length + 1);
        }
        const styleDef = this.visualizationForm.getOskariStyle();
        const style = { name, style: styleDef, title };
        const layer = Oskari.getSandbox().findMapLayerFromSelectedMapLayers(layerId);
        if (layer) {
            layer.saveUserStyle(style);
            layer.setCustomStyle(styleDef);
            layer.selectStyle(name);
        }

        const layerStyles = this.getUserStylesForLayer(layerId);
        const index = layerStyles.findIndex(s => s.name === name);

        if (index !== -1) {
            layerStyles[index] = style;
        } else {
            layerStyles.push(style);
        }
        this.styles.set(layerId, layerStyles);
        this.notifyUpdate();
    }

    removeUserStyle (layerId, styleName) {
        if (!layerId || !styleName) {
            return;
        }
        const layer = Oskari.getSandbox().findMapLayerFromSelectedMapLayers(layerId);
        if (layer) {
            layer.removeStyle(styleName);
        }
        const layerStyles = this.getUserStylesForLayer(layerId);
        const index = layerStyles.findIndex(s => s.name === styleName);
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
        return layerStyles.find(s => s.name === styleName);
    }

    /**
     * @method getCustomStyleEditorForm To get editor ui element for custom style.
     * @param {Object} styleWithMetadata
     * @return VisualizationForm's form element
     */
    getCustomStyleEditorForm (styleWithMetadata = {}) {
        const { style, title } = styleWithMetadata;
        if (!style || !title) {
            this.visualizationForm = new VisualizationForm({ name: '' });
        } else {
            this.visualizationForm.setOskariStyleValues(style, title);
        }
        return this.visualizationForm.getForm();
    }
}
