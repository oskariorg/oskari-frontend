
(function() {
    define(['_bundle/models/layerModel'],function(LayerModel) {
        return Backbone.Collection.extend({

            // Reference to this collection's model.
            model : LayerModel,

            initialize: function(models) {

            }

        });
        
    });
}).call(this);
