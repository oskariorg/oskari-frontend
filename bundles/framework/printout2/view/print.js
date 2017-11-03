Oskari.clazz.define("Oskari.mapping.printout.view.print",

    function ( instance ) {
        this.instance = instance;
        this.container = null;

    }, {
        
    }, {
        _templates: {
            container: '<div class="print-container"></div>'
        },
        setElement: function ( element ) {
            this.container = element;
        },
        createUi: function () {
            var container = jQuery( this._templates.container );
            this.setElement( container );
        }

    });