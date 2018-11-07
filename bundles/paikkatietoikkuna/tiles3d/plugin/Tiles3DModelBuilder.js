const Style = Oskari.clazz.get('Oskari.mapframework.domain.Style');

export default class Tiles3DModelBuilder {
    parseLayerData (layer, mapLayerJson, maplayerService) {
        if (!mapLayerJson.options) {
            return;
        }
        const options = mapLayerJson.options;
        const styles = jQuery.extend({}, options.styles || {}, options.externalStyles || {});
        Object.keys(styles).forEach((styleName) => {
            const style = new Style();
            style.setName(styleName);
            style.setTitle(styleName);
            layer.addStyle(style);
        });
        layer.selectStyle('default');
    }
}
