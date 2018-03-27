Oskari.clazz.define('Oskari.projection.change.view.ErrorListing', function () {
    this.loc = Oskari.getLocalization('projection-change');
    this.errorView = _.template('<div class="oskari-projection-warning"><div>${desc}</div></div>')
}, {
    setElement: function(el) {
        this.element = el;
    },
    getElement: function() {
        return this.element;
    },
    createList: function (errorList) {
        var list = jQuery('<ul class="projection-errorlist"></ul>');
        errorList.forEach( function ( unsupported ) {
            list.append( jQuery('<li>'+ unsupported.getName() +'</li>') );
        });
        return list;
    },
    show: function( parentElement, errorList ) {
        var error = jQuery( this.errorView ({
            desc: this.loc.error.desc,
        }));

        var layerList = this.createList(errorList);
        error.append(layerList);

        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var btn = dialog.createCloseButton(this.loc.infoPopup.ok);
        btn.addClass('primary');
        btn.setHandler( function () {
            dialog.close(true);
        });
        dialog.dialog.zIndex(parentElement.zIndex() + 1);
        dialog.show(this.loc.error.title, error, [btn]);
        dialog.moveTo(parentElement);
        dialog.makeDraggable();
    }
});
