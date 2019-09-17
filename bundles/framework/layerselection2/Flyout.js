/**
 * @class Oskari.mapframework.bundle.layerselection2.Flyout
 *
 * Renders the "selected layers" flyout.
 *
 * To-do: (critical) replace create/destroy div to show/hide div when modifiying tools
 * for shown layers
 * To-do: fix some method naming issues  (f.ex. layer footer is in a dual role)
 */
Oskari.clazz.define('Oskari.mapframework.bundle.layerselection2.Flyout',

    /**
     * @static @method create called automatically on construction
     *
     * @param
     * {Oskari.mapframework.bundle.layerselection2.LayerSelectionBundleInstance}
     * instance
     * Reference to component that created the tile
     *
     */
    function (instance) {
        this.instance = instance;
        this.container = null;
        this.state = null;
        this.template = null;
        this.templateLayer = null;
        this.templateLayerTools = null;
        this.templateLayerOutOfScale = null;
        this.templateLayerOutOfContentArea = null;
        this.sortableBinded = false;
        this._sliders = {};
        this.toolsAsText = ['ownStyle', 'objectData', 'content-editor'];
        this.blacklistedTools = ['show-layer-legend-tool'];
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.mapframework.bundle.layerselection2.Flyout';
        },

        /**
         * @public @method setEl
         * Interface method implementation
         *
         * @param {Object} el
         * Reference to the container in browser
         * @param {Number} width
         * Container size(?) - not used
         * @param {Number} height
         * Container size(?) - not used
         *
         */
        setEl: function (el, width, height) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('layerselection2')) {
                jQuery(this.container).addClass('layerselection2');
            }
        },

        /**
         * @public @method startPlugin
         * Interface method implementation, assigns the HTML templates
         * that will be used to create the UI
         *
         *
         */
        startPlugin: function () {
            var loc = this.instance.getLocalization('layer'),
                elParent,
                elId;
            // sortable class/data-sortable are configs for rightJS
            // sortable component
            this.template = jQuery('<ul class="selectedLayersList sortable" ' + 'data-sortable=\'{' + 'itemCss: "li.layer.selected", ' + 'handleCss: "div.layer-title" ' + '}\'></ul>');

            this.templateLayer = jQuery('<li class="layerselection2 layer selected">' + '<div class="layer-info">' + '<div class="layer-icon"></div>' + '<div class="layer-tool-remove"></div>' + '<div class="layer-tool-refresh"></div>' + '<div class="layer-title"><h4></h4>' + '</div>' + '</div>' + '<div class="stylesel">' + '<label for="style">' + loc.style + '</label>' + '<select name="style"></select></div>' + '<div class="layer-tools volatile">' + '</div>' + '</li>');

            // footers are changed based on layer state
            this.templateLayerFooterTools = jQuery('<div class="right-tools">' + '<div class="layer-rights"></div>' + '<div class="object-data"></div>' + '<div class="layer-description">' + '</div>' + '<div class="layer-filter"></div>' + '</div>' + '<div class="left-tools">' + '<div class="layer-visibility">' + '<a href="JavaScript:void(0);">' + loc.hide + '</a>' + '&nbsp;' + '<span class="temphidden" ' + 'style="display: none;">' + loc.hidden + '</span>' + '</div>' + '<div class="oskariui layer-opacity">' + '<div class="layout-slider">' + '</div> ' + '<div class="opacity-slider" style="display:inline-block">' + '<input type="text" />%</div>' + '</div>' + '</div>');

            this.templateLayerFooterHidden = jQuery('<p class="layer-msg">' + '<a href="JavaScript:void(0);">' + loc.show + '</a> ' + loc.hidden + '</p>');

            this.templateLayerFooterOutOfScale = jQuery('<p class="layer-msg">' + loc['out-of-scale'] + ' <a href="JavaScript:void(0);">' + loc['move-to-scale'] + '</a></p>');

            this.templateLayerFooterOutOfContentArea = jQuery('<p class="layer-msg">' + loc['out-of-content-area'] + ' <a href="JavaScript:void(0);">' + loc['move-to-content-area'] + '</a></p>');

            this.templateUnsupported = jQuery('<div class="layer-footer-unsupported">' + loc['unsupported-projection'] + '</div>');

            this.templateChangeUnsupported = jQuery('<div class="layer-footer-unsupported">' + loc['unsupported-projection'] + '<br><a href="JavaScript:void(0);">' + loc['change-projection'] + '</a></div>');

            // set id to flyouttool-close
            elParent = this.container.parentElement.parentElement;
            elId = jQuery(elParent).find('.oskari-flyouttoolbar').find('.oskari-flyouttools').find('.oskari-flyouttool-close');
            elId.attr('id', 'oskari_layerselection2_flyout_oskari_flyouttool_close');
        },

        /**
         * @public @method stopPlugin
         * Interface method implementation, does nothing atm
         *
         *
         */
        stopPlugin: function () {

        },

        /**
         * @public @method getTitle
         *
         *
         * @return {String} localized text for the title of the flyout
         */
        getTitle: function () {
            return this.instance.getLocalization('title');
        },

        /**
         * @public @method getDescription
         *
         *
         * @return {String} localized text for the description of the flyout.
         */
        getDescription: function () {
            return this.instance.getLocalization('desc');
        },

        /**
         * @public @method getOptions
         * Interface method implementation, does nothing atm
         *
         *
         */
        getOptions: function () {

        },

        /**
         * @public @method setState
         * Interface method implementation, does nothing atm
         *
         * @param {Object} state
         * State that this component should use
         *
         */
        setState: function (state) {
            this.state = state;
        },

        /**
         * @public @method createUi
         * Creates the UI for a fresh start
         *
         *
         */
        createUi: function () {
            var me = this,
                sandbox = me.instance.getSandbox(),
                n,
                layer,
                layerContainer,
                layers = sandbox.findAllSelectedMapLayers(),
                listContainer = me.template.clone(),
                celOriginal = jQuery(me.container),
                scale = sandbox.getMap().getScale();

            celOriginal.empty();
            celOriginal.append(listContainer);
            for (n = layers.length - 1; n >= 0; n -= 1) {
                layer = layers[n];
                layerContainer = me._createLayerContainer(layer);
                listContainer.append(layerContainer);

                // footer tools
                me._appendLayerFooter(layerContainer, layer, layer.isInScale(scale), true);
            }
            listContainer.sortable({
                start: function (event, ui) {
                    var height = ui.item.height();
                    me.calculateContainerHeightDuringSort(height);
                },
                stop: function (event, ui) {
                    me.calculateContainerHeightDuringSort();
                    me._layerOrderChanged(ui.item);
                }
            });

            // this blocks user inputs/selections in FF and Opera
            /* listContainer.disableSelection(); */

            // RIGHTJS sortable event handling
            // TODO: get rid of sortableBinded and UNBIND?
            if (!me.sortableBinded) {
                me.sortableBinded = true;
                /* RightJS('.selectedLayersList').on('finish', function (event) {
                 me._layerOrderChanged(event.index);
                 }); */
            }
        },
        calculateContainerHeightDuringSort: function (height) {
            var container = jQuery(this.container);
            if (typeof height === 'undefined') {
                container.css({
                    height: ''
                });
            }
            var totalHeight = container.height() + height;
            container.css({
                height: totalHeight
            });
        },
        /**
         * @private @method _appendLayerFooter
         *
         * @param {jQuery} layerDiv
         * @param {Object} layer
         * @param {Boolean} isInScale
         * @param {Boolean} isGeometryMatch
         *
         */
        _appendLayerFooter: function (layerDiv, layer, isInScale, isGeometryMatch) {
            var toolsDiv = layerDiv.find('div.layer-tools');

            var footer;
            if (!layer.isSupported(this.instance.getSandbox().getMap().getSrsName())) {
                footer = this._createUnsupportedFooter();
            } else {
                /* fix: we need this at anytime for slider to work */
                footer = this._createLayerFooter(layer, layerDiv);

                if (!layer.isVisible()) {
                    toolsDiv.addClass('hidden-layer');
                    footer.css('display', 'none');
                    toolsDiv.append(this._createLayerFooterHidden(layer));
                } else if (!isInScale) {
                    var oosFtr = this._createLayerFooterOutOfScale(layer);
                    toolsDiv.addClass('out-of-scale');
                    footer.css('display', 'none');
                    toolsDiv.append(oosFtr);
                } else if (!isGeometryMatch) {
                    var oocaFtr = this._createLayerFooterOutOfContentArea(layer);
                    toolsDiv.addClass('out-of-content');
                    footer.css('display', 'none');
                    toolsDiv.append(oocaFtr);
                } else {
                    footer.css('display', '');
                }
            }

            toolsDiv.append(footer);

            var opa = layerDiv.find('div.layer-opacity div.opacity-slider input');
            this._addSlider(layer, layerDiv, opa);
        },
        /**
         * @private
         * @method _createUnsupportedFooter create jQuery element for unsupported SRS footer
         */
        _createUnsupportedFooter: function () {
            var me = this;
            var sandbox = me.instance.getSandbox();
            var footer;

            if (sandbox.hasHandler('ShowProjectionChangerRequest')) {
                // show link to change projection
                footer = me.templateChangeUnsupported.clone();
                footer.find('a').on('click', function () {
                    // send request to show projection changer
                    var request = Oskari.requestBuilder('ShowProjectionChangerRequest')();
                    sandbox.request(me.instance.getName(), request);
                    return false;
                });
            } else {
                footer = me.templateUnsupported.clone();
            }

            return footer;
        },
        /**
         * @private @method _switchRefreshIcon
         * - not show refresh button, if layer is invisible or not in scale
         *
         * @param {jQuery} layerDiv
         * @param {Object} layer
         * @param {Boolean} isInScale
         *
         */
        _switchRefreshIcon: function (layerDiv, layer, isInScale) {
            var refreshDiv = layerDiv.find('div.layer-tool-refresh');

            if (!isInScale || !layer.isVisible()) {
                refreshDiv.css('display', 'none');
            } else {
                refreshDiv.css('display', '');
            }
        },

        /**
         * @private @method _addSlider
         *
         * @param {Object} layer
         * @param {jQuery} layerDiv
         * @param {jQuery} input
         *
         * @return {Object} slider
         */
        _addSlider: function (layer, layerDiv, input) {
            var me = this,
                lyrId = layer.getId(),
                opa = layer.getOpacity(),
                sliderEl = layerDiv.find('.layout-slider'),
                slider = sliderEl.slider({
                    min: 0,
                    max: 100,
                    value: opa,
                    /* change: function (event,ui) {
                     me._layerOpacityChanged(layer, ui.value);
                     }, */
                    slide: function (event, ui) {
                        me._layerOpacityChanged(layer, ui.value);
                    },
                    stop: function (event, ui) {
                        me._layerOpacityChanged(layer, ui.value);
                    }
                });

            me._sliders[lyrId] = slider;

            if (input) {
                input.attr('value', layer.getOpacity());
                input.on('change paste keyup', function () {
                    // sliderEl.slider('value', jQuery(this).val());
                    me._layerOpacityChanged(layer, jQuery(this).val());
                });
            }

            return slider;
        },

        /**
         * @private @method _layerOrderChanged
         * Notify Oskari that layer order should be changed
         *
         * @param {Number} newIndex index where the moved layer is now
         *
         */
        _layerOrderChanged: function (item) {
            var allNodes = jQuery(this.container).find('.selectedLayersList li.layerselection2'),
                movedId = item.attr('layer_id'),
                newIndex = -1;

            allNodes.each(function (index, el) {
                if (jQuery(this).attr('layer_id') === movedId) {
                    newIndex = index;
                    return false;
                }
                return true;
            });
            if (newIndex > -1) {
                // the layer order is reversed in presentation
                // the lowest layer has the highest index
                newIndex = (allNodes.length - 1) - newIndex;
                var sandbox = this.instance.getSandbox(),
                    reqName = 'RearrangeSelectedMapLayerRequest',
                    builder = Oskari.requestBuilder(reqName),
                    request = builder(movedId, newIndex);

                sandbox.request(this.instance.getName(), request);
            }
        },

        /**
         * @private @method _createLayerContainer
         * Creates the layer containers

         * @param
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
         * layer Layer to render
         * @param {jQuery} layerDiv
         *
         * @return {jQuery} reference to the created layer container
         */
        _updateStyles: function (layer, layerDiv) {
            var me = this,
                sandbox = me.instance.getSandbox(),
                stylesel = layerDiv.find('div.stylesel');

            stylesel.hide();

            if (layer.getStyles && layer.getStyles().length > 1) {
                var hasOpts = false,
                    styles = layer.getStyles(),
                    sel = stylesel.find('select'),
                    i,
                    opt;

                sel.empty();
                for (i = 0; i < styles.length; i += 1) {
                    opt = jQuery('<option value="' + styles[i].getName() + '">' + styles[i].getTitle() + '</option>');
                    sel.append(opt);
                    hasOpts = true;
                }
                if (!sel.hasClass('binded')) {
                    sel.on('change', function (e) {
                        var val = sel.find('option:selected').val();
                        layer.selectStyle(val);
                        var builder = Oskari.requestBuilder('ChangeMapLayerStyleRequest'),
                            req = builder(layer.getId(), val);
                        sandbox.request(me.instance.getName(), req);
                    });
                    sel.addClass('binded');
                }
                if (hasOpts) {
                    if (layer.getCurrentStyle()) {
                        sel.val(layer.getCurrentStyle().getName());
                    }
                    sel.trigger('change');
                    stylesel.show();
                }
            }
        },

        /**
         * @private @method _createLayerContainer
         * Creates the layer containers
         *
         * @param
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
         * layer Layer to render
         *
         * @return {jQuery} reference to the created layer container
         */
        _createLayerContainer: function (layer) {
            var me = this,
                sandbox = me.instance.getSandbox(),
                layerId = layer.getId(),
                layerDiv = this.templateLayer.clone(),
                tooltips = this.instance.getLocalization('layer').tooltip,
                icon = layerDiv.find('div.layer-icon'),
                loc = me.instance.getLocalization('layer');

            // setup id
            layerDiv.attr('layer_id', layerId);
            layerDiv.find('div.layer-title h4').append(layer.getName());
            layerDiv.find('div.layer-title').append(layer.getDescription());

            this._updateStyles(layer, layerDiv);

            // setup icon
            icon.addClass(layer.getIconClassname());

            if (layer.isBaseLayer()) {
                icon.attr('title', tooltips['type-base']);
                // tooltip = mapservice_basemap_image_tooltip
            } else if (layer.isLayerOfType('WMS')) {
                icon.attr('title', tooltips['type-wms']);
                // tooltip = mapservice_maplayer_image_tooltip
            }
            // FIXME: WMTS is an addition done by an outside bundle
            // so this shouldn't
            // be here
            // but since it would require some refactoring to make
            // this general
            // I'll just leave this like it was on old implementation
            else if (layer.isLayerOfType('WMTS')) {
                icon.attr('title', tooltips['type-wms']);
                // icon.attr('title',
                //           'mapservice_maplayer_image_tooltip');
            } else if (layer.isLayerOfType('WFS')) {
                icon.attr('title', tooltips['type-wfs']);
                // tooltip = selected_layers_module_wfs_icon_tooltip
            } else if (layer.isLayerOfType('VECTOR')) {
                icon.attr('title', tooltips['type-wms']);
                // tooltip = mapservice_maplayer_image_tooltip
            }

            // remove layer from selected tool
            if (!layer.isSticky()) {
                layerDiv.find('div.layer-tool-remove').addClass('icon-close');
                layerDiv.find('.layer-tool-remove').attr(
                    'id',
                    'oskari_layerselection_layercontainer_icon_close_layerId' + layerId
                );

                layerDiv.find('div.layer-tool-remove').on(
                    'click',
                    function () {
                        var reqName = 'RemoveMapLayerRequest',
                            builder = Oskari.requestBuilder(reqName),
                            request = builder(layer.getId());

                        sandbox.request(me.instance.getName(), request);
                    }
                );
            }
            // manual refresh/reload for wfs layer
            if (layer.hasFeatureData() && layer.isManualRefresh()) {
                layerDiv.find('div.layer-tool-refresh').addClass('refresh');
                layerDiv.find('.layer-tool-refresh').attr(
                    'id',
                    'oskari_layerselection_layercontainer_icon_refresh_layerId' + layerId
                );
                layerDiv.find('.layer-tool-refresh').attr('title', loc.refresh_load.tooltip);
                layerDiv.find('div.layer-tool-refresh').on(
                    'click',
                    function () {
                        sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me.instance, 'detach']);
                        var event = Oskari.eventBuilder('WFSRefreshManualLoadLayersEvent')(layerId);
                        sandbox.notifyAll(event);
                        return false;
                    }
                );
            }

            return layerDiv;
        },

        /**
         * @public @method handleLayerOrderChanged
         *
         * @param {Object} layer
         * @param {Number} fromPosition
         * @param {Number} toPosition
         *
         */
        handleLayerOrderChanged: function (layer, fromPosition, toPosition) {
            if (!layer) {
                throw new Error('handleLayerOrderChanged: No layer provided');
            }
            if (isNaN(fromPosition)) {
                throw new Error('handleLayerOrderChanged: fromPosition is Not a Number: ' + fromPosition);
            }
            if (isNaN(toPosition)) {
                throw new Error('handleLayerOrderChanged: toPosition is Not a Number: ' + toPosition);
            }

            if (fromPosition === toPosition) {
                // Layer wasn't actually moved, ignore
                return;
            }

            // Layer order is inverted in the DOM.
            // Also note that from- and toPosition are 0-based, where nth-child
            // based, so we just subtract position from layer count
            var me = this,
                layerContainer = jQuery(me.container).find('ul.selectedLayersList'),
                layerCount = layerContainer.find('> li').length,
                fromIndex = layerCount - fromPosition, // Order is inverted
                toIndex = layerCount - toPosition,
                el = layerContainer.find('> li:nth-child(' + fromIndex + ')').detach();

            if (toIndex === 1) {
                // First element, just add to the beginning
                layerContainer.prepend(el);
            } else if (toIndex === layerCount) {
                // Last element, just add to the end
                layerContainer.append(el);
            } else {
                // Somewhere in the middle, add before index
                // This would fail on toIndex === layerCount as we've removed one element,
                // but that case is handled above
                layerContainer.find('> li:nth-child(' + toIndex + ')').before(el);
            }
        },

        /**
         * @public @method handleLayerVisibilityChanged
         * Changes the container representing the layer by f.ex "dimming" it and
         * changing the footer to match current layer status.
         *
         * @param
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
         * layer Layer to modify
         * @param {Boolean} isInScale true if map is in layers scale range
         * @param {Boolean} isGeometryMatch true if layers geometry is in map
         * viewport
         *
         */
        handleLayerVisibilityChanged: function (layer, isInScale, isGeometryMatch) {
            var lyrSel = 'li.layerselection2.layer.selected[layer_id=' + layer.getId() + ']',
                layerDiv = jQuery(this.container).find(lyrSel),
                footer = layerDiv.find('div.layer-tools'); // teardown previous footer & layer state classes

            footer.empty();

            layerDiv.removeClass('hidden-layer');
            layerDiv.removeClass('out-of-scale');
            layerDiv.removeClass('out-of-content');

            this._sliders[layer.getId()] = null;

            this._appendLayerFooter(layerDiv, layer, isInScale, isGeometryMatch);

            this._switchRefreshIcon(layerDiv, layer, isInScale);
        },

        /**
         * @private @method _layerOpacityChanged
         * Handles slider/input field for opacity on this flyout/internally
         *
         * @param
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
         * layer Layer that had its opacity changed
         * @param {Number} newOpacity Layer's new opacity
         *
         */
        _layerOpacityChanged: function (layer, newOpacity) {
            var sandbox = this.instance.getSandbox(),
                reqName = 'ChangeMapLayerOpacityRequest',
                requestBuilder = Oskari.requestBuilder(reqName),
                request = requestBuilder(layer.getId(), newOpacity);

            sandbox.request(this.instance.getName(), request);
            this._changeOpacityInput(layer);
        },

        /**
         * @private @method _changeOpacityInput
         * Changes the opacity input field's value.
         *
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
         * layer Layer under the opacity change
         *
         */
        _changeOpacityInput: function (layer) {
            var lyrSel = 'li.layerselection2.layer.selected[layer_id=' + layer.getId() + ']',
                layerDiv = jQuery(this.container).find(lyrSel),
                opa = layerDiv.find('div.layer-opacity div.opacity-slider input'),
                slider = layerDiv.find('.layout-slider');

            opa.attr('value', layer.getOpacity());
            slider.slider('value', layer.getOpacity());
        },

        /**
         * @private @method handleLayerOpacityChanged
         * Handles slider/input field for opacity value change when it is changed
         * externally
         *
         * @param
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
         * layer Layer that had its opacity changed
         *
         */
        handleLayerOpacityChanged: function (layer) {
            if (this._sliders[layer.getId()]) {
                this._sliders[layer.getId()].slider('value', layer.getOpacity());
                this._changeOpacityInput(layer);
            }
        },

        /**
         * @private @method handleLayerStyleChanged
         * Handles style dropdown change when it is changed externally
         *
         * @param
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
         * layer Layer that had its style changed
         *
         */
        handleLayerStyleChanged: function (layer) {
            var lyrSel = 'li.layer.selected[layer_id=' + layer.getId() + ']',
                layerDiv = jQuery(this.container).find(lyrSel),
                styleDropdown = layerDiv.find('div.stylesel select');
            styleDropdown.val(layer.getCurrentStyle().getName());
        },

        /**
         * @private @method _createLayerFooterOutOfScale
         * Creates an out-of-scale footer for the given layer
         *
         * @param
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
         * layer Layer
         *
         * @return {jQuery} reference to the created footer
         */
        _createLayerFooterOutOfScale: function (layer) {
            var me = this,
                sandbox = me.instance.getSandbox(),
                msg = this.templateLayerFooterOutOfScale.clone(),
                reqName = 'MapModulePlugin.MapMoveByLayerContentRequest',
                requestBuilder = Oskari.requestBuilder(reqName);

            msg.addClass('layer-msg-for-outofscale');
            msg.find('a').on('click', function () {
                // send request to show map layer
                var request = requestBuilder(layer.getId());
                sandbox.request(me.instance.getName(), request);
                return false;
            });
            return msg;
        },

        /**
         * @private @method _createLayerFooterHidden
         * Creates footer for the given invisible layer
         *
         * @param
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
         * layer Layer
         *
         * @return {jQuery} reference to the created footer
         */
        _createLayerFooterHidden: function (layer) {
            var me = this,
                sandbox = me.instance.getSandbox(),
                msg = this.templateLayerFooterHidden.clone(),
                reqName = 'MapModulePlugin.MapLayerVisibilityRequest',
                visibilityRequestBuilder = Oskari.requestBuilder(reqName);

            msg.addClass('layer-msg-for-hidden');
            msg.find('a').on('click', function () {
                // send request to show map layer
                var request = visibilityRequestBuilder(layer.getId(), true);
                sandbox.request(me.instance.getName(), request);
                return false;
            });
            return msg;
        },

        /**
         * @private @method _createLayerFooterOutOfContentArea
         * Creates an out-of-contentarea footer for the given layer
         *
         * @param
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
         * layer Layer
         *
         * @return {jQuery} reference to the created footer
         */
        _createLayerFooterOutOfContentArea: function (layer) {
            var me = this,
                sandbox = me.instance.getSandbox(),
                msg = this.templateLayerFooterOutOfContentArea.clone(),
                reqName = 'MapModulePlugin.MapMoveByLayerContentRequest',
                requestBuilder = Oskari.requestBuilder(reqName);

            msg.addClass('layer-msg-for-outofcontentarea');
            msg.find('a').on('click', function () {
                // send request to show map layer
                var request = requestBuilder(layer.getId());
                sandbox.request(me.instance.getName(), request);
                return false;
            });
            return msg;
        },

        /**
         * @private @method _createLayerFooter
         * Creates a footer for the given layer with the usual tools (opacity etc)
         *
         * @param
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
         * layer Layer
         *
         * @return {jQuery} reference to the created footer
         */
        _createLayerFooter: function (layer) {
            var me = this,
                sandbox = me.instance.getSandbox(),
                tools = this.templateLayerFooterTools.clone(), // layer footer
                visReqName = 'MapModulePlugin.MapLayerVisibilityRequest',
                visibilityRequestBuilder = Oskari.requestBuilder(visReqName),
                s;

            // Sticky layers can't be hidden
            if (layer.isSticky()) {
                tools.find('div.layer-visibility').hide();
            }

            tools.find('div.layer-visibility a').on('click', function () {
                // send request to hide map layer
                var request = visibilityRequestBuilder(layer.getId(), false);
                sandbox.request(me.instance.getName(), request);
                return false;
            });

            var closureMagic = function (tool) {
                return function () {
                    tool.getCallback()();
                    return false;
                };
            };

            // Footer functions
            var laytools = layer.getTools(),
                laytool,
                toolContainer;

            for (s = 0; s < laytools.length; s += 1) {
                laytool = laytools[s];
                if (laytool && me.blacklistedTools.indexOf(laytool.getName()) === -1) {
                    // Icon or text link
                    if (laytool.getIconCls() && me.toolsAsText.indexOf(laytool.getName()) === -1) {
                        toolContainer = jQuery('<div></div>');
                        toolContainer.addClass(laytool.getIconCls());
                        toolContainer.attr('title', laytool.getTooltip());
                        tools.find('div.object-data').append(toolContainer);
                        toolContainer.on('click', closureMagic(laytool));
                    } else {
                        toolContainer = jQuery('<a href="JavaScript:void(0);"></a>');
                        toolContainer.append(laytool.getTitle());
                        tools.find('div.object-data').append(toolContainer);
                        toolContainer.on('click', closureMagic(laytool));
                    }
                }
            }

            // publish permissions
            this._updatePublishPermissionText(layer, tools);

            return tools;
        },

        /**
         * @private @method _updatePublishPermissionText
         *
         * @param {Object} layer
         * @param {jQuery} footer
         *
         */
        _updatePublishPermissionText: function (layer, footer) {
            var loc = this.instance.getLocalization('layer'),
                publishPermission = layer.getPermission('publish');

            if (publishPermission === 'publication_permission_ok' && Oskari.user().isLoggedIn()) {
                footer.find('div.layer-rights').html(
                    loc.rights.can_be_published_map_user.label
                );
                footer.find('div.layer-rights').attr(
                    'title',
                    loc.rights.can_be_published_map_user.tooltip
                );
            }
        },
        /**
         * @method handleLayerSelectionChanged
         * If isSelected is false, removes the matching layer container from the UI.
         * If isSelected is true, constructs a matching layer container and adds it
         * to the UI.
         *
         * @param
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
         * layer Layer that was changed
         * @param {Boolean} isSelected
         * True if layer is selected, false if removed from selection
         * @param {Boolean} keepLayersOrder
         * True to ignore baselayer placement
         */
        handleLayerSelectionChanged: function (layer, isSelected, keepLayersOrder) {
            // add layer
            if (isSelected) {
                var me = this,
                    sandbox = me.instance.getSandbox(),
                    scale = sandbox.getMap().getScale(),
                    listContainer = jQuery('ul.selectedLayersList'),
                    layerContainer = this._createLayerContainer(layer),
                    previousLayers = [];

                // insert to top
                if (layer.isBaseLayer() && !keepLayersOrder) {
                    // find all baselayers == layers whose id starts with 'base_'
                    previousLayers = listContainer.find('li.layerselection2[layer_id^=base_]');
                } else {
                    previousLayers = listContainer.find('.layerselection2.layer.selected');
                }

                if (previousLayers.length > 0) {
                    // without first(), adds before each layer
                    if (layer.isBaseLayer() && !keepLayersOrder) {
                        previousLayers.last().after(layerContainer);
                    } else {
                        previousLayers.first().before(layerContainer);
                    }
                } else {
                    listContainer.append(layerContainer);
                }

                this._appendLayerFooter(layerContainer, layer, layer.isInScale(scale), true);
            }
            // remove layer
            else {
                var layerDiv = jQuery(this.container).find('li.layerselection2[layer_id=' + layer.getId() + ']');

                if (layerDiv) {
                    this._sliders[layer.getId()] = null;
                    layerDiv.remove();
                }
            }
        },

        /**
         * @method handleLayerModified
         * Updates the name for the given layer in the UI
         *
         * @param
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
         * layer Layer that was modified
         *
         */
        handleLayerModified: function (layer) {
            var newDiv,
                me = this,
                layerDiv = jQuery(me.container).find('li.layerselection2[layer_id=' + layer.getId() + ']'),
                scale = this.instance.getSandbox().getMap().getScale();

            newDiv = this._createLayerContainer(layer);
            layerDiv.replaceWith(newDiv);
            me._appendLayerFooter(newDiv, layer, layer.isInScale(scale), true);
            /*
            jQuery(layerDiv).find('.layer-title h4').html(layer.getName());
            me._updateStyles(layer, layerDiv);
            var footer = layerDiv.find('div.layer-tools');
            me._updatePublishPermissionText(layer, footer);
            */
        },

        /**
         * @method handleLayerSticky
         *
         * @param
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
         * layer layer whichs switch off enable/disable is changed
         * Updates the name for the given layer in the UI
         */
        handleLayerSticky: function (layer) {
            var me = this,
                layerDiv = jQuery(me.container).find('li.layerselection2[layer_id=' + layer.getId() + ']');

            layerDiv.find('div.layer-tool-remove').removeClass('icon-close');
        },

        /**
         * @method refresh
         * utitity to temporarily support rightjs sliders (again)
         */
        refresh: function () {
            var me = this,
                sandbox = me.instance.getSandbox(),
                layers = sandbox.findAllSelectedMapLayers(),
                n,
                layer;

            for (n = layers.length - 1; n >= 0; n -= 1) {
                layer = layers[n];
                me.handleLayerOpacityChanged(layer);
            }
        }
    }, {
        /**
         * @static @property {String[]} protocol
         */
        protocol: ['Oskari.userinterface.Flyout']
    }
);
