
(function() {
    define(['_bundle/models/roleModel', '_bundle/collections/userRoleCollection'],
        function(roleModel, userRoleCollection) {
        return Backbone.Collection.extend({

            // Reference to this collection's model.
            model : roleModel,

            getRoles : function() {
                return this.models;
            }
        });
        
    });
}).call(this);
