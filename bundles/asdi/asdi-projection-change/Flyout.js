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
            me.toggleMobileClasses(false);
        }
        if ( Oskari.util.isMobile() ) {
            me.toggleMobileClasses(true);
        }
    });
}, {
    hasContent: function () {
        return this.getElement().find('.oskari-map-projection').length > 0;
    },
    toggleMobileClasses: function (enabled) {
        var elem = this.getElement();
        if ( enabled ) {
          elem.find('.oskari-map-projection').addClass('projection-mobile');
          elem.find('.projection-card').addClass('card-mobile');
        } else {
          elem.find('.oskari-map-projection').removeClass('projection-mobile');
          elem.find('.projection-card').removeClass('card-mobile');
        }
    },
}, {
    'extend': ['Oskari.userinterface.extension.ExtraFlyout']  
});