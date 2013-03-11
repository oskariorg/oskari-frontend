(function() {
    define(['_bundle/collections/layerGroupCollection'], function(LayerGroupCollection) {
        return Backbone.Model.extend({
            layerGroups : null,
            initialize : function() {
                // if(jQuery.isArray(layerGroups)) {
                //     this.layerGroups = layerGroups;
                // }

                this.title = this.attributes.title;
                this.layerGroups = this.attributes.grouping;
                //TODO view -> this.layerContainers = {};
                this.filter = '';
                //TODO view -> this._createUI();
                this.on('change:layerGroups', this.notify, this);
            },


            getTitle : function() {
                return (this.title != null) ? this.title : this.names.fi;
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
            },
            getGroupTitles: function() {
                var groupNames = [];
                for (var i = this.layerGroups.length - 1; i >= 0; i--) {
                    groupNames.push(this.layerGroups[i].name);
                };
                return groupNames;
            },
            getGroupingTitle: function(index, lang) {
                var group = this.layerGroups[index];
                if(group.getTitle != null) {
                    return group.getTitle() + ' (' + group.models.length + ')';
                } else {
                    return group.names[lang];
                }
            },


            getClasses: function(baseUrl) {
                var me = this,
                    action_route = "&action_route=GetMapLayerClasses";

                jQuery.ajax({
                    type : "GET",
                    dataType: 'json',
                    beforeSend: function(x) {
                      if(x && x.overrideMimeType) {
                       x.overrideMimeType("application/j-son;charset=UTF-8");
                      }
                     },
                    url : baseUrl + action_route,
                    success : function(pResp) {
                        me.loadClasses(pResp);

                    },
                    error : function(jqXHR, textStatus) {
                        if(jqXHR.status != 0) {
                            console.log("Error while retrieving classes" + textStatus);
                        }
                    }
                }); 
            },

            loadClasses: function(classes) {
                var me = this;
                var groups = me.layerGroups;
debugger;
                //TODO: we need a better data from backend
                for (var key in classes) {
                    var obj = classes[key];
                    delete obj.maplayers;
                    if(obj.parentid == null) {
                        var updated = false;
                        for (var i = groups.length - 1; i >= 0; i--) {
                            var group = groups[i];
                            if(group.name == obj.nameFi ||
                                group.name == obj.nameSv ||
                                group.name == obj.nameEn ||
                                group.id === obj.id) {

                                group.names = (group.names != null) ? group.names : {};
                                group.names.fi = obj.nameFi;
                                group.names.sv = obj.nameSv;
                                group.names.en = obj.nameEn;
                                group.name = group.names[Oskari.getLang()];
                                group.id = obj.id;
                                updated = true;
                                break;
                            }
                        };
                        if(!updated){
                            var group = {};
                            group.names = (group.names != null) ? group.names : {};
                            group.names.fi = obj.nameFi;
                            group.names.sv = obj.nameSv;
                            group.names.en = obj.nameEn;
                            group.id = obj.id;
                            groups.push(group);
                        }
                   }
                }
                me.layerGroups = groups;
                me.trigger('change');
            },
            removeClass : function(id) {
                var groups = this.layerGroups;
                for (var i = groups.length - 1; i >= 0; i--) {
                    if(groups[i].id == id){
                        groups.splice(i, 1);
                    }
                }
            },

            notify: function() {
                console.log('layerGroups has changed');
            }
        });
    });
}).call(this);
