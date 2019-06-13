const WFSLayer = Oskari.clazz.get('Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer');
/**
 * @class Oskari.mapframework.bundle.myplacesimport.domain.UserLayer
 *
 * MapLayer of type UserLayer
 */
export class UserLayer extends WFSLayer {
    constructor () {
        super();
        this._layerType = 'USERLAYER';
        this._metaType = 'USERLAYER';
        this.description = undefined;
        this.source = undefined;
        this.renderingElement = undefined;
        this.featureProperties = []; // property names in fixed order from user_layer table fields column
        this.featurePropertyIndexes = [];
    }
    setDescription (desc) {
        this.description = desc;
    }
    getDescription () {
        if (this.description) {
            return Oskari.util.sanitize(this.description);
        }
        return this.description;
    }
    setSource (source) {
        this.source = source;
    }
    getSource () {
        if (this.source) {
            return Oskari.util.sanitize(this.source);
        }
        return this.source;
    }
    setRenderingElement (element) {
        this.renderingElement = element;
    }
    getRenderingElement () {
        return this.renderingElement;
    }
    setFeatureProperties (fields) {
        this.featureProperties = fields;
    }
    getFeatureProperties () {
        return this.featureProperties;
    }
    setFeaturePropertyIndexes (indexes) {
        this.featurePropertyIndexes = indexes;
    }
    getFeaturePropertyIndexes () {
        return this.featurePropertyIndexes;
    }
    hasOrder () {
        return this.featureProperties && this.featureProperties.length > 1;
    }
    isFilterSupported () {
        // this defaults to false in AbstractLayer, but WFSLayer returns true.
        // Not sure if this is something we want, but it's the same behavior as before but NOT having
        // WFS and analysis referenced in AbstractLayer
        return false;
    }
};

Oskari.clazz.defineES('Oskari.mapframework.bundle.myplacesimport.domain.UserLayer', UserLayer);
