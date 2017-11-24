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
        this.layoutParams = {};
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
            var maplinkArgs = settings.maplinkArgs;
            var pageSizeArgs = '&pageSize=' + settings.pageSize;  
            var pageTitleArgs = '&pageTitle=' + encodeURIComponent(settings.pageTitle);
            var saveFileArgs = '';
            var contentOptions = [];
            var p;
            var layoutArgs;
            this.handleExtendingTools();
            layoutArgs = me._getLayoutParams(selections.pageSize);

            for (p in me.contentOptionsMap) {
                if (me.contentOptionsMap.hasOwnProperty(p)) {
                    if (settings[p]) {
                        contentOptions.push('&' + p + '=true');
                    }
                }
            }
            var contentOptionArgs = contentOptions.join(''),
                formatArgs = '&format=' + settings.format,
                parameters = maplinkArgs + '&action_route=GetPreview' + pageSizeArgs + pageTitleArgs + contentOptionArgs + formatArgs + saveFileArgs + layoutArgs;

            url = url + parameters;

            me.openUrlWindow(url, settings);
        },
        getProtocolImplementers: function () {
            return Oskari.clazz.protocol('Oskari.mapping.printout2.Tool');
        },
        handleExtendingTools: function () {
            var me = this;
            var tools = this.createExtendingTools();
            tools.forEach( function ( tool ) {
                if ( typeof tool._getStatsLayer === 'function' ) {
                    if ( tool._getStatsLayer() ) {
                        var legend = tool.getGeoJSON();
                        me.toolholder.setPosition( legend, "bottom-right" );
                        me.printarea.getPrintArea().prepend( jQuery( legend ) );
                    }
                }
                var legend = tool.getElement();
                if( !legend ) {
                    return;
                }
                me.toolholder.setPosition( legend, "bottom-right" );
                me.printarea.getPrintArea().prepend( jQuery( legend ) );
            });
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
        openUrlWindow: function ( infoUrl, settings ) {
            var wopParm = 'location=1,' + 'status=1,' + 'scrollbars=1,' + 'width=850,' + 'height=1200';
            if (this._isLandscape( settings )) {
                wopParm = 'location=1,' + 'status=1,' + 'scrollbars=1,' + 'width=1200,' + 'height=850';
            }
            var link = infoUrl;
            window.open(link, 'BasicPrintout', wopParm);
        },
                /**
         * @public @method getLayoutParams
         * Get params for backend print layout.
         * pdf template based on page Size
         *
         * @param {String} pageSize
         *
         */
        _getLayoutParams: function (pageSize) {
            var me = this,
                params = '',
                ind = me._getPageMapRectInd(pageSize);

            if (me.layoutParams.pageTemplate) {
                params = '&pageTemplate=' + me.layoutParams.pageTemplate + '_' + pageSize + '.pdf';
            }
            if (me.layoutParams.pageMapRect) {
                if (ind < me.layoutParams.pageMapRect.length) {
                    params = params + '&pageMapRect=' + me.layoutParams.pageMapRect[ind];
                }
            }
            if (me.layoutParams.tableTemplate) {
                params = params + '&tableTemplate=' + me.layoutParams.tableTemplate + '_' + pageSize;
            }

            return params;
        },
        /**
         * @private @method _getPageMapRectInd
         * get index of pagesize for mapRectangle bbox
         *
         * @param {String} pageSize
         *
         * @return {Number} Page size index
         */
        _getPageMapRectInd: function (pageSize) {
            var ind = 0;

            if (pageSize === 'A4_Landscape') {
                ind = 1;
            } else if (pageSize === 'A3') {
                ind = 2;
            } else if (pageSize === 'A3_Landscape') {
                ind = 3;
            }
            return ind;
        },
        _isLandscape: function ( settings ) {
            var ret = false;
            var sizeOptions = this.sizepanel.getSizeOptions();
            if (sizeOptions[settings.pageSize].id.indexOf('Land') > -1) {
                ret = true;
            }
            return ret;
        },
        render: function ( container ) { },
        refresh: function () { },
        destroy: function () {
            this.setElement(null);
            this.printarea.destroy();
        }
    }, {

    });