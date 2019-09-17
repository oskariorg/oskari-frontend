/**
 * @class Oskari.framework.bundle.hierarchical-layerlist.view.LayerGroupTab
 *
 *
 */
Oskari.clazz.define(
    'Oskari.framework.bundle.hierarchical-layerlist.view.LayerGroupTab',
    /**
     * @method create called automatically on construction
     * @static
     */
    function (instance, title, id) {
        this.instance = instance;
        this.service = this.instance.layerlistExtenderService;
        this.title = title;
        this.id = id;
        this.layerGroups = [];
        this.showSearchSuggestions = (instance.conf && instance.conf.showSearchSuggestions === true);
        this.sb = this.instance.getSandbox();
        this.localization = this.instance.getLocalization();
        this._notifierService = this.sb.getService('Oskari.framework.bundle.hierarchical-layerlist.OskariEventNotifierService');
        this._mapLayerService = this.sb.getService('Oskari.mapframework.service.MapLayerService');
        this.templates = {
            spinner: jQuery('<span class="spinner-text"></span>'),
            descriptionAndMainTools: jQuery('<div class="description-and-tools"><div class="field-description"></div><div class="main-tools"></div><div class="clear"></div></div>'),
            mainTool: jQuery('<div class="main-tool"></div>'),
            groupTool: jQuery('<div class="group-tool"></div>'),
            subgroupTool: jQuery('<div class="subgroup-tool"></div>'),
            subgroupSubgroupTool: jQuery('<div class="subgroup-subgroup-tool"></div>'),
            layerTool: jQuery('<div class="layer-tool"></div>'),
            description: jQuery('<div>' +
                '  <h4 class="indicator-msg-popup"></h4>' +
                '  <p></p>' +
                '</div>'),
            relatedKeywords: jQuery('<div class="related-keywords"></div>'),
            keywordsTitle: jQuery('<div class="keywords-title"></div>'),
            keywordContainer: jQuery('<a href="#"class="keyword-cont">' +
                '  <span class="keyword"></span>' +
                '</a>'),
            keywordType: jQuery('<div class="type"></div>'),
            layerFilter: jQuery('<div class="layer-filter hierarchical-layerlist-layer-filter">' +
                '</div><div style="clear:both;"></div>'),
            layerTree: jQuery('<div class="hierarchical-layerlist-tree"></div>'),
            noSearchResults: jQuery('<div class="hierarchical-layerlist-search-noresults"></div>'),
            layerContainer: jQuery('<span class="layer">' +
                '<span class="layer-tools">' +
                '   <span class="layer-backendstatus-icon backendstatus-unknown" title=""></span>' +
                '   <span class="layer-icon"></span>' +
                '   <span class="layer-info"></span>' +
                '</span>' +
                '<span class="layer-title"></span>' +
                '</span>')
        };
        this._createUI(id);
        this._bindExtenderServiceListeners();
        this._bindOskariEvents();
    }, {
        /*******************************************************************************************************************************
        /* PRIVATE METHODS
        *******************************************************************************************************************************/

        /**
         * Bind extender service event listeners
         * @method  _bindExtenderServiceListeners
         * @private
         */
        _bindExtenderServiceListeners: function () {
            var me = this;

            // Main tool added
            me.service.on('maintool.added', function (data) {
                var tool = me.templates.mainTool.clone();
                tool.attr('data-id', data.id);
                tool.attr('title', data.options.tooltip);
                tool.addClass(data.options.cls);

                tool.on('click', function (evt) {
                    evt.stopPropagation();
                    tool.addClass('active');
                    data.handler(tool);
                });
                me.getFilterField().getField().find('.main-tools').append(tool);
            });

            // Group tool added
            me.service.on('grouptool.added', function (data) {
                me._addGroupTools();
            });

            // Subgroup tool added
            me.service.on('subgrouptool.added', function (data) {
                me._addSubgroupTools();
            });

            // Subgroup tool added
            me.service.on('subgroupsubgrouptool.added', function (data) {
                me._addSubgroupSubgroupTools();
            });

            // Layer tool added
            me.service.on('layertool.added', function (data) {
                me._addLayerTools();
            });

            // conditional select changed
            me.service.on('conditional.select', function (data) {
                me.selectNodeFromTree(data.node, data.event);
            });

            me.service.on('order.changed', function (data) {
                if (!data.ajax) {
                    me._updateAllTools();
                }
            });

            me.service.on('search', function (data) {
                // if nothing results found then hide jstree and show no results text
                if (data.str.res.length == 0) {
                    me.getJsTreeElement().hide();
                    me.setNoResultMessageVisible(true);
                } else {
                    me.getJsTreeElement().show();
                    me.setNoResultMessageVisible(false);
                }
            });

            me.service.on('search.clear', function () {
                me.setNoResultMessageVisible(false);
            });
        },

        /**
         * Update layer counts and groups visibility
         *
         * @method  _updateLayerCountsAndGroupsVisibility
         * @param   {Booelan}           search is search
         * @private
         */
        _updateLayerCountsAndGroupsVisibility: function (search) {
            var me = this;
            var jstree = me.getJsTreeElement().jstree(true);

            var getNodesByType = function (type, childrens) {
                var nodes = childrens || jstree.get_json('#', { flat: true });
                return nodes.filter(function (node) {
                    return node.type === type;
                });
            };

            var calculateLayerCounts = function (node) {
                var getLayersCount = function (group) {
                    var node = jstree.get_node(group.id);
                    var count = {
                        visible: 0,
                        all: 0
                    };

                    node.children.forEach(function (child) {
                        var childNode = jstree.get_node(child);
                        if (childNode.type === 'layer' && childNode.state.hidden === false) {
                            count.visible++;
                        }

                        if (childNode.type === 'layer') {
                            count.all++;
                        }
                        if (childNode.type !== 'layer') {
                            var subCount = getLayersCount(childNode);
                            count.visible += subCount.visible;
                            count.all += subCount.all;
                        }
                    });

                    return count;
                };

                return getLayersCount(node);
            };

            var updateLayerCounts = function (type) {
                var groups = getNodesByType(type);
                groups.forEach(function (groupNode) {
                    var count = calculateLayerCounts(groupNode);
                    var node = jstree.get_node(groupNode);
                    if ((count.all === 0 && !me.service.hasEmptyGroupsVisible()) || node.state.hidden) {
                        jstree.hide_node(groupNode);
                    } else {
                        jstree.show_node(groupNode);
                    }
                    var nodeText = jstree.get_text(groupNode);
                    var el = jQuery('<div>' + nodeText + '</div>');
                    if (!search) {
                        el.find('.layer-count').html('(' + count.all + ')');
                    } else {
                        el.find('.layer-count').html('(' + count.visible + '/' + count.all + ')');
                    }
                    nodeText = el.html();
                    jstree.rename_node(groupNode, nodeText);
                });
            };

            updateLayerCounts('group');
            updateLayerCounts('subgroup');
            updateLayerCounts('subgroup-subgroup');
        },

        /**
         * Update all tools
         * @method  _updateAllTools
         * @private
         */
        _updateAllTools: function () {
            var me = this;
            // ugly timeout, need remove in future
            // wait at js tree is rendered
            clearTimeout(me.toolsTimeout);
            me.toolsTimeout = setTimeout(function () {
                me._addGroupTools();
                me._addSubgroupTools();
                me._addSubgroupSubgroupTools();
                me._addLayerTools();
            }, 200);
        },
        /**
         * Add group tools
         * @method  _addGroupTools
         * @param {Object} element jquery element, if not defined find all group-tools
         * @private
         */
        _addGroupTools: function (element) {
            var me = this;
            var el = element || me.getJsTreeElement();
            var groupTools = el.find('.group-tools');
            groupTools.empty();
            Object.keys(me.service.getGroupTool()).forEach(function (key) {
                var grouptool = me.service.getGroupTool(key);
                var tool = me.templates.groupTool.clone();
                tool.attr('data-id', key);
                tool.attr('title', grouptool.options.tooltip);
                tool.addClass(grouptool.options.cls);

                tool.on('click', function (evt) {
                    evt.stopPropagation();
                    jQuery(this).addClass('active');
                    var parent = jQuery(this).parents('a.jstree-anchor');
                    var groupId = parent.attr('data-group-id');
                    grouptool.handler(jQuery(this), groupId);
                });
                groupTools.append(tool);
            });
        },
        /**
         * Add subgroup tools
         * @method  _addSubgroupTools
         * @param {Object} element jquery element, if not defined find all subgroup-tools
         * @private
         */
        _addSubgroupTools: function (element) {
            var me = this;
            var el = element || me.getJsTreeElement();
            var subgroupTools = el.find('.subgroup-tools');
            subgroupTools.empty();
            Object.keys(me.service.getSubgroupTool()).forEach(function (key) {
                var subgrouptool = me.service.getSubgroupTool(key);
                var tool = me.templates.subgroupTool.clone();
                tool.attr('data-id', key);
                tool.attr('title', subgrouptool.options.tooltip);
                tool.addClass(subgrouptool.options.cls);

                tool.on('click', function (evt) {
                    evt.stopPropagation();
                    jQuery(this).addClass('active');
                    var parent = jQuery(this).parents('a.jstree-anchor');
                    var groupId = parent.attr('data-group-id');
                    var parentGroupId = parent.attr('data-parent-group-id');
                    subgrouptool.handler(jQuery(this), groupId, parentGroupId);
                });
                subgroupTools.append(tool);
            });
        },
        /**
         * Add subgroup subgroup tools
         * @method  _addSubgroupSubgroupTools
         * @param {Object} element jquery element, if not defined find all subgroup-tools
         * @private
         */
        _addSubgroupSubgroupTools: function (element) {
            var me = this;
            var el = element || me.getJsTreeElement();
            var subgroupSubgroupTools = el.find('.subgroup-subgroup-tools');
            subgroupSubgroupTools.empty();
            Object.keys(me.service.getSubgroupSubgroupTool()).forEach(function (key) {
                var subgrouptool = me.service.getSubgroupSubgroupTool(key);
                var tool = me.templates.subgroupSubgroupTool.clone();
                tool.attr('data-id', key);
                tool.attr('title', subgrouptool.options.tooltip);
                tool.addClass(subgrouptool.options.cls);

                tool.on('click', function (evt) {
                    evt.stopPropagation();
                    jQuery(this).addClass('active');
                    var parent = jQuery(this).parents('a.jstree-anchor');
                    var groupId = parent.attr('data-group-id');
                    var parentGroupId = parent.attr('data-parent-group-id');
                    subgrouptool.handler(jQuery(this), groupId, parentGroupId);
                });
                subgroupSubgroupTools.append(tool);
            });
        },
        /**
         * Add layer tools
         * @method  _addLayerTools
         * @param {Object} element jquery element, if not defined find all layer-tools
         * @private
         */
        _addLayerTools: function (element) {
            var me = this;
            var el = element || me.getJsTreeElement();
            var layerTools = el.find('span.layer-tools');
            layerTools.find('.layer-tool').remove();
            Object.keys(me.service.getLayerTool()).forEach(function (key) {
                var layertool = me.service.getLayerTool(key);
                var tool = me.templates.layerTool.clone();
                tool.attr('data-id', key);
                tool.attr('title', layertool.options.tooltip);
                tool.addClass(layertool.options.cls);

                tool.on('click', function (evt) {
                    evt.stopPropagation();
                    jQuery(this).addClass('active');
                    var parent = jQuery(this).parents('a.jstree-anchor');
                    var groupId = parent.attr('data-group-id');
                    var layerId = parent.attr('data-layer-id');
                    layertool.handler(jQuery(this), groupId, layerId);
                });
                layerTools.append(tool);
            });
        },
        /**
         * Get JStree
         * @method  _getJsTreeObject
         * @param   {String}         text   node text
         * @param   {String}         type   node type (group|layer)
         * @param   {Object}         opts   extra options
         * @return  {Object}                Jstree node conf
         * @private
         */
        _getJsTreeObject: function (text, type, opts, children, tools) {
            var jstreeObject = {
                text: text + '<div class="' + type + '-tools"></div>',
                type: type,
                children: children
            };

            if (tools === false) {
                jstreeObject.text = text;
            }

            // layer has already defined tools, so remove extra div
            if (type === 'layer') {
                jstreeObject.text = text;
            }

            jQuery.extend(true, jstreeObject, opts || {});
            return jstreeObject;
        },
        /**
         * @method _createInfoIcon
         * @private
         * @param {Object} input
         *      container for the icon
         * Creates info icon for given oskarifield
         */
        _createInfoIcon: function (oskarifield) {
            // "use strict";
            var me = this,
                infoIcon = jQuery('<div class="icon-info"></div>'),
                indicatorCont = oskarifield.find('.field-description');
            // clear previous indicator
            indicatorCont.find('.icon-info').remove();
            // append this indicator
            indicatorCont.append(infoIcon);
            // show metadata
            infoIcon.on('click', function () {
                var desc = me.templates.description.clone(),
                    dialog = Oskari.clazz.create(
                        'Oskari.userinterface.component.Popup'
                    ),
                    okBtn = Oskari.clazz.create(
                        'Oskari.userinterface.component.buttons.OkButton'
                    );

                desc.find('p').text(me.instance.getLocalization('filter').description);
                okBtn.addClass('primary');
                okBtn.setHandler(function () {
                    dialog.close(true);
                });
                dialog.show(me.instance.getLocalization('filter').text, desc, [okBtn]);
            });
        },
        /**
         * Create UI
         * @method  @private _createUI
         *
         * @param  {String} oskarifieldId oskari field id
         */
        _createUI: function (oskarifieldId) {
            var me = this,
                oskarifield,
                layerFilter;

            me.tabPanel = Oskari.clazz.create(
                'Oskari.userinterface.component.TabPanel');
            me.tabPanel.setTitle(me.title, me.id);

            oskarifield = me.getFilterField().getField();

            if (me.showSearchSuggestions) {
                oskarifield.append(
                    me.templates.spinner.clone()
                        .text(me.instance.getLocalization('loading'))
                );

                oskarifield.append(
                    me.templates.relatedKeywords.clone()
                );
            }
            var descriptionAndMainTools = me.templates.descriptionAndMainTools.clone();
            descriptionAndMainTools.find('.field-description').text(me.instance.getLocalization('filter').shortDescription);
            oskarifield.append(descriptionAndMainTools);

            me._createInfoIcon(oskarifield);

            if (!(this.instance.conf && this.instance.conf.hideLayerFilters && this.instance.conf.hideLayerFilters === true)) {
                layerFilter = me.templates.layerFilter.clone();
                me.tabPanel.getContainer().append(layerFilter);
            }

            me.tabPanel.getContainer().append(oskarifield);
            oskarifield.find('.spinner-text').hide();

            // add id to search input
            oskarifield.find('input').attr(
                'id',
                'oskari_hierarchical-layerlist_search_input_tab_' + oskarifieldId
            );

            me.accordion = Oskari.clazz.create(
                'Oskari.userinterface.component.Accordion'
            );
            me.accordion.insertTo(me.tabPanel.getContainer());
        },

        /**
         * Show layer metadata
         * @method  _showLayerMetaData
         * @param   {Object}           layer oskari layer
         * @private
         */
        _showLayerMetaData: function (layer) {
            var me = this,
                rn = 'catalogue.ShowMetadataRequest',
                uuid = layer.getMetadataIdentifier(),
                additionalUuids = [],
                additionalUuidsCheck = {},
                subLayers = layer.getSubLayers(),
                subUuid;
            additionalUuidsCheck[uuid] = true;
            if (subLayers && subLayers.length > 0) {
                for (var s = 0; s < subLayers.length; s += 1) {
                    subUuid = subLayers[s].getMetadataIdentifier();
                    if (subUuid && subUuid !== '' && !additionalUuidsCheck[subUuid]) {
                        additionalUuidsCheck[subUuid] = true;
                        additionalUuids.push({
                            uuid: subUuid
                        });
                    }
                }
            }
            me.sb.postRequestByName(rn, [{
                uuid: uuid
            },
            additionalUuids
            ]);
        },
        /**
         * Show maplayer backend status
         * @method  _showMapLayerBackendStatus
         * @param   {Object}          layer Oskari layer
         * @private
         */
        _showMapLayerBackendStatus: function (layer) {
            var me = this,
                mapLayerId = layer.getId();
            me.sb.postRequestByName('ShowMapLayerInfoRequest', [
                mapLayerId
            ]);
        },
        /**
         * Get jstree node real id
         * @method  _getNodeRealId
         * @param   {Object}       node jstree node
         * @return  {String}       node id
         * @private
         */
        _getNodeRealId: function (node) {
            return node.a_attr['data-layer-id'];
        },
        /**
         * @method _createLayerContainer
         * @private
         * Creates the layer containers
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer to render
         */
        _createLayerContainer: function (layer) {
            var me = this,
                // create from layer template
                // (was clone-from-template but template was only used once so there was some overhead)
                layerDiv = this.templates.layerContainer.clone(),
                tooltips = me.instance.getLocalization('tooltip'),
                tools = jQuery(layerDiv).find('span.layer-tools'),
                icon = tools.find('span.layer-icon'),
                subLayers,
                s,
                subUuid,
                elBackendStatus,
                layerInfo,
                subLmeta;

            icon.addClass(layer.getIconClassname());

            if (layer.isBaseLayer()) {
                icon.attr('title', tooltips['type-base']);
            } else if (layer.isLayerOfType('WMS')) {
                icon.attr('title', tooltips['type-wms']);
            } else if (layer.isLayerOfType('WMTS')) {
                icon.attr('title', tooltips['type-wms']);
            } else if (layer.isLayerOfType('WFS')) {
                if (layer.isManualRefresh()) {
                    icon.attr('title', tooltips['type-wfs-manual']);
                } else {
                    icon.attr('title', tooltips['type-wfs']);
                }
            } else if (layer.isLayerOfType('VECTOR')) {
                icon.attr('title', tooltips['type-wms']);
            }

            if (!layer.getMetadataIdentifier()) {
                subLayers = layer.getSubLayers();
                subLmeta = false;
                if (subLayers && subLayers.length > 0) {
                    subLmeta = true;
                    for (s = 0; s < subLayers.length; s += 1) {
                        subUuid = subLayers[s].getMetadataIdentifier();
                        if (!subUuid || subUuid === '') {
                            subLmeta = false;
                            break;
                        }
                    }
                }
            }
            if (layer.getMetadataIdentifier() || subLmeta) {
                layerInfo = tools.find('span.layer-info');
                layerInfo.addClass('icon-info');
            }

            // setup id
            layerDiv.attr('layer_id', layer.getId());
            layerDiv.find('.layer-title').append(layer.getName());

            /*
             * backend status
             */
            elBackendStatus = tools.find('.layer-backendstatus-icon');

            var backendStatus = layer.getBackendStatus();
            if (backendStatus) {
                var iconClass = me.instance.getLocalization('backendStatus')[backendStatus] ? me.instance.getLocalization('backendStatus')[backendStatus].iconClass : null;
                var tooltip = me.instance.getLocalization('backendStatus')[backendStatus] ? me.instance.getLocalization('backendStatus')[backendStatus].tooltip : null;
                if (iconClass) {
                    elBackendStatus.removeClass('backendstatus-unknown');
                    elBackendStatus.addClass(iconClass);
                    elBackendStatus.attr('title', tooltip);
                }
            }

            return layerDiv;
        },

        /**
         * Update container height
         * @method  _updateContainerHeight
         * @param   {Integer}               height map heigt
         * @private
         */
        _updateContainerHeight: function (height) {
            var me = this;
            me.getJsTreeElement().css('max-height', (height * 0.5) + 'px');
        },

        /**
         * Bind Oskari events
         * @method  _bindOskariEvents
         * @private
         */
        _bindOskariEvents: function () {
            var me = this;

            me._notifierService.on('AfterMapLayerAddEvent', function (evt) {
                var layer = evt.getMapLayer();
                me._toggleLayerCheckboxes(layer.getId(), true);
            });

            me._notifierService.on('AfterMapLayerRemoveEvent', function (evt) {
                var layer = evt.getMapLayer();
                me._toggleLayerCheckboxes(layer.getId(), false);
            });

            me._notifierService.on('MapSizeChangedEvent', function (evt) {
                me._updateContainerHeight(evt.getHeight());
            });
        },

        /**
         * Toggle layer checkboxes
         * @method  _toggleLayerCheckboxes
         * @param   {String}         layerId layer id
         * @param   {Boolean}         checked need layer checked
         * @private
         */
        _toggleLayerCheckboxes: function (layerId, checked) {
            var me = this;
            var layers = [];
            var modelData = me.getJsTreeElement().jstree(true)._model.data;
            Object.keys(modelData).forEach(function (key) {
                var node = modelData[key];
                if (node.type === 'layer' && node.a_attr['data-layer-id'] === layerId) {
                    layers.push(node.id);
                }
            });
            if (checked) {
                me.getJsTreeElement().jstree().check_node(layers);
            } else {
                me.getJsTreeElement().jstree().uncheck_node(layers);
            }
        },

        /*******************************************************************************************************************************
        /* PUBLIC METHODS
        *******************************************************************************************************************************/
        /**
         * Get title
         * @method getTitle
         * @return {Strin} title
         */
        getTitle: function () {
            return this.title;
        },

        /**
         * Get tab panel
         * @method getTabPanel
         * @return {Object}    tab panel
         */
        getTabPanel: function () {
            return this.tabPanel;
        },

        /**
         * Get state
         * @method getState
         * @return {Object} state
         */
        getState: function () {
            var state = {
                tab: this.getTitle(),
                filter: this.filterField.getValue()
            };
            return state;
        },

        /**
         * Set state
         * @method setState
         * @param  {Object} state state
         */
        setState: function (state) {
            // "use strict";
            if (!state) {
                return;
            }

            if (!state.filter) {
                this.filterField.setValue(state.filter);
            }
        },

        /**
         * @public @method focus
         * Focuses the panel's search field (if available)
         *
         *
         */
        focus: function () {
            this.getFilterField().getField().find('input').focus();
        },

        /**
         * Get filter field
         * @method  @public getFilterField
         *
         * @return {Oskari.userinterface.component.FormInput} field
         */
        getFilterField: function () {
            var me = this,
                field,
                timer = 0;
            if (me.filterField) {
                return me.filterField;
            }
            field = Oskari.clazz.create(
                'Oskari.userinterface.component.FormInput');
            field.setPlaceholder(me.instance.getLocalization('filter').text);
            field.addClearButton();

            field.bindChange(function (event) {
                event.stopPropagation(); // JUST BECAUSE TEST ENVIRONMENT FAILS
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(function () {
                    me.getJsTreeElement().jstree(true).search(field.getValue());
                    timer = null;
                }, 300);
            }, true);

            me.filterField = field;
            return field;
        },

        /**
         * Select node from tree
         * @method selectNodeFromTree
         * @param  {Object}           node  jstree node
         * @param  {Object}           event event
         */
        selectNodeFromTree: function (node, event) {
            var me = this;
            var tree = jQuery(event.delegateTarget);
            var isChecked = tree.jstree().is_checked(node);
            var target = jQuery(event.target);
            var nodeChildren = node.children_d;

            var layersChecked = [];
            nodeChildren.forEach(function (nodeId) {
                var node = tree.jstree().get_node(nodeId);
                if (node.type === 'layer') {
                    layersChecked.push(node.a_attr['data-layer-id']);
                }
            });

            if (node.type.indexOf('group') > -1 && !jQuery(event.target).hasClass('jstree-checkbox')) {
                return;
            }

            var layerId = null;

            var allSelectedLayers = me.sb.findAllSelectedMapLayers();
            var allSelectedLayersLength = allSelectedLayers.length;
            var desc = me.templates.description.clone();
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var okBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.OkButton');
            var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.CancelButton');

            switch (node.type) {
            case 'layer':
                // Need open backend status
                if (target.hasClass('layer-backendstatus-icon')) {
                    me._showMapLayerBackendStatus(me.sb.findMapLayerFromAllAvailable(me._getNodeRealId(node)));
                }
                // Need open metadata
                else if (target.hasClass('layer-info')) {
                    me._showLayerMetaData(me.sb.findMapLayerFromAllAvailable(me._getNodeRealId(node)));
                }
                // uncheck nodes
                else if (isChecked) {
                    tree.jstree().uncheck_node(node);

                    layerId = me._getNodeRealId(node);
                    if (me.sb.isLayerAlreadySelected(layerId)) {
                        me.sb.postRequestByName('RemoveMapLayerRequest', [layerId]);
                    }

                    if (me.instance._selectedLayerGroupId[layerId]) {
                        delete me.instance._selectedLayerGroupId[layerId];
                    }
                }
                // check nodes
                else {
                    if (allSelectedLayersLength > 10) {
                        desc.find('p').text(me.instance.getLocalization('manyLayersWarning').text);
                        okBtn.addClass('primary');
                        okBtn.setHandler(function () {
                            dialog.close(true);
                            tree.jstree().check_node(node);
                            var layerId = me._getNodeRealId(node);
                            if (!me.sb.isLayerAlreadySelected(layerId)) {
                                me.sb.postRequestByName('AddMapLayerRequest', [layerId]);
                            }
                        });
                        cancelBtn.addClass('secondary');
                        cancelBtn.setHandler(function () {
                            dialog.close(true);
                        });
                        dialog.show(me.instance.getLocalization('manyLayersWarning').title, desc, [okBtn, cancelBtn]);
                    } else {
                        tree.jstree().check_node(node);
                        layerId = me._getNodeRealId(node);
                        if (!me.sb.isLayerAlreadySelected(layerId)) {
                            me.sb.postRequestByName('AddMapLayerRequest', [layerId]);
                        }
                    }

                    if (!me.instance._selectedLayerGroupId[layerId]) {
                        me.instance._selectedLayerGroupId[layerId] = node.a_attr['data-group-id'];
                    }
                }
                break;
            case 'subgroup-subgroup':
            case 'subgroup':
            case 'group':
                if (isChecked) {
                    tree.jstree().uncheck_node(node);
                    layersChecked.forEach(function (layerId) {
                        if (me.sb.isLayerAlreadySelected(layerId)) {
                            me.sb.postRequestByName('RemoveMapLayerRequest', [layerId]);
                        }
                    });
                } else {
                    // If there are already 10 or more layers on the map show a warning to the user when adding more layers.
                    // selected layers

                    if ((layersChecked.length > 10 || allSelectedLayersLength >= 10)) {
                        var text = me.instance.getLocalization('manyLayersWarning').text;
                        if (allSelectedLayersLength >= 10) {
                            text = me.instance.getLocalization('manyLayersWarningAlready').text;
                        }

                        desc.find('p').text(text);
                        okBtn.addClass('primary');
                        okBtn.setHandler(function () {
                            dialog.close(true);
                            tree.jstree().open_node(node);
                            tree.jstree().check_node(node);
                            layersChecked.forEach(function (layerId) {
                                if (!me.sb.isLayerAlreadySelected(layerId)) {
                                    me.sb.postRequestByName('AddMapLayerRequest', [layerId]);
                                }
                            });
                        });
                        cancelBtn.addClass('secondary');
                        cancelBtn.setHandler(function () {
                            dialog.close(true);
                        });
                        dialog.show(me.instance.getLocalization('manyLayersWarning').title, desc, [okBtn, cancelBtn]);
                    } else {
                        tree.jstree().open_node(node);
                        tree.jstree().check_node(node);
                        layersChecked.forEach(function (layerId) {
                            if (!me.sb.isLayerAlreadySelected(layerId)) {
                                me.sb.postRequestByName('AddMapLayerRequest', [layerId]);
                            }
                        });
                    }
                }
                break;
            }
        },
        /**
         * Get jstree jQuery element
         * @method getJsTreeElement
         * @return {Object}       jQuery element
         */
        getJsTreeElement: function () {
            return this.tabPanel.getContainer().find('.hierarchical-layerlist-tree');
        },

        /**
         * Show layer groups
         * @method  @public showLayerGroups
         *
         * @param  {Array} groups
         */
        showLayerGroups: function (groups) {
            var me = this,
                jsTreeData = [];

            if (me.getJsTreeElement().length > 0) {
                me.getJsTreeElement().remove();
            }
            var layerTree = me.templates.layerTree.clone();

            var getLayerConf = function (layer, group) {
                if (layer) {
                    var opts = {
                        a_attr: {
                            'data-group-id': group.getId(),
                            'data-layer-id': layer.getId(),
                            'data-tools-visible': (typeof group.isToolsVisible === 'function') ? group.isToolsVisible() : true
                        }
                    };

                    return me._getJsTreeObject(jQuery('<span/>').append(me._createLayerContainer(layer).clone()).html(),
                        'layer',
                        opts);
                }
                return null;
            };

            var getSubgroupConf = function (maplayerGroup, parentGroup, groupPrefix) {
                if (maplayerGroup) {
                    var subgroupChildren = [];

                    var opts = {
                        a_attr: {
                            class: (!maplayerGroup.hasSelectable()) ? 'no-checkbox' : '',
                            'data-group-id': maplayerGroup.getId(),
                            'data-parent-group-id': parentGroup.getId()
                        }
                    };

                    addChildren(maplayerGroup, subgroupChildren, groupPrefix + 'subgroup-');

                    return me._getJsTreeObject(Oskari.getLocalized(maplayerGroup.getName()) + ' <span class="layer-count"></span>',
                        groupPrefix + 'subgroup',
                        opts, subgroupChildren);
                }
                return null;
            };

            me.tabPanel.getContainer().append(layerTree);

            if (me.tabPanel.getContainer().find('.hierarchical-layerlist-search-noresults').length === 0) {
                var noSearchResults = me.templates.noSearchResults.clone();
                noSearchResults.html(me.instance.getLocalization('errors.noResults')).hide();
                me.tabPanel.getContainer().append(noSearchResults);
                me.setNoResultMessageVisible(false);
            }

            me.layerGroups = groups;

            var addChildren = function (group, groupChildren, groupPrefix) {
                var childrens = group.getChildren();
                childrens.forEach(function (children) {
                    if (children.type === 'layer') {
                        var layerConf = getLayerConf(me.sb.findMapLayerFromAllAvailable(children.id), group);
                        if (layerConf) {
                            groupChildren.push(layerConf);
                        }
                    } else {
                        var groupConf = getSubgroupConf(me._mapLayerService.getAllLayerGroups(children.id), group, groupPrefix);
                        if (groupConf) {
                            groupChildren.push(groupConf);
                        }
                    }
                });
            };

            groups.forEach(function (group) {
                var groupChildren = [];

                var extraOpts = {
                    a_attr: {
                        'data-group-id': group.getId()
                    }
                };
                // Create root group
                if (!group.hasSelectable()) {
                    extraOpts.a_attr.class = 'no-checkbox';
                }

                addChildren(group, groupChildren, '');

                var groupObject = me._getJsTreeObject(group.getTitle() + ' <span class="layer-count"></span>',
                    'group', extraOpts, groupChildren, group.isToolsVisible());

                jsTreeData.push(groupObject);
            });

            var jsTreeDiv = me.getJsTreeElement();

            me.service.getEventHandler().forEach(function (event) {
                jsTreeDiv.on(event.name, event.handler);
            });

            jsTreeDiv.jstree(me.service.getLayerlistOption());
            jsTreeDiv.jstree(true).settings.core.data = jsTreeData;
            jsTreeDiv.jstree(true).refresh();

            me._updateContainerHeight(jQuery('#mapdiv').height());

            // check selected layers
            me.sb.findAllSelectedMapLayers().forEach(function (layer) {
                me._toggleLayerCheckboxes(layer.getId(), true);
            });

            // JStree is ready
            me.getJsTreeElement().on('ready.jstree', function () {
                me._updateLayerCountsAndGroupsVisibility(false);
                me._addGroupTools();
                me._addSubgroupTools();
            });

            // When open node then updata tools also
            me.getJsTreeElement().on('open_node.jstree', function () {
                me._addSubgroupTools();
                me._addSubgroupSubgroupTools();
                me._addLayerTools();

                // check selected layers
                me.sb.findAllSelectedMapLayers().forEach(function (layer) {
                    me._toggleLayerCheckboxes(layer.getId(), true);
                });
            });

            me.getJsTreeElement().on('redraw.jstree', function () {
                me._updateAllTools();
                me._updateLayerCountsAndGroupsVisibility(true);
            });

            // Add click handler for toggle groups open/close state
            me.getJsTreeElement().on('click', function (evt) {
                if (!jQuery(evt.target).hasClass('jstree-checkbox') && !jQuery(evt.target).hasClass('jstree-ocl')) {
                    me.getJsTreeElement().jstree(true).toggle_node(evt.target);
                }
            });
        },

        /**
         * Set no result message visible
         * @method setNoResultMessageVisible
         * @param  {Boolean}                  visible has message visible
         */
        setNoResultMessageVisible: function (visible) {
            var me = this;
            var noResultsElement = me.tabPanel.getContainer().find('.hierarchical-layerlist-search-noresults');
            if (!visible) {
                noResultsElement.hide();
                return;
            }
            noResultsElement.show();
        },

        /**
         * @method clearRelatedKeywordsPopup
         * @private
         * @param {String} keyword
         *      keyword to filter layers by
         * @param {Object} oskarifield
         *      dom object to be cleared
         * Clears related keywords popup
         */
        clearRelatedKeywordsPopup: function (keyword, oskarifield) {
            // clear only if sent keyword has changed or it is not null
            if (this.sentKeyword && this.sentKeyword !== keyword) {
                oskarifield.find('.related-keywords').html('').hide();
            }
        }
    }
);
