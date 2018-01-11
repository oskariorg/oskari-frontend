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
    this.setLayer(layer);
}, {
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
    },
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
        me._el.find('.visible a').unbind('click');
        me._el.find('.visible a').bind('click', function(evt) {
            evt.stopPropagation();
            me.sb.postRequestByName('MapModulePlugin.MapLayerVisibilityRequest', [me._layer.getId(), !me._layer.isVisible()]);
        });

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
        me._el.find('.icon-remove').unbind('click');
        me._el.find('.icon-remove').bind('click', function(evt) {
            evt.stopPropagation();
            me.sb.postRequestByName('RemoveMapLayerRequest', [me._layer.getId()]);
        });
    },
    /**
     * Set layer tool toggle handling
     * @method  _setToolToggleHandler
     * @private
     */
    _setToolToggleHandler: function() {
        var me = this;
        me._el.find('.layer-info').unbind('click');
        var toggleIcon = me._el.find('.header-tools .toggle');

        toggleIcon.attr('title', me.locale.tooltips.openLayerTools);

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

            sel.unbind('change');
            sel.bind('change', function(e) {
                var val = sel.find('option:selected').val();
                me._layer.selectStyle(val);
                me.sb.postRequestByName('ChangeMapLayerStyleRequest', [me._layer.getId(), val]);
            });

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

        if (!me._bindedOpacity) {
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
        me._bindedOpacity = true;
    },
    addTool: function(toolId, iconCls, handler) {
        var me = this;
        // allready added
        if (me._el.find('.bottom-tools .tool-' + toolId).length > 0) {
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
        me._el.find('.bottom-tools').append(tool);
    },
    _addLayerExtentTool: function() {
        var me = this;
        me._layer._geometryWKT = 'POLYGON ((51857.07752019336 6617351.758085947, 64757.51754980773 6724539.1800989425, 77780.43746099574 6831712.629646971, 90922.13308078656 6938872.410219978, 104178.87018318352 7046018.839966641, 117546.88551808393 7153152.251308996, 131022.38783961348 7260272.990545034, 144601.5589337572 7367381.417439794, 158280.5546451786 7474477.904805448, 172055.50590313738 7581562.838070868, 185922.51974644407 7688636.614841255, 199877.68034737493 7795699.644448195, 236191.67830600997 7791243.318616742, 272563.0624726217 7787362.586186218, 308983.85680056794 7784057.789610645, 345446.10300669156 7781329.218095038, 381941.8578017532 7779177.108736253, 418463.190078363 7777601.647466223, 455002.17806454666 7776602.969796763, 491550.9064510594 7776181.161365283, 528101.4635005761 7776336.258280902, 564645.9381468832 7777068.247270706, 601176.4170921873 7778377.065625957, 637684.9819106762 7780262.600948358, 674163.706166442 7782724.690696563, 682253.5601090218 7675142.326825145, 690291.1725247321 7567564.430475263, 698274.2458524778 7459991.165674924, 706200.4989268251 7352422.690918106, 714067.6676445415 7244859.158983923, 721873.5056238836 7137300.716763376, 729615.7848563935 7029747.505094043, 737292.2963510042 6922199.658602795, 744900.8507702629 6814657.30555671, 752439.279058465 6707120.567722377, 759905.4330615391 6599589.560233721, 705444.5950397715 6596222.67797946, 650955.6845310468 6593645.009427913, 596446.1838329614 6591856.154975107, 541923.5442930857 6590855.836400321, 487395.1974830585 6590643.897801558, 432868.5663778016 6591220.306118018, 378351.0765369692 6592585.151240729, 323850.167285723 6594738.6457116045, 269373.30289194116 6597681.12401024, 214927.98373695806 6601413.041426821, 160521.75747694494 6605934.9725185605, 106162.23019201797 6611247.60914618, 51857.07752019336 6617351.758085947))';
        if (me._layer.getGeometryWKT() !== '') {
            me.addTool('zoom-to-extent', 'zoom-to-extent', function(evt) {
                me.sb.postRequestByName('MapModulePlugin.AddFeaturesToMapRequest', [me._layer.getGeometryWKT(), {
                    layerId: 'hierarchical-layerlist-layer-extent',
                    clearPrevious: true,
                    layerOptions: null,
                    centerTo: true,
                }]);

                me.sb.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, 'hierarchical-layerlist-layer-extent']);
            });

            me.addTool('zoom-to-extent2', 'zoom-to-extent', function(evt) {
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