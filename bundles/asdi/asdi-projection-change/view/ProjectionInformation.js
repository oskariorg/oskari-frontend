/*
 * Creates a flyout with tabs for different ways of visualizing data
 */
Oskari.clazz.define('Oskari.projection.change.view.ProjectionInformation', function (projection) {
    this.projection = projection;
    this.loc = Oskari.getLocalization('projection-change');
    this.infoView = _.template('<div class="oskari-projection-information"><i>${desc}</i><br/><img class="projection-preview-image" src="/Oskari/bundles/asdi/asdi-projection-change/resources/images/${img}"></img></div>');
}, {
    setElement: function(dialog) {
        this.dialog = dialog;
    },
    getElement: function() {
        return this.dialog;
    },
    createClassSelector: function ( srs ) {
       return srs.replace(':', '');
    },
    constructTitle: function () {
        var title = this.loc.projectionCode[this.projection.srsName].name + ' [' + this.projection.srsName + ']';
        return title;
    },
    show: function( parentElement ) {
        var me = this;

        if ( this.getElement() ) {
            return;
        }

        var info = jQuery( this.infoView ({
            desc: this.loc.projectionCode[this.projection.srsName].desc,
            img: this.createClassSelector( this.projection.srsName ) + '.png',
        }));
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var btn = dialog.createCloseButton(this.loc.infoPopup.ok);
        btn.addClass('primary');
        btn.setHandler( function () {
            dialog.close(true);
            me.dialog = null;
        });
        dialog.dialog.zIndex(parentElement.zIndex() + 1);

        dialog.show(this.constructTitle(), info, [btn]);
        dialog.moveTo(parentElement);
        dialog.makeDraggable();
        this.setElement(dialog);
    }
});
