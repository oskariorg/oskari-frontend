(function() {
    define(function() {
        return Backbone.Model.extend({

            // Default attributes
/*            defaults : function() {
                return {
                    title : "Layer"
                };
            },
*/            
            // Ensure that each todo created has `title`.
            initialize : function(model) {
                jQuery.extend(this, model);
                this.visible = true;
            }
        });
    });
}).call(this);
