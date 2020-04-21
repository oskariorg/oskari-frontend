import { SIZE_OPTIONS, FORMAT_OPTIONS, PAGE_OPTIONS, SCALE_OPTIONS, TIME_OPTION, WINDOW_SIZE, PARAMS } from '../constants';
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

        me.mapmodule = me.instance.sandbox.findRegisteredModuleInstance('MainMapModule');

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
        me.timeseriesPlugin = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModuleTimeseriesControlPlugin');
        me.scales = null;
    }, {
        __templates: {
            preview: '<div><img /><span></span></div>',
            previewNotes: '<div class="previewNotes"><span></span></div>',
            location: '<div class="location"></div>',
            tool: '<div class="tool ">' + '<input type="checkbox"/>' + '<label></label></div>',
            buttons: '<div class="buttons"></div>',
            help: '<div class="help icon-info"></div>',
            main: '<div class="basic_printout">' + '<div class="header">' + '<div class="icon-close">' + '</div>' + '<h3></h3>' + '</div>' + '<div class="content">' + '</div>' + '<form method="post" target="map_popup_111" id="oskari_print_formID" style="display:none" action="" ><input name="geojson" type="hidden" value="" id="oskari_geojson"/><input name="tiles" type="hidden" value="" id="oskari_tiles"/><input name="tabledata" type="hidden" value="" id="oskari_print_tabledata"/><input name="customStyles" type="hidden" value=""/></form>' + '</div>',
            format: '<div class="printout_format_cont printout_settings_cont"><div class="printout_format_label"></div></div>',
            mapTitle: '<div class="printout_title_cont printout_settings_cont"><div class="printout_title_label"></div><input class="printout_title_field" type="text"></div>',
            optionPage: '<div class="printout_option_cont printout_settings_cont">' + '<input type="checkbox" />' + '<label></label></div>',
            optionTool: '<div class="tool">' + '<input type="radio"/>' + '<label class="printout_radiolabel"></label></div>',
            scaleSelection: '<div class="scaleselection">' + '<select name="scaleselect" />' + '</div>',
            contentOptions: '<div class=""/>'
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
            content.find('div.header div.icon-close').on('click', function () {
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

            if (me.instance.conf.scaleSelection) {
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
            SIZE_OPTIONS.forEach(function (option, i) {
                const { value, width, height } = option;
                var toolContainer = me.template.optionTool.clone();
                let label = me.loc.size.options[value];
                const id = 'printout-size-' + value;
                if (width && height) {
                    label = label + ' (' + width + ' x ' + height + 'px)';
                }
                toolContainer.find('label').append(label).attr('for', id);
                const input = toolContainer.find('input');
                if (i === 0) {
                    input.prop('checked', true);
                }
                input.attr({
                    value,
                    name: 'printout-size',
                    id
                });
                input.on('change', function () {
                    me._cleanMapPreview();
                    me._updateMapPreview();
                });
                contentPanel.append(toolContainer);
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


            var format = me.template.format.clone();
            format.find('.printout_format_label').html(me.loc.format.label);

            FORMAT_OPTIONS.forEach(function (option, i) {
                const { name, mime } = option;
                var toolContainer = me.template.optionTool.clone();
                const id = 'printout-format-' + name;
                const label = me.loc.format.options[name];
                toolContainer.find('label').append(label).attr('for', id);
                const input = toolContainer.find('input');
                if (i === 0) {
                    input.prop('checked', true);
                }
                input.attr({
                    value: mime,
                    name: 'printout-format',
                    id
                });
                input.on('change', function () {
                    if (name === 'png') {
                        contentOptions.find('input').prop('disabled', true);
                    } else {
                        contentOptions.find('input').prop('disabled', false);
                    }
                });
                format.append(toolContainer);
            });
            contentPanel.append(format);
            /* --- options available for pdf --- */
            const contentOptions = me.template.contentOptions.clone();
            var mapTitle = me.template.mapTitle.clone();
            mapTitle.find('.printout_title_label').html(me.loc.mapTitle.label);
            mapTitle.find('.printout_title_field').attr('placeholder', me.loc.mapTitle.label);
            contentOptions.append(mapTitle);
            const options = [...PAGE_OPTIONS];
            if (this._isTimeSeriesActive()) {
                options.push(TIME_OPTION);
            } // TODO puske tai poista pageScale !== m
            options.forEach(function (value) {
                var opt = me.template.optionPage.clone();
                const id = 'printout-page-' + value;
                opt.find('input').attr({ id, value }).prop('checked', true);
                const label = me.loc.content[value].label;
                opt.find('label').html(label).attr('for', id);
                contentOptions.append(opt);
            });
            contentPanel.append(contentOptions);
            // scale line on print isn't implemented for non-metric projections so hide the choice here.
            // TODO
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

            const checkUnsupportedLayers = () => {
                const layerNames = this.instance.sandbox.findAllSelectedMapLayers()
                    .filter(l => l.getLayerType() === 'wmts')
                    .map(l => l.getName());
                if (layerNames.length === 0) return;
                const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                const message = '<div>' + me.loc.scale.unsupportedLayersMessage + ':</div><ul><li>' + layerNames.join('</li><li>') + '</li></ul>';
                var btn = dialog.createCloseButton();
                btn.setPrimary(true);
                dialog.show(me.loc.scale.unsupportedLayersTitle, message, [btn]);
                dialog.fadeout();
            };
            const handleInputChange = value => {
                console.log(value);
                if (value === 'configured') {
                    selection.show();
                    checkUnsupportedLayers();
                    this._updateScaleToSelected(true);
                    this.instance.sandbox.postRequestByName('DisableMapKeyboardMovementRequest', [['zoom']]);
                    this.instance.sandbox.postRequestByName('DisableMapMouseMovementRequest', [['zoom']]);
                } else {
                    selection.hide();
                    this.instance.sandbox.postRequestByName('EnableMapKeyboardMovementRequest', [['zoom']]);
                    this.instance.sandbox.postRequestByName('EnableMapMouseMovementRequest', [['zoom']]);
                }
                this._cleanMapPreview();
                this._updateMapPreview();
            };

            SCALE_OPTIONS.forEach(function (value, i) {
                var toolContainer = me.template.optionTool.clone();
                var label = me.loc.scale[value];
                const id = 'printout-scale-' + value;
                toolContainer.find('label').append(label).attr('for', id);
                const input = toolContainer.find('input');
                if (i === 0) {
                    input.prop('checked', true);
                }
                input.attr({
                    id,
                    value,
                    name: 'printout-scale'
                });
                input.on('change', () => handleInputChange(value));
                contentPanel.append(toolContainer);
            });

            const scales = me.instance.conf.scales || me.mapmodule.getScaleArray().slice().reverse();
            const selection = me.template.scaleSelection.clone();
            const select = selection.find('select');
            scales.forEach(function (scale) {
                var opt = jQuery('<option></option>');
                opt.attr('value', scale);
                opt.html('1:' + scale);
                select.append(opt);
            });
            select.on('change', function () {
                console.log(this.value);
                me.mapmodule.zoomToScale(this.value, false);
                me._cleanMapPreview();
                me._updateMapPreview();
            });
            this.scales = scales;
            contentPanel.append(selection);

            return panel;
        },

        /**
         * Update selected scale to option
         * @method  _updateScaleToSelected
         * @private
         */
        _updateScaleToSelected: function (selectFirst) {
            var select = this.mainPanel.find('.scaleselection select');
            const scales = this.scales;
            const mapScale = this.mapmodule.getMapScale();
            if (scales && scales.includes(mapScale)) {
                select.val(scales);
            }
            // else select first option
            else if (selectFirst === true) {
                select.val(select.find('option:first').val());
                select.trigger('change');
            }
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
        _isTimeSeriesActive: function () {
            const hasLayers =
                    this.instance.sandbox.findAllSelectedMapLayers()
                        .filter(l => l.getAttributes().times).length > 0;
            return hasLayers && !!this.timeseriesPlugin;
        },

        /**
         * @private @method _updateMapPreview
         */
        _updateMapPreview: function () {
            var me = this;
            const url = this._getUrlForPreview(200);
            const isLandscape = this._isLandscape();
            const cls = isLandscape ? 'preview preview-landscape' : 'preview preview-portrait';
            me.previewContent.attr('class', cls);

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
            const url = this._getUrlForPreview();
            this.openURLinWindow(url);
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
                me.printMap();
            });
            saveBtn.insertTo(buttonCont);

            return buttonCont;
        },

        /**
         * @private @method _gatherParams
         * Gathers selections and returns them as JSON object
         *
         * @return {Object}
         */
        _gatherParams: function () {
            const container = this.mainPanel;
            const sandbox = this.instance.getSandbox();
            const pageSize = this._getPageSize();
            const format = container.find('input[name=printout-format]:checked').val() || FORMAT_OPTIONS[0].mime;
            
            var resolution = sandbox.getMap().getResolution();

            var scale = jQuery('div.basic_printout select[name=scaleselect]').val();
            var scaleText = '';

            if (this.instance.conf.scaleSelection && this.scaleOptionsMap.usedefinedscale.selected) {
                resolution = this.mapmodule.getExactResolution(scale);
                scaleText = '1:' + scale;
            }
            const pageTitle = encodeURIComponent(container.find('.printout_title_field').val());
            const srs = sandbox.getMap().getSrsName();
            const customStyles = this._getSelectedCustomStyles();
            // printMap has been called outside so keep this separation for mapLinkArgs and selections
            var maplinkArgs = sandbox.generateMapLinkParameters({ srs, resolution, scaleText });
            var selections = {};

            container.find('.printout_option_cont input').each(function () {
                if (this.checked === true) {
                    selections[this.value] = true;
                }
            });
            console.log(maplinkArgs);
            console.log(selections);
            return { maplinkArgs, pageSize, format, customStyles, pageTitle, ...selections };
        },
        _getUrlForPreview: function (scaledWidth) {
            const pageSize = this._getPageSize();
            const map = Oskari.getSandbox().getMap();
            const baseLayer = this.mapmodule.getBaseLayer();

            let mapLayers = '';
            if (baseLayer) {
                mapLayers = baseLayer.getId() + ' ' +
                baseLayer.getOpacity() + ' ' +
                baseLayer.getCurrentStyle().getName();
            }

            let url = Oskari.urls.getRoute('GetPrint') +
                '&format=image/png' +
                '&pageSize=' + pageSize +
                '&resolution=' + map.getResolution() +
                '&srs=' + map.getSrsName() +
                '&coord=' + map.getX() + '_' + map.getY() +
                '&mapLayers=' + mapLayers;

            if (Number.isInteger(scaledWidth)) {
                url += '&scaledWidth=' + scaledWidth;
            }

            return url;
        },
        _getWindowSpecs: function () {
            const isLandscape = this._isLandscape();
            const width = isLandscape ? WINDOW_SIZE[1] : WINDOW_SIZE[0];
            const height = isLandscape ? WINDOW_SIZE[0] : WINDOW_SIZE[1];
            return `location=1,status=1,scrollbars=1,width=${width},height=${height}`;
        },
        _getSelectedCustomStyles: function () {
            const customStyles = {};
            const selectedLayers = Oskari.getSandbox().findAllSelectedMapLayers();

            selectedLayers.forEach(l => {
                if (l.getCurrentStyle().getName() === 'oskari_custom') {
                    customStyles[l.getId()] = l.getCustomStyle();
                }
            });

            return JSON.stringify(customStyles);
        },
        /**
         * @public @method openURLinWindow
         *
         * @param {String} infoUrl
         * @param {boolean} isLandscape
         *
         */
        openURLinWindow: function (infoUrl) {
            const wopParm = this._getWindowSpecs();
            window.open(infoUrl, 'BasicPrintout', wopParm);
        },

        /**
         * @private @method openPostURLinWindow
         * Sends the gathered map data to the server to save them/publish the map.
         *
         * @param {String} printUrl Url to print service action route GetPrint
         * @param {String} geoJson Stringified GeoJSON
         * @param {String} tileData Stringified tile data
         * @param {String} customStyles Stringified styles
         *
         */
        openPostURLinWindow: function (printUrl, geoJson, tileData, tableData, customStyles) {
            var me = this;
            var wopParm = this._getWindowSpecs();
            me.mainPanel.find('#oskari_print_formID').attr('action', printUrl);
            me.mainPanel.find('input[name=customStyles]').val(customStyles);
            // Are these used anymore??
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
         * @method printMap
         * Sends the gathered map data to the server to save them/publish the map.
         *
         * @param {Object} selections map data as returned by _gatherSelections()
         *
         */
        printMap: function (selections) {
            const { maplinkArgs, pageTimeSeriesTime, customStyles, ...params } = selections || this._gatherSelections();
            if (this._isTimeSeriesActive()) { // riittääkö että option mukana pakotettun true/false ja voiko kerätä selections
                params[PARAMS.TIME] = this.timeseriesPlugin.getCurrentTime();
                if (pageTimeSeriesTime) {
                    params[PARAMS.FORMATTED_TIME] = this.timeseriesPlugin.getCurrentTimeFormatted();
                    params[PARAMS.SERIES_LABEL] = 'timeseriesPrintLabel'; // this.contentOptionsMap.pageTimeSeriesTime.printLabel; //TODO selections mukana
                }
            }
            const paramsList = Object.keys(params).map(key => '&' + key + '=' + params[key]);
            let url = Oskari.urls.getRoute('GetPrint') + '&' + maplinkArgs + paramsList.join('');

            // additional layout params for PDF? is needed??
            url = url + this._getLayoutParams(selections.pageSize);
            console.log(selections);
            const hasCustomStyles = Object.keys(customStyles).length > 0;
            const hasTileData = Object.keys(this.instance.tileData).length > 0;
            // We need to use the POST method if there's GeoJSON or tile data.
            if (hasTileData || hasCustomStyles || this.instance.tableJson) {
                var stringifiedJson = this._stringifyGeoJson(null);
                var stringifiedTileData = this._stringifyTileData(this.instance.tileData);
                var stringifiedTableData = this._stringifyTableData(this.instance.tableJson);
                Oskari.log('BasicPrintout').debug('PRINT POST URL ' + url);
                this.openPostURLinWindow(url, stringifiedJson, stringifiedTileData, stringifiedTableData, customStyles);
            } else {
                // Otherwise GET is satisfiable.
                Oskari.log('BasicPrintout').warn('PRINT URL ' + url);
                this.openURLinWindow(url);
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
        // TODO is this needed??
        _getLayoutParams: function (pageSize) {
            var me = this;
            var params = '';
            var ind = SIZE_OPTIONS.findIndex(opt => opt.value === pageSize);
            console.log('INDEX', ind, me.layoutParams);

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
         * @return true/false
         * return true, if Landscape print orientation
         */
        _isLandscape: function (pageSize) {
            const ps = pageSize || this._getPageSize();
            const opt = SIZE_OPTIONS.find(o => o.value === ps);
            return opt ? opt.landscape : SIZE_OPTIONS[0].landscape;
        },
        _getPageSize: function () {
            return this.mainPanel.find('input[name=printout-size]:checked').val() || SIZE_OPTIONS[0].value;
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
                ret = JSON.stringify(geoJson).replace('"', '"');
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
