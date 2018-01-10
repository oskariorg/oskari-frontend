Oskari.clazz.define('Oskari.framework.bundle.hierarchical-layerlist.SelectedLayer', function(layer, sandbox, locale) {
    this.locale = locale;
    this.sb = sandbox;
    this._template = jQuery('<li class="layer selected">' +
            '   <div class="layer-info">' +
            '       <div class="visible"><a></a></div>'+
            '       <div class="header">' +
            '           <div class="breadcrumb"></div>'+
            '           <div class="title"></div>'+
            '       </div>'+
            '       <div class="header-tools">'+
            '          <div class="toggle"></div>'+
            '          <div class="icon icon-remove icon-close"></div>'+
            '          <div style="clear:both;"></div>' +
            '       </div>'+
            '       <div style="clear:both;"></div>' +
            '   </div>' +
            '   <div class="layer-tools" style="display:none;">'+
            '       <div class="stylesel">' +
            '           <label for="style">' + this.locale.style + '</label>' +
            '           <select name="style"></select>' +
            '       </div>' +
            '   </div>'+
            '</li>');

    this._el = this._template.clone();
    this._layer = null;
    this.setLayer(layer);
}, {
    setLayer: function(layer){
        var me = this;
        me._layer = layer;
        this._el.attr('data-layerid', layer.getId());
        me._setTitle(layer.getName());
        me._setBreadcrumb();
        me._setVisibility();
        me._setRemoveHandler();
        me._setToolToggleHandler();
    },
    _setVisibility: function() {
        var me = this;
        var visibilityText = me.locale.hide;
        if(!me._layer.isVisible()) {
            visibilityText = me.locale.show;
        }
        me._el.find('.visible a').html(visibilityText);
        me._el.find('.visible a').unbind('click');
        me._el.find('.visible a').bind('click', function(evt) {
            evt.stopPropagation();
            me.sb.postRequestByName('MapModulePlugin.MapLayerVisibilityRequest', [me._layer.getId(), !me._layer.isVisible()]);
        });

    },
    _setBreadcrumb: function() {
        // FIXME: need to be getGroup ?
        this._el.find('.breadcrumb').html(this._layer.getInspireName());
    },
    _setTitle: function() {
        this._el.find('.header .title').html(this._layer.getName());
    },
    _setRemoveHandler: function(){
        var me = this;
        me._el.find('.icon-remove').attr('title', me.locale.tooltips.removeLayer);
        me._el.find('.icon-remove').unbind('click');
        me._el.find('.icon-remove').bind('click', function(evt) {
            evt.stopPropagation();
            me.sb.postRequestByName('RemoveMapLayerRequest', [me._layer.getId()]);
        });
    },
    _setToolToggleHandler: function(){
        var me = this;
        me._el.find('.layer-info').unbind('click');
        var toggleIcon = me._el.find('.header-tools .toggle');

        toggleIcon.attr('title', me.locale.tooltips.openLayerTools);

        me._el.find('.layer-info').bind('click', function() {
            if(toggleIcon.hasClass('open')) {
                toggleIcon.attr('title', me.locale.tooltips.closeLayerTools);
                toggleIcon.removeClass('open');
                me._el.find('.layer-tools').hide();
            } else {
                toggleIcon.attr('title', me.locale.tooltips.openLayerTools);
                toggleIcon.addClass('open');
                me._el.find('.layer-tools').show();
            }
        });
    },
    getElement: function(){
        return this._el;
    }
});