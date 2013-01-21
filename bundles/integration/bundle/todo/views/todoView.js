define([
    "_bundle/collections/todoCollection", 
    "_bundle/views/itemView", 
    "text!_bundle/templates/stats.html", 
    "text!_bundle/templates/view.html"], 
    function(TodoCollection, ItemView, StatsTemplate, ViewTemplate) {
    // Create our global collection of **Todos**.
    var Todos = new TodoCollection;

    // The Application
    // ---------------
    return Backbone.View.extend({

        // Instead of generating a new element, bind to the existing skeleton of
        // the App already present in the HTML.
        /*el : container,*/

        appTemplate : _.template(ViewTemplate),
        // Our template for the line of statistics at the bottom of the app.
        statsTemplate : _.template(StatsTemplate),

        // Delegated events for creating new items, and clearing completed ones.
        events : {
            "keypress #new-todo" : "createOnEnter",
            "click #clear-completed" : "clearCompleted",
            "click #toggle-all" : "toggleAllComplete"
        },

        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        initialize : function() {
            this.el = this.options.el;
            this.options.el.append(this.appTemplate);
            this.input = this.$("#new-todo");
            this.allCheckbox = this.$("#toggle-all")[0];

            this.listenTo(Todos, 'add', this.addOne);
            this.listenTo(Todos, 'reset', this.addAll);
            this.listenTo(Todos, 'all', this.render);

            this.footer = this.$('footer');
            this.main = $('#main');
            
            Todos.fetch();
        },
        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.
        render : function() {
            var done = Todos.done().length;
            var remaining = Todos.remaining().length;

            if(Todos.length) {
                this.main.show();
                this.footer.show();
                this.footer.html(this.statsTemplate({
                    done : done,
                    remaining : remaining
                }));
            } else {
                this.main.hide();
                this.footer.hide();
            }

            this.allCheckbox.checked = !remaining;
        },
        // Add a single todo item to the list by creating a view for it, and
        // appending its element to the `<ul>`.
        addOne : function(todo) {
            var view = new ItemView({
                model : todo
            });
            this.$("#todo-list").append(view.render().el);
        },
        // Add all items in the **Todos** collection at once.
        addAll : function() {
            Todos.each(this.addOne);
        },
        // If you hit return in the main input field, create new **Todo** model,
        // persisting it to *localStorage*.
        createOnEnter : function(e) {
            if(e.keyCode != 13)
                return;
            if(!this.input.val())
                return;

            Todos.create({
                title : this.input.val()
            });
            this.input.val('');
        },
        // Clear all done todo items, destroying their models.
        clearCompleted : function() {
            _.invoke(Todos.done(), 'destroy');
            return false;
        },
        toggleAllComplete : function() {
            var done = this.allCheckbox.checked;
            Todos.each(function(todo) {
                todo.save({
                    'done' : done
                });
            });
        }
    });

});
