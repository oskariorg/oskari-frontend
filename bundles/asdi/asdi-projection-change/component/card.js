Oskari.clazz.define('Oskari.projection.change.component.card',
/**
 * @class 
 * @param { Object } view - contains info about the current view passed down to card
 * @param function() callback - callback function to call when element is clicked
 */
function (view, callback) {
    this.card = _.template('<div class="projection-card" data-srs="${srs}">'+
                        '<div class="card-image"></div> '+
                        '<div class="info-row">'+
                            '<p class="card-header"> ${projectionName} </p>'+
                            '<div class="projection-info icon-info"></div>'+
                            '<div class="projection-warning oskari-hidden" title="${tooltip}"></div>'+
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
    getElement: function () {
        return this.element;
    },
    setElement: function (el) {
        this.element = el;
    },
    checkUnsupportedLayers: function () {
        var me = this;
        var layers = Oskari.getSandbox().getMap().getLayers();
        var unsupportedLayers = layers.filter( function (layer) {
            return !layer.isSupported(me.view.srsName);
        });
        if ( unsupportedLayers.length !== 0 ) {
            var warningElement = this.getElement().find('.projection-warning');
            warningElement.removeClass('oskari-hidden');
            //warningLink
            warningElement.on('click', function ( event ) {
                event.stopPropagation();
                me.errorListing.show( jQuery(this), unsupportedLayers );
            });
        }     
    },
    create: function (view) {
        var me = this;
        var tpl = this.card;

        var card = jQuery( tpl ({
            srs: view.srsName,
            projectionName: view.name,
            tooltip: me.loc.error.hover.icon
        }));

        card.find('.card-image').on('click', function (e) {
            e.stopPropagation();
            me.projectionChangeHandler( view.uuid,  view.srsName );
        });
        //infolink
        card.find('.projection-info').on('click', function ( event ) {
            event.stopPropagation();
            me.infoView.show( jQuery(this) );
        });
        this.setElement(card);
        this.checkUnsupportedLayers();
    }
});