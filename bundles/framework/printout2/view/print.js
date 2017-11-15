Oskari.clazz.define("Oskari.mapping.printout2.view.print",

    function ( instance ) {
        this.instance = instance;
        this.loc = instance._localization["BasicView"];
        this.container = null;
        this.preview = Oskari.clazz.create( 'Oskari.mapping.printout2.components.preview', this );
        this.settings = Oskari.clazz.create( 'Oskari.mapping.printout2.components.settings', this );
        this.sizepanel = Oskari.clazz.create( 'Oskari.mapping.printout2.components.sizepanel', this );
        this.accordion = null;
    }, {
        _templates: {
            wrapper: '<div class="print-container"> hello person </div>',
            buttons: jQuery('<div class="buttons"></div>')
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
        createSizePanel: function () {
            var sizePanel = this.sizepanel._createSizePanel();
            sizePanel.open();
            this.accordion.addPanel( sizePanel );
        },
        createUi: function ( ) {
            var wrapper = jQuery( this._templates.wrapper );
            
            this.createAccordion();
            this.createSizePanel();
            this.createSettingsPanel();
            var container = jQuery('<div></div>');
            container.append( wrapper );
            this.accordion.insertTo( container );
            this.setElement( container );
            this.createPreview();
            wrapper.append( this._getButtons() );   
        },
                /**
         * @private @method _getButtons
         * Renders printout buttons to DOM snippet and returns it.
         *
         *
         * @return {jQuery} container with buttons
         */
        _getButtons: function () {
            var me = this,
                buttonCont = me._templates.buttons.clone(),
                cancelBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.buttons.CancelButton'
                );

            cancelBtn.setHandler(function () {
                me.instance.setPublishMode(false);
                // Send print canceled event
                me.instance.sendCanceledEvent('cancel');
            });
            cancelBtn.insertTo(buttonCont);

            me.backBtn = Oskari.clazz.create(
                'Oskari.userinterface.component.Button'
            );
            me.backBtn.setTitle(me.loc.buttons.back);
            me.backBtn.setHandler(function () {
                me.instance.setPublishMode(false);
                // Send print canceled event previous
                me.instance.sendCanceledEvent('previous');
            });
            me.backBtn.insertTo(buttonCont);
            me.backBtn.hide();

            var saveBtn = Oskari.clazz.create(
                'Oskari.userinterface.component.buttons.SaveButton'
            );

            saveBtn.setTitle(me.loc.buttons.save);

            saveBtn.setHandler(function () {
                var map = me.instance.sandbox.getMap(),
                    features = (map.geojs === undefined || map.geojs === null) ? null : map.geojs,
                    selections = me._gatherSelections();

                if (selections) {
                    me._printMap(selections, features);
                }
            });
            saveBtn.insertTo(buttonCont);

            return buttonCont;
        },
        render: function ( container ) {
        },
        refresh: function () {

        }
    }, {

    });