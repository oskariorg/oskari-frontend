/**
 * @class Oskari.framework.bundle.hierarchical-layerlist.LayerlistExtenderService
 */
(function (Oskari) {
    var _log = Oskari.log('HierarchicalLayerlist.LayerlistExtenderService');

    Oskari.clazz.define('Oskari.framework.bundle.hierarchical-layerlist.LayerlistExtenderService',

        /**
         * @method create called automatically on construction
         * @static
         */
        function () {
            var me = this;
            this.sb = Oskari.getSandbox();
            /* Default options for jsTree */
            this._jsTreeOptions = {
                core: {
                    check_callback: true,
                    themes: {
                        variant: 'large'
                    },
                    dblclick_toggle: false
                },
                checkbox: {
                    keep_selected_style: false
                },
                types: {
                    group: {
                        icon: 'jstree-group-icon',
                        valid_children: ['layer', 'subgroup', 'subgroup-subgroup']
                    },
                    subgroup: {
                        icon: 'jstree-group-icon',
                        valid_children: ['layer', 'subgroup', 'subgroup-subgroup']
                    },
                    'subgroup-subgroup': {
                        icon: 'jstree-group-icon',
                        valid_children: ['layer']
                    },
                    layer: {
                        icon: 'jstree-layer-icon',
                        valid_children: []
                    }
                },
                search: {
                    show_only_matches: true,
                    show_only_matches_children: true,
                    close_opened_onclear: true,
                    search_callback: function (text, node) {
                        if (node.type == 'layer') {
                            var searchText = text.toLowerCase();
                            var nodeText = jQuery(node.text).find('.layer-title').text().toLowerCase();

                            var layerId = node.a_attr['data-layer-id'];
                            var dataProvider = me.sb.findMapLayerFromAllAvailable(layerId).getOrganizationName().toLowerCase();
                            // check also dataprovider name
                            return (nodeText.indexOf(searchText) !== -1 || dataProvider.indexOf(searchText) !== -1);
                        }
                        return false;
                    }
                },
                state: {
                    key: 'hierarchical-layerlist'
                },
                conditionalselect: function (node, event) {
                    me.trigger('conditional.select', {
                        node: node,
                        event: event
                    });
                },
                plugins: ['checkbox', 'changed', 'wholerow', 'types', 'search', 'state', 'conditionalselect']
            };
            this._events = [{
                name: 'search.jstree',
                handler: function (nodes, str, res) {
                    me.trigger('search', {
                        nodes: nodes,
                        str: str,
                        res: res
                    });
                }
            }, {
                name: 'clear_search.jstree',
                handler: function (nodes, str, res) {
                    me.trigger('search.clear', {
                        nodes: nodes,
                        str: str,
                        res: res
                    });
                }
            }];
            this._mainTools = {};
            this._groupTools = {};
            this._subgroupTools = {};
            this._subgroupSubgroupTools = {};
            this._layerTools = {};
            this._showEmptyGroups = false;

            // attach on, off, trigger functions
            Oskari.makeObservable(this);
        }, {
            __name: 'HierarchicalLayerlist.LayerlistExtenderService',
            __qname: 'Oskari.framework.bundle.hierarchical-layerlist.LayerlistExtenderService',

            /*******************************************************************************************************************************
            /* PUBLIC METHODS
            *******************************************************************************************************************************/

            getQName: function () {
                return this.__qname;
            },
            getName: function () {
                return this.__name;
            },
            getSandbox: function () {
                return this.sandbox;
            },
            /**
             * Get layerlist jsTree options
             * @method getLayerlistOption
             * @param  {String}                 key layerlist option id, if not defined then return all.
             * @return {Object|String|Boolean}  option value
             */
            getLayerlistOption: function (key) {
                if (!key) {
                    return this._jsTreeOptions;
                }
                return this._jsTreeOptions[key];
            },
            /**
             * Add jsTree layerlist option
             * @method addLayerlistOption, for example allow draggin etc.
             * @param  {String}                 key     option key
             * @param  {Object|String|Boolean}  value   option value
             * @param {Boolean}                 notTriggerEvent not trigger event when tru, defaults false
             */
            addLayerlistOption: function (key, value, notTriggerEvent) {
                this._jsTreeOptions[key] = value;
                if (!notTriggerEvent) {
                    this.trigger('option.added', {
                        key: key,
                        value: value
                    });
                }
            },

            /**
             * Get main tool.
             * @method getMainTool
             * @param  {String}    id if defined return tool id corresponding tool, if not defeined return all maintools.
             * @return {Object}    wanted main tool or all main tools
             */
            getMainTool: function (id) {
                if (!id) {
                    return this._mainTools;
                }
                return this._mainTools[id];
            },
            /**
             * Add layerlist maintool (top row tools)
             * @method addMainTool
             * @param  {String}    id      tool unique id
             * @param  {Function}  handler tool handler
             * @param  {Object}    options tool options:
             *                             {
             *                                 cls: 'active-cls',
             *                                 tooltip: 'Tool tooltip'
             *                             }
             *
             */
            addMainTool: function (id, handler, options) {
                if (this._mainTools[id]) {
                    _log.warn('Main tool "' + id + '" allready defined.');
                    return;
                }
                if (typeof handler !== 'function') {
                    _log.warn('Main tool "' + id + '" has no any handler, not added.');
                    return;
                }

                this._mainTools[id] = {
                    handler: function (tool) {
                        handler(tool, id);
                    },
                    options: options
                };
                this.trigger('maintool.added', {
                    id: id,
                    handler: handler,
                    options: options
                });
            },
            /**
             * Get event handlers
             * @method getEventHandler
             * @param  {String}        eventName event name
             * @return {Array}         if eventName not defeined then return all events, other return all wanted event name handlers
             */
            getEventHandler: function (eventName) {
                var me = this;
                if (!eventName) {
                    return me._events;
                }
                return jQuery.grep(me._events, function (name) {
                    return name === eventName;
                });
            },
            /**
             * Add event handler
             * @method addEventHandler
             * @param  {String}        eventName event name
             * @param  {function}      handler   event handler
             */
            addEventHandler: function (eventName, handler) {
                var obj = {
                    name: name,
                    handler: handler
                };
                this._events.push(obj);
                this.trigger('event.added', obj);
            },
            /**
             * Get group tool(s)
             * @method getGroupTool
             * @param  {String}     id group tool id
             * @return {Object}     wanted group tool
             */
            getGroupTool: function (id) {
                if (!id) {
                    return this._groupTools;
                }
                if (this._groupTools[id]) {
                    return this._groupTools[id];
                }
                return null;
            },
            /**
             * Add group tool
             * @method addGroupTool
             * @param  {String}     id         group tool id
             * @param  {Function}   handler    tool handler
             * @param  {Object}     options    group tool options:
             *                                 {
             *                                     cls: 'active-cls'
             *                                 }
             */
            addGroupTool: function (id, handler, options) {
                if (this._groupTools[id]) {
                    _log.warn('Group tool "' + id + '" allready defined.');
                    return;
                }
                if (typeof handler !== 'function') {
                    _log.warn('Group tool "' + id + '" has no any handler, not added.');
                    return;
                }

                this._groupTools[id] = {
                    handler: handler,
                    options: options
                };

                this.trigger('grouptool.added', {
                    id: id,
                    handler: handler,
                    options: options
                });
            },
            /**
             * Get subgroup tool(s)
             * @method getSubgroupTool
             * @param  {String}     id subgroup tool id
             * @return {Object}     wanted subgroup tool
             */
            getSubgroupTool: function (id) {
                if (!id) {
                    return this._subgroupTools;
                }
                if (this._subgroupTools[id]) {
                    return this._subgroupTools[id];
                }
                return null;
            },
            /**
             * Add subgroup tool
             * @method addSubgroupTool
             * @param  {String}     id         subgroup tool id
             * @param  {Function}   handler    tool handler
             * @param  {Object}     options    subgroup tool options:
             *                                 {
             *                                     cls: 'active-cls'
             *                                 }
             */
            addSubgroupTool: function (id, handler, options) {
                if (this._subgroupTools[id]) {
                    _log.warn('Subgroup tool "' + id + '" allready defined.');
                    return;
                }
                if (typeof handler !== 'function') {
                    _log.warn('Subgroup tool "' + id + '" has no any handler, not added.');
                    return;
                }

                this._subgroupTools[id] = {
                    handler: handler,
                    options: options
                };

                this.trigger('subgrouptool.added', {
                    id: id,
                    handler: handler,
                    options: options
                });
            },

            /**
             * Get subgroup subgroup tool(s)
             * @method getSubgroupSubgroupTool
             * @param  {String}     id subgroup tool id
             * @return {Object}     wanted subgroup tool
             */
            getSubgroupSubgroupTool: function (id) {
                if (!id) {
                    return this._subgroupSubgroupTools;
                }
                if (this._subgroupSubgroupTools[id]) {
                    return this._subgroupSubgroupTools[id];
                }
                return null;
            },
            /**
             * Add subgroup subgroup tool
             * @method addSubgroupSubgroupTool
             * @param  {String}     id         subgroup tool id
             * @param  {Function}   handler    tool handler
             * @param  {Object}     options    subgroup subgroup tool options:
             *                                 {
             *                                     cls: 'active-cls'
             *                                 }
             */
            addSubgroupSubgroupTool: function (id, handler, options) {
                if (this._subgroupSubgroupTools[id]) {
                    _log.warn('Subgroup subgroup tool "' + id + '" allready defined.');
                    return;
                }
                if (typeof handler !== 'function') {
                    _log.warn('Subgroup subgroup tool "' + id + '" has no any handler, not added.');
                    return;
                }

                this._subgroupSubgroupTools[id] = {
                    handler: handler,
                    options: options
                };

                this.trigger('subgroupsubgrouptool.added', {
                    id: id,
                    handler: handler,
                    options: options
                });
            },

            /**
             * Get layer tool.
             * @method getLayerTool
             * @param  {String}    id if defined return tool id corresponding tool, if not defeined return all layer tools.
             * @return {Object}    wanted layer tool or all layer tools
             */
            getLayerTool: function (id) {
                if (!id) {
                    return this._layerTools;
                }
                return this._layerTools[id];
            },
            /**
             * Add layer tool
             * @method addLayerTool
             * @param  {String}     id      layer tool id
             * @param  {Function}   handler layer tool handler
             * @param  {Object}     options layer tool options:
             *                                 {
             *                                     cls: 'active-cls'
             *                                 }
             */
            addLayerTool: function (id, handler, options) {
                if (this._layerTools[id]) {
                    _log.warn('Layer tool "' + id + '" allready defined.');
                    return;
                }
                if (typeof handler !== 'function') {
                    _log.warn('Layer tool "' + id + '" has no any handler, not added.');
                    return;
                }

                this._layerTools[id] = {
                    handler: handler,
                    options: options
                };
                this.trigger('layertool.added', {
                    id: id,
                    handler: handler,
                    options: options
                });
            },
            /**
             * Sets show empty groups
             * @method showEmptyGroups
             * @param  {Boolean} show empty groups
             */
            showEmptyGroups: function (showEmptyGroups) {
                this._showEmptyGroups = showEmptyGroups;
                this.trigger('show.empty.groups', this._showEmptyGroups);
            },
            /**
             * Is empty groups visible
             * @method hasEmptyGroupsVisible
             * @return {Boolean} show empty groups
             */
            hasEmptyGroupsVisible: function () {
                return this._showEmptyGroups;
            }

        }, {
            'protocol': ['Oskari.mapframework.service.Service']
        });
}(Oskari));
