define([
    'text!_bundle/templates/tabPanelTemplate.html',
    'text!_bundle/templates/accordionPanelTemplate.html',
    'text!_bundle/templates/layerRowTemplate.html',
    '_bundle/views/layerView'], 
    function(TabPanelTemplate, AccordionPanelTemplate,LayerRowTemplate, LayerView) {
    return Backbone.View.extend({
        tagName: 'div',

        className: 'tab-content',

        events: {
            "click .accordion-header" : "toggleLayerGroup"
        },
        initialize : function() {
            this.layerGroupingModel = this.options.layerGroupingModel;
            this.tabTemplate = _.template(TabPanelTemplate);
            this.accordionTemplate = _.template(AccordionPanelTemplate);
            this.layerTemplate = _.template(LayerRowTemplate);
            this.render();
        },
        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.
        render : function() {
            console.log('render tab-content');
            this.$el.addClass(this.options.tabId);

            if(this.layerGroupingModel != null){
//                this.layerContainers = undefined;
                this.layerContainers = {};

                for(var i = 0; i < this.layerGroupingModel.layerGroups.length; ++i) {
                    var group = this.layerGroupingModel.layerGroups[i];
    //                var layers = group.getLayers();

        //            groupPanel.setTitle(group.getTitle() + ' (' + layers.length + ')');
        //            group.layerListPanel = groupPanel;

                    var visibleLayerCount = 0;
                    var groupPanel = jQuery(this.accordionTemplate({title: group.getTitle() + ' (' + group.models.length + ')'}));
                    var groupContainer = groupPanel.find('.content');
                    for(var n = 0; n < group.models.length; ++n) {
                        var layer = group.at(n);


                        var layerView = new LayerView({model:layer, instance: this.options.instance});
                        //var layerWrapper = //jQuery(this.layerTemplate({title: group.getTitle() + ' (' + layers.length + ')'}));
                        // var layerWrapper = 
                        //     Oskari.clazz.create('Oskari.mapframework.bundle.layerselector2.view.Layer',
                        //     layer, this.instance.sandbox, this.instance.getLocalization());
                        //var layerContainer = layerWrapper.find('.container');
                        if(visibleLayerCount%2 == 1) {
                            layerView.$el.addClass('odd');
                        } else {
                            layerView.$el.removeClass('odd');
                        }
                        visibleLayerCount++;

                        groupContainer.append(layerView.$el);
                        
                        this.layerContainers[layer.getId()] = layerView;
                    }
                    var tab = this.tabTemplate();
                    this.$el.append(jQuery(tab).append(groupPanel));
                }
                
    /*            var selectedLayers = this.options.instance.sandbox.findAllSelectedMapLayers();
                for(var i = 0; i < selectedLayers.length; ++i) {
                    this.setLayerSelected(selectedLayers[i].getId(), true);
                }
                            
                this.filterLayers(this.filterField.getValue());
    */
                this.$el.find('div.content').hide();
            }
        },
        toggleLayerGroup : function(e) {
            var element = jQuery(e.currentTarget);
            var panel = element.parents('.accordion:first');
            var headerIcon = panel.find('headerIcon');
            if(panel.hasClass('open')) {
                panel.removeClass('open');
                headerIcon.removeClass('icon-arrow-down');
                headerIcon.addClass('icon-arrow-right');
                jQuery(panel).find('div.content').hide();
            } else {
                panel.addClass('open');
                headerIcon.removeClass('icon-arrow-right');
                headerIcon.addClass('icon-arrow-down');
                jQuery(panel).find('div.content').show();
            }
        }


    });
});
