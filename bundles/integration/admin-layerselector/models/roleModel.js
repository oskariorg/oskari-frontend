(function() {
    define(function() {
        return Backbone.Model.extend({

            // Ensure that each todo created has `title`.
            initialize : function(model) {
                // exted given object (role) with this one
                jQuery.extend(this, model);
            }
        });
    });
}).call(this);