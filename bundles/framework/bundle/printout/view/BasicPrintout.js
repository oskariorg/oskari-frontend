/**
 * @class Oskari.mapframework.bundle.printout.view.BasicPrintout
 * Renders the printouts "publish mode" sidebar view where the user can make
 * selections regarading the map to publish.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.printout.view.BasicPrintout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.printout.PrintoutBundleInstance} instance
     *      reference to component that created this view
     * @param {Object} localization
     *      localization data in JSON format
     * @param {Object} backendConfiguration
     *      backend URL configuration for ajax and image requests
     * @param {Object} formState
     *      formState for ui state reload
     */

    function (instance, localization, backendConfiguration) {
        var me = this;
        this.isEnabled = false;
        this.instance = instance;
        this.loc = localization;
        this.backendConfiguration = backendConfiguration;
        this.legendInProcess = false;
        this.isParcelMode = false;

        /* templates */
        this.template = {};
        var p,
            s,
            f;
        for (p in this.__templates) {
            if (this.__templates.hasOwnProperty(p)) {
                this.template[p] = jQuery(this.__templates[p]);
            }
        }

        // Layout params, pdf template
        this.layoutParams = {};

        /* page sizes listed in localisations */
        this.sizeOptions = this.loc.size.options;

        this.sizeOptionsMap = {};
        for (s = 0; s < this.sizeOptions.length; s++) {
            this.sizeOptionsMap[this.sizeOptions[s].id] = this.sizeOptions[s];
        }

        /* format options listed in localisations */
        this.formatOptions = this.loc.format.options;
        this.formatOptionsMap = {};
        for (f = 0; f < this.formatOptions.length; f++) {
            this.formatOptionsMap[this.formatOptions[f].id] = this.formatOptions[f];
        }

        /* content options listed in localisations */
        this.contentOptions = this.loc.content.options;
        this.contentOptionsMap = {};
        for (f = 0; f < this.contentOptions.length; f++) {
            this.contentOptionsMap[this.contentOptions[f].id] = this.contentOptions[f];
        }

        /* legend options listed in localisations */
        this.legendOptions = this.loc.legend.options;
        this.legendOptionsMap = {};
        for (f = 0; f < this.legendOptions.length; f++) {
            this.legendOptionsMap[this.legendOptions[f].id] = this.legendOptions[f];
        }

        this.accordion = null;
        this.mainPanel = null;
        this.sizePanel = null;
        this.backBtn = null;

        this.progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
        this.alert = Oskari.clazz.create('Oskari.userinterface.component.Alert');

        this.previewContent = null;
        this.previewImgDiv = null;

        this.contentOptionDivs = {};

    }, {
        __templates: {
            "preview": '<div class="preview"><img /><span></span></div>',
            "previewNotes": '<div class="previewNotes"><span></span></div>',
            "location": '<div class="location"></div>',
            "tool": '<div class="tool ">' + '<input type="checkbox"/>' + '<label></label></div>',
            "buttons": '<div class="buttons"></div>',
            "help": '<div class="help icon-info"></div>',
            "main": '<div class="basic_printout">' + '<div class="header">' + '<div class="icon-close">' + '</div>' + '<h3></h3>' + '</div>' + '<div class="content">' + '</div>' + '<form method="post" target="map_popup_111" id="oskari_print_formID" style="display:none" action="" ><input name="geojson" type="hidden" value="" id="oskari_geojson"/><input name="tiles" type="hidden" value="" id="oskari_tiles"/><input name="tabledata" type="hidden" value="" id="oskari_print_tabledata"/></form>' + '</div>',
            "format": '<div class="printout_format_cont printout_settings_cont"><div class="printout_format_label"></div></div>',
            "formatOptionTool": '<div class="tool ">' + '<input type="radio" name="format" />' + '<label></label></div>',
            "legend": '<div class="printout_legend_cont printout_settings_cont"><div class="printout_legend_label"></div></div>',
            "legendOptionTool": '<div class="tool ">' + '<input type="radio" name="legend" />' + '<label></label></div>',
            "title": '<div class="printout_title_cont printout_settings_cont"><div class="printout_title_label"></div><input class="printout_title_field" type="text"></div>',
            "option": '<div class="printout_option_cont printout_settings_cont">' + '<input type="checkbox" />' + '<label></label></div>',
            "sizeOptionTool": '<div class="tool ">' + '<input type="radio" name="size" />' + '<label></label></div>'
        },
        /**
         * @method render
         * Renders view to given DOM element
         * @param {jQuery} container reference to DOM element this component will be
         * rendered to
         */
        render: function (container) {
            var me = this;
            var content = this.template.main.clone();

            this.mainPanel = content;
            content.find('div.header h3').append(this.loc.title);

            container.append(content);
            var contentDiv = content.find('div.content');

            this.alert.insertTo(contentDiv);

            var accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
            this.accordion = accordion;

            this.sizePanel = this._createSizePanel();
            this.sizePanel.open();

            accordion.addPanel(this.sizePanel);

            var settingsPanel = this._createSettingsPanel();
            accordion.addPanel(settingsPanel);

            var previewPanel = this._createPreviewPanel();
            previewPanel.open();

            accordion.addPanel(previewPanel);

            /*var scalePanel = this._createLocationAndScalePanel();
         scalePanel.open();

         accordion.addPanel(scalePanel);*/

            accordion.insertTo(contentDiv);

            // Legend setup visible only if statslayer is visible
            this._setLegendVisibility();

            // buttons
            // close
            container.find('div.header div.icon-close').bind('click', function () {
                me.instance.setPublishMode(false);
            });
            contentDiv.append(this._getButtons());

            var inputs = this.mainPanel.find('input[type=text]');
            inputs.focus(function () {
                me.instance.sandbox.postRequestByName('DisableMapKeyboardMovementRequest');
            });
            inputs.blur(function () {
                me.instance.sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
            });
            // bind help tags
            var helper = Oskari.clazz.create('Oskari.userinterface.component.UIHelper', this.instance.sandbox);
            helper.processHelpLinks(this.loc.help, content, this.loc.error.title, this.loc.error.nohelp);

        },
        /**
         * @method _createSizePanel
         * @private
         * Creates the size selection panel for printout
         * @return {jQuery} Returns the created panel
         */
        _createSizePanel: function () {
            var me = this;
            var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            panel.setTitle(this.loc.size.label);
            var contentPanel = panel.getContainer();
            // tooltip
            var tooltipCont = this.template.help.clone(),
                i;
            tooltipCont.attr('title', this.loc.size.tooltip);
            contentPanel.append(tooltipCont);
            // content
            var closureMagic = function (tool) {
                return function () {
                    var size = contentPanel.find('input[name=size]:checked').val(),
                        i;
                    // reset previous setting
                    for (i = 0; i < me.sizeOptions.length; ++i) {
                        me.sizeOptions[i].selected = false;
                    }
                    tool.selected = true;
                    me._cleanMapPreview();
                    me._updateMapPreview();
                    // Update legend
                    me._createLegend();
                };
            };
            for (i = 0; i < this.sizeOptions.length; ++i) {
                var option = this.sizeOptions[i];
                var toolContainer = this.template.sizeOptionTool.clone();
                var label = option.label;
                if (option.width && option.height) {
                    label = label + ' (' + option.width + ' x ' + option.height + 'px)';
                }
                toolContainer.find('label').append(label).attr({
                    'for': option.id,
                    'class': 'printout_radiolabel'
                });
                if (option.selected) {
                    toolContainer.find('input').attr('checked', 'checked');
                }
                contentPanel.append(toolContainer);
                toolContainer.find('input').attr({
                    'value': option.id,
                    'name': 'size',
                    'id': option.id
                });
                toolContainer.find('input').change(closureMagic(option));
            }

            return panel;
        },
        /**
         * @method _createSettingsPanel
         * @private
         * Creates a settings panel for printout
         * @return {jQuery} Returns the created panel
         */
        _createSettingsPanel: function () {
            var me = this;
            var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            panel.setTitle(this.loc.settings.label);
            var contentPanel = panel.getContainer();
            // tooltip
            var tooltipCont = this.template.help.clone();
            tooltipCont.attr('title', this.loc.settings.tooltip);
            contentPanel.append(tooltipCont);

            var closureMagic = function (tool) {
                return function () {
                    var format = contentPanel.find('input[name=format]:checked').val(),
                        i;
                    // reset previous setting
                    for (i = 0; i < me.formatOptions.length; ++i) {
                        me.formatOptions[i].selected = false;
                    }
                    tool.selected = true;

                };
            };
            /* format options from localisations files */
            var format = this.template.format.clone(),
                i,
                f,
                option,
                toolContainer,
                label;
            format.find('.printout_format_label').html(this.loc.format.label);
            for (i = 0; i < this.formatOptions.length; ++i) {
                option = this.formatOptions[i];
                toolContainer = this.template.formatOptionTool.clone();
                label = option.label;

                toolContainer.find('label').append(label).attr({
                    'for': option.id,
                    'class': 'printout_radiolabel'
                });
                if (option.selected) {
                    toolContainer.find('input').attr('checked', 'checked');
                }
                format.append(toolContainer);
                toolContainer.find('input').attr({
                    'value': option.format,
                    'name': 'format',
                    'id': option.id
                });
                toolContainer.find('input').change(closureMagic(option));
            }
            contentPanel.append(format);

            var mapTitle = this.template.title.clone();
            mapTitle.find('.printout_title_label').html(this.loc.mapTitle.label);
            mapTitle.find('.printout_title_field').attr({
                'value': '',
                'placeholder': this.loc.mapTitle.label
            });

            contentPanel.append(mapTitle);

            /* CONTENT options from localisations files */

            for (f = 0; f < this.contentOptions.length; f++) {
                var dat = this.contentOptions[f];

                var opt = this.template.option.clone();
                opt.find('input').attr({
                    'id': dat.id,
                    'checked': dat.checked
                });
                opt.find('label').html(dat.label).attr({
                    'for': dat.id,
                    'class': 'printout_checklabel'
                });
                this.contentOptionDivs[dat.id] = opt;
                contentPanel.append(opt);

            }

            // Lengend options
            var closureMagic2 = function (tool) {
                return function () {
                    var legend = contentPanel.find('input[name=legend]:checked').val(),
                        i;
                    // reset previous setting
                    for (i = 0; i < me.legendOptions.length; ++i) {
                        me.legendOptions[i].selected = false;
                    }
                    tool.selected = true;

                };
            };

            var legend = this.template.legend.clone();
            legend.find('.printout_legend_label').html(this.loc.legend.label);
            for (i = 0; i < this.legendOptions.length; ++i) {
                option = this.legendOptions[i];
                toolContainer = this.template.legendOptionTool.clone();
                label = option.label;

                toolContainer.find('label').append(label).attr({
                    'for': option.id,
                    'class': 'printout_radiolabel'

                });
                if (option.selected) {
                    toolContainer.find('input').attr('checked', 'checked');
                }
                legend.append(toolContainer);
                toolContainer.find('input').attr({
                    'value': option.loca,
                    'name': 'location',
                    'id': option.id
                });
                toolContainer.find('input').change(closureMagic2(option));
                toolContainer.find('input[name="location"]').click(function () {
                    // Legend stuff
                    me._createLegend();
                });
            }
            contentPanel.append(legend);

            return panel;
        },
        /**
         * @method _createSizePanel
         * @private
         * Creates the size selection panel for printout
         * @return {jQuery} Returns the created panel
         */
        _createPreviewPanel: function () {
            var me = this;
            var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            panel.setTitle(this.loc.preview.label);
            var contentPanel = panel.getContainer();

            var tooltipCont = this.template.help.clone();
            tooltipCont.attr('title', this.loc.preview.tooltip);
            contentPanel.append(tooltipCont);

            var previewContent = this.template.preview.clone();

            contentPanel.append(previewContent);

            /* progress */
            me.progressSpinner.insertTo(previewContent);

            var previewImgDiv = previewContent.find('img');
            previewImgDiv.click(function () {
                me.showFullScaleMapPreview();
            });
            var previewSpan = previewContent.find('span');

            this.previewContent = previewContent;
            this.previewImgDiv = previewImgDiv;
            this.previewSpan = previewSpan;
            var p;
            for (p in this.loc.preview.notes) {
                if (this.loc.preview.notes.hasOwnProperty(p)) {
                    var previewNotes = this.template.previewNotes.clone();
                    previewNotes.find('span').text(this.loc.preview.notes[p]);
                    contentPanel.append(previewNotes);
                }
            }

            return panel;
        },
        /**
         * @method _createSizePanel
         * @private
         * Creates the size selection panel for printout
         * @return {jQuery} Returns the created panel
         */
        _createLocationAndScalePanel: function () {
            var me = this;
            var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            panel.setTitle(this.loc.location.label);
            var contentPanel = panel.getContainer();

            var tooltipCont = this.template.help.clone();
            tooltipCont.attr('title', this.loc.location.tooltip);
            contentPanel.append(tooltipCont);

            var locationContent = this.template.location.clone();

            contentPanel.append(locationContent);

            return panel;
        },
        _cleanMapPreview: function () {
            var loc = this.loc;
            var previewImgDiv = this.previewImgDiv,
                previewSpan = this.previewSpan;
            previewImgDiv.hide();
            previewSpan.text(loc.preview.pending);
        },
        _updateMapPreview: function () {
            var me = this;
            var selections = this._gatherSelections("image/png");

            var urlBase = this.backendConfiguration.formatProducers[selections.format];
            var maplinkArgs = selections.maplinkArgs;
            var pageSizeArgs = "&pageSize=" + selections.pageSize;
            var previewScaleArgs = "&scaledWidth=200";
            var url = urlBase + maplinkArgs + pageSizeArgs + previewScaleArgs;

            this.previewContent.removeClass('preview-portrait');
            this.previewContent.removeClass('preview-landscape');
            this.previewContent.addClass(this.sizeOptionsMap[selections.pageSize].classForPreview);

            var previewImgDiv = this.previewImgDiv,
                previewSpan = this.previewSpan;

            me.progressSpinner.start();
            window.setTimeout(function () {
                previewImgDiv.imagesLoaded(function () {
                    previewSpan.text('');
                    previewImgDiv.fadeIn('slow', function () {
                        me.progressSpinner.stop();

                    });
                });
                previewImgDiv.attr('src', url);

            }, 100);
        },
        showFullScaleMapPreview: function () {
            var selections = this._gatherSelections("image/png");
            var urlBase = this.backendConfiguration.formatProducers[selections.format];
            var maplinkArgs = selections.maplinkArgs;
            var pageSizeArgs = "&pageSize=" + selections.pageSize;
            var url = urlBase + maplinkArgs + pageSizeArgs;
            this.openURLinWindow(url, selections);

        },
        /**
         * @method _getButtons
         * @private
         * Renders printout buttons to DOM snippet and returns it.
         * @return {jQuery} container with buttons
         */
        _getButtons: function () {
            var me = this;

            var buttonCont = this.template.buttons.clone();

            var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelBtn.setTitle(this.loc.buttons.cancel);
            cancelBtn.setHandler(function () {
                me.instance.setPublishMode(false);
                // Send print canceled event
                me.instance.sendCanceledEvent('cancel');
            });
            cancelBtn.insertTo(buttonCont);

            me.backBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            me.backBtn.setTitle(this.loc.buttons.back);
            me.backBtn.setHandler(function () {
                me.instance.setPublishMode(false);
                // Send print canceled event previous
                me.instance.sendCanceledEvent('previous');
            });
            me.backBtn.insertTo(buttonCont);
            me.backBtn.hide();

            var saveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            saveBtn.setTitle(this.loc.buttons.save);
            saveBtn.addClass('primary');
            saveBtn.setHandler(function () {
                var map = me.instance.sandbox.getMap();
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
         * @method _gatherSelections
         * @private
         * Gathers printout selections and returns them as JSON object
         * @return {Object}
         */
        _gatherSelections: function (format) {
            var container = this.mainPanel;
            var sandbox = this.instance.getSandbox();

            var size = container.find('input[name=size]:checked').val();
            var selectedFormat = (format !== null && format !== undefined) ? format : container.find('input[name=format]:checked').val();
            var title = container.find('.printout_title_field').val();

            var maplinkArgs = sandbox.generateMapLinkParameters();

            var selections = {
                pageTitle: title,
                pageSize: size,
                maplinkArgs: maplinkArgs,
                format: selectedFormat || "application/pdf"
            };
            var p;
            for (p in this.contentOptionsMap) {
                if (this.contentOptionsMap.hasOwnProperty(p)) {
                    selections[p] = this.contentOptionDivs[p].find('input').prop('checked');
                }
            }

            return selections;

        },
        openURLinWindow: function (infoUrl, selections) {
            var wopParm = "location=1," + "status=1," + "scrollbars=1," + "width=850," + "height=1200";
            if (this._isLandscape(selections)) {
                wopParm = "location=1," + "status=1," + "scrollbars=1," + "width=1200," + "height=850";
            }
            var link = infoUrl;
            window.open(link, "BasicPrintout", wopParm);
        },
        /**
         * @method openPostURLinWindow
         * @private
         * Sends the gathered map data to the server to save them/publish the map.
         * @param {String} geoJson Stringified GeoJSON
         * @param {String} tileData Stringified tile data
         * @param {Object} printUrl Url to print service action route GetPreview
         * @param {Object} selections map data as returned by _gatherSelections()
         */
        openPostURLinWindow: function (geoJson, tileData, tableData, printUrl, selections) {
            var me = this;
            var wopParm = "location=1," + "status=1," + "scrollbars=1," + "width=850," + "height=1200";
            if (this._isLandscape(selections)) {
                wopParm = "location=1," + "status=1," + "scrollbars=1," + "width=1200," + "height=850";
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
            if(!me.isParcelMode) window.open('about:blank', 'map_popup_111', wopParm);
            me.mainPanel.find('#oskari_print_formID').submit();
        },
        /**
         * @method printMap
         * Sends the gathered map data to the server to save them/publish the map.
         * @param {Object} printParams, parameters for printing pdf via print service
         */
        printMap: function (printParams) {
            var me = this;
            me._printMap(printParams, null);
        },
        /**
         * @method _printMap
         * @private
         * Sends the gathered map data to the server to save them/publish the map.
         * @param {Object} selections map data as returned by _gatherSelections()
         * @param {Object} features map data as returned by _gatherFeatures()
         */
        _printMap: function (selections, features) {
            var me = this;
            var sandbox = this.instance.getSandbox();
            var url = sandbox.getAjaxUrl();

            var urlBase = this.backendConfiguration.formatProducers[selections.format];

            var maplinkArgs = selections.maplinkArgs;
            var pageSizeArgs = "&pageSize=" + selections.pageSize;
            var pageTitleArgs = "&pageTitle=" + encodeURIComponent(selections.pageTitle);
            var saveFileArgs = "";
            if(selections.saveFile) saveFileArgs = "&saveFile=" + selections.saveFile;
            var layoutArgs = me._getLayoutParams(selections.pageSize);

            var contentOptions = [],
                p;
            for (p in this.contentOptionsMap) {
                if (this.contentOptionsMap.hasOwnProperty(p)) {
                    if (selections[p]) {
                        contentOptions.push("&" + p + "=true");
                    }
                }
            }
            var contentOptionArgs = contentOptions.join('');
            var formatArgs = "&format=" + selections.format;

            var parameters = maplinkArgs + '&action_route=GetPreview' + pageSizeArgs + pageTitleArgs + contentOptionArgs + formatArgs + saveFileArgs + layoutArgs;
            url = url + parameters;

            // We need to use the POST method if there's GeoJSON or tile data.
            if (this.instance.geoJson || !jQuery.isEmptyObject(this.instance.tileData) || this.instance.tableJson ) {
                var stringifiedJson = this._stringifyGeoJson(this.instance.geoJson),
                    stringifiedTileData = this._stringifyTileData(this.instance.tileData),
                    stringifiedTableData = this._stringifyTableData(this.instance.tableJson);

                this.instance.getSandbox().printDebug("PRINT POST URL " + url);
                this.openPostURLinWindow(stringifiedJson, stringifiedTileData, stringifiedTableData, url, selections);
            } else {
                // Otherwise GET is satisfiable.
                this.instance.getSandbox().printDebug("PRINT URL " + url);
                this.openURLinWindow(url, selections);
            }
        },
        /**
         * @method  modifyUIConfig4Parcel
         * Modify default UI config.
         * @param {Object} printParams, parameters for printing pdf via print service
         */
        modifyUIConfig4Parcel: function (printParams) {
            var me = this;
            var container = me.mainPanel;

            me.isParcelMode = true;
            container.find('div.header h3').empty();
            container.find('div.header h3').append(me.loc.title+ " (3/3)");

            // Print title
            container.find('.printout_title_field').attr("value",printParams.pageTitle);

            if(me.sizePanel) me.sizePanel.close();
            container.find('div.accordion_panel').first().next().hide();

            //Add back step button
            me.backBtn.show();

        },
        /**
         * @method setLayoutParams
         * Set params for backend print layout.
         * @param {Object} printParams, parameters for printing pdf via print service
         */
        setLayoutParams: function (printParams) {
            var me = this;
            me.layoutParams = printParams;

        },
        /**
         * @method getLayoutParams
         * Get params for backend print layout.
         * pdf template based on page Size
         */
        _getLayoutParams: function (pageSize) {
            var params = "",
                ind = this._getPageMapRectInd(pageSize);
            if (this.layoutParams.pageTemplate) params = "&pageTemplate="+ this.layoutParams.pageTemplate + "_" + pageSize + ".pdf";
            if (this.layoutParams.pageMapRect) {
                if (ind < this.layoutParams.pageMapRect.length)  params = params + "&pageMapRect=" + this.layoutParams.pageMapRect[ind];
            }
            if (this.layoutParams.tableTemplate) params = params + "&tableTemplate=" + this.layoutParams.tableTemplate + "_" + pageSize;

            return params;

        },
        /**
     * @method _isLandscape
     * @private
     * @param {Object} JSONobject (_gatherSelections)
     @return true/false
     * return true, if Landscape print orientation
     */
        _isLandscape: function (selections) {
            var ret = false;
            if (this.sizeOptionsMap[selections.pageSize].id.indexOf('Land') > -1) {
                ret = true;
            }
            return ret;
        },

        /**
         * Get auxiliary graphics in geojson format + styles
         *
         * @method _stringifyGeoJson
         * @private
         * @param {JSON} geoJson
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
         * Flattens and stringifies tile data for each layer.
         *
         * @method _stringifyTileData
         * @private
         * @param {Object[Array[Object]]} tileData
         *      Object of arrays each containing objects with keys 'bbox' and 'url', eg.
         *      {
         *         'layer1': [ {bbox: '...', url: '...'}, ... ],
         *         'layer2': [ {bbox: '...', url: '...'}, ... ],
         *      }
         * @return {String/null} Stringified data object or null if tileData object is empty.
         */
        _stringifyTileData: function (tileData) {
            if (!jQuery.isEmptyObject(tileData)) {
                var dataArr = [],
                    returnArr,
                    key;

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
        _stringifyTableData: function (tableData) {
            if (!jQuery.isEmptyObject(tableData)) {
                return JSON.stringify(tableData);
            }
            return null;
        },

        /**
         * @method _setLegendVisibility
         * Legend parameters UI visible on/off
         *
         * @private
         *
         */
        _setLegendVisibility: function () {
            var container = this.mainPanel;

            if (this._hasStatsLayers()) {
                container.find('.printout_legend_cont').show();
            } else {
                container.find('.printout_legend_cont').hide();
            }
        },
        /**
         * @method _hasStatsLayers
         * Check if stats layers are selected
         *
         * @private
         * @return{boolean} true; statslayers exists
         *
         */
        _hasStatsLayers: function () {
            var layers = this.instance.getSandbox().findAllSelectedMapLayers(),
                i;
            // request updates for map tiles
            for (i = 0; i < layers.length; i++) {
                if (layers[i].isLayerOfType('STATS')) {
                    if (layers[i].isVisible()) {
                        return true;
                    }

                }
            }
            return false;
        },
        /**
         * @method _createLegend
         * Creates geojson legend for print service
         * Only for statslayer and statsgrid legend
         * @private
         * @
         *
         */
        _createLegend: function () {
            var me = this;
            // only if any statslayer visible 
            me._setLegendVisibility();
            if (!me._hasStatsLayers()) {
                return;
            }

            // Is geostat legend available
            // get div where the map is rendered from openlayers
            var map = this.instance.sandbox.getMap();
            var container = this.mainPanel;
            var parentContainer = jQuery('#contentMap');
            // Get legend position
            var legend_pos = container.find('input[name=location]:checked').val();
            if (legend_pos === 'NO') {
                // remove old, if any
                if (me.instance.getSandbox().getMap().GeoJSON) {
                    me.instance.getSandbox().getMap().GeoJSON = null;
                }
                me.instance.legendPlugin.clearLegendLayers();
            } else {
                var legend = parentContainer.find('div.geostats-legend');
                if (legend.length > 0) {
                    if (me.legendInProcess) {
                        return;
                    }
                    me.legendInProcess = true;
                    this._printMapInfo(legend, function (data) {

                        var title = legend.find('.geostats-legend-title').html();
                        // ranges
                        var ranges = [];
                        // loop divs
                        legend.find('div').each(function () {
                            var myclass = jQuery(this).attr('class');
                            if (myclass === undefined || myclass === null) {
                                var legend_row = {
                                    "boxcolor": jQuery(this).find('.geostats-legend-block').attr('style'),
                                    "range": jQuery(this).text()
                                };
                                ranges.push(legend_row);
                            }
                        });

                        var legendgjs = me.instance.legendPlugin.plotLegend(title, ranges, data, legend_pos);
                        me.instance.geoJson = legendgjs;
                        me.legendInProcess = false;
                    });
                }
            }

        },
        /**
         * get index of pagesize for mapRectangle bbox
         * @param pageSize
         * @private
         */
        _getPageMapRectInd : function (pageSize) {
            var ind=0;
            if(pageSize === "A4_Landscape")ind=1;
            if(pageSize === "A3")ind=2;
            if(pageSize === "A3_Landscape")ind=3;
            return ind;

        },

        /**
         * @method _printMapInfo
         *  Get print info data
         * @param {String} url  print url string
         * @private
         * @
         */
        _printMapInfo: function (legend, callback) {

            var me = this;
            var selections = me._gatherSelections();
            var sandbox = this.instance.getSandbox();
            var url = sandbox.getAjaxUrl();

            var urlBase = this.backendConfiguration.formatProducers[selections.format];

            var maplinkArgs = selections.maplinkArgs;
            var pageSizeArgs = "&pageSize=" + selections.pageSize;
            var pageTitleArgs = "&pageTitle=" + encodeURIComponent(selections.pageTitle);
            var contentOptions = [],
                p;
            for (p in this.contentOptionsMap) {
                if (this.contentOptionsMap.hasOwnProperty(p)) {
                    if (selections[p]) {
                        contentOptions.push("&" + p + "=true");
                    }
                }
            }
            var contentOptionArgs = contentOptions.join('');
            var formatArgs = "&format=" + selections.format;

            var parameters = maplinkArgs + '&action_route=GetProxyRequest&serviceId=print' + pageSizeArgs + pageTitleArgs + contentOptionArgs + formatArgs;
            url = url + parameters;

            // ajax call
            me.instance.printService.fetchPrintMapData(
                // url
                url,
                // success callback

                function (data) {
                    if (data) {

                        callback(data);
                    } else {
                        alert('Error to fetch print info: ');
                    }
                },
                // error callback

                function (jqXHR, textStatus) {
                    alert('Error to fetch print info: ');

                }
            );
        },
        /**
         * @method destroy
         * Destroyes/removes this view from the screen.
         */
        destroy: function () {
            this.mainPanel.remove();
        },
        hide: function () {
            this.mainPanel.hide();
        },
        show: function () {
            this.mainPanel.show();
        },
        setEnabled: function (e) {
            this.isEnabled = e;
        },
        getEnabled: function () {
            return this.isEnabled;
        },
        refresh: function (isUpdate) {
            if (isUpdate) {
                this._updateMapPreview();
            } else {
                this._cleanMapPreview();
            }
            // Update legend
            this._createLegend();
        },
        getState: function () {
            return this._gatherSelections();
        },
        setState: function (formState) {

        }
    });