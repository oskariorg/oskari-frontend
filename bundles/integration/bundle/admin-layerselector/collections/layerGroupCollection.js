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
                if(!models || models.length === 0) {
                    // setup empty collection
                    this.resetLayers();
                }
                var me = this;

                this.on('add', function(layerModel) {
                    me.searchIndex[layerModel.getId()] = me._getSearchIndex(layerModel);
                });
                this.on('change', function(layerModel) {
                    me.searchIndex[layerModel.getId()] = me._getSearchIndex(layerModel);
                });
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
             * Returns an array of localized names and adds locales for missing, but supported languages.
             * Usable for editing form
             * @return {Object[]} object with lang and name properties
             */
            getNamesAsList : function() {
                var names = [];
                var usedLanguages = {};
                for (var lang in this.names) {
                    if (this.names.hasOwnProperty(lang)) {
                        usedLanguages[lang] = true;
                        names.push({
                            "lang" : lang,
                            "name" : this.names[lang]
                        });
                    }
                }
                
                // Make sure all supported languages are present
                var supportedLanguages = Oskari.getSupportedLanguages();
                
                for (var j = 0; j < supportedLanguages.length; j++) {
                    if (!usedLanguages[supportedLanguages[j]]) {
                        names.push({
                            "lang" : supportedLanguages[j],
                            "name": ""
                        });
                    }
                }
                return names;
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
            resetLayers : function() {
                //this.models = [];
                this.reset();
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
