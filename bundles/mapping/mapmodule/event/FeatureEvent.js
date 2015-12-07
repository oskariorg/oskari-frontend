/**
 * @class Oskari.mapframework.bundle.mapmodule.event.FeatureClickEvent
 *
 * Event is sent after a feature is clicked
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.event.FeatureEvent',
    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this._features = [];
    }, {
        __name: 'FeatureEvent',
        op : {
            'add' : 'add',
            'remove' : 'remove',
            'click' : 'click'
        },
        setOpAdd : function() {
            this._operation = this.op.add;
            return this;
        },
        setOpRemove : function() {
            this._operation = this.op.remove;
            return this;
        },
        setOpClick : function() {
            this._operation = this.op.click;
            return this;
        },
        getName: function () {
            return this.__name;
        },
        addFeature : function(id, geojson, layerId) {
            this._features.push({
                id : id,
                geojson : geojson,
                layerId : layerId
            });
            return this;
        },
        /**
         * Serialization for RPC
         * @return {Object} object has key id which has the marker id
         */
        getParams: function () {
            return {
                operation: this._operation,
                features: this._features
            };
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.event.Event']
    });
