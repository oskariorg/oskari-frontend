Oskari.clazz.define('Oskari.projection.change.flyout', function ( params, options ) {
    this.loc = params.loc;
    this.projectionView = Oskari.clazz.create('Oskari.projection.change.view.ProjectionChange', params );
    this.templates = {
        main: jQuery('<div></div>')
    }
    this.element = null;
    var me = this;
    this.on('show', function() {
        if (!me.getElement()) {
            me.setTitle(me.loc.title);
            me.addClass(options.cls);
            me.setContent(me.projectionView.getElement());
        }
    });
}, {
    getElement: function () {
        return this.element;
    },
    setElement: function (el) {
        this.element = el;
    }
}, {
    'extend': ['Oskari.userinterface.extension.ExtraFlyout']  
});