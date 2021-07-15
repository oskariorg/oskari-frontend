const VisualizationForm = Oskari.clazz.get('Oskari.userinterface.component.VisualizationForm');

export class UserStyleService {
    constructor () {
        this.styles = new Map();
        Oskari.makeObservable(this);
    }

    saveUserStyle (layer, name) {
        const styleDef = this.visualizationForm.getOskariStyle();
        const layerId = layer.getId();
        let title = this.visualizationForm.getOskariStyleName();
        if (!title) {
            const existing = this.getUserStylesForLayer(layerId);
            title = Oskari.getMsg('userstyle', 'defaultName') + ' ' + (existing.length + 1);
        }
        const style = { name, style: styleDef, title };
        layer.saveUserStyle(style);

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

    /**
     * @method applyEditorStyle Applies custom style editor's style to the layer.
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @param {String} styleName
     */
    applyEditorStyle (layer, styleName) {
        const style = this.visualizationForm.getOskariStyle();
        layer.setCustomStyle(style);
        layer.selectStyle(styleName);
    }
}
