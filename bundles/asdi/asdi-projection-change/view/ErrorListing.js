/*
 * Creates a flyout with tabs for different ways of visualizing data
 */
Oskari.clazz.define('Oskari.projection.change.view.ErrorListing', function () {
    this.loc = Oskari.getLocalization('projection-change');
}, {
    _template: {
        container: jQuery('<div class="oskari-projection-warning"></div>')
    },
    setElement: function(el) {
        this.element = el;
    },
    getElement: function() {
        return this.element;
    },
    show: function( parentElement ) {
        var content = this._template.container.clone();
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var btn = dialog.createCloseButton(this.loc.infoPopup.ok);
        btn.addClass('primary');
        btn.setHandler( function () {
            dialog.close(true);
        });
        dialog.dialog.zIndex(parentElement.zIndex() + 1);
        dialog.setContent(content);
        dialog.show(this.loc.error.title, this.loc.error.desc, [btn]);
        dialog.moveTo(parentElement);
        dialog.makeDraggable();
    }
}, {
});