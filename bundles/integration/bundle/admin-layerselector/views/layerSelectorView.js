define([
    "text!_bundle/templates/layerSelectorTemplate.html", '_bundle/collections/layerCollection'], 
    function(ViewTemplate, LayerCollection) {
    return Backbone.View.extend({

        // Instead of generating a new element, bind to the existing skeleton of
        // the App already present in the HTML.
        /*el : container,*/

        appTemplate : _.template(ViewTemplate),


        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        initialize : function() {
            this.el = this.options.el;
            this.render();
        },
        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.
        render : function() {
            this.el.append(this.appTemplate);
            
        }, 

        addToCollection: function(models) {
            this.collection = new LayerCollection(models);
debugger;
        }

    });
});
