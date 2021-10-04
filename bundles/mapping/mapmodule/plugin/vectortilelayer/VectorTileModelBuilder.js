export class VectorTileModelBuilder {
    parseLayerData (layer, mapLayerJson, maplayerService) {
        const { options = {}, style } = mapLayerJson;

        if (style) {
            layer.selectStyle(style);
        }
        if (options.hover) {
            layer.setHoverOptions(options.hover);
        }
    }
}
