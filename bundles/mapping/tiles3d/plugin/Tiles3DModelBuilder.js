import { VectorStyle } from '../../mapmodule/domain/VectorStyle';
import { VECTOR_STYLE } from '../../mapmodule/domain/constants';

export class Tiles3DModelBuilder {
    parseLayerData (layer, mapLayerJson, maplayerService) {
        const { options = {}, style } = mapLayerJson;
        /* deprecated --> */
        const { styles = {}, externalStyles = {} } = options;
        Object.keys(styles).forEach(id => {
            const style = new VectorStyle({ id, type: VECTOR_STYLE.OSKARI });
            style.parseStyleFromOptions(externalStyles[id]);
            layer.addStyle(style);
        });
        // Remove styles from options to be sure that VectorStyle is used
        delete options.styles;

        Object.keys(externalStyles).forEach(id => {
            // Use name as title
            const style = new VectorStyle({ id, type: VECTOR_STYLE.CESIUM });
            style.parseStyleFromOptions(externalStyles[id]);
            layer.addStyle(style);
        });
        // Remove externalStyles from options to be sure that VectorStyle is used
        delete options.externalStyles;
        /* <-- deprecated */
        if (style) {
            layer.selectStyle(style);
        }
    }
}
