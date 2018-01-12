Oskari.clazz.define('Oskari.framework.bundle.hierarchical-layerlist.SelectedLayer', function(layer, sandbox, locale) {
    this.locale = locale;
    this.sb = sandbox;
    this._template = jQuery('<li class="layer selected">' +
        '   <div class="layer-info">' +
        '       <div class="visible"><a></a></div>' +
        '       <div class="header">' +
        '           <div class="breadcrumb"></div>' +
        '           <div class="title"></div>' +
        '           <div class="description"></div>' +
        '       </div>' +
        '       <div class="header-tools">' +
        '          <div class="toggle"></div>' +
        '          <div class="icon icon-remove icon-close"></div>' +
        '          <div style="clear:both;"></div>' +
        '       </div>' +
        '       <div style="clear:both;"></div>' +
        '   </div>' +
        '   <div class="layer-tools" style="display:none;">' +
        '       <div class="stylesel">' +
        '           <label for="style" class="width-prefix text-right">' + this.locale.style + '</label>' +
        '           <select name="style"></select>' +
        '       </div>' +
        '       <div class="oskariui opacity">' +
        '           <div class="slider"></div>' +
        '           <div class="slider-text">' +
        '               <div><input type="text" class="opacity-slider-text" />%</div>' +
        '           </div>' +
        '       </div>' +
        '       <div class="bottom-tools"></div>' +
        '   </div>' +
        '</li>');

    this._toolTemplate = jQuery('<div class="tool"></div>');

    this._el = this._template.clone();
    this._layer = null;

    // already binded
    this._binded = false;

    // layer tools
    this._tools = {};

    this.setLayer(layer);
}, {
    /** PUBLIC METHODS ******************************************************************************************************************/
    /**
     * Set Oskari layer to component and also get properties from this
     * @method setLayer
     * @param  {Object} layer Oskari layer
     */
    setLayer: function(layer) {
        var me = this;
        me._layer = layer;
        this._el.attr('data-layerid', layer.getId());
        me._setTitle();
        me._setBreadcrumb();
        me._setDescription();
        me._setVisibility();
        me._setRemoveHandler();
        me._setToolToggleHandler();
        me._updateStyles();
        me._addOpacitySlider();
        me._addLayerExtentTool();
        me._binded = true;
    },
    /**
     * Add layer tool
     * @method addTool
     * @param  {String} toolId  tool identifier
     * @param  {String} iconCls icon style class
     * @param  {String} tooltip tooltip text
     * @param  {Function} handler tool handler
     */
    addTool: function(toolId, iconCls, tooltip, handler) {
        var me = this;
        // allready added
        if (me._tools[toolId]) {
            return;
        }

        var tool = me._toolTemplate.clone();
        tool.addClass(iconCls);
        tool.addClass('tool-' + toolId);
        if (typeof handler === 'function') {
            tool.unbind('click');
            tool.bind('click', function(evt) {
                handler(evt);
            });
        }
        tool.attr('title', tooltip);
        me._el.find('.bottom-tools').append(tool);
        me._tools[toolId] = tool;
    },

    /** PRIVATE METHODS ******************************************************************************************************************/

    /**
     * Set visibility texts and handler
     * @method  _setVisibility
     * @private
     */
    _setVisibility: function() {
        var me = this;
        var visibilityText = me.locale.hide;
        if (!me._layer.isVisible()) {
            visibilityText = me.locale.show;
        }
        me._el.find('.visible a').html(visibilityText);

        if (!me._binded) {
            me._el.find('.visible a').bind('click', function(evt) {
                evt.stopPropagation();
                me.sb.postRequestByName('MapModulePlugin.MapLayerVisibilityRequest', [me._layer.getId(), !me._layer.isVisible()]);
            });
        }

    },
    /**
     * Set breadcrumb
     * @method  _setBreadcrumb
     * @private
     */
    _setBreadcrumb: function() {
        // FIXME: need to be getGroup ?
        if (this._layer.getGroups().length > 0) {
            this._el.find('.breadcrumb').html(this._layer.getGroups()[0].name);
        }
    },
    /**
     * Set title
     * @method  _setTitle
     * @private
     */
    _setTitle: function() {
        this._el.find('.header .title').html(this._layer.getName());
    },
    /**
     * Set description
     * @method  _setDescription
     * @private
     */
    _setDescription: function() {
        this._el.find('.header .description').html(this._layer.getDescription());
    },
    /**
     * Set layer remove handler
     * @method  _setRemoveHandler
     * @private
     */
    _setRemoveHandler: function() {
        var me = this;
        me._el.find('.icon-remove').attr('title', me.locale.tooltips.removeLayer);
        if (!me._binded) {
            me._el.find('.icon-remove').bind('click', function(evt) {
                evt.stopPropagation();
                me.sb.postRequestByName('RemoveMapLayerRequest', [me._layer.getId()]);
            });
        }
    },
    /**
     * Set layer tool toggle handling
     * @method  _setToolToggleHandler
     * @private
     */
    _setToolToggleHandler: function() {
        var me = this;
        var toggleIcon = me._el.find('.header-tools .toggle');

        toggleIcon.attr('title', me.locale.tooltips.openLayerTools);

        if (!me._binded) {
            me._el.find('.layer-info').bind('click', function() {
                if (toggleIcon.hasClass('open')) {
                    toggleIcon.attr('title', me.locale.tooltips.openLayerTools);
                    toggleIcon.removeClass('open');
                    me._el.find('.layer-tools').hide();
                } else {
                    toggleIcon.attr('title', me.locale.tooltips.closeLayerTools);
                    toggleIcon.addClass('open');
                    me._el.find('.layer-tools').show();
                }
            });
        }
    },
    /**
     * Updata layer styles selection and add handler for style change
     * @method  _updateStyles
     * @private
     */
    _updateStyles: function() {
        var me = this;
        var stylesel = me._el.find('.stylesel');
        stylesel.hide();

        if (typeof me._layer.getStyles === 'function' && me._layer.getStyles().length > 1) {
            var hasOpts = false,
                styles = me._layer.getStyles(),
                sel = stylesel.find('select'),
                i,
                opt;

            sel.empty();
            for (i = 0; i < styles.length; i += 1) {
                opt = jQuery('<option value="' + styles[i].getName() + '">' + styles[i].getTitle() + '</option>');
                sel.append(opt);
                hasOpts = true;
            }

            if (!me._binded) {
                sel.bind('change', function(e) {
                    var val = sel.find('option:selected').val();
                    me._layer.selectStyle(val);
                    me.sb.postRequestByName('ChangeMapLayerStyleRequest', [me._layer.getId(), val]);
                });
            }
            if (hasOpts) {
                if (me._layer.getCurrentStyle()) {
                    sel.val(me._layer.getCurrentStyle().getName());
                }
                sel.trigger('change');
                stylesel.show();
            }

        }
    },
    /**
     * Add opacity slider
     * @method  _addOpacitySlider
     * @private
     */
    _addOpacitySlider: function() {
        var me = this;
        var opacity = me._layer.getOpacity();
        var input = me._el.find('.opacity-slider-text');

        if (!me._binded) {
            var layerOpacityChanged = function(opacity) {
                me.sb.postRequestByName('ChangeMapLayerOpacityRequest', [me._layer.getId(), opacity]);
                me._el.find('.opacity-slider-text').attr('value', opacity);
            };

            var sliderEl = me._el.find('.opacity .slider');
            sliderEl.slider({
                min: 0,
                max: 100,
                value: opacity,
                slide: function(event, ui) {
                    layerOpacityChanged(ui.value);
                },
                stop: function(event, ui) {
                    layerOpacityChanged(ui.value);
                }
            });

            input.bind('change paste keyup', function() {
                layerOpacityChanged(jQuery(this).val());
            });
        }

        input.attr('value', me._layer.getOpacity());
    },
    /**
     * Add layer extent tool
     * @method  _addLayerExtentTool
     * @private
     */
    _addLayerExtentTool: function() {
        var me = this;
        if (me._layer.getGeometryWKT() && me._layer.getGeometryWKT() !== '') {
            me.addTool('zoom-to-extent', 'zoom-to-extent', me.locale.tooltips.zoomToLayerExtent, function(evt) {
                me.sb.postRequestByName('MapModulePlugin.AddFeaturesToMapRequest', [me._layer.getGeometryWKT(), {
                    layerId: 'hierarchical-layerlist-layer-extent',
                    clearPrevious: true,
                    layerOptions: null,
                    centerTo: true,
                }]);

                me.sb.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, 'hierarchical-layerlist-layer-extent']);
            });
        }
    },
    /**
     * Get jQuery element
     * @method getElement
     * @return {Object}   jQuery element
     */
    getElement: function() {
        return this._el;
    }
});