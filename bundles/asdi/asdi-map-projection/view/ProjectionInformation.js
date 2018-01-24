/*
 * Creates a flyout with tabs for different ways of visualizing data
 */
Oskari.clazz.define('Oskari.map.projection.view.ProjectionInformation', function (projection) {
    this.projection = projection;
}, {
    _template: {
        container: jQuery('<div class="oskari-projection-information"></div>')
    },
    setElement: function(el) {
        this.element = el;
    },
    getElement: function() {
        return this.element;
    },
    show: function( parentElement ) {
        var me = this;
        if ( this.getElement() ) {
            return;
        }
        var el = this._template.container.clone();
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var btn = dialog.createCloseButton("asdsad");
        btn.addClass('primary');
        btn.setHandler( function () {
            dialog.close(true);
        });
        dialog.dialog.zIndex(parentElement.zIndex() + 1);
        dialog.show('Note', "asd", [btn]);
        dialog.moveTo(parentElement);
        this.setElement(el);
    },
}, {
});