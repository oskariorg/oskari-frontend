export class VectorTileModelBuilder {
    parseLayerData (layer, mapLayerJson, maplayerService) {
        const { options = {} } = mapLayerJson;
        if (options.hover) {
            layer.setHoverOptions(options.hover);
        }
    }
}
