/**
 * @class Oskari.mapframework.bundle.printout.view.BasicPrintout
 * Renders the printouts "publish mode" sidebar view where the user can make
 * selections regarading the map to publish.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.printout.view.BasicPrintout',

    /**
     * @static @method create called automatically on construction
     *
     * @param {Oskari.mapframework.bundle.printout.PrintoutBundleInstance} instance
     * Reference to component that created this view
     * @param {Object} localization
     * Localization data in JSON format
     * @param {Object} backendConfiguration
     * Backend URL configuration for ajax and image requests
     * @param {Object} formState
     * FormState for ui state reload
     *
     */
    function (instance, localization, backendConfiguration) {
        var me = this;

        me.isEnabled = false;
        me.instance = instance;
        me.loc = localization;
        me.backendConfiguration = backendConfiguration;

        /* templates */
        me.template = {};

        Object.keys(me.__templates).forEach(function (templateName) {
            me.template[templateName] = jQuery(me.__templates[templateName]);
        });

        // Layout params, pdf template
        me.layoutParams = {};

        // FIXME: remove option configuration from localization files
        /* page sizes listed in localisations */
        me.sizeOptions = me.loc.size.options;

        me.sizeOptionsMap = {};
        me.sizeOptions.forEach(function (opt) {
            me.sizeOptionsMap[opt.id] = opt;
        });

        me.mapmodule = me.instance.sandbox.findRegisteredModuleInstance('MainMapModule');

        me.scaleOptionsMap = {
            mapscale: {
                label: me.loc.scale.mapScale,
                selected: true
            },
            usedefinedscale: {
                label: me.loc.scale.definedScale,
                selected: false,
                scales: me.instance.conf.scales || me.mapmodule.getScaleArray().reverse()
            }
        };

        /* format options listed in localisations */
        me.formatOptions = me.loc.format.options;
        me.formatOptionsMap = {};
        me.formatOptions.forEach(function (opt) {
            me.formatOptionsMap[opt.id] = opt;
        });

        /* content options listed in localisations */
        me.contentOptions = me.loc.content.options;
        me.contentOptionsMap = {};
        me.contentOptions.forEach(function (opt) {
            me.contentOptionsMap[opt.id] = opt;
        });

        me.accordion = null;
        me.mainPanel = null;
        me.sizePanel = null;
        me.backBtn = null;

        me.progressSpinner = Oskari.clazz.create(
            'Oskari.userinterface.component.ProgressSpinner'
        );
        me.alert = Oskari.clazz.create(
            'Oskari.userinterface.component.Alert'
        );

        me.previewContent = null;
        me.previewImgDiv = null;

        me.contentOptionDivs = {};
    }, {
        __templates: {
            preview: '<div class="preview"><img /><span></span></div>',
            previewNotes: '<div class="previewNotes"><span></span></div>',
            location: '<div class="location"></div>',
            tool: '<div class="tool ">' + '<input type="checkbox"/>' + '<label></label></div>',
            buttons: '<div class="buttons"></div>',
            help: '<div class="help icon-info"></div>',
            main: '<div class="basic_printout">' + '<div class="header">' + '<div class="icon-close">' + '</div>' + '<h3></h3>' + '</div>' + '<div class="content">' + '</div>' + '<form method="post" target="map_popup_111" id="oskari_print_formID" style="display:none" action="" ><input name="geojson" type="hidden" value="" id="oskari_geojson"/><input name="tiles" type="hidden" value="" id="oskari_tiles"/><input name="tabledata" type="hidden" value="" id="oskari_print_tabledata"/></form>' + '</div>',
            format: '<div class="printout_format_cont printout_settings_cont"><div class="printout_format_label"></div></div>',
            formatOptionTool: '<div class="tool ">' + '<input type="radio" name="format" />' + '<label></label></div>',
            title: '<div class="printout_title_cont printout_settings_cont"><div class="printout_title_label"></div><input class="printout_title_field" type="text"></div>',
            option: '<div class="printout_option_cont printout_settings_cont">' + '<input type="checkbox" />' + '<label></label></div>',
            sizeOptionTool: '<div class="tool ">' + '<input type="radio" name="size" />' + '<label></label></div>',
            scaleOptionTool: '<div class="tool ">' + '<input type="radio" name="scale" />' + '<label></label></div>',
            scaleSelection: '<div class="scaleselection">' + '<select name="scaleselect" />' + '</div>'
        },
        /**
         * @public @method render
         * Renders view to given DOM element
         *
         * @param {jQuery} container reference to DOM element this component will be
         * rendered to
         *
         */
        render: function (container) {
            var me = this;
            var content = me.template.main.clone();

            me.mainPanel = content;
            content.find('div.header h3').append(me.loc.title);
            content.find('div.header div.icon-close').on('click', function(){
                me.instance.sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
                me.instance.sandbox.postRequestByName('EnableMapMouseMovementRequest');
            });

            container.append(content);
            var contentDiv = content.find('div.content');

            me.alert.insertTo(contentDiv);

            var accordion = Oskari.clazz.create(
                'Oskari.userinterface.component.Accordion'
            );
            me.accordion = accordion;

            me.sizePanel = me._createSizePanel();
            me.sizePanel.open();

            accordion.addPanel(me.sizePanel);

            var settingsPanel = me._createSettingsPanel();
            accordion.addPanel(settingsPanel);

            if(me.instance.conf.scaleSelection) {
                var scalePanel = me._createScalePanel();
                accordion.addPanel(scalePanel);
            }

            var previewPanel = me._createPreviewPanel();
            previewPanel.open();

            accordion.addPanel(previewPanel);
            accordion.insertTo(contentDiv);

            // buttons
            // close
            container.find('div.header div.icon-close').on(
                'click',
                function () {
                    me.instance.setPublishMode(false);
                }
            );
            contentDiv.append(me._getButtons());

            var inputs = me.mainPanel.find('input[type=text]');
            inputs.on('focus', function () {
                me.instance.sandbox.postRequestByName(
                    'DisableMapKeyboardMovementRequest'
                );
            });
            inputs.on('blur', function () {
                me.instance.sandbox.postRequestByName(
                    'EnableMapKeyboardMovementRequest'
                );
            });
            // bind help tags
            var helper = Oskari.clazz.create(
                'Oskari.userinterface.component.UIHelper',
                me.instance.sandbox
            );
            helper.processHelpLinks(
                me.loc.help,
                content,
                me.loc.error.title,
                me.loc.error.nohelp
            );
        },

        /**
         * @private @method _createSizePanel
         * Creates the size selection panel for printout
         *
         *
         * @return {jQuery} Returns the created panel
         */
        _createSizePanel: function () {
            var me = this;
            var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            panel.addClass('printsize');
            var contentPanel = panel.getContainer();
            var tooltipCont = me.template.help.clone();

            panel.setTitle(me.loc.size.label);
            tooltipCont.attr('title', me.loc.size.tooltip);
            panel.getHeader().append(tooltipCont);
            // content
            me.sizeOptions.forEach(function (option) {
                var toolContainer = me.template.sizeOptionTool.clone();
                var label = option.label;

                if (option.width && option.height) {
                    label = label + ' (' + option.width + ' x ' + option.height + 'px)';
                }
                toolContainer.find('label').append(label).attr({
                    'for': option.id,
                    'class': 'printout_radiolabel'
                });
                if (option.selected) {
                    toolContainer.find('input').prop('checked', true);
                }
                contentPanel.append(toolContainer);
                toolContainer.find('input').attr({
                    'value': option.id,
                    'name': 'size',
                    'id': option.id
                });
                toolContainer.find('input').on('change', function () {
                    // reset previous setting
                    me.sizeOptions.forEach(function (opt) {
                        opt.selected = false;
                    });
                    // select this one
                    option.selected = true;
                    me._cleanMapPreview();
                    me._updateMapPreview();
                });
            });

            return panel;
        },

        /**
         * @private @method _createSettingsPanel
         * Creates a settings panel for printout
         *
         *
         * @return {jQuery} Returns the created panel
         */
        _createSettingsPanel: function () {
            var me = this;
            var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            panel.addClass('printsettings');
            panel.setTitle(me.loc.settings.label);
            var contentPanel = panel.getContainer();
            // tooltip
            var tooltipCont = me.template.help.clone();
            tooltipCont.attr('title', me.loc.settings.tooltip);
            panel.getHeader().append(tooltipCont);

            /* format options from localisations files */
            var format = me.template.format.clone();

            format.find('.printout_format_label').html(me.loc.format.label);

            me.formatOptions.forEach(function (option) {
                var toolContainer = me.template.formatOptionTool.clone();
                toolContainer.find('label').append(option.label).attr({
                    'for': option.id,
                    'class': 'printout_radiolabel'
                });
                if (option.selected) {
                    toolContainer.find('input').prop('checked', true);
                }
                format.append(toolContainer);
                toolContainer.find('input').attr({
                    'value': option.format,
                    'name': 'format',
                    'id': option.id
                });
                toolContainer.find('input').on('change', function () {
                    // reset previous setting
                    me.formatOptions.forEach(function (opt) {
                        opt.selected = false;
                    });
                    option.selected = true;
                });
            });
            contentPanel.append(format);

            var mapTitle = me.template.title.clone();
            mapTitle.find('.printout_title_label').html(me.loc.mapTitle.label);
            mapTitle.find('.printout_title_field').attr({
                'value': '',
                'placeholder': me.loc.mapTitle.label
            });

            contentPanel.append(mapTitle);

            /* CONTENT options from localisations files */
            me.contentOptions.forEach(function (dat) {
                var opt = me.template.option.clone();
                opt.find('input').attr('id', dat.id).prop('checked', !!dat.checked);
                opt.find('label').html(dat.label).attr({
                    'for': dat.id,
                    'class': 'printout_checklabel'
                });
                me.contentOptionDivs[dat.id] = opt;
                contentPanel.append(opt);
            });

            // scale line on print isn't implemented for non-metric projections so hide the choice here.
            var mapmodule = me.instance.sandbox.findRegisteredModuleInstance('MainMapModule');
            if (mapmodule.getProjectionUnits() !== 'm') {
                me.contentOptionDivs.pageScale.css('display', 'none');
            }

            return panel;
        },

        /**
         * @private @method _createScalePanel
         * Creates the scale selection panel for printout
         *
         *
         * @return {jQuery} Returns the created panel
         */
        _createScalePanel: function () {
            var me = this;
            var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            panel.addClass('define_scale');
            var contentPanel = panel.getContainer();
            var tooltipCont = me.template.help.clone();

            panel.setTitle(me.loc.scale.label);
            tooltipCont.attr('title', me.loc.scale.tooltip);
            panel.getHeader().append(tooltipCont);

            var unsupportedLayersDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var okButton = unsupportedLayersDialog.createCloseButton('OK');
            okButton.addClass('primary');

            var getUnsupportedLayers = function() {
                var layerNames = [];
                var layers = me.instance.sandbox.findAllSelectedMapLayers().filter(function(l) {
                    return l.getLayerType() === 'wmts';
                });
                layers.forEach(function(layer){
                    layerNames.push(layer.getName());
                });
                return layerNames;
            };

            Object.keys(me.scaleOptionsMap).forEach(function (key) {
                var option = me.scaleOptionsMap[key];
                var toolContainer = me.template.scaleOptionTool.clone();
                var label = option.label;

                toolContainer.find('label').append(label).attr({
                    'for': option.key,
                    'class': 'printout_radiolabel'
                });
                toolContainer.find('input').prop('checked', !!option.selected);
                contentPanel.append(toolContainer);
                toolContainer.find('input').attr({
                    'value': key,
                    'name': 'scale',
                    'id': key
                });
                toolContainer.find('input').on('change', function () {
                    if(option.scales) {
                        contentPanel.find('.scale-'+key).show();
                        me._updateScaleToSelected(true);

                        me.instance.sandbox.postRequestByName('DisableMapKeyboardMovementRequest', [['zoom']]);
                        me.instance.sandbox.postRequestByName('DisableMapMouseMovementRequest', [['zoom']]);
                        // check if selected layers contains wmts layers
                    } else {
                        contentPanel.find('.scaleselection').hide();
                        me.instance.sandbox.postRequestByName('EnableMapKeyboardMovementRequest', [['zoom']]);
                        me.instance.sandbox.postRequestByName('EnableMapMouseMovementRequest', [['zoom']]);
                    }

                    // reset previous setting
                    Object.keys(me.scaleOptionsMap).forEach(function (k) {
                        var opt = me.scaleOptionsMap[k];
                        opt.selected = false;
                    });
                    option.selected = true;
                    var unsupportedLayers = getUnsupportedLayers();
                    if(unsupportedLayers.length>0 && option.scales) {
                        var message = '<div>' + me.loc.scale.unsupportedLayersMessage + ':</div><ul>';
                        unsupportedLayers.forEach(function(layerName){
                            message += '<li>' + layerName + '</li>';
                        });
                        message += '</ul>';
                        unsupportedLayersDialog.show(me.loc.scale.unsupportedLayersTitle, message, [okButton]);
                    }
                    me._cleanMapPreview();
                    me._updateMapPreview();
                });

                if(option.scales) {
                    var selection = me.template.scaleSelection.clone();
                    selection.addClass('scale-'+key);
                    var currentScale = me.mapmodule.getMapScale();

                    var optionEl = jQuery('<option></option>');
                    option.scales.forEach(function(scale){
                        var el = optionEl.clone();
                        el.attr('value', scale);
                        el.html('1:'+scale);
                        if(scale===currentScale) {
                            el.attr('selected',true);
                        }
                        selection.find('select').append(el);
                    });

                    selection.find('select').on('change', function(){
                        var el = jQuery(this);
                        var selectedScale = el.val();
                        me.mapmodule.zoomToScale(selectedScale, false);
                        me._cleanMapPreview();
                        me._updateMapPreview();
                    });
                    contentPanel.append(selection);
                    selection.toggle(!!option.selected);
                }
            });

            return panel;
        },

        /**
         * Update selected scale to option
         * @method  _updateScaleToSelected
         * @private
         */
        _updateScaleToSelected: function(selectFirst){
            var me = this;
            Object.keys(me.scaleOptionsMap).forEach(function (key) {
                var option = me.scaleOptionsMap[key];
                var selection = me.mainPanel.find('.scale-'+key);
                if(option.scales && option.scales.findIndex(
                    function(s) {
                        return s === me.mapmodule.getMapScale();
                    }) > -1) {
                    selection.find('select').val(me.mapmodule.getMapScale());
                }
                // else select first option
                else if(selectFirst === true){
                    selection.find('select').val(selection.find('select option:first').val());
                    selection.find('select').trigger('change');
                }
            });
        },

        /**
         * @private @method _createSizePanel
         * Creates the size selection panel for printout
         *
         *
         * @return {jQuery} Returns the created panel
         */
        _createPreviewPanel: function () {
            var me = this;
            var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            panel.addClass('printpreview');
            panel.setTitle(me.loc.preview.label);
            var contentPanel = panel.getContainer();
            var tooltipCont = me.template.help.clone();

            tooltipCont.attr('title', me.loc.preview.tooltip);
            panel.getHeader().append(tooltipCont);

            var previewContent = me.template.preview.clone();

            contentPanel.append(previewContent);

            /* progress */
            me.progressSpinner.insertTo(previewContent);

            var previewImgDiv = previewContent.find('img');
            previewImgDiv.on('click', function () {
                me.showFullScaleMapPreview();
            });
            var previewSpan = previewContent.find('span');

            me.previewContent = previewContent;
            me.previewImgDiv = previewImgDiv;
            me.previewSpan = previewSpan;

            Object.keys(me.loc.preview.notes).forEach(function (locKey) {
                var previewNotes = me.template.previewNotes.clone();
                previewNotes.find('span').text(me.loc.preview.notes[locKey]);
                contentPanel.append(previewNotes);
            });

            return panel;
        },

        /**
         * @private @method _cleanMapPreview
         */
        _cleanMapPreview: function () {
            this.previewImgDiv.hide();
            this.previewSpan.text(this.loc.preview.pending);
        },

        /**
         * @private @method _updateMapPreview
         */
        _updateMapPreview: function () {
            var me = this;
            var selections = me._gatherSelections('image/png');
            var urlBase = me.backendConfiguration.formatProducers[selections.format];
            var maplinkArgs = selections.maplinkArgs;
            var pageSizeArgs = '&pageSize=' + selections.pageSize;
            var previewScaleArgs = '&scaledWidth=200';
            var url = urlBase + maplinkArgs + pageSizeArgs + previewScaleArgs;

            me.previewContent.removeClass('preview-portrait');
            me.previewContent.removeClass('preview-landscape');
            me.previewContent.addClass(me.sizeOptionsMap[selections.pageSize].classForPreview);

            me.progressSpinner.start();
            window.setTimeout(function () {
                me.previewImgDiv.imagesLoaded(function () {
                    me.previewSpan.text('');
                    me.previewImgDiv.fadeIn('slow', function () {
                        me.progressSpinner.stop();
                    });
                });
                me.previewImgDiv.attr('src', url);
            }, 100);
        },

        /**
         * @public @method showFullScaleMapPreview
         */
        showFullScaleMapPreview: function () {
            var me = this;
            var selections = me._gatherSelections('image/png');
            var urlBase = me.backendConfiguration.formatProducers[selections.format];
            var maplinkArgs = selections.maplinkArgs;
            var pageSizeArgs = '&pageSize=' + selections.pageSize;
            var url = urlBase + maplinkArgs + pageSizeArgs;

            me.openURLinWindow(url, selections);
        },

        /**
         * @private @method _getButtons
         * Renders printout buttons to DOM snippet and returns it.
         *
         *
         * @return {jQuery} container with buttons
         */
        _getButtons: function () {
            var me = this;
            var buttonCont = me.template.buttons.clone();
            var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.CancelButton');

            cancelBtn.setHandler(function () {
                me.instance.setPublishMode(false);

                // Send print canceled event
                me.instance.sendCanceledEvent('cancel');

                // enable navigations
                me.instance.sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
                me.instance.sandbox.postRequestByName('EnableMapMouseMovementRequest');
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

            var saveBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.SaveButton');
            saveBtn.setTitle(me.loc.buttons.save);
            saveBtn.setHandler(function () {
                var map = me.instance.sandbox.getMap();
                // FIXME: nope, don't go saving to some random "geojs" variable on the sandbox.getMap()
                var features = (map.geojs === undefined || map.geojs === null) ? null : map.geojs;
                var selections = me._gatherSelections();

                if (selections) {
                    me._printMap(selections, features);
                }
            });
            saveBtn.insertTo(buttonCont);

            return buttonCont;
        },

        /**
         * @private @method _gatherSelections
         * Gathers printout selections and returns them as JSON object
         *
         *
         * @return {Object}
         */
        _gatherSelections: function (format) {
            var me = this;
            var container = me.mainPanel;
            var sandbox = me.instance.getSandbox();
            var size = container.find('input[name=size]:checked').val();
            var selectedFormat = (format !== null && format !== undefined) ? format : container.find('input[name=format]:checked').val();
            var title = container.find('.printout_title_field').val();
            var resolution = sandbox.getMap().getResolution();

            var scale = jQuery('div.basic_printout select[name=scaleselect]').val();
            var scaleText = '';

            if(me.instance.conf.scaleSelection && me.scaleOptionsMap.usedefinedscale.selected) {
                resolution = me.mapmodule.getExactResolution(scale);
                scaleText = '1:' + scale;
            }

            var maplinkArgs = sandbox.generateMapLinkParameters({
                srs: sandbox.getMap().getSrsName(),
                resolution: resolution,
                scaleText: scaleText
            });

            var selections = {
                pageTitle: title,
                pageSize: size,
                maplinkArgs: maplinkArgs,
                format: selectedFormat || 'application/pdf'
            };

            if (!size) {
                var firstSizeOption = container.find('input[name=size]').first();
                firstSizeOption.prop('checked', true);
                selections.pageSize = firstSizeOption.val();
            }

            for (var p in me.contentOptionsMap) {
                if (me.contentOptionsMap.hasOwnProperty(p)) {
                    selections[p] = me.contentOptionDivs[p].find('input').prop('checked');
                }
            }
            return selections;
        },

        /**
         * @public @method openURLinWindow
         *
         * @param {String} infoUrl
         * @param {Object} selections
         *
         */
        openURLinWindow: function (infoUrl, selections) {
            var wopParm = 'location=1,' + 'status=1,' + 'scrollbars=1,' + 'width=850,' + 'height=1200';
            if (this._isLandscape(selections)) {
                wopParm = 'location=1,' + 'status=1,' + 'scrollbars=1,' + 'width=1200,' + 'height=850';
            }
            var link = infoUrl;
            window.open(link, 'BasicPrintout', wopParm);
        },

        /**
         * @private @method openPostURLinWindow
         * Sends the gathered map data to the server to save them/publish the map.
         *
         * @param {String} geoJson Stringified GeoJSON
         * @param {String} tileData Stringified tile data
         * @param {Object} printUrl Url to print service action route GetPrint
         * @param {Object} selections map data as returned by _gatherSelections()
         *
         */
        openPostURLinWindow: function (geoJson, tileData, tableData, printUrl, selections) {
            var me = this;
            var wopParm = 'location=1,' + 'status=1,' + 'scrollbars=1,' + 'width=850,' + 'height=1200';
            if (me._isLandscape(selections)) {
                wopParm = 'location=1,' + 'status=1,' + 'scrollbars=1,' + 'width=1200,' + 'height=850';
            }
            var link = printUrl;
            me.mainPanel.find('#oskari_print_formID').attr('action', link);

            if (geoJson) {
                // UTF-8 Base64 encoding
                var textu8 = unescape(encodeURIComponent(geoJson));
                me.mainPanel.find('input[name=geojson]').val(jQuery.base64.encode(textu8));
            }
            if (tileData) {
                me.mainPanel.find('input[name=tiles]').val(tileData);
            }
            if (tableData) {
                me.mainPanel.find('input[name=tabledata]').val(tableData);
            }

            window.open('about:blank', 'map_popup_111', wopParm);

            me.mainPanel.find('#oskari_print_formID').submit();
        },

        /**
         * @public @method printMap
         * Sends the gathered map data to the server to save them/publish the map.
         *
         * @param {Object} printParams, parameters for printing pdf via print service
         *
         */
        printMap: function (printParams) {
            var me = this;
            me._printMap(printParams, null);
        },

        /**
         * @private @method _printMap
         * Sends the gathered map data to the server to save them/publish the map.
         *
         * @param {Object} selections map data as returned by _gatherSelections()
         * @param {Object} features map data as returned by _gatherFeatures()
         *
         */
        _printMap: function (selections, features) {
            var me = this;
            // base url + layers/location
            var url = Oskari.urls.getRoute('GetPrint') + '&' + selections.maplinkArgs;
            // page size
            url = url + '&pageSize=' + selections.pageSize;
            // title for PDF
            url = url + '&pageTitle=' + encodeURIComponent(selections.pageTitle);
            var contentOptions = [];

            Object.keys(me.contentOptionsMap).forEach(function (optKey) {
                if (selections[optKey]) {
                    contentOptions.push('&' + optKey + '=true');
                }
            });
            // ??
            url = url + contentOptions.join('');
            // png/pdf
            url = url + '&format=' + selections.format;
            // additional layout params for PDF?
            url = url + me._getLayoutParams(selections.pageSize);

            // TODO: what what in the what now? Pretty sure saveFile isn't used or implemented on the server, but keeping it for now just to be on the safe side
            if (selections.saveFile) {
                url = url + '&saveFile=' + selections.saveFile;
            }

            if (selections.scaleText) {
                url = url + '&scaleText=' + selections.scaleText;
            }


            // We need to use the POST method if there's GeoJSON or tile data.
            if (me.instance.geoJson || !jQuery.isEmptyObject(me.instance.tileData) || me.instance.tableJson) {
                var stringifiedJson = me._stringifyGeoJson(me.instance.geoJson);
                var stringifiedTileData = me._stringifyTileData(me.instance.tileData);
                var stringifiedTableData = me._stringifyTableData(me.instance.tableJson);

                Oskari.log('BasicPrintout').debug('PRINT POST URL ' + url);
                me.openPostURLinWindow(stringifiedJson, stringifiedTileData, stringifiedTableData, url, selections);
            } else {
                // Otherwise GET is satisfiable.
                Oskari.log('BasicPrintout').debug('PRINT URL ' + url);
                me.openURLinWindow(url, selections);
            }
        },

        /**
         * @public @method setLayoutParams
         * Set params for backend print layout.
         *
         * @param {Object} printParams, parameters for printing pdf via print service
         */
        setLayoutParams: function (printParams) {
            var me = this;
            me.layoutParams = printParams;
        },

        /**
         * @public @method getLayoutParams
         * Get params for backend print layout.
         * pdf template based on page Size
         *
         * @param {String} pageSize
         */
        _getLayoutParams: function (pageSize) {
            var me = this;
            var params = '';
            var ind = me._getPageMapRectInd(pageSize);

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
         * @private @method _isLandscape
         *
         * @param {Object} JSONobject (_gatherSelections)
         *
         * @return true/false
         * return true, if Landscape print orientation
         */
        _isLandscape: function (selections) {
            return this.sizeOptionsMap[selections.pageSize].id.indexOf('Land') > -1;
        },

        /**
         * @private @method _stringifyGeoJson
         * Get auxiliary graphics in geojson format + styles
         *
         * @param {JSON} geoJson
         *
         * @return {String/null} Stringified JSON or null if param is empty.
         */
        _stringifyGeoJson: function (geoJson) {
            var ret = null;
            if (geoJson) {
                ret = JSON.stringify(geoJson).replace('\"', '"');
            }
            return ret;
        },

        /**
         * @private @method _stringifyTileData
         * Flattens and stringifies tile data for each layer.
         *
         * @param {Object[Array[Object]]} tileData
         *      Object of arrays each containing objects with keys 'bbox' and 'url', eg.
         *      {
         *         'layer1': [ {bbox: '...', url: '...'}, ... ],
         *         'layer2': [ {bbox: '...', url: '...'}, ... ],
         *      }
         *
         * @return {String/null} Stringified data object or null if tileData object is empty.
         */
        _stringifyTileData: function (tileData) {
            if (!jQuery.isEmptyObject(tileData)) {
                var dataArr = [];
                var returnArr;
                var key;

                for (key in tileData) {
                    if (tileData.hasOwnProperty(key)) {
                        dataArr.push(tileData[key]);
                    }
                }
                // dataArr is now an array like this:
                // [ [{}, ...], [{}, ...], ... ]
                returnArr = [].concat.apply([], dataArr);
                return JSON.stringify(returnArr);
            }
            return null;
        },

        /**
         * @private @method _stringifyTableData
         * Stringifies table data.
         *
         * @param {} tableData
         */
        _stringifyTableData: function (tableData) {
            if (!jQuery.isEmptyObject(tableData)) {
                return JSON.stringify(tableData);
            }
            return null;
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
            if (pageSize === 'A4_Landscape') {
                return 1;
            } else if (pageSize === 'A3') {
                return 2;
            } else if (pageSize === 'A3_Landscape') {
                return 3;
            }
            return 0;
        },

        /**
         * @public @method destroy
         * Destroys/removes this view from the screen.
         */
        destroy: function () {
            this.mainPanel.remove();
        },

        /**
         * @public @method hide
         *
         *
         */
        hide: function () {
            this.mainPanel.hide();
        },

        /**
         * @public @method show
         *
         *
         */
        show: function () {
            this.mainPanel.show();
        },

        /**
         * @public @method setEnabled
         *
         * @param {Boolean} e
         *
         */
        setEnabled: function (e) {
            this.isEnabled = e;
        },

        /**
         * @public @method getEnabled
         *
         *
         * @return {Boolean} enabled
         */
        getEnabled: function () {
            return this.isEnabled;
        },

        /**
         * @public @method refresh
         *
         * @param {Boolean} isUpdate
         *
         */
        refresh: function (isUpdate) {
            var me = this;

            // always  update current maps scale
            me._updateScaleToSelected();

            if (isUpdate) {
                this._updateMapPreview();
            } else {
                this._cleanMapPreview();
            }
        },

        /**
         * @public @method getState
         *
         *
         * @return {Object} state
         */
        getState: function () {
            return this._gatherSelections();
        },

        /**
         * @public @method setState
         *
         * @param {Object} formState
         *
         */
        setState: function (formState) {

        }
    }
);
