Oskari.clazz.define("Oskari.mapping.printout2.components.sidepanel",
    function ( view ) {
        this.view = view;
        this.element = null;
}, {
    template: {
        header: jQuery('<div class="print-header"><h3></h3><div class="icon-close"></div></div>'),
        panel: jQuery('<div class="print-panel"></div>'),
        container: jQuery('<div class="print-container"></div>'),
        close: jQuery('')
    },
    setElement: function ( element ) {
        this.element = element;
    },
    getElement: function () {
        return this.element;
    },
    create: function () {
        var header = this.template.header.clone();
        header.find('h3').html( this.view.loc.title );
        var panel = this.template.panel.clone();
        var container = this.template.container.clone();
        container.append( header );
        container.append( panel );
        this.setElement( container );
        this.handleClose();
    },
    handleClose: function () {
        var me = this;
        var element = this.getElement();
        element.find('.icon-close').on('click', function () {
            me.view.destroy();
        });
    }
}, {
});