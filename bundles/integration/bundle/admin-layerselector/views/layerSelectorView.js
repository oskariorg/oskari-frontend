define([
    "text!_bundle/templates/layerSelectorTemplate.html",
    '_bundle/collections/allLayersCollection',
    '_bundle/models/layersTabModel',
    '_bundle/views/tabPanelView'], 
    function(ViewTemplate, LayerCollection, LayersTabModel, TabPanelView) {
    return Backbone.View.extend({


        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        initialize : function() {
            this.instance = this.options.instance;
            this.el = this.options.el;
            this.appTemplate = _.template(ViewTemplate);
//            this.layerTabs = [];
            this.render();
        },

        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.
        render : function() {
            this.el.html(this.appTemplate);
            this._renderLayerGroups();
            
        },
        _renderLayerGroups: function(layerGrouping) {
            var tabContent = new TabPanelView({layerGroupingModel: (layerGrouping != null) ? layerGrouping : null});
//            this.layerTabs.push(tabContent);
            jQuery('.admin-layerselectorapp').html(tabContent.el);
        },

        addToCollection: function(models) {
            this.collection = new LayerCollection(models);
            inspireGrouping = this.collection.getLayerGroups('getInspireName');

            this._renderLayerGroups(new LayersTabModel({
                grouping : inspireGrouping, 
                title: this.instance.getLocalization('filter').inspire
            }));
        }

    });
});
