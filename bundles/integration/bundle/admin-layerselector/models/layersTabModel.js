(function () {
    define(['_bundle/collections/layerGroupCollection'], function (LayerGroupCollection) {
        return Backbone.Model.extend({
            layerGroups: [],

            /**
             * Initialize
             *
             * @method initialize
             */
            initialize: function () {
                this.title = this.attributes.title;
                this.type = this.attributes.type;
                this.baseURL = this.attributes.baseUrl;
                this.actions = this.attributes.actions;
                this.layerGroups = this.attributes.grouping || [];
                this.layers = this.attributes.layers || [];
                this.filter = '';

                var me = this;
                // bind this view to the add and remove events of the collection!
                this.layers.on('change', function(model){
                    me.addLayer(model);
                });
                this.layers.on('add', function(model){
                    me.addLayer(model);
                });
                this.layers.on('remove', function(model){
                    me.removeLayer(model);
                });
            },


            /**
             * Return the name of this layerTab
             *
             * @method getTitle
             * @return {String} title
             */
            getTitle: function () {
                return this.title || this.names[Oskari.getDefaultLanguage()];
            },

            /**
             * Add layer groups
             * TODO: not used yet
             *
             * @method addLayerGroups
             * @param {Array} groups
             */
            addLayerGroups: function (groups) {
                this.layerGroups = groups;
            },

            /**
             * Return all layer groups
             *
             * @method getAllLayerGroups
             * @return {Array} groups
             */
            getAllLayerGroups: function () {
                return this.layerGroups;
            },
            /**
             * return group titles
             *
             * @method getGrouptitles
             * @param {Array} names of all these groups
             */
            getGroupTitles: function () {
                var groupNames = [],
                    i,
                    name;
                for (i = 0; i < this.layerGroups.length; i += 1) {
                    if (this.layerGroups[i].id) {
                        name = this.layerGroups[i].name;
                        if (!name) {
                            name = this.layerGroups[i].names[Oskari.getLang()];
                        }
                        groupNames.push({
                            name: name,
                            id: this.layerGroups[i].id
                        });
                    }
                }
                return groupNames;
            },
            /**
             * Return grouping title
             *
             * @method getGroupingTitle
             * @param {integer} index
             * @param {String} lang
             * @return {String} localized name
             */
            getGroupingTitle: function (index, lang) {
                var group = this.layerGroups[index];
                if (group.getTitle) {
                    return group.getTitle() + ' (' + group.models.length + ')';
                }
                return group.names[lang];
            },

            /**
             * Ajax call to save a group to backend.
             *
             * @method save
             * @param {Object} item group to save
             */
            save: function (item, callback) {
                var me = this;
                var method = "POST";
                if(!item.id) {
                    // insert if no id
                    method = "PUT";
                }
                this.__tryRestMethods(method, {
                    dataType: 'json',
                    data : item,
                    url: me.baseURL + me.actions.save + "&iefix=" + (new Date()).getTime(),
                    success: function (pResp) {
                        me._saved(pResp);
                        if(callback) {
                            callback();
                        }
                    },
                    error: function (jqXHR, textStatus) {
                        if(callback /* && jqXHR.status !== 0 */) {
                            callback("Error while saving group:" + textStatus);
                        }
                    }
                });
            },
            /**
             * Tries to call backend with given method, if server responds with 
             * '405 Method Not Allowed' tries the request again with POST method
             * and additional header 'X-HTTP-Method-Override' with the original method as value.
             * @param  {String} method 'GET' | 'POST' | 'PUT'  | 'DELETE' 
             * @param  {Object} config for jQuery.ajax() - method will be overridden with value of method param
             */
            __tryRestMethods : function(method, config) {
                var me = this;
                config.type = method;
                var errorHandler = function(jqXHR, textStatus) {
                    var origType = config.type;
                    if(textStatus === 'Method Not Allowed' && 
                        (origType === 'PUT' || origType === 'DELETE')) {
                        // PUT/DELETE not allowed -> try POST instead
                        var origBefore = config.beforeSend;
                        config.beforeSend = function(req) {
                            req.setRequestHeader('X-HTTP-Method-Override', origType);
                            if(origBefore) {
                                origBefore(req);
                            }
                        }
                        me.__tryRestMethods('POST', config);
                    }
                    else if(config.__oskariError) {
                        config.__oskariError(jqXHR, textStatus);
                    }
                }
                if(!config.__oskariError) {
                    config.__oskariError = config.error;
                    config.error = errorHandler;
                }
                jQuery.ajax(config);
            },
            /**
             * Ajax success callback to save a group to backend.
             *
             * @method _saved
             * @private
             * @param {Object} item group that was saved
             */
            _saved : function(item) {
                var hasChanges = this._parseObjectToGroup(item);
                // trigger update if had changes
                if(hasChanges) {
                    // refresh layerGroups - is this really necessary?
                    this.set('layerGroups', this.layerGroups);
                    // trigger change event so that DOM will be re-rendered
                    this.trigger('change:layerGroups');
                }
            },
            /**
             * Ajax call to get classes / organizations from backend.
             * loadClasses function will be called if call succeeds
             *
             * @method getClasses
             * @param {String} baseUrl
             * @param {String} action_route
             */
            getClasses: function (groupingMethod) {
                var me = this;
                jQuery.ajax({
                    type: "GET",
                    dataType: 'json',
                    url: me.baseURL + me.actions.load + "&iefix=" + (new Date()).getTime(),
                    success: function (pResp) {
                        // cleanup old layer Groups since we always refresh from server for now
                        me.layerGroups = [];
                        me.loadGroups(pResp, groupingMethod);
                    },
                    error: function (jqXHR, textStatus) {
                        /*if (jqXHR.status !== 0) {
                            //                            console.log("Error while retrieving classes" + textStatus);
                        }*/
                    }
                });
            },

            /**
             * Reads given groups and adds data to this model..
             *
             * @method loadClasses
             * @param {Array} classes
             */
            loadGroups: function (classes, groupingMethod) {
                //console.log("loadClasses");
                var me = this;
                var groups = me.layerGroups;
                var results = classes[this.type];
                var hasChanges = false;
                _.each(results, function(item) {
                    var changes = me._parseObjectToGroup(item, groupingMethod);
                    if(!hasChanges) {
                        hasChanges = changes;
                    }
                });
                // trigger update if had changes
                if(hasChanges) {
                    // refresh layerGroups - is this really necessary?
                    me.set('layerGroups', groups);
                    // trigger change event so that DOM will be re-rendered
                    me.trigger('change:layerGroups');
                }
            },
            /**
             * Parse an ajax object to save a group to backend.
             *
             * @method _parseObjectToGroup
             * @private
             * @param {Object} item group to parse
             * @return {Boolean} true if changes
             */
            _parseObjectToGroup : function(item, groupingMethod) {
                var me = this;
                var groups = me.layerGroups;
                var defaultLanguage = Oskari.getLang();
                var loadedGroup = me.getGroup(item.id);
                var hasChanges = false;
                if(!loadedGroup) {
                    // create a new group if not found
                    hasChanges = true;
                    // first param is null because Backbone just works that way
                    loadedGroup = new LayerGroupCollection(null, item.name[defaultLanguage]);
                    loadedGroup.id = item.id;
                    loadedGroup.names = loadedGroup.names || {};
                    groups.push(loadedGroup);
                }
                // copy names
                for (var lang in item.name) {
                    if (item.name.hasOwnProperty(lang)) {
                        if(!hasChanges) {
                            // flag changed if not flagged before and name has changed
                            hasChanges = (loadedGroup.names[lang] !== item.name[lang]);
                        }
                        loadedGroup.names[lang] = item.name[lang];
                    }
                }
                // update default name
                loadedGroup.name = loadedGroup.names[Oskari.getLang()] || '';
                if(groupingMethod) {
                    me._mapLayersForGroup(loadedGroup, groupingMethod);
                }
                this.sortByName();
                return hasChanges;
            },

            sortByName : function() {
                this.layerGroups.sort(function(a,b){
                    var name_a = a.name; 
                    if(name_a) {
                        name_a = name_a.toLowerCase();
                    }
                    var name_b = b.name; 
                    if(name_b) {
                        name_b = name_b.toLowerCase();
                    }
                    if(name_a > name_b) return 1;
                    if(name_a < name_b) return -1;
                    return 0;
                });
            },
            /**
             * Returns a template group for adding new organization.
             * @return {Object} object for form template
             */
            getTemplateGroup : function() {

                var supportedLanguages = Oskari.getSupportedLanguages();
                supportedLanguages.sort();

                var names = [];
                for (var i = 0; i < supportedLanguages.length; i++) {
                    names.push({
                        "lang" : supportedLanguages[i],
                        "name" : ""
                    });
                }
                
                return {
                    "getNamesAsList" : function() {
                        return names;
                    }
                };
            },
            /**
             * returns layer groups so that they are grouped with given grouping method
             *
             * @method getLayerGroups
             * @private
             */
            _mapLayersForGroup: function (group, groupingMethod) {
                var me = this;
                // FIXME: this needs some performance tuning
                _.each(this.layers.models, function(layer) {
                    if (layer.getMetaType &&
                        layer.getMetaType() == 'published' ||
                        layer.getMetaType() == 'myplaces') {
                        // skip published layers
                        return;
                    }
                    var groupAttr = layer[groupingMethod]();
                    if(group.name === groupAttr) {
                        group.add(layer);
                    }
                });
            },

            /**
             * Ajax call to remove a group to backend.
             *
             * @method remove
             * @param {Number} id for the group to remove
             */
            remove: function (id, callback) {
                var me = this;
                if(!id) {
                    if(callback) {
                        callback('Id missing');
                    }
                    return;
                }
                this.__tryRestMethods("DELETE", {
                    dataType: 'json',
                    url: me.baseURL + me.actions.remove + "&id=" + id + "&iefix=" + (new Date()).getTime(),
                    success: function (pResp) {
                        me._removeClass(id);
                        if(callback) {
                            callback();
                        }
                    },
                    error: function (jqXHR, textStatus) {
                        if(callback /* && jqXHR.status !== 0 */) {
                            callback("Error while removing group: " + textStatus, jqXHR);
                        }
                    }
                });
            },
            /**
             * Remove a class with given id
             *
             * @method removeClass
             * @param {integer} id of class/organization that needs to be removed
             * @private
             */
            _removeClass: function (id) {
                var groups = this.layerGroups;
                var foundIndex = -1;
                for (var i = groups.length - 1; i >= 0; i -= 1) {
                    /// === wont match it correctly for some reason, maybe string from DOM attribute <> integer
                    if (groups[i].id == id) {
                        foundIndex = i;
                        //groups.splice(foundIndex, 1);
                        break;
                    }
                }
                if(foundIndex !== -1) {
                    var me = this;
                    var group = groups.splice(foundIndex, 1)[0];
                    // remove layers so they are removed from the other tab as well
                    var layers = group.getLayers();
                    _.each(layers, function(layer){
                        // this will trigger removal of layer which updates both tabs
                        me.trigger('adminAction', {
                            type: "adminAction",
                            command: 'removeLayer',
                            modelId: layer.getId()
                        }); 
                    });
                    if(layers.length == 0) {
                        // trigger change event so that DOM will be re-rendered
                        // if there was no layers
                        this.trigger('change:layerGroups');
                    }
                }
            },
            /**
             * Removes layer from all layer groups found on this tab
             * @param  {LayerModel} layermodel backbone layer model
             */
            removeLayer : function(layermodel) {
                _.each(this.layerGroups, function(group){
                    group.remove(layermodel);
                });
                // trigger change event so that DOM will be re-rendered
                this.trigger('change:layerGroups');
            },
            /**
             * Removes layer from all layer groups found on this tab
             * @param  {LayerModel} layermodel backbone layer model
             */
            addLayer : function(layermodel) {
                if(!layermodel) {
                    return;
                }
                var modelGroupId = layermodel.getGroupId(this.type);
                var me = this;
                _.each(this.layerGroups, function(group){
                    var tmp = group.get(layermodel);
                    if(modelGroupId === group.id) {
                        group.add(layermodel, {merge: true});
                        if(!tmp) {
                            // new layer - trigger change
                            me.trigger('change:layerGroups');
                        }
                    }
                    else if(tmp) {
                        // layer removed from group/group changed
                        group.remove(tmp);
                        // trigger change
                        me.trigger('change:layerGroups');
                    }
                });
            },
            

            getGroup: function (groupId) {
                var groups = this.layerGroups;
                for (var i = 0; i <  groups.length; ++i) {
                    /// === wont match it correctly for some reason, maybe string from DOM attribute <> integer
                    if (groups[i].id == groupId) {
                        return groups[i];
                    }
                }
                return null;
            }
        });
    });
}).call(this);