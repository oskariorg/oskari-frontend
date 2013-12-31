(function() {
    define(['_bundle/models/layerModel'],function(LayerModel) {
        return Backbone.Collection.extend({

            // Reference to this collection's model.
            model : LayerModel,

            /**
             * Initialize
             *
             * @method initialize
             */
            initialize: function(models,title) {
                this.name = title; 
                this.searchIndex = {};
            },

            /**
             * Sets a new name 
             * @method setTitle
             * @param {String} value
             */
            setTitle : function(value) {
                this.name = value;
            },
            /**
             * Returns title / name of this layerGroup
             * @method getTitle 
             * @return {String}
             */
            getTitle : function() {
                return this.name;
            },
            /**
             * Adds a new layer to the layer group
             * @method addLayer 
             * @param {LayerModel} layer
             */
            addLayer : function(layerModel) {
                var tmpModel = this.get(layerModel);
                if(!tmpModel)  {
                    this.add(layerModel, {silent: true});
                    this.searchIndex[layerModel.getId()] = this._getSearchIndex(layerModel);
                }

            },
            /**
             * removes a layer with given id
             * @method addLayer 
             * @param {LayerModel} layer
             * @return {Object} removed layer
             */
            removeLayer: function(id) {
                var removed = false;
                for (var i = this.models.length - 1; i >= 0; i--) {
                    if(this.models[i].id === id ) {
                        this.models[i].splice(index, 1);
                        removed = true;
                        break;
                    }
                };
                return removed;
            },
            /**
             * Get all layer 
             * 
             * @method getLayers 
             * @return {Layer[]}
             */
            getLayers : function() {
                return this.models;
            },
            /**
             * Remove all layers
             * 
             * @method addLayer 
             * @param {LayerModel} layer
             */
            removeLayers : function() {
                this.models = [];
            },
            /**
             * Returns search index. i.e. full name of a layer as a string 
             * @method addLayer 
             * @param {LayerModel} layer
             * @return {String} name+inspireName+organizationName
             */
            _getSearchIndex : function(layerModel) {
                var val = layerModel.getName() +  ' ' + 
                    layerModel.getInspireName() +  ' ' +
                    layerModel.getOrganizationName();
                // TODO: maybe filter out undefined texts
                return val.toLowerCase();
            },
            /**
             * Checks if layer matches with the keyword
             * @method matchesKeyword 
             * @param {LayerId} id
             * @param {String} keyword
             * @return {boolean} true if keyword is found from layer name
             */
            matchesKeyword : function(layerId, keyword) {
                var searchableIndex = this.searchIndex[layerId];
                return searchableIndex.indexOf(keyword.toLowerCase()) != -1;
            }

        });
        
    });
}).call(this);
