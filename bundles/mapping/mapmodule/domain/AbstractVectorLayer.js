import { VectorStyle, createDefaultStyle, DEFAULT_STYLE_NAME } from './VectorStyle';
import { VECTOR_STYLE, parseStylesFromOptions } from './constants';

const AbstractLayer = Oskari.clazz.get('Oskari.mapframework.domain.AbstractLayer');

export class AbstractVectorLayer extends AbstractLayer {
    constructor () {
        super(...arguments);
        this.hoverOptions = null;
    }

    /* override */
    selectStyle (name) {
        super.selectStyle(name);
        // TODO: use flag and super? -> how about getCurrentStyle npe
        // OR: let createlayer select -> empty style which will be removed after info is loaded
        // -> how to select defult style? describe returns??
        // -> empty default style is created for every vector layer
    }
    // getCurrentStyle () {}

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

    handleDescribeLayer (info) {
        const { styles = [], defaultStyleId } = info;
        const vs = styles.map(s => new VectorStyle(s));
        // override all styles as create map layer -> select style -> created default style
        this.setStyles(vs);
        // this is done on maplayer add, so select default style
        // TODO: what about non-default selected + refresh -> should select
        Oskari.getSandbox().postRequestByName('ChangeMapLayerStyleRequest', [this.getId(), defaultStyleId]);
    }

    // For user data layers
    setStylesFromOptions (options) {
        const styles = parseStylesFromOptions(options);
        this.setStyles(styles);
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
