// polyfill for bind - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind -> polyfill
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}
// actual model - uses bind to make Oskari layer object functions call BackBone model.attributes
(function () {
    define(function () {
        return Backbone.Model.extend({

            // Ensure that each todo created has `title`.
            initialize: function (model) {
                // exted given object (layer) with this one
                if (model) {
                    for (var key in model) {
                        if(model[key] && typeof model[key] === 'function') {
                            var prop = model[key];
                            this[key] = prop.bind(this.attributes);
                        }
                    }
                }
                this._selectFirstStyle();
                this.supportedLanguages = Oskari.getSupportedLanguages();
                // setup backbone id so collections work
                this.id = model.getId();
            },
            /**
             * Selects the first style so legendImage will show initial value
             * @return {[type]} [description]
             */
            _selectFirstStyle : function() {
                var styles = this.getStyles();
                if(styles.length) {
                    this.selectStyle(styles[0].getName());
                }
            },
            /**
             * Sets the internal state for full capabilities response.
             * Call setupCapabilities with selected wmslayer to pick one layer def from the whole response after calling this.
             * @param  {Object} capabilities response from server
             */
            setCapabilitiesResponse: function (resp, skipSort) {
                if (!skipSort) {
                    this._sortCapabilities(resp);
                }
                this.set({
                    "capabilities": resp
                });
            },
            _sortCapabilities: function (capabilities) {
                var me = this,
                    sortFunction = me._getPropertyComparatorFor('title');
                capabilities.layers.sort(sortFunction);
                if(capabilities.groups) {
                    capabilities.groups.sort(sortFunction);
                    _.each(capabilities.groups, function (group) {
                        me._sortCapabilities(group);
                    });
                }
            },
            _getPropertyComparatorFor: function (property) {
                return function (a, b) {
                    if (a[property] > b[property]) {
                        return 1;
                    } else if (a[property] < b[property]) {
                        return -1;
                    }
                    return 0;
                };
            },
            /**
             * Internal method to set attributes based on given capabilities node.
             * @private
             * @param  {Object} capabilitiesNode
             */
            _setupFromCapabilitiesValues: function (capabilitiesNode) {
                var sb = Oskari.getSandbox();
                sb.printDebug("Found:", capabilitiesNode);
                var mapLayerService = sb.getService('Oskari.mapframework.service.MapLayerService'),
                    mapLayer = mapLayerService.createMapLayer(capabilitiesNode),
                    dataToKeep = null;
                // clear existing values
                var capabilities = this.get("capabilities");
                var adminBlock = this.get("_admin");

                var typeFunction = this._typeHandlers[mapLayer.getLayerType()];
                if(typeFunction) {
                    dataToKeep = typeFunction.apply(this);
                }
                this.clear({
                    silent: true
                });

                if(dataToKeep && typeFunction) {
                    typeFunction.apply(this, [dataToKeep, mapLayer]);
                }
                // move credentials for maplayer data
                if(adminBlock && mapLayer._admin) {
                    mapLayer._admin.username = adminBlock.username;
                    mapLayer._admin.password = adminBlock.password;
                }
                this.set(mapLayer, {
                    silent: true
                });

                this._selectFirstStyle();

                // this will trigger change so the previous can be done silently
                this.setCapabilitiesResponse(capabilities);
            },
            /**
             * Append wfsconfiguration to capabilities adminblock.
             * @param  {Object} GetWfsLayerconfiguration response from server
             */
            setWfsConfigurationResponse: function (resp) {
                var adminBlock = this.get("_admin");
                if(adminBlock) {
                    adminBlock.passtrough = resp;
                }
            },
            /**
             * Extra handling per layertype in format key=layertype, value is a function that takes params data and reference to the map layer.
             * Like "wmts" : function(data, mapLayer) {}
             * If data is not given assume getter, otherwise setup data.
             * @type {Object}
             */
            _typeHandlers : {
            },
            /**
             * Recursive function to search capabilities by layerName.
             * Recursion uses the second parameter internally, but it's optional.
             * If not set, it will be fetched from models attributes.
             * @param  {String} layerName      name to search for
             * @param  {Object} capabilities (optional capabilities object)
             * @param  {String} additionalId additional id used for searching (optional)
             * @param  {String} title used for  mapping capabilities because of duplicate layer names
             * @return {Boolean}             true if name was found
             */
            setupCapabilities: function (layerName, capabilities, additionalId, title) {
                if (!layerName) {
                    return;
                }
                var me = this;
                if (!capabilities) {
                    capabilities = this.get('capabilities');
                }
                // layer node
                // title is also used for matching because of duplicate layernames in capabilities
                if(title) {
                    if (capabilities.layerName === layerName && capabilities.title === title) {
                        if (!additionalId) {
                            me._setupFromCapabilitiesValues(capabilities);
                            return true;
                        } else if (capabilities.additionalId === additionalId) {
                            me._setupFromCapabilitiesValues(capabilities);
                            return true;
                        }
                    }
                }
                else {
                    if (capabilities.layerName === layerName) {
                        if (!additionalId) {
                            me._setupFromCapabilitiesValues(capabilities);
                            return true;
                        } else if (capabilities.additionalId === additionalId) {
                            me._setupFromCapabilitiesValues(capabilities);
                            return true;
                        }
                    }
                }
                // group node
                if (capabilities.self && capabilities.self.layerName === layerName) {
                    me._setupFromCapabilitiesValues(capabilities.self);
                    return true;
                }
                var found = false;

                // check layers directly under this
                _.each(capabilities.layers, function (layer) {
                    if (!found) {
                        found = me.setupCapabilities(layerName, layer, additionalId, title);
                    }
                });
                // if not found, check any groups under this
                if (!found && capabilities.groups) {
                    _.each(capabilities.groups, function (group) {
                        if (!found) {
                            found = me.setupCapabilities(layerName, group, additionalId);
                        }
                    });
                }
                return found;
            },


            /**
             * Returns XSLT if defined or null if not
             * @return {String} xslt
             */
            getGfiXslt: function () {
                var adminBlock = this.getAdmin();
                if (adminBlock) {
                    return adminBlock.xslt;
                }
                return null;
            },

            /**
             * Returns username if defined or null if not
             * @return {String} username
             */
            getUsername: function () {
                var adminBlock = this.getAdmin();
                if (adminBlock) {
                    return adminBlock.username;
                }
                return null;
            },

            /**
             * Returns password if defined or null if not
             * @return {String} password
             */
            getPassword: function () {
                var adminBlock = this.getAdmin();
                if (adminBlock) {
                    return adminBlock.password;
                }
                return null;
            },
            /**
             * Returns service version if defined or null if not
             * @return {String} version
             */
            getVersion: function () {
                var adminBlock = this.getAdmin();
                if (adminBlock) {
                    return adminBlock.version;
                }
                return null;
            },
            /**
             * Returns service  jobtype if defined or null if not
             * @return {String} jobtype
             */
            getJobType: function () {
                var adminBlock = this.getAdmin();
                if (adminBlock) {
                    return adminBlock.jobtype;
                }
                return null;
            },
            /**
             * Returns capabilities for layer JSON
             * @return {Object} capabilities
             */
            getCapabilities: function () {
                var adminBlock = this.getAdmin();
                if (adminBlock) {
                    return adminBlock.capabilities;
                }
                return null;
            },
            /**
             * Returns wfs service manual refresh mode
             * @return {Boolean} true/false
             */
            isManualRefresh: function () {
                var adminBlock = this.getAdmin();
                if (adminBlock) {
                    return adminBlock.manualRefresh;
                }
                return false;
            },
            /**
             * Returns wfs service resolveDepth param
             * @return {Boolean} true/false
             */
            isResolveDepth: function () {
                var adminBlock = this.getAdmin();
                if (adminBlock) {
                    return adminBlock.resolveDepth;
                }
                return false;
            },
            /**
             * Returns interface url
             * @return {String} url
             */
            getInterfaceUrl: function () {
                var adminBlock = this.getAdmin();
                if (adminBlock) {
                    return adminBlock.url;
                }
                return this.getLayerUrls().join();
            },

            /**
             * Returns organization or inspire id based on type
             * @param  {String} type ['organization' | 'inspire']
             * @return {Number} group id
             */
            getGroupId: function (type) {
                var adminBlock = this.getAdmin();
                if (adminBlock) {
                    // inspireId or organizationId
                    return adminBlock[type + 'Id'];
                }
                return null;
            },
            /**
             * Returns language codes for defined names
             * @return {String[]} language codes
             */
            getNameLanguages: function () {
                // TODO: maybe cache result?
                return this._getLanguages(this.get('_name'));
            },
            /**
             * Returns language codes for defined names
             * @return {String[]} language codes
             */
            getDescLanguages: function () {
                // TODO: maybe cache result?
                return this._getLanguages(this.get('_description'));
            },

            /**
             * Returns legend url
             * @returns {String} legend url
             */
            getLegendUrl: function() {
                var adminBlock = this.getAdmin();
                var capabilitiesBlock = this.getCapabilities();

                if (capabilitiesBlock && adminBlock) {
                        return adminBlock.legendImage;
                }

                return '';
            },
            /**
             * Returns style legend url
             * @param styleName  style name
             * @returns {String} legend url
             */
            getStyleLegendUrl: function (styleName) {
                var capabilitiesBlock = this.getCapabilities();


                if (capabilitiesBlock && styleName && capabilitiesBlock.styles) {
                        var selectedStyle = jQuery.grep(capabilitiesBlock.styles || [], function (style) {
                            return style.name === styleName;
                        });

                        if (selectedStyle.length > 0) {
                            return selectedStyle[0].legend;
                        }
                }

                return '';
            },
            /**
             * Returns style legend urls
             * @returns {String} legend url
             */
            getStyleLegendUrls: function () {
                var capabilitiesBlock = this.getCapabilities(),
                    styleName,
                    legends = [];

                if (capabilitiesBlock && this.getStyles()) {
                    for (i = 0; i < this.getStyles().length; i += 1) {
                        styleName = this.getStyles()[i].getName();

                        if (styleName && capabilitiesBlock.styles) {
                            var selectedStyle = jQuery.grep(capabilitiesBlock.styles || [], function (style) {
                                return style.name === styleName;
                            });

                            if (selectedStyle.length > 0) {
                                legends.push( selectedStyle[0].legend);
                            }
                        }
                    }
                }

                return legends;
            },

            /**
             * Returns defined language codes or default language if not set
             * @method  _getLanguages
             * @param {String/Object} attribute to use for calculation
             * @return {String[]} [description]
             * @private
             */
            _getLanguages: function (attr) {
                var langList = [];
                // add languages from possible object value
                if (attr && typeof attr === 'object') {
                    for (var key in attr) {
                        if(attr.hasOwnProperty(key)) {
                            langList.push(key);
                        }
                    }
                }

                // add any missing languages
                _.each(this.supportedLanguages, function (lang) {
                    if (jQuery.inArray(lang, langList) === -1) {
                        langList.push(lang);
                    }
                });

                return langList;
            }
        });
    });
}).call(this);
