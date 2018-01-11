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
        '   </div>' +
        '</li>');

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
     * Get jQuery element
     * @method getElement
     * @return {Object}   jQuery element
     */
    getElement: function() {
        return this._el;
    }
});