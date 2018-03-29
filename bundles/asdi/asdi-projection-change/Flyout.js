Oskari.clazz.define('Oskari.projection.change.flyout', function ( params, options ) {
    this.loc = params.loc;
    this.projectionView = Oskari.clazz.create('Oskari.projection.change.view.ProjectionChange', params );
    this.element = null;
    var me = this;
    this.on('show', function() {
        
        if (!me.hasContent()) {
            me.setTitle(me.loc.title);
            me.addClass(options.cls);
            me.setContent(me.projectionView.getElement());
        }
    });
}, {
    hasContent: function () {
        return this.getElement().find('.oskari-map-projection').length > 0;
    }
}, {
    'extend': ['Oskari.userinterface.extension.ExtraFlyout']  
});