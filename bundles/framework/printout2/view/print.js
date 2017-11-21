Oskari.clazz.define( "Oskari.mapping.printout2.view.print",

    function ( instance ) {
        this.instance = instance;
        this.loc = instance._localization["BasicView"];
        this.container = null;
        this.preview = Oskari.clazz.create( 'Oskari.mapping.printout2.components.preview', this );
        this.settings = Oskari.clazz.create( 'Oskari.mapping.printout2.components.settings', this );
        this.sizepanel = Oskari.clazz.create( 'Oskari.mapping.printout2.components.sizepanel', this );
        this.toolholder = Oskari.clazz.create( 'Oskari.mapping.printout2.components.toolholder', this );
        this.printarea = Oskari.clazz.create( 'Oskari.mapping.printout2.components.printarea', this );
        this.accordion = null;
        /* content options listed in localisations */
        this.contentOptions = this.loc.content.options;
        this.contentOptionsMap = {};
        for ( f = 0; f < this.contentOptions.length; f += 1 ) {
            this.contentOptionsMap[ this.contentOptions[f].id ] = this.contentOptions[f];
        }
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
        getSettingsForPrint: function ( format ) {
            var me = this;
                var container = me.getElement();
                if(!container) {
                    return;
                }
                var sandbox = me.instance.getSandbox();
                var size = container.find('input[name=size]:checked').val();
                var selectedFormat = (format !== null && format !== undefined) ? format : container.find('input[name=format]:checked').val();
                var title = container.find('.printout_title_field').val();
                maplinkArgs = sandbox.generateMapLinkParameters(),
                p,
                selections = {
                    pageTitle: title,
                    pageSize: size,
                    maplinkArgs: maplinkArgs,
                    format: selectedFormat || 'application/pdf'
                };

            if (!size) {
                var firstSizeOption = container.find('input[name=size]').first();
                firstSizeOption.attr('checked', 'checked');
                selections.pageSize = firstSizeOption.val();
            }

            for (p in me.contentOptionsMap) {
                if (me.contentOptionsMap.hasOwnProperty(p)) {
                    selections[p] = me.settings.getContentOptions()[p].find('input').prop('checked');
                }
            }

            return selections;
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
                    selections = me.getSettingsForPrint();

                if (selections) {
                    me.print(selections, features);
                }
            });
            saveBtn.insertTo(buttonCont);

            return buttonCont;
        },
        print: function ( settings, features ) {
            var me = this;
            var sandbox = me.instance.getSandbox();
            var url = sandbox.getAjaxUrl();
            var urlBase = me.instance.backendConfiguration.formatProducers[settings.format];
            var tools = this.createExtendingTools();
            tools.forEach( function ( tool ) {
                if ( typeof tool._getStatsLayer === 'function' ) {
                    if ( tool._getStatsLayer() ) {
                        var legend = tool.getGeoJSON();
                        me.toolholder.setPosition( legend, "top-right" );
                        jQuery("#mapdiv").prepend( jQuery( legend ) );
                    }
                }
            });
        },
        getProtocolImplementers: function () {
            return Oskari.clazz.protocol('Oskari.mapping.printout2.Tool');
        },
        createExtendingTools: function () {
            var me = this;
            var sandbox = this.instance.getSandbox();
            var mapmodule = sandbox.findRegisteredModuleInstance("MainMapModule");
            var definedTools = this.getProtocolImplementers();
            var tools = [];
            Object.keys( definedTools ).forEach( function ( tool ) {
                var tool = Oskari.clazz.create( tool );
                if ( tool.isActive() === true ) {
                    tools.push(tool);
                }
            });
            return tools;
        },
        render: function ( container ) { },
        refresh: function () { }
    }, {

    });