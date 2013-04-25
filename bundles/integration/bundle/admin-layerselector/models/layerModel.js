(function() {
    define(function() {
        return Backbone.Model.extend({

            // Ensure that each todo created has `title`.
            initialize : function(model) {
                // exted given object (layer) with this one
                jQuery.extend(this, model);
            }
        });
    });
}).call(this);
