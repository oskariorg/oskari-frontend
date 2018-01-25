Oskari.clazz.define('Oskari.projection.change.flyout', function (instance, options) {
    this.instance = instance;
    this.loc = instance.getLocalization();
    this.projectionView = null;
    this.templates = {
        main: jQuery('<div></div>')
    }
    this.element = null;
    var me = this;
    this.on('show', function() {
        if(!me.getElement()) {
            me.createUi();
            me.setTitle(me.loc.title);
            me.addClass(options.cls);
            me.setContent(me.getElement());
        }
    });
}, {
    getElement: function () {
        return this.element;
    },
    setElement: function (el) {
        this.element = el;
    },
    createUi: function () {
        this.projectionView = Oskari.clazz.create('Oskari.projection.change.view.ProjectionChange', this.instance);
        var container = this.templates.main.clone();
        container.append(this.projectionView.getElement());
        this.setElement( container );
    }
}, {
    'extend': ['Oskari.userinterface.extension.ExtraFlyout']  
});