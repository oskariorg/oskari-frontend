/**
 * @class Oskari.digiroad.bundle.featureselector.domain.VectorLayer
 *
 * MapLayer of type Vector (Digiroad edition)
 */
Oskari.clazz.define('Oskari.digiroad.bundle.featureselector.domain.VectorLayer',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    /* Layer Type */
    this._layerType = 'DR_VECTOR';
    this._protocolType = null;
    this._protocolOpts = null;
    this._strategyTypes = null;
}, {
    /* Layer type specific functions */

    /**
    * @method getProtocolType
    */
    getProtocolType: function() {
        return this._protocolType;
    },

    /**
    * @method setProtocolType
    */
    setProtocolType: function(type) {
        this._protocolType = type;
    },

    /**
    * @method getProtocolOpts
    */
    getProtocolOpts: function() {
        return this._protocolOpts;
    },

    /**
    * @method setProtocolOpts
    */
    setProtocolOpts: function(opts) {
        this._protocolOpts = opts;
    },

    /**
    * @method getStrategyTypes
    */
    getStrategyTypes: function() {
        return this._strategyTypes;
    },

    /**
    * @method setStrategyTypes
    * @param {String/Array[String]} types Either a string like 'BBOX,FIXED'
    * or an array like ['BBOX','FIXED']
    */
    setStrategyTypes: function(types) {
        if (typeof types === 'string') {
            this._strategyTypes = types.split(',');
        }
        else if (typeof types === 'object' && types.constructor === Array) {
            this._strategyTypes = types;
        }
    }
    
}, {
    "extend": ["Oskari.mapframework.domain.AbstractLayer"]
});