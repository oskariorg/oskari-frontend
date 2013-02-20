define([
    "text!_bundle/templates/layerSelectorTemplate.html",
    '_bundle/collections/allLayersCollection',
    '_bundle/views/tabPanelView'], 
    function(ViewTemplate, LayerCollection, TabPanelView) {
    return Backbone.View.extend({


        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        initialize : function() {
            this.el = this.options.el;
            this.appTemplate = _.template(ViewTemplate);
            this.render();
        },

        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.
        render : function() {
            this.el.html(this.appTemplate);
            var tabContent = new TabPanelView(this.collection);
            jQuery('.admin-layerselectorapp').html(tabContent.el);
            
        }, 

        addToCollection: function(models) {
            this.collection = new LayerCollection(models);
            var inspireGroups = this.collection.getLayerGroups('getInspireName');
debugger;
            this.render();
        }

    });
});
