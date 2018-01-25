Oskari.clazz.define('Oskari.projection.change.component.card',
/**
 * @class 
 * @param { Object } view - contains info about the current view passed down to card
 * @param function() callback - callback function to call when element is clicked
 */
function (view, callback) {
    this.card = jQuery('<div class="projection-card">'+
                        '<img class="card-image"></img> '+
                        '<div class="info-row">'+
                            '<p class="card-header"></p>'+
                            '<div class="projection-info icon-info"></div>'+
                        '</div>'+
                        '</div>');
    this.element = null;
    this.callback = callback;
    this.view = view;
    this.infoView = Oskari.clazz.create('Oskari.projection.change.view.ProjectionInformation', view);
    if ( !this.getElement() )
    {
        this.create(view);
    }
}, {
    getElement: function () {
        return this.element;
    },
    setElement: function (el) {
        this.element = el;
    },
    create: function (view) {
        var me = this;
        var card = this.card.clone();
        card.find('img').addClass(view.imgCls);
        card.find('p').html(view.name);

        card.on('click', function() {
            me.callback( view.uuid,  view.srsName );
        });
        //infolink
        card.find('.projection-info').on('click', function( event ) {
            event.stopPropagation();
            me.infoView.show( jQuery(this) );
            //display information about projection
        });

        this.setElement(card);
    }
}, {
});