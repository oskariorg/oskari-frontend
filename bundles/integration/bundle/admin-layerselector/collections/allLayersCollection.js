
(function() {
    define(['_bundle/models/layerModel', '_bundle/collections/layerGroupCollection'],
        function(LayerModel, LayerGroupCollection) {
        return Backbone.Collection.extend({

            // Reference to this collection's model.
            model : LayerModel,

            /**
             * Initialize
             *
             * @method initialize
             */
            initialize: function(models) {
            },


            /**
             * returns layer groups so that they are grouped with given grouping method
             * 
             * @method getLayerGroups
             */
            getLayerGroups : function(groupingMethod) {
                var groupList = [],
                    me = this,
                    layers = this.models;


                // sort layers by grouping & name
                this.models.sort(function(a, b) {
                    return me._layerListComparator(a, b, groupingMethod);
                });

                var group = null;
                for (var n = 0; n < layers.length; ++n) {
                    var layer = layers[n];
                    if(layer.getMetaType &&
                     layer.getMetaType() == 'published' ||
                     layer.getMetaType() == 'myplaces') {
                        // skip published layers
                        continue;
                    }
                    var groupAttr = layer[groupingMethod]();
                    if (!group || group.getTitle() != groupAttr) {
                        group = new LayerGroupCollection(null, groupAttr);
                        groupList.push(group);
                    }
                    group.addLayer(layer);

                }
                return groupList;
            },

            /**
             * Helper to compare layers with each others to sort them out
             * 
             * @method _layerListComparator
             * @return {integer} if a > b => 1, a = b => 0 & a < b => -1
             */
            _layerListComparator : function(a, b, groupingMethod) {
                var nameA = a[groupingMethod]().toLowerCase();
                var nameB = b[groupingMethod]().toLowerCase();
                if(nameA == nameB) {
                    nameA = a.getName().toLowerCase();
                    nameB = b.getName().toLowerCase();          
                }
                if (nameA < nameB) {return -1}
                if (nameA > nameB) {return 1}
                return 0;
            },

            /**
             * Removes layer with given id
             * 
             * @method removeLayer
             */
            removeLayer: function(id) {
                for (var i = this.models.length - 1; i >= 0; i--) {
                    if(this.models[i].id === id ) {
                        this.models[i].splice(index, 1);
                        break;
                    }
                };
            }


        });
        
    });
}).call(this);
