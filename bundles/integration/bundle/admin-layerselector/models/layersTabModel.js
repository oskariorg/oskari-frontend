(function () {
    define(['_bundle/collections/layerGroupCollection'], function (LayerGroupCollection) {
        return Backbone.Model.extend({
            layerGroups: null,

            /**
             * Initialize
             *
             * @method initialize
             */
            initialize: function () {
                this.title = this.attributes.title;
                this.type = this.attributes.type;
                this.layerGroups = this.attributes.grouping;
                this.filter = '';
            },


            /**
             * Return the name of this layerTab
             *
             * @method getTitle
             * @return {String} title
             */
            getTitle: function () {
                // FIXME use default language
                return (this.title != null) ? this.title : this.names[Oskari.getDefaultLanguage()];
            },


            /**
             * Return the state of this layer
             * TODO: not used yet
             *
             * @method getState
             * @return {Object} state (title, filter, groups)
             */
            getState: function () {
                var state = {
                    tab: this.getTitle(),
                    filter: this.filter,
                    groups: []
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
            /**
             * Set the state of this layer
             * TODO: not used yet
             *
             * @method setState
             * @param {Object} state an object containing info about title, filter, groups
             */
            setState: function (state) {
                if (!state) {
                    return;
                }

                if (!state.filter) {
                    this.filter = state.filter;
                    this.filterLayers(state.filter);
                }
                if (state.groups && state.groups.length > 0) {
                    // TODO: should open panels in this.accordion where groups[i] == panel.title
                }
            },


            /**
             * Add layer groups
             * TODO: not used yet
             *
             * @method addLayerGroups
             * @param {Array} groups
             */
            addLayerGroups: function (groups) {
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
            getFilteredLayerGroups: function (keyword) {

                // filter
                var selectedGroups = [];
                //var visibleGroupCount = 0;
                for (var i = 0; i < this.layerGroups.length; ++i) {
                    var group = this.layerGroups[i];
                    if (group.getLayers != null) {
                        var layers = group.getLayers();
                        var selectedGroup = new LayerGroupCollection(null, group.getTitle());
                        //var visibleLayerCount = 0;
                        for (var n = 0; n < layers.length; ++n) {
                            var layer = layers[n];
                            var layerId = layer.getId();
                            if (group.matchesKeyword(layerId, keyword)) {
                                selectedGroup.addLayer(layer);
                            }
                        }
                        if (selectedGroup.getLayers().length > 0) {
                            selectedGroups.push(selectedGroup);
                        }
                    }
                }
                return selectedGroups;
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
                //                console.log(this.layerGroups);
                var groupNames = [];
                for (var i = 0; i < this.layerGroups.length; i++) {
                    if (this.layerGroups[i].id != null) {
                        var name = this.layerGroups[i].name;
                        if (!name) {
                            name = this.layerGroups[i].names[Oskari.getLang()];
                            //                            console.log(name);
                        }
                        groupNames.push({
                            name: name,
                            id: this.layerGroups[i].id
                        });
                    }
                };
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
                if (group.getTitle != null) {
                    return group.getTitle() + ' (' + group.models.length + ')';
                } else {
                    return group.names[lang];
                }
            },

            /**
             * Ajax call to get classes / organizations from backend.
             * loadClasses function will be called if call succeeds
             * TODO: this should not be necessary.
             *
             * @method getClasses
             * @param {String} baseUrl
             * @param {String} action_route
             */
            getClasses: function (baseUrl, action_route) {
                var me = this
                jQuery.ajax({
                    type: "GET",
                    dataType: 'json',
                    beforeSend: function (x) {
                        if (x && x.overrideMimeType) {
                            x.overrideMimeType("application/j-son;charset=UTF-8");
                        }
                    },
                    url: baseUrl + action_route + "&iefix=" + (new Date()).getTime(),
                    success: function (pResp) {
                        me.loadClasses(pResp);

                    },
                    error: function (jqXHR, textStatus) {
                        if (jqXHR.status != 0) {
                            //                            console.log("Error while retrieving classes" + textStatus);
                        }
                    }
                });
            },

            /**
             * Reads given classes and adds data to this model..
             *
             * @method loadClasses
             * @param {Array} classes
             */
            loadClasses: function (classes) {
                //console.log("loadClasses");
                var me = this,
                    groups = me.layerGroups,
                    lang;
                //TODO: we need a better data from backend
                for (var key in classes) {
                    var obj = classes[key];
                    delete obj.maplayers;
                    if (obj.parentid == null) {
                        var updated = false;
                        for (var i = groups.length - 1; i >= 0; i--) {
                            var group = groups[i],
                                gotMatch = group.id === obj.id;
                            if (!gotMatch) {
                                for (lang in obj.name) {
                                    if (obj.name.hasOwnProperty(lang) && obj.name[lang] === group.name) {
                                        gotMatch = true;
                                        break;
                                    }
                                }
                            }
                            if (gotMatch) {
                                group.names = (group.names != null) ? group.names : {};
                                for (lang in obj.name) {
                                    if (obj.name.hasOwnProperty(lang)) {
                                        group.names[lang] = obj.name[lang];
                                    }
                                }
                                group.name = group.names[Oskari.getLang()];
                                group.id = obj.id;
                                updated = true;
                                break;
                            }
                        };
                        if (!updated && obj.id != null) {
                            var group = {};
                            group.names = (group.names != null) ? group.names : {};
                            for (lang in obj.name) {
                                if (obj.name.hasOwnProperty(lang)) {
                                    group.names[lang] = obj.name[lang];
                                }
                            }
                            group.id = obj.id;
                            groups.push(group);
                        }
                    }
                }
                // refresh layerGroups
                me.set('layerGroups', groups);
                // trigger change event so that DOM will be re-rendered
                me.trigger('change:layerGroups');
            },
            /**
             * Remove a class with given id
             *
             * @method removeClass
             * @param {integer} id of class/organization that needs to be removed
             */
            removeClass: function (id) {
                var groups = this.layerGroups;
                for (var i = groups.length - 1; i >= 0; i--) {
                    if (groups[i].id == id) {
                        groups.splice(i, 1);
                    }
                }
            },

            /**
             * Removes a layer with given id
             *
             * @method removeLayer
             * @param {integer} id
             */
            removeLayer: function (id) {
                var groups = this.layerGroups;
                for (var i = groups.length - 1; i >= 0; i--) {
                    if (groups[i].id === id) {
                        var removed = groups.removeLayer(id);
                        if (removed) {
                            break;
                        }
                    }
                }
            },

            // TODO move encode and decode to model prototype so they're accessible to all models

            /**
             * Helper function. Encodes data to base64 format
             *
             * @method encode64
             * @param {Object} data
             * @return {String} encoded data
             */
            encode64: function (data) {
                //http://phpjs.org/functions/base64_encode/
                // http://kevin.vanzonneveld.net
                // +   original by: Tyler Akins (http://rumkin.com)
                // +   improved by: Bayron Guevara
                // +   improved by: Thunder.m
                // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                // +   bugfixed by: Pellentesque Malesuada
                // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                // +   improved by: Rafał Kukawski (http://kukawski.pl)
                // *     example 1: base64_encode('Kevin van Zonneveld');
                // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
                // mozilla has this native
                // - but breaks in 2.0.0.12!
                //if (typeof this.window['btoa'] == 'function') {
                //    return btoa(data);
                //}
                var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
                    ac = 0,
                    enc = "",
                    tmp_arr = [];

                if (!data) {
                    return data;
                }

                do { // pack three octets into four hexets
                    o1 = data.charCodeAt(i++);
                    o2 = data.charCodeAt(i++);
                    o3 = data.charCodeAt(i++);

                    bits = o1 << 16 | o2 << 8 | o3;

                    h1 = bits >> 18 & 0x3f;
                    h2 = bits >> 12 & 0x3f;
                    h3 = bits >> 6 & 0x3f;
                    h4 = bits & 0x3f;

                    // use hexets to index into b64, and append result to encoded string
                    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
                } while (i < data.length);

                enc = tmp_arr.join('');

                var r = data.length % 3;

                return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);

            },

            /**
             * Helper function. Decodes data from base64 format
             *
             * @method decode64
             * @param {Object} data (in base64 format)
             * @return {String} decoded data
             */
            decode64: function (data) {
                //http://phpjs.org/functions/base64_encode/
                // http://kevin.vanzonneveld.net
                // +   original by: Tyler Akins (http://rumkin.com)
                // +   improved by: Thunder.m
                // +      input by: Aman Gupta
                // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                // +   bugfixed by: Onno Marsman
                // +   bugfixed by: Pellentesque Malesuada
                // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                // +      input by: Brett Zamir (http://brett-zamir.me)
                // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                // *     example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
                // *     returns 1: 'Kevin van Zonneveld'
                // mozilla has this native
                // - but breaks in 2.0.0.12!
                //if (typeof this.window['atob'] == 'function') {
                //    return atob(data);
                //}
                var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
                    ac = 0,
                    dec = "",
                    tmp_arr = [];

                if (!data) {
                    return data;
                }

                data += '';

                do { // unpack four hexets into three octets using index points in b64
                    h1 = b64.indexOf(data.charAt(i++));
                    h2 = b64.indexOf(data.charAt(i++));
                    h3 = b64.indexOf(data.charAt(i++));
                    h4 = b64.indexOf(data.charAt(i++));

                    bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

                    o1 = bits >> 16 & 0xff;
                    o2 = bits >> 8 & 0xff;
                    o3 = bits & 0xff;

                    if (h3 == 64) {
                        tmp_arr[ac++] = String.fromCharCode(o1);
                    } else if (h4 == 64) {
                        tmp_arr[ac++] = String.fromCharCode(o1, o2);
                    } else {
                        tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
                    }
                } while (i < data.length) {
                    dec = tmp_arr.join('');
                    return dec;
                }
            }

        });
    });
}).call(this);