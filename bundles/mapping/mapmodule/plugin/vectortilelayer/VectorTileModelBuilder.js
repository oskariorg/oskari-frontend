import { VectorStyle } from '../../domain/VectorStyle';
export class VectorTileModelBuilder {
    parseLayerData (layer, mapLayerJson, maplayerService) {
        const { options = {}, style } = mapLayerJson;
        const { externalStyles = {}, hover } = options;

        // normal styles are set in AbstractVectorLayer setOptions
        // set external styles
        Object.keys(externalStyles).forEach(name => {
            // Use name as title
            const style = new VectorStyle(name, name, 'external', externalStyles[name]);
            layer.addStyle(style);
        });
        // Remove externalStyles from options to be sure that VectorStyle is used
        delete options.externalStyles;

        if (style) {
            layer.selectStyle(style);
        }
        if (hover) {
            layer.setHoverOptions(mapLayerJson.options.hover);
        }
    }
}
