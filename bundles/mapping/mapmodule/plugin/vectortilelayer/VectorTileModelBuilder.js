const Style = Oskari.clazz.get('Oskari.mapframework.domain.Style');

export default class VectorTileModelBuilder {
    parseLayerData (layer, mapLayerJson, maplayerService) {
        const { options } = mapLayerJson;
        if (!options) {
            return;
        }
        let styles = [];
        if (options.styles) {
            styles = Object.keys(options.styles);
        }
        if (options.externalStyles) {
            const externalStyles = Object.keys(options.externalStyles);
            styles = styles.concat(externalStyles.filter(style => !styles.includes(style)));
        }
        styles.forEach(styleName => {
            const style = new Style();
            style.setName(styleName);
            style.setTitle(styleName);
            layer.addStyle(style);
        });
        if (styles.length > 0) {
            layer.selectStyle(styles.includes('default') ? 'default' : styles[0]);
        }
        if (options.hover) {
            layer.setHoverOptions(mapLayerJson.options.hover);
        }
    }
}
