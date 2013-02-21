define( 
    function() {
    return Backbone.View.extend({
        tagName: 'div',

        className: 'tab-content',

        initialize : function() {
            this.layerGroups = this.options.layerGroupingModel;
            //this.template = _.template(Template);
            //this.el = this.options.el;
            this.render();
        },
        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.
        render : function() {
            console.log('render tab-content');            
debugger;

/*        this.layerContainers = undefined;
        this.layerContainers = {};

        for(var i = 0; i < groups.length; ++i) {
            var group = groups[i];
            var layers = group.getLayers();

            var groupPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            groupPanel.setTitle(group.getTitle() + ' (' + layers.length + ')');
            group.layerListPanel = groupPanel;
            
            var groupContainer = groupPanel.getContainer();
            for(var n = 0; n < layers.length; ++n) {
                var layer = layers[n];
                var layerWrapper = 
                    Oskari.clazz.create('Oskari.mapframework.bundle.layerselector2.view.Layer',
                    layer, this.instance.sandbox, this.instance.getLocalization());
                var layerContainer = layerWrapper.getContainer();
                groupContainer.append(layerContainer);
                
                this.layerContainers[layer.getId()] = layerWrapper;
            }
            this.accordion.addPanel(groupPanel);
        }
        
        var selectedLayers = this.instance.sandbox.findAllSelectedMapLayers();
        for(var i = 0; i < selectedLayers.length; ++i) {
            this.setLayerSelected(selectedLayers[i].getId(), true);
        }
                    
        this.filterLayers(this.filterField.getValue());
*/


        }

    });
});
