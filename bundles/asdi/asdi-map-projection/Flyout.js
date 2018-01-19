Oskari.clazz.define('Oskari.map.projection.flyout', function (instance) {
    this.instance = instance;
    this.loc = instance.getLocalization();
    this.projectionView = null;
    this.templates = {
        main: jQuery('<div class="oskari-flyout projection-changer"></div>')
    }
    this.element = null;
}, {
    getElement: function () {
        return this.element;
    },
    setElement: function () {

    },
    init: function () {
        this.projectionView = Oskari.clazz.create('Oskari.map.projection.view.ProjectionChange', this.instance);
        var container = this.templates.main.clone();
        container.append(this.projectionView.getElement());
        this.setElement( container );
    },
    open: function ( ) {
        if ( this.getElement() ) {
            this.getElement().show();
        }    
    },
    hide: function ( ) {
        if ( this.getElement() ) {
            this.getElement().hide();
        }
    }
}, {
    'extend': ['Oskari.userinterface.extension.ExtraFlyout']  
});