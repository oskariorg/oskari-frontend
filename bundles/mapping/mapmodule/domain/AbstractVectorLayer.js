import { VectorStyle, createDefaultStyle, DEFAULT_STYLE_NAME } from './VectorStyle';

const AbstractLayer = Oskari.clazz.get('Oskari.mapframework.domain.AbstractLayer');

export class AbstractVectorLayer extends AbstractLayer {
    constructor () {
        super(...arguments);
        this._hoverOptions = null;
        this._storedStyleName = null;
        this._controlData = {};
    }

    /* override */
    selectStyle (name) {
        // style is seleced on createMapLayer and styles are loaded async for VectorLayer
        // store selected style name to try selecting it when styles are available
        this._storedStyleName = name;
        // don't create empty style on startup, create it on getCurrentStyle when needed
        if (this.getStyles().length === 0) {
            return;
        }
        // select style (defaults to first)
        super.selectStyle(name);
    }

    /* override */
    addStyle (style) {
        const styles = this.getStyles();
        const index = styles.findIndex(s => s.getName() === style.getName());
        if (index !== -1) {
            styles[index] = style;
        } else {
            styles.push(style);
        }
    }

    /* override */
    getCurrentStyle () {
        if (!this._currentStyle) {
            if (this.getStyles().length > 0) {
                super.selectStyle(this._storedStyleName);
            } else {
                this._currentStyle = createDefaultStyle(this._storedStyleName);
            }
        }
        return this._currentStyle;
    }

    /* override */
    getStyleType () {
        return this._controlData.styleType;
    }

    /* override */
    getLegendImage () {
        return null;
    }

    setHoverOptions (options) {
        this._hoverOptions = options;
    }

    getHoverOptions () {
        return this._hoverOptions;
    }

    handleDescribeLayer (info) {
        const { styles = [], controlData = {}, hover } = info;
        const vs = styles.map(s => new VectorStyle(s));
        if (vs.length) {
            // override all styles as create map layer if there were any
            this.setStyles(vs);
            // update current style (defaults to first)
            super.selectStyle(this._storedStyleName);
            // request notifies change
            Oskari.getSandbox().postRequestByName('ChangeMapLayerStyleRequest', [this.getId(), this._storedStyleName]);
        }
        this._controlData = controlData;
        this._hoverOptions = hover;
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
        return this._controlData.clusteringDistance;
    }

    /**
     * To setup clustering. Sets the minimum distance between features before clustering kicks in.
     *  @method setClusteringDistance
     *  @return {Number} Distance between features in pixels
     */
    setClusteringDistance (distance) {
        this._controlData.clusteringDistance = distance;
    }
}

Oskari.clazz.defineES('Oskari.mapframework.domain.AbstractVectorLayer', AbstractVectorLayer);
