/*
 * Creates a flyout with tabs for different ways of visualizing data
 */
Oskari.clazz.define('Oskari.projection.change.view.ProjectionChange', function (instance) {
    this.instance = instance;
    this.sb = instance.getSandbox();
    this.loc = instance.getLocalization();
    this.element = null;
    this.createUi();
}, {
    _template: {
        container: jQuery('<div class="oskari-map-projection"></div>')
    },
    setElement: function (el) {
        this.element = el;
    },
    getElement: function () {
        return this.element;
    },
    createUi: function () {
        var me = this;
        if ( this.getElement() ) {
            return;
        }
        var el = this._template.container.clone();
        var views = this.instance.getViews();
        views.forEach( function (view) {
            el.append( me.createCard( view ) );
        });

        this.setElement(el);
    },
    /**
      * @method createCard
      * @param { Object } view
      */
    createCard: function (view) {
        var card = Oskari.clazz.create('Oskari.projection.change.component.card', view, this.changeProjection.bind(this) );
        return card.getElement();
    },
    /**
      * @method changeProjection
      * @description reloads the page with a new uuid
      */
    changeProjection: function ( uuid, srs ) {
       // window.open("localhost:8080?uuid="+uuid);
        this.updateSelectedLayers(srs);
    },
    updateSelectedLayers: function (srs) {
        //disable layers that are not supported in new projection
        var layerSelection = Oskari.getSandbox().findRegisteredModuleInstance('LayerSelection');
        var layers = Oskari.getSandbox().findAllSelectedMapLayers();
        layers.forEach( function (layer) {
            if (layer._srs_name !== srs) {
                debugger;
                //layer srs doesn't match the new projection srs
            }
        });
    }
}, {
});