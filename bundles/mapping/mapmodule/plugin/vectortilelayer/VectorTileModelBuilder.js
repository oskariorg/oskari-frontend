import { VectorStyle } from '../../domain/VectorStyle';
export class VectorTileModelBuilder {
    parseLayerData (layer, mapLayerJson, maplayerService) {
        const { options, style } = mapLayerJson;
        if (!options) {
            return;
        }
        if (options.styles) {
            Object.entries(options.styles).forEach(([name, styleDef]) => {
                const style = new VectorStyle(name, null, 'normal', styleDef, true);
                layer.addStyle(style);
            });
            // Remove styles from options to be sure that VectorStyle is used
            delete options.styles;
        }
        if (options.externalStyles) {
            Object.entries(options.externalStyles).forEach(([name, styleDef]) => {
                const style = new VectorStyle(name, null, 'external', styleDef);
                layer.addStyle(style);
            });
            // Remove externalStyles from options to be sure that VectorStyle is used
            delete options.externalStyles;
        }
        if (style) {
            layer.selectStyle(style);
        }
        if (options.hover) {
            layer.setHoverOptions(mapLayerJson.options.hover);
        }
    }
}
