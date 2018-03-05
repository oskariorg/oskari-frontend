
Oskari.clazz.define('Oskari.projection.change.view.ProjectionChange', function (params) {
    this.views = params.views;
    this.sb = params.sb
    this.loc = params.loc;
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
        this.views.forEach( function (view) {
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
        if (!uuid) {
            return;
        }
        var me = this,
            url = window.location.origin;
        if (window.location.pathname && window.location.pathname.length) {
            url += window.location.pathname;
        }
        url += "?uuid="+uuid;
        url += this.getSelectedMapLayersUrlParam();

        window.location.href = url;
    },
    getSelectedMapLayersUrlParam: function () {
        var maplayerUrlString = "&mapLayers="
        var layerString = '';
        var layers = this.sb.getMap().getLayers();
        
        if ( layers.length === 0 ) {
            return;
        }
        layers.forEach( function (layer) {
            if (layerString !== '') {
                    layerString += ',';
            }
            layerString +=  layer._id + '+' + layer._opacity ;
            if ( layer.style ) {
                layerString += '+' + layer.style;
            } else {
                layerString += '+';
            }
        });
        maplayerUrlString += layerString;
        return maplayerUrlString;
    }
}, {
});