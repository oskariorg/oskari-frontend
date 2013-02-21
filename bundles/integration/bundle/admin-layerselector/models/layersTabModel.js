(function() {
    define(['_bundle/collections/layerGroupCollection'], function(LayerGroupCollection) {
        return Backbone.Model.extend({
            // Ensure that each todo created has `title`.
            initialize : function() {
                // if(jQuery.isArray(layerGroups)) {
                //     this.layerGroups = layerGroups;
                // }

                this.title = this.attributes.title;
                this.layerGroups = this.attributes.grouping;
                //TODO view -> this.layerContainers = {};
                this.filter = '';
                //TODO view -> this._createUI();
            },


            getTitle : function() {
                return this.title;
            },

            getState : function() {
                var state = {
                    tab : this.getTitle(),
                    filter : this.filter,
                    groups : []
                };
                // TODO: groups listing
                /*
                var layerGroups = jQuery(this.container).find('div.layerList div.layerGroup.open');
                for(var i=0; i < layerGroups.length; ++i) {
                    var group = layerGroups[i];
                    state.groups.push(jQuery(group).find('.groupName').text());
                }*/
                return state;
            },
            setState : function(state) {
                if(!state) {
                    return;
                }
                
                if(!state.filter) {
                    this.filter = state.filter;
                    this.filterLayers(state.filter);
                }
                if(state.groups && state.groups.length > 0) {
                    // TODO: should open panels in this.accordion where groups[i] == panel.title
                }
            },


            addLayerGroups : function(groups) {
                var me = this;
                this.layerGroups = groups;                
            },

            /**
             * @method _filterLayers
             * @private
             * @param {String} keyword
             *      keyword to filter layers by
             * Shows and hides layers by comparing the given keyword to the text in layer containers layer-keywords div.
             * Also checks if all layers in a group is hidden and hides the group as well.
             */
            getFilteredLayerGroups : function(keyword) {
                
                // filter
                var selectedGroups = [];
                var visibleGroupCount = 0;
                for(var i = 0; i < this.layerGroups.length; ++i) {
                    var group = this.layerGroups[i];
                    var layers = group.getLayers();
                    var selectedGroup = group;
                    selectedGroup.removeLayers();
                    var visibleLayerCount = 0;
                    for(var n = 0; n < layers.length; ++n) {
                        var layer = layers[n];
                        var layerId = layer.getId();
                        if(group.matchesKeyword(layerId, keyword)) {
                            selectedGroup.addLayer(layer);
                        }
                    }
                    if(selectedGroup.getLayers().length > 0) {
                        selectedGroups.push(selectedGroup);
                    }
                }
                return selectedGroups;
            },
            getAllLayerGroups : function() {
                return this.layerGroups;
            }

        });
    });
}).call(this);
