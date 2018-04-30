Oskari.clazz.define('Oskari.coordinatetransformation.view.CoordinateSystemInformation', function (system) {
    this.system = system;
    this.loc = Oskari.getMsg.bind(null, 'coordinatetransformation');
}, {
    _template: {
        container: jQuery('<div class="oskari-coordinatesystem-info"></div>')
    },
    setElement: function(el) {
        this.element = el;
    },
    getElement: function() {
        return this.element;
    },
    show: function( parentElement, title, info ) {
        var title = "title", // TODO
            info = "info"; // TODO
        var content = this._template.container.clone();
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var btn = dialog.createCloseButton(this.loc('actions.ok'));
        btn.addClass('primary');
        btn.setHandler( function () {
            dialog.close(true);
        });
        dialog.dialog.zIndex(parentElement.zIndex() + 1);
        dialog.setContent(content);
        dialog.show(title, info, [btn]);
        dialog.moveTo(parentElement);
        dialog.makeDraggable();
    }
}, {
});