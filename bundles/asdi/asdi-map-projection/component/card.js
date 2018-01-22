Oskari.clazz.define('Oskari.map.projection.component.card', function (img, name) {
this.card  = jQuery('<div class="projection-card"><img class="card-image"></img><p class="card-header"></p></div>');
this.element = null;
if( !this.getElement() )
{
    this.create(img, name);
}
}, {
    getElement: function () {
        return this.element;
    },
    setElement: function (el) {
        this.element = el;
    },
    create: function (img, name) {
        var card = this.card.clone();
        card.find('img').addClass(img);
        card.find('p').html(name);
        this.setElement(card);
    }
}, {
});