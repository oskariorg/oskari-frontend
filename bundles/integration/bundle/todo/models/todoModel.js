
(function() {

    define(function() {

        // Todo Model
        // ----------

        // Our basic **Todo** model has `title`, `order`, and `done` attributes.
        return Backbone.Model.extend({

            // Default attributes for the todo item.
            defaults : function() {
                return {
                    title : "empty todo...",
                    order : 0,
                    done : false
                };
            },
            // Ensure that each todo created has `title`.
            initialize : function() {
                if(!this.get("title")) {
                    this.set({
                        "title" : this.defaults().title
                    });
                }
            },
            // Toggle the `done` state of this todo item.
            toggle : function() {
                this.save({
                    done : !this.get("done")
                });
            }
        });
    });
}).call(this);
