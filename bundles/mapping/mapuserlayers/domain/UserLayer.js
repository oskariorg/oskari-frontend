/**
 * @class Oskari.mapframework.bundle.myplacesimport.domain.UserLayer
 *
 * MapLayer of type UserLayer
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplacesimport.domain.UserLayer',

    /**
 * @method create called automatically on construction
 * @static
 */
    function () {
        this._layerType = 'USERLAYER';
        this._metaType = 'USERLAYER';
        this.description = undefined;
        this.source = undefined;
        this.renderingElement = undefined;
    }, {
        setDescription: function (desc) {
            this.description = desc;
        },
        getDescription: function () {
            if (this.description) {
                return Oskari.util.sanitize(this.description);
            }
            return this.description;
        },
        setSource: function (source) {
            this.source = source;
        },
        getSource: function () {
            if (this.source) {
                return Oskari.util.sanitize(this.source);
            }
            return this.source;
        },
        setRenderingElement: function (element) {
            this.renderingElement = element;
        },
        getRenderingElement: function () {
            return this.renderingElement;
        },
        isFilterSupported: function () {
            // this defaults to false in AbstractLayer, but WFSLayer returns true.
            // Not sure if this is something we want, but it's the same behavior as before but NOT having
            // WFS and analysis referenced in AbstractLayer
            return false;
        }

    }, {
        'extend': ['Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer']
    });
