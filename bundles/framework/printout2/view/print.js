Oskari.clazz.define("Oskari.mapping.printout2.view.print",

    function ( instance ) {
        this.instance = instance;
        this.container = null;
        this.preview = Oskari.clazz.create( 'Oskari.mapping.printout2.components.preview', instance );
    }, {
        _templates: {
            container: '<div class="print-container"></div>'
        },
        setElement: function ( element ) {
            this.container = element;
        },
        createPreview: function () {
            this.preview.createPreviewPanel();
            return this.preview.getElement();
        },
        createUi: function () {
            var container = jQuery( this._templates.container );
            var preview = this.createPreview();
            container.append( preview );
            this.setElement( container );
        }
    }, {

    });