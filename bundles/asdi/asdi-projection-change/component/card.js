Oskari.clazz.define('Oskari.projection.change.component.card',
/**
 * @class 
 * @param { Object } view - contains info about the current view passed down to card
 * @param function() callback - callback function to call when element is clicked
 */
function (view, callback) {
    this.card = _.template('<div class="projection-card" data-srs="${srs}">'+
                        '<img class="card-image" src="${imgPath}"></img> '+
                        '<div class="info-row">'+
                            '<p class="card-header"> ${projectionName} </p>'+
                            '<div class="projection-info icon-info"></div>'+
                            '<div class="projection-warning icon-warning-light oskari-hidden" title="${tooltip}"></div>'+
                        '</div>'+
                        '</div>');
    this.element = null;
    this.loc = Oskari.getLocalization('projection-change');
    this.projectionChangeHandler = callback;
    this.view = view;
    this.infoView = Oskari.clazz.create('Oskari.projection.change.view.ProjectionInformation', view);
    this.errorListing = Oskari.clazz.create('Oskari.projection.change.view.ErrorListing');
    this.create(view);
}, {
    eventHandlers: {
        AfterMapLayerRemoveEvent: function (event) {
            this.toggleWarningElement();
        },
        AfterMapLayerAddEvent: function (event) {
            this.toggleWarningElement();
        }
    },
    onEvent: function (event) {
        var handler = this.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }
        return handler.apply(this, [event]);
    },
    getName: function () {
        return 'Oskari.projection.change.component.card';
    },
    getElement: function () {
        return this.element;
    },
    setElement: function (el) {
        this.element = el;
    },
    getImagePath: function ( epsg ) {
        var name = epsg.replace(':', '');
        return '/Oskari/bundles/asdi/asdi-projection-change/resources/images/' + name + '.png';
    },
    getUnsupportedLayers: function () {
        var me = this;
        var layers = Oskari.getSandbox().getMap().getLayers();
        var unsupportedLayers = layers.filter( function (layer) {
            return !layer.isSupported(me.view.srsName);
        });
        return unsupportedLayers;
    },
    toggleWarningElement: function () {
        var element = this.getElement().find('.projection-warning');
        if ( this.getUnsupportedLayers().length !== 0 ) {
            element.removeClass('oskari-hidden');
        } else {
            element.addClass('oskari-hidden');
        }
    },
    create: function (view) {
        var me = this;
        var tpl = this.card;

        var card = jQuery( tpl ({
            imgPath: me.getImagePath(view.srsName),
            srs: view.srsName,
            projectionName: me.loc.projectionCode[view.srsName].displayName,
            tooltip: me.loc.error.hover.icon
        }));

        card.find('.card-image').on('click', function (event) {
            event.stopPropagation();
            me.projectionChangeHandler( view.uuid,  view.srsName );
        });
        //infolink
        card.find('.projection-info').on('click', function ( event ) {
            event.stopPropagation();
            me.infoView.show( jQuery(this) );
        });
        //warningLink
        card.find('.projection-warning').on('click', function ( event ) {
            event.stopPropagation();
            me.errorListing.show( jQuery(this), me.getUnsupportedLayers() );
        });
        this.setElement(card);
        this.toggleWarningElement();

        for (p in this.eventHandlers) {
            if (this.eventHandlers.hasOwnProperty(p)) {
                Oskari.getSandbox().registerForEventByName(this, p);
            }
        }
    }
});
