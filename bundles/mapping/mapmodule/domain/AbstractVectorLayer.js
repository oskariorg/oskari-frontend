import { VectorStyle, createDefaultStyle, DEFAULT_STYLE_NAME } from './VectorStyle';

const AbstractLayer = Oskari.clazz.get('Oskari.mapframework.domain.AbstractLayer');

export class AbstractVectorLayer extends AbstractLayer {
    constructor () {
        super(...arguments);
        this.hoverOptions = null;
    }

    /* override */
    // AbstractLayer selectStyle creates empty if style isn't found
    _createEmptyStyle () {
        return createDefaultStyle();
    }

    getLegendImage () {
        return null;
    }

    setHoverOptions (options) {
        this.hoverOptions = options;
    }

    getHoverOptions () {
        return this.hoverOptions;
    }

    setOptions (options) {
        super.setOptions(options);
        // Create styles before setting options
        const { styles = {} } = options;
        // use addStyle to avoid duplicate and invalid styles
        this.setStyles([]);
        Object.keys(styles).forEach(styleId => {
            const style = new VectorStyle(styleId, null, 'normal', styles[styleId]);
            this.addStyle(style);
        });
        // Remove styles from options to be sure that VectorStyle is used
        delete options.styles;
    }

    removeStyle (name) {
        const styles = this.getStyles();
        const index = styles.findIndex(s => s.getName() === name);
        if (index !== -1) {
            styles.splice(index, 1);
        }
        // Remove style from layer if active.
        const current = this.getCurrentStyle().getName();
        const sb = Oskari.getSandbox();
        if (current === name) {
            sb.postRequestByName('ChangeMapLayerStyleRequest', [this.getId(), DEFAULT_STYLE_NAME]);
        } else {
            // Only notify to update list of styles in selected layers.
            const event = Oskari.eventBuilder('MapLayerEvent')(this.getId(), 'update');
            sb.notifyAll(event);
        }
    }

    /**
     * To get distance between features when clustering kicks in.
     *  @method getClusteringDistance
     *  @return {Number} Distance between features in pixels
     */
    getClusteringDistance () {
        return this.getOptions().clusteringDistance;
    }

    /**
     * To setup clustering. Sets the minimum distance between features before clustering kicks in.
     *  @method setClusteringDistance
     *  @return {Number} Distance between features in pixels
     */
    setClusteringDistance (distance) {
        this.getOptions().clusteringDistance = distance;
    }
}

Oskari.clazz.defineES('Oskari.mapframework.domain.AbstractVectorLayer', AbstractVectorLayer);
