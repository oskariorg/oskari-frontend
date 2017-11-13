Oskari.clazz.define("Oskari.mapping.printout2.view.print",

    function ( instance ) {
        this.instance = instance;
        this.container = null;
        this.preview = Oskari.clazz.create( 'Oskari.mapping.printout2.components.preview', this );
        this.settings = Oskari.clazz.create( 'Oskari.mapping.printout2.components.settings', this );
        this.accordion = null;
    }, {
        _templates: {
            wrapper: '<div class="print-container"> hello person </div>'
        },
        setElement: function ( element ) {
            this.container = element;
        },
        getElement: function () {
            return this.container;
        },
        createAccordion: function () {
            var accordion = Oskari.clazz.create(
                'Oskari.userinterface.component.Accordion'
            );
            this.accordion = accordion;
        },
        createPreview: function () {
            var previewPanel = this.preview.createPreviewPanel();
            previewPanel.open();
            this.preview._cleanMapPreview();
            this.preview._updateMapPreview();
            this.accordion.addPanel( previewPanel );
        },
        createSettingsPanel: function () {
            var settingsPanel = this.settings._createSettingsPanel();
            settingsPanel.open();
            this.accordion.addPanel( settingsPanel );
        },
        createUi: function ( ) {
            var wrapper = jQuery( this._templates.wrapper );
            
            this.createAccordion();
            this.createSettingsPanel();

            var container = jQuery('<div></div>');
            container.append( wrapper );
            this.accordion.insertTo( container );
            this.setElement( container );
            this.createPreview();
        },
        render: function ( container ) {
        },
        refresh: function () {

        }
    }, {

    });