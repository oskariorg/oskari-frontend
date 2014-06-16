/**
 * @class Oskari.analysis.bundle.analyse.view.StartAnalyse
 * Request the analyse params and layers and triggers analyse actions
 * Analyses data  and save results
 *
 */
Oskari.clazz.define('Oskari.analysis.bundle.analyse.view.StartAnalyse',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.analysis.bundle.analyse.AnalyseBundleInstance} instance
     *      reference to component that created this panel view
     * @param {Object} localization
     *      localization data in JSON format
     */

    function (instance, localization) {
        var me = this,
            p,
            f,
            s;
        me.isEnabled = false;
        me.instance = instance;
        me.loc = localization;
        me.id_prefix = 'oskari_analyse_';
        me.layer_prefix = 'analysis_';
        me.max_analyse_layer_fields = 10;
        // unit -> multiplier
        me.bufferUnits = {
            'm': 1,
            'km': 1000
        };

        /* templates */
        me.template = {};
        for (p in me.__templates) {
            if (me.__templates.hasOwnProperty(p)) {
                me.template[p] = jQuery(me.__templates[p]);
            }
        }

        /* Analyse method options in localisations */
        me.methodOptions = me.loc.method.options;

        me.methodOptionsMap = {};
        for (s = 0; s < me.methodOptions.length; s++) {
            me.methodOptionsMap[me.methodOptions[s].id] = me.methodOptions[s];
        }

        /* parameter options listed in localisations */
        me.paramsOptions = me.loc.params.options;
        me.paramsOptionsMap = {};
        for (f = 0; f < me.paramsOptions.length; f++) {
            me.paramsOptionsMap[me.paramsOptions[f].id] = me.paramsOptions[f];
        }

        /* aggregate options listed in localisations */
        me.aggreOptions = me.loc.aggregate.options;
        me.aggreOptionsMap = {};
        for (f = 0; f < me.aggreOptions.length; f++) {
            me.aggreOptionsMap[me.aggreOptions[f].id] = me.aggreOptions[f];
        }

        /* spatial options listed in localisations for intersect */
        me.spatialOptions = me.loc.spatial.options;
        me.spatialOptionsMap = {};
        for (f = 0; f < me.spatialOptions.length; f++) {
            me.spatialOptionsMap[me.spatialOptions[f].id] = me.spatialOptions[f];
        }

        // content options listed in localisations
        me.contentOptionsMap = {};
        me.intersectOptionsMap = {};
        me.unionOptionsMap = {};

        me.contentOptions = {};
        me.intersectOptions = {};
        me.unionOptions = {};

        me.accordion = null;
        me.mainPanel = null;

        me.progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
        me.alert = Oskari.clazz.create('Oskari.userinterface.component.Alert');

        me.previewContent = null;
        me.previewImgDiv = null;

        me.contentOptionDivs = {};

        me.paramsOptionDivs = {};
        me.aggreOptionDivs = {};

        me._filterJsons = {};
        me._filterPopups = {};

        me._userSetFilter = {};

    }, {
        __templates: {
            "content": '<div class="layer_data"></div>',
            "icons_layer": '<table class=layer-icons> <tr> <td><div class="layer-icon layer-wfs" title="Tietotuote"></div></td><td><div class="layer-info icon-info"></div></td><td><div class="filter icon-funnel-active"></div></td><td><div class="icon-close"></div></td></tr></table>',
            "icons_temp_layer": '<div class="icon-close"></div>',
            "tool": '<div class="tool ">' + '<input type="checkbox"/>' + '<label></label></div>',
            "buttons": '<div class="buttons"></div>',
            "help": '<div class="help icon-info"></div>',
            "main": '<div class="basic_analyse">' + '<div class="header">' + '<div class="icon-close">' + '</div>' + '<h3></h3>' + '</div>' + '<div class="content">' + '</div>' + '</div>',
            "columnsContainer": '<div class="analyse-columns-container"></div>',
            "columnsDropdown": '<select class="analyse-columns-dropdown"></select>',
            "paramsOptionExtra": '<div class="extra_params"></div>',
            "paramsOptionTool": '<div class="tool ">' + '<input type="radio" name="params" />' + '<label></label></div>',
            "aggreOptionTool": '<div class="tool ">' + '<input type="checkbox" name="aggre" />' + '<label></label></div>',
            "spatialOptionTool": '<div class="tool ">' + '<input type="radio" name="spatial" />' + '<label></label></div>',
            "intersectOptionTool": '<div class="tool ">' + '<input type="radio" name="intersect" />' + '<label></label></div>',
            "unionOptionTool": '<div class="tool ">' + '<input type="radio" name="union" />' + '<label></label></div>',
            "layerUnionOptionTool": '<div class="tool"><input type="checkbox" name="layer_union" /><label></label></div>',
            "title": '<div class="analyse_title_cont analyse_settings_cont"><div class="settings_buffer_label"></div><input class="settings_buffer_field" type="text"><select class="settings_buffer_units"></select></div>',
            "title_name": '<div class="analyse_title_name analyse_settings_cont"><div class="settings_name_label"></div><input class="settings_name_field" type="text"></div>',
            "title_color": '<div class="analyse_title_colcont analyse_output_cont"><div class="output_color_label"></div></div>',
            "title_columns": '<div class="analyse_title_columns analyse_output_cont"><div class="columns_title_label"></div></div>',
            "title_extra": '<div class="analyse_title_extra analyse_output_cont"><div class="extra_title_label"></div></div>',
            "icon_colors": '<div class="icon-menu"></div>',
            "random_colors": '<div class="analyse_randomize_colors tool"><input type="checkbox" name="randomize_colors" id="analyse_randomize_colors_input" /><label for="analyse_randomize_colors_input"></label></div>',
            "option": '<div class="analyse_option_cont analyse_settings_cont">' + '<input type="radio" name="selectedlayer" />' + '<label></label></div>',
            "methodOptionTool": '<div class="tool ">' + '<input type="radio" name="method" />' + '<label></label></div>',
            "featureListSelect": '<div class="analyse-select-featurelist"><a href="#">...</a></div>',
            "featureList": '<div class="analyse-featurelist"><ul></ul></div>',
            "featureListElement": '<li><input type="checkbox"/><label></label></li>',
            'areasAndSectorsExtra': '<div class="analyse_areas_and_sectors_cont analyse_settings_cont"><label><span></span><input class="settings_area_size_field" type="text" pattern="[0-9]+"><select class="settings_area_size_units"></select></label><label><span></span><input class="settings_area_count_field" type="text" pattern="[0-9]+"></label><label><span></span><input class="settings_sector_count_field" type="text" pattern="^0*[1-9]$|^0*1[0-2]$"></label></div>',

        },
        /**
         * @method render
         * Renders view to given DOM element
         * @param {jQuery} container reference to DOM element this component will be
         * rendered to
         */
        render: function (container) {
            var me = this,
                content = this.template.main.clone();

            this.mainPanel = content;
            content.find('div.header h3').append(this.loc.title);

            container.append(content);
            var contentDiv = content.find('div.content');

            this.alert.insertTo(contentDiv);

            var accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
            this.accordion = accordion;

            var contentPanel = Oskari.clazz.create(
                'Oskari.analysis.bundle.analyse.view.ContentPanel', this);
            this.contentPanel = contentPanel;

            var methodPanel = this._createMethodPanel(),
                settingsPanel = this._createSettingsPanel(),
                outputPanel = this._createOutputPanel();
            //outputPanel.open();

            contentPanel.getDataPanel().open();
            contentPanel.getDrawToolsPanel().open();
            methodPanel.open();
            settingsPanel.open();
            accordion.addPanel(contentPanel.getDataPanel());
            accordion.addPanel(contentPanel.getDrawToolsPanel());
            accordion.addPanel(methodPanel);
            accordion.addPanel(settingsPanel);
            accordion.addPanel(outputPanel);
            accordion.insertTo(contentDiv);

            // buttons
            // close
            container.find('div.header div.icon-close').bind('click', function () {
                me.instance.setAnalyseMode(false);
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

            /* progress */
            me.progressSpinner.insertTo(container);

            this._addAnalyseData(contentPanel);
            // Show the possible warning of exceeding the feature property count.
            this.showInfos();
        },
        /**
         * @method _createMethodPanel
         * @private
         * Creates the method selection panel for analyse
         * @return {jQuery} Returns the created panel
         */
        _createMethodPanel: function () {
            var me = this,
                panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel'),
                i,
                option,
                label,
                toolContainer,
                tooltipCont;
            panel.setTitle(this.loc.method.label);
            var contentPanel = panel.getContainer();
            // content
            var closureMagic = function (tool) {
                return function () {
                    var size = contentPanel.find('input[name=method]:checked').val(),
                        i;
                    // reset previous setting
                    for (i = 0; i < me.methodOptions.length; ++i) {
                        me.methodOptions[i].selected = false;
                    }
                    tool.selected = true;

                };
            };
            var clickMagic = function (tool) {
                return function () {
                    me._modifyExtraParameters(tool.id);
                };
            };
            for (i = 0; i < this.methodOptions.length; ++i) {
                option = this.methodOptions[i];
                me.option_id = option.id;
                toolContainer = this.template.methodOptionTool.clone();
                label = option.label;
                if (option.width && option.height) {
                    label = label + ' (' + option.width + ' x ' + option.height + 'px)';
                }
                toolContainer.find('label').append(label).attr({
                    'for': option.id,
                    'class': 'method_radiolabel'
                });
                if (option.selected) {
                    toolContainer.find('input').attr('checked', 'checked');
                }
                tooltipCont = this.template.help.clone();
                tooltipCont.attr('title', option.tooltip);
                toolContainer.append(tooltipCont);

                contentPanel.append(toolContainer);
                toolContainer.find('input').attr({
                    'value': option.id,
                    'name': 'method',
                    'id': option.id
                });
                toolContainer.find('input').change(closureMagic(option));
                toolContainer.find('input').click(clickMagic(option));

            }

            return panel;
        },
        /**
         * @method _createSettingsPanel
         * @private
         * Creates a settings panel for analyses
         * @return {jQuery} Returns the created panel
         */
        _createSettingsPanel: function () {
            var me = this,
                panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            panel.setTitle(this.loc.settings.label);
            var headerPanel = panel.getHeader(),
                contentPanel = panel.getContainer();
            // tooltip
            var tooltipCont = this.template.help.clone();
            tooltipCont.attr('title', this.loc.settings.tooltip);
            tooltipCont.addClass('header-icon-info');
            headerPanel.append(tooltipCont);

            // Changing part of parameters ( depends on method)
            var extra = this.template.paramsOptionExtra.clone();
            contentPanel.append(extra);
            // buffer is default method
            me._addExtraParameters(contentPanel, me.id_prefix + "buffer");

            var columnsContainer = this.template.columnsContainer.clone();
            this._createColumnsSelector(columnsContainer, me.loc.params.label);
            contentPanel.append(columnsContainer);

            // Analyse NAME
            var selected_layers = me._selectedLayers(),
                name = '_';
            if (selected_layers[0]) {
                name = selected_layers[0].name.substring(0, 15) + name;
            }
            var analyseTitle = me.template.title_name.clone();
            analyseTitle.find('.settings_name_label').html(me.loc.analyse_name.label);
            analyseTitle.find('.settings_name_field').attr({
                'value': name,
                'placeholder': me.loc.analyse_name.tooltip
            });

            contentPanel.append(analyseTitle);

            return panel;
        },

        /**
         * Creates the selector to select which attributes should be preserved in the analysis
         * (all, none or select from list).
         *
         * @method _createColumnsSelector
         * @param {jQuery Object} columnsContainer the dom element the columns selector should be appended to.
         */
        _createColumnsSelector: function (columnsContainer, title) {
            var me = this,
                columnsTitle = this.template.title_columns.clone(),
                i,
                option,
                label,
                toolContainer;
            columnsTitle.find('.columns_title_label').html(title);
            columnsContainer.append(columnsTitle);

            var closureMagic = function (tool) {
                return function () {
                    var featureList = columnsContainer.find('.analyse-featurelist'),
                        i;
                    // reset previous setting
                    for (i = 0; i < me.paramsOptions.length; ++i) {
                        me.paramsOptions[i].selected = false;
                    }
                    tool.selected = true;

                    if (tool.id === 'oskari_analyse_select') {
                        featureList.show();
                    } else {
                        featureList.hide();
                    }
                };
            };

            for (i = 0; i < this.paramsOptions.length; ++i) {
                option = this.paramsOptions[i];
                toolContainer = this.template.paramsOptionTool.clone();
                label = option.label;
                if (option.width && option.height) {
                    label = label + ' (' + option.width + ' x ' + option.height + 'px)';
                }
                toolContainer.find('label').append(label).attr({
                    'for': option.id,
                    'class': 'params_radiolabel'
                });
                if (option.selected) {
                    toolContainer.find('input[name=params]').attr('checked', 'checked');
                }

                if (option.id === 'oskari_analyse_select') {
                    this._appendFeatureList(toolContainer);
                }

                columnsContainer.append(toolContainer);
                toolContainer.find('input[name=params]').attr({
                    'value': option.id,
                    'name': 'params',
                    'id': option.id
                });
                toolContainer.find('input[name=params]').change(closureMagic(option));
            }

            // Check that params selection is allowed for the selected layer
            this._checkParamsSelection();
        },

        /**
         * Creates a list to select fields to include in analyse
         *
         * @method _appendFeatureList
         * @param {jQuery object} toolContainer
         */
        _appendFeatureList: function (toolContainer) {
            var featureListSelect = this.template.featureListSelect.clone(),
                featureList = this.template.featureList.clone();

            featureListSelect.append(featureList);
            toolContainer.append(featureListSelect);
            featureList.hide();
            featureList.find('ul').empty();
            this._appendFields(featureList);

            featureListSelect.find('a').on('click', function (e) {
                e.preventDefault();
                featureList.toggle();
            });
        },

        /**
         * Appeds the fields from the layer to the feature list
         *
         * @method _appendFields
         * @param {jQuery object} featureList
         */
        _appendFields: function (featureList) {
            var me = this,
                selectedLayer = this._getSelectedMapLayer();

            if (!selectedLayer) return;

            var fields = ((selectedLayer.getFields && selectedLayer.getFields()) ? selectedLayer.getFields().slice() : []),
                locales = ((selectedLayer.getLocales && selectedLayer.getLocales()) ? selectedLayer.getLocales().slice() : []),
                i,
                featureListElement,
                localizedLabel,
                elementId;

            for (i = 0; i < fields.length; ++i) {
                // Get only the fields which originate from the service,
                // that is, exclude those which are added by Oskari (starts with '__').
                if (!fields[i].match(/^__/)) {
                    localizedLabel = locales[i] || fields[i];
                    elementId = (selectedLayer.getId() + '_' + fields[i]);
                    featureListElement = this.template.featureListElement.clone();

                    featureListElement
                        .find('input')
                        .prop('id', elementId)
                        .prop('name', 'analyse-feature-property')
                        .val(fields[i]);
                    featureListElement
                        .find('label')
                        .html(localizedLabel)
                        .attr({
                            'for': elementId
                        });
                    featureList.find('ul').append(featureListElement);
                }
            }

            this._preselectProperties(featureList.find('ul'));
            featureList
                .find('ul li')
                .change(function () {
                    me._checkPropertyList(featureList.find('ul'));
                });
        },
        /**
         * Preselects the max number of feature properties permitted
         * (defaults to 10).
         *
         * @method _preselectProperties
         * @private
         * @param  {jQuery} propertyList
         */
        _preselectProperties: function (propertyList) {
            var maxNumOfFields = this.max_analyse_layer_fields;

            propertyList
                .find('input[name=analyse-feature-property]')
                .each(function (index) {
                    if (index < maxNumOfFields) {
                        jQuery(this).prop('checked', true);
                    } else {
                        jQuery(this).prop('disabled', true);
                    }
                });
        },
        /**
         * Checks if the number of checked properties is over
         * the permitted limit and if so, disables the other
         * properties.
         *
         * @method _checkPropertyList
         * @private
         * @param  {jQuery} propertyList
         */
        _checkPropertyList: function (propertyList) {
            var checked = propertyList.find('li input:checked'),
                unchecked = propertyList.find('li input:not(:checked)');

            if (checked.length >= this.max_analyse_layer_fields) {
                unchecked.prop('disabled', true);
            } else {
                unchecked.prop('disabled', false);
            }
        },
        /**
         * Refreshes the fields list after a layer has been added or changed.
         *
         * @method _refreshFields
         */
        _refreshFields: function () {
            var featureList = jQuery('div.analyse-featurelist');
            featureList.find('ul').empty();
            this._appendFields(featureList);
        },

        /**
         * @method _createOutputPanel
         * @private
         * Creates a output panel for analyse visualization
         * @return {jQuery} Returns the created panel
         */
        _createOutputPanel: function () {
            var me = this,
                panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            panel.setTitle(me.loc.output.label);
            var headerPanel = panel.getHeader(),
                contentPanel = panel.getContainer();
            // tooltip
            var tooltipCont = me.template.help.clone();
            tooltipCont.attr('title', me.loc.output.tooltip);
            tooltipCont.addClass('header-icon-info');
            headerPanel.append(tooltipCont);
            // title
            var colorTitle = me.template.title_color.clone();
            colorTitle.find('.output_color_label').html(me.loc.output.color_label);
            contentPanel.append(colorTitle);
            // Create random color picker checkbox
            var colorRandomizer = me.template.random_colors.clone();
            colorRandomizer.find('input[name=randomize_colors]').attr('checked', 'checked');
            colorRandomizer.find('label').addClass('params_checklabel').html(me.loc.output.random_color_label);
            contentPanel.append(colorRandomizer);

            var visualizationForm = Oskari.clazz.create('Oskari.userinterface.component.VisualizationForm');
            me.visualizationForm = visualizationForm;
            contentPanel.append(me.visualizationForm.getForm());

            return panel;
        },
        /**
         * @method _selectedLayers
         * @private
         * Select selected layers for analyse
         * @return {Json ?} Returns selected layers
         */
        _selectedLayers: function () {
            var me = this,
                layers = [],
                p,
                layer;
            if (me.contentOptionDivs) {
                for (p in me.contentOptionsMap) {
                    if (me.contentOptionDivs[p] !== undefined) {
                        if (me.contentOptionDivs[p].find('input').prop('checked')) {
                            layer = {
                                id: me.contentOptionsMap[p].id,
                                name: me.contentOptionsMap[p].label,
                                temp: me.contentOptionsMap[p].temp
                            };
                            layers.push(layer);
                        }


                    }
                }
            }
            return layers;
        },
        /**
         * @method _columnSelector
         * @private
         * Select columns for analyse
         * @param {json}  layers selected layer ids etc
         * @return {Json ?} Returns selected columns
         */
        _columnSelector: function (layers) {
            alert('TODO: add columns selector - use grid component - layers: ' + JSON.stringify(layers));
        },
        /**
         * @method getStyleValues
         * Returns style values as an object
         * @return {Object}
         */
        getStyleValues: function () {
            var me = this,
                values = {};

            // Sets random color values for visualization form
            // if the checkbox is checked.
            me.randomizeColors();

            var formValues = me.visualizationForm.getValues();
            if (formValues) {
                values.dot = {
                    size: formValues.dot.size,
                    color: '#' + formValues.dot.color,
                    shape: formValues.dot.shape
                };
                values.line = {
                    size: formValues.line.width,
                    color: '#' + formValues.line.color,
                    cap: formValues.line.cap,
                    corner: formValues.line.corner,
                    style: formValues.line.style
                };
                values.area = {
                    size: formValues.area.lineWidth,
                    lineColor: '#' + formValues.area.lineColor,
                    fillColor: '#' + formValues.area.fillColor,
                    lineStyle: formValues.area.lineStyle,
                    fillStyle: formValues.area.fillStyle,
                    lineCorner: formValues.area.lineCorner
                };
            }

            return values;
        },
        /**
         * @method _getButtons
         * @private
         * Renders data buttons to DOM snippet and returns it.
         * @return {jQuery} container with buttons
         */
        _getButtons: function () {
            var me = this,
                buttonCont = this.template.buttons.clone(),
                analyseBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.Button'
                ),
                closeBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.buttons.CloseButton'
                ),
                saveBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.buttons.SaveButton'
                );
            closeBtn.setHandler(function () {
                me.instance.setAnalyseMode(false);
            });
            closeBtn.insertTo(buttonCont);

            saveBtn.setPrimary(false);
            saveBtn.setHandler(function () {
                var selections = me._gatherSelections();
                if (selections) {
                    me._saveAnalyse(selections);
                }
            });
            saveBtn.insertTo(buttonCont);

            analyseBtn.setTitle(this.loc.buttons.analyse);
            analyseBtn.addClass('primary');
            analyseBtn.setHandler(function () {
                // Check parameters and continue to analyse action
                me._analyseMap();
            });
            analyseBtn.insertTo(buttonCont);

            return buttonCont;
        },
        /**
         * @method _addAnalyseData
         * @private
         * Add analyse data layer to selection box
         * @param {jQuery} contentPanel  content panel for data layer selections
         * @param String inserted_layer_id  id of last inserted layer
         */
        _addAnalyseData: function (contentPanel, inserted_layer_id) {
            var me = this,
                layersContainer = contentPanel.getLayersContainer(),
                sandbox = me.instance.getSandbox(),
                layers = sandbox.findAllSelectedMapLayers(),
                features = contentPanel.getFeatures(),
                selectedLayer = me._getSelectedMapLayer(),
                templateOpt = me.template.option,
                templateIcons = me.template.icons_layer,
                templateTempIcons = me.template.icons_temp_layer,
                contentOptions,
                contentOptionsMap,
                contentOptionDivs;

            layers = layers.concat(features);
            // Add property types for WFS layer, if not there
            me._addPropertyTypes(layers);

            contentOptions = _.chain(layers)
                .filter(function (layer) {
                    return me._eligibleForAnalyse(layer);
                })
                .map(function (layer) {
                    var isTemp = layer.isLayerOfType(me.contentPanel.getLayerType()),
                        option = {
                            id: layer.getId(),
                            label: layer.getName(),
                            temp: isTemp,
                            icon: layer.getLayerType()
                        };

                    if (!isTemp) {
                        option.layerId = option.id;
                        option.id = (me.id_prefix + 'layer_' + option.id);
                    }

                    // Checked is the last inserted layer or current selected layer, if layer_id is not available
                    if (inserted_layer_id && inserted_layer_id === layer.getId()) {
                        option.checked = 'checked';
                    } else if (!inserted_layer_id && selectedLayer && selectedLayer.getName() === layer.getName()) {
                        option.checked = 'checked';
                    }


                    return option;
                })
                .value();

            if (!selectedLayer && contentOptions.length) {
                _.first(contentOptions).checked = 'checked';
            }


            contentOptionsMap = _.foldl(contentOptions, function (map, option) {
                map[option.id] = option;
                return map;
            }, {});

            contentOptionDivs = _.foldl(contentOptions, function (divs, datum) {
                var opt = templateOpt.clone(),
                    isTemp = datum.temp,
                    icons = (isTemp ? templateTempIcons.clone() : templateIcons.clone()),
                    removeLayer;

                opt.find('input')
                    .attr({
                        'id': datum.id,
                        'checked': datum.checked
                    })
                    .change(function (e) {
                        me._refreshFields();
                        me._modifyAnalyseName();
                        me.showInfos();
                        me._checkParamsSelection();
                        me._refreshIntersectLayers();
                        me.refreshExtraParameters();
                    });

                opt.find('label')
                    .html(datum.label)
                    .attr({
                        'for': datum.id,
                        'class': 'params_checklabel'
                    });

                if (isTemp) {
                    removeLayer = function (id) {
                        return function () {
                            contentPanel.removeGeometry(id);
                        };
                    };

                    icons.addClass('analyse-temp-feature');
                    icons.click(removeLayer(datum.id));
                } else {
                    removeLayer = function (id) {
                        return function () {
                            me._removeLayerRequest(id);
                        };
                    };

                    me._infoRequest(icons, datum.id);
                    me._filterRequest(icons, datum.id);

                    me.updateFilterIcon(datum.layerId, icons);

                    icons.find('div.icon-close').click(removeLayer(datum.id));
                    icons.find('.layer-icon').addClass('layer-' + datum.icon);
                }

                opt.append(icons);

                divs[datum.id] = opt;
                return divs;
            }, {});

            _.each(contentOptionDivs, function (div) {
                layersContainer.append(div);
            });

            this.contentOptions = contentOptions;
            this.contentOptionsMap = contentOptionsMap;
            this.contentOptionDivs = contentOptionDivs;

            // Refresh analyse name
            me._modifyAnalyseName();
            me._refreshFields();
            me.refreshExtraParameters();
            me._checkParamsSelection();
        },

        updateFilterIcon: function (layerId, element) {
            var me = this,
                filter,
                filterIcon,
                icons = element,
                added = 'icon-funnel-active',
                removed = 'icon-funnel',
                tmp;

            // See if user has opened the filter popup
            if (me._userSetFilter[layerId]) {
                // See if layer has no active filter
                filter = me.getFilterJson(layerId);
                if (!filter.featureIds && !filter.bbox && !filter.filters) {
                    // Flip classes
                    tmp = added;
                    added = removed;
                    removed = tmp;
                }
                if (!icons || !icons.length) {
                    icons = me.contentPanel.getLayersContainer()
                        .find('#' + me.id_prefix + 'layer_' + layerId)
                        .siblings('.layer-icons');
                }
                filterIcon = icons.find('.filter');
                filterIcon
                    .removeClass(removed)
                    .addClass(added);
            }
        },

        _eligibleForAnalyse: function (layer) {
            return ((layer.hasFeatureData && layer.hasFeatureData()) ||
                layer.isLayerOfType(this.contentPanel.getLayerType()));
        },
        /**
         * @method _addExtraParameters
         * @private
         * Add parameters data UI according to method
         * @param {String} method  analyse method
         */
        _addExtraParameters: function (contentPanel, method) {
            var me = this,
                extra = contentPanel.find('.extra_params');
            if (method === this.id_prefix + "buffer") {
                var bufferTitle = me.template.title.clone(),
                    bufferUnitSelect = bufferTitle.find('select.settings_buffer_units');
                bufferTitle.find('.settings_buffer_label').html(me.loc.buffer_size.label);
                bufferTitle.find('.settings_buffer_field').attr({
                    'value': '',
                    'placeholder': me.loc.buffer_size.tooltip
                });
                for (var unit in me.bufferUnits) {
                    bufferUnitSelect.append(
                        '<option value="' + unit + '">' +
                        me.loc.buffer_units[unit] +
                        '</option>'
                    );
                }

                extra.append(bufferTitle);

            } else if (method === this.id_prefix + "aggregate") {
                // sum, count, min, max, med

                me._aggregateExtra(extra);

            } else if (method === this.id_prefix + "aggregateNumeric") {
                // sum, count, min, max, med
                me._aggregateExtra(extra);

            } else if (method === this.id_prefix + "aggregateText") {
                // sum, count, min, max, med
                me._aggregateExtraText(extra);

            } else if (method === this.id_prefix + "clip") {
                // clipping layer selection
                me._intersectExtra(extra, false);

            } else if (method === this.id_prefix + "intersect") {
                // intersecting layer selection
                me._intersectExtra(extra);

            } else if (method === this.id_prefix + "union") {
                // union input 2 layer selection
                // deprecated  me._unionExtra(extra);

            } else if (method === this.id_prefix + "layer_union") {
                // unfiy two or more analyse layers
                me._layerUnionExtra(extra);
            } else if (method === this.id_prefix + "areas_and_sectors") {
                me._areasAndSectorsExtra(extra);
            }
        },
        /**
         * @method _aggregateExtra
         * @private
         ** Add extra parameters for params UI according to method aggregate
         * @param {jQuery} contentPanel  div to append extra params
         */
        _aggregateExtra: function (contentPanel) {
            var me = this;
            //title
            var title = this.template.title_extra.clone(),
                i,
                option,
                toolContainer,
                label;
            title.find('.extra_title_label').html(this.loc.aggregate.label);
            contentPanel.append(title);

            // sum, count, min, max, med
            var closureMagic = function (tool) {
                return function () {
                    var size = contentPanel.find('input[name=aggre]:checked').val(),
                        i;
                    // reset previous setting
                    for (i = 0; i < me.aggreOptions.length; ++i) {
                        me.aggreOptions[i].selected = false;
                    }
                    tool.selected = true;

                };
            };

            for (i = 0; i < this.aggreOptions.length; ++i) {
                option = this.aggreOptions[i];
                toolContainer = this.template.aggreOptionTool.clone();
                label = option.label;
                if (option.width && option.height) {
                    label = label + ' (' + option.width + ' x ' + option.height + 'px)';
                }
                toolContainer.find('label').append(label).attr({
                    'for': option.id,
                    'class': 'params_radiolabel'
                });
                if (i !== this.aggreOptions.length - 1) toolContainer.find('input').attr('checked', 'checked');

                contentPanel.append(toolContainer);
                toolContainer.find('input').attr({
                    'value': option.id,
                    'name': 'aggre',
                    'id': option.id
                });
                toolContainer.find('input').change(closureMagic(option));

                // Hide last one, no no data
                if (i === this.aggreOptions.length - 1) {
                    if (this._getNoDataValue()) {
                        toolContainer.find('input').attr('checked', 'checked');
                    } else {
                        toolContainer.find('input').removeAttr('checked');
                        toolContainer.hide();
                    }
                }
            }

        },
        /**
         * @method _aggregateExtraText
         * @private
         ** Add extra parameters for params UI according to method aggregate
         * @param {jQuery} contentPanel  div to append extra params
         */
        _aggregateExtraText: function (contentPanel) {
            var me = this,
                text_parm_len = 1;
            //title
            var title = this.template.title_extra.clone(),
                i,
                option,
                toolContainer,
                label;
            title.find('.extra_title_label').html(this.loc.aggregate.label);
            contentPanel.append(title);

            // sum, count, min, max, med
            var closureMagic = function (tool) {
                return function () {
                    var size = contentPanel.find('input[name=aggre]:checked').val(),
                        i;
                    // reset previous setting
                    for (i = 0; i < text_parm_len; ++i) {
                        me.aggreOptions[i].selected = false;
                    }
                    tool.selected = true;

                };
            };

            for (i = 0; i < text_parm_len; ++i) {
                option = this.aggreOptions[i];
                toolContainer = this.template.aggreOptionTool.clone();
                label = option.label;
                if (option.width && option.height) {
                    label = label + ' (' + option.width + ' x ' + option.height + 'px)';
                }
                toolContainer.find('label').append(label).attr({
                    'for': option.id,
                    'class': 'params_radiolabel'
                });

                toolContainer.find('input').attr('checked', 'checked');

                contentPanel.append(toolContainer);
                toolContainer.find('input').attr({
                    'value': option.id,
                    'name': 'aggre',
                    'id': option.id
                });
                toolContainer.find('input').change(closureMagic(option));
            }

        },
        /**
         * @method _intersectExtra
         * @private
         * Add extra parameters for params UI according to method needs
         * @param {jQuery} contentPanel  div to append extra params
         * @param {boolean} full define if full or limited set of choices is shown
         */
        _intersectExtra: function (contentPanel, full) {
            var me = this;
            // Set radiobuttons for selecting intersecting layer
            var options = [],
                option,
                p,
                f,
                showSpatial = true;

            // Show also spatial operator choice
            if (typeof full !== "undefined") {
                showSpatial = full;
            }

            // Checked data layers
            if (me.contentOptionDivs) {
                for (p in me.contentOptionsMap) {
                    if (me.contentOptionDivs[p] !== undefined) {
                        option = {
                            id: me.contentOptionsMap[p].id,
                            label: me.contentOptionsMap[p].label,
                            data: me.contentOptionDivs[p].find('input').prop('checked')
                        };
                        options.push(option);
                    }
                }
            }

            me.intersectOptions = options;
            me.intersectOptionsMap = {};

            for (f = 0; f < me.intersectOptions.length; f++) {
                me.intersectOptionsMap[me.intersectOptions[f].id] = me.intersectOptions[f];
            }
            // title
            var title = me.template.title_extra.clone(),
                i,
                toolContainer,
                label;
            title.find('.extra_title_label').html(me.loc.intersect.label);
            contentPanel.append(title);

            var closureMagic = function (tool) {
                return function () {
                    var size = contentPanel.find('input[name=aggre]:checked').val(),
                        i;
                    // reset previous setting
                    for (i = 0; i < me.intersectOptions.length; ++i) {
                        me.intersectOptions[i].selected = false;
                    }
                    tool.selected = true;

                };
            };

            for (i = 0; i < me.intersectOptions.length; ++i) {
                option = me.intersectOptions[i];
                toolContainer = me.template.intersectOptionTool.clone();
                label = option.label;
                toolContainer.find('label').append(label).attr({
                    'for': 'intersect_' + option.id,
                    'class': 'params_radiolabel'
                });
                // Do not show option if it is selected as analysis data
                if (option.data) {
                    toolContainer.hide();
                    option.selected = false;
                }
                if (option.selected) {
                    toolContainer.find('input').attr('checked', 'checked');
                }
                contentPanel.append(toolContainer);
                toolContainer.find('input').attr({
                    'value': option.id,
                    'name': 'intersect',
                    'id': 'intersect_' + option.id
                });
                toolContainer.find('input').change(closureMagic(option));
            }

            // Show spatial operator choice
            if (showSpatial) {
                //title spatial operator
                var titlespa = this.template.title_extra.clone();
                titlespa.find('.extra_title_label').html(this.loc.spatial.label);
                contentPanel.append(titlespa);

                var closureMagic = function (tool) {
                    return function () {
                        var size = contentPanel.find('input[name=spatial]:checked').val(),
                            i;
                        // reset previous setting
                        for (i = 0; i < me.spatialOptions.length; ++i) {
                            me.spatialOptions[i].selected = false;
                        }
                        tool.selected = true;

                    };
                };

                // spatial operators
                for (i = 0; i < this.spatialOptions.length; ++i) {
                    option = this.spatialOptions[i];
                    toolContainer = this.template.spatialOptionTool.clone();
                    label = option.label;
                    if (option.width && option.height) {
                        label = label + ' (' + option.width + ' x ' + option.height + 'px)';
                    }
                    toolContainer.find('label').append(label).attr({
                        'for': option.id,
                        'class': 'params_radiolabel'
                    });
                    if (option.selected) {
                        toolContainer.find('input').attr('checked', 'checked');
                    }
                    contentPanel.append(toolContainer);
                    toolContainer.find('input').attr({
                        'value': option.id,
                        'name': 'spatial',
                        'id': option.id
                    });
                    toolContainer.find('input').change(closureMagic(option));
                }
            }
        },
        /**
         * @method _unionExtra
         * @private
         * Add extra parameters for params UI according to method union
         * @param {jQuery} contentPanel  div to append extra params
         */
        _unionExtra: function (contentPanel) {
            var me = this;

            // Set radiobuttons for selecting union layer
            var options = [],
                p,
                option,
                f,
                i,
                toolContainer,
                label;
            // Checked data layers
            if (me.contentOptionDivs) {
                for (p in me.contentOptionsMap) {
                    if (me.contentOptionDivs[p] !== undefined) {
                        // true or false var test = me.contentOptionDivs[p].find('input').prop('checked');
                        option = {
                            id: me.contentOptionsMap[p].id,
                            label: me.contentOptionsMap[p].label
                        };
                        options.push(option);
                    }
                }
            }

            me.unionOptions = options;
            me.unionOptionsMap = {};

            for (f = 0; f < me.unionOptions.length; f++) {
                me.unionOptionsMap[me.unionOptions[f].id] = me.unionOptions[f];
            }
            // title
            var title = me.template.title_extra.clone();
            title.find('.extra_title_label').html(me.loc.union.label);
            contentPanel.append(title);

            var closureMagic = function (tool) {
                return function () {
                    var size = contentPanel.find('input[name=aggre]:checked').val(),
                        i;
                    // reset previous setting
                    for (i = 0; i < me.unionOptions.length; ++i) {
                        me.unionOptions[i].selected = false;
                    }
                    tool.selected = true;

                };
            };

            for (i = 0; i < me.unionOptions.length; ++i) {
                option = me.unionOptions[i];
                toolContainer = me.template.unionOptionTool.clone();
                label = option.label;
                if (option.width && option.height) {
                    label = label + ' (' + option.width + ' x ' + option.height + 'px)';
                }
                toolContainer.find('label').append(label).attr({
                    'for': option.id,
                    'class': 'params_radiolabel'
                });
                if (option.selected) {
                    toolContainer.find('input').attr('checked', 'checked');
                }
                contentPanel.append(toolContainer);
                toolContainer.find('input').attr({
                    'value': option.id,
                    'name': 'union',
                    'id': option.id
                });
                toolContainer.find('input').change(closureMagic(option));
            }

            //title spatial operator
            var titlespa = this.template.title_extra.clone();
            titlespa.find('.extra_title_label').html(this.loc.spatial.label);
            contentPanel.append(titlespa);

            var closureMagic = function (tool) {
                return function () {
                    var size = contentPanel.find('input[name=spatial]:checked').val(),
                        i;
                    // reset previous setting
                    for (i = 0; i < me.spatialOptions.length; ++i) {
                        me.spatialOptions[i].selected = false;
                    }
                    tool.selected = true;

                };
            };

            // spatial operators
            for (i = 0; i < this.spatialOptions.length; ++i) {
                option = this.spatialOptions[i];
                toolContainer = this.template.spatialOptionTool.clone();
                label = option.label;
                if (option.width && option.height) {
                    label = label + ' (' + option.width + ' x ' + option.height + 'px)';
                }
                toolContainer.find('label').append(label).attr({
                    'for': option.id,
                    'class': 'params_radiolabel'
                });
                if (option.selected) {
                    toolContainer.find('input').attr('checked', 'checked');
                }
                contentPanel.append(toolContainer);
                toolContainer.find('input').attr({
                    'value': option.id,
                    'name': 'spatial',
                    'id': option.id
                });
                toolContainer.find('input').change(closureMagic(option));
            }

        },

        /**
         * Add layer selection ui for analyse layer union.
         *
         * @method _layerUnionExtra
         * @param  {jQuery} contentPanel
         * @return {undefined}
         */
        _layerUnionExtra: function (contentPanel) {
            var me = this,
                selectedLayer = me._getSelectedMapLayer();

            if (!selectedLayer || (selectedLayer && !selectedLayer.isLayerOfType('ANALYSIS'))) {
                contentPanel.append(jQuery(
                    '<div>' + me.loc.layer_union.notAnalyseLayer + '</div>'
                ));
                return;
            }

            me.unionOptions = jQuery.map(me.contentOptionsMap || {}, function (val, key) {
                if (me._validForLayerUnion(selectedLayer, val.id)) {
                    return {
                        id: val.id,
                        label: val.label
                    };
                }
            });

            if (me.unionOptions.length === 0) {
                contentPanel.append(jQuery(
                    '<div>' + me.loc.layer_union.noLayersAvailable + '</div>'
                ));
                return;
            }

            // title
            var title = me.template.title_extra.clone(),
                i,
                option,
                toolContainer,
                label;
            title.find('.extra_title_label').html(me.loc.layer_union.label);
            contentPanel.append(title);

            // layers
            for (i = 0; i < me.unionOptions.length; ++i) {
                option = me.unionOptions[i];
                toolContainer = me.template.layerUnionOptionTool.clone();
                label = option.label;
                toolContainer.find('label').append(label).attr({
                    'for': option.id,
                    'class': 'params_checklabel'
                });
                if (option.selected) {
                    toolContainer.find('input').attr('checked', 'checked');
                }
                contentPanel.append(toolContainer);
                toolContainer.find('input').attr({
                    'value': option.id,
                    'id': option.id
                });
            }
        },

        /**
         * Add params ui for areas and sectors.
         *
         * @method _areasAndSectorsExtra
         * @param  {jQuery} contentPanel
         * @return {undefined}
         */
        _areasAndSectorsExtra: function (contentPanel) {
            var me = this,
                loc = me.loc.areas_and_sectors,
                extraParams = me.template.areasAndSectorsExtra.clone(),
                unitsSelect = extraParams.find('.settings_area_size_units'),
                unit,
                labels = extraParams.find('label'),
                keys = ['area_size', 'area_count', 'sector_count'];

            for (unit in me.bufferUnits) {
                unitsSelect.append(
                    '<option value="' + unit + '">' +
                    me.loc.buffer_units[unit] +
                    '</option>'
                );
            }

            labels.each(function (i) {
                this.getElementsByTagName('SPAN')[0].innerHTML = loc[keys[i]];
                this.getElementsByTagName('INPUT')[0].placeholder =
                    loc[keys[i] + '_tooltip'];
            });

            contentPanel.append(extraParams);
        },

        /**
         * Refreshes layer list in the intersect or clip parameters
         *
         * @method
         * @private
         */
        _refreshIntersectLayers: function () {
            var dataLayers = jQuery("div.basic_analyse div.analyse_option_cont.analyse_settings_cont input[type=radio]"),
                paramLayer,
                i,
                j;

            // No need to refresh?
            if ((jQuery("div.basic_analyse div.extra_params input[type=radio][name=intersect]")).length === 0) {
                return;
            }

            for (i = 0; i < dataLayers.length; i++) {
                paramLayer = jQuery("div.basic_analyse div.extra_params input[type=radio][name=intersect][value=" + jQuery(dataLayers[i]).attr("id") + "]");
                for (j = 0; j < dataLayers.length; j++) {
                    if (jQuery(dataLayers[i]).is(":checked")) {
                        paramLayer.prop("checked", false);
                        paramLayer.parent().hide();
                    } else {
                        paramLayer.parent().show();
                    }
                }
            }
        },

        /**
         * Checks to see if the layer hiding behind the id is valid for layer union.
         * It performs checks to see if the layer is not the same as the selected layer,
         * the layer is of type 'analysis', and if the layer has the same feature fields
         * as the selected layer.
         *
         * @method _validForLayerUnion
         * @param  {Oskari.Layer} selectedLayer
         * @param  {String} oskari_analyse_id id of the layer in form 'oskari_analyse_layer_<id>'
         * @return {Boolean} returns true if the layer is valid for analyse union
         */
        _validForLayerUnion: function (selectedLayer, oskari_analyse_id) {
            if (!oskari_analyse_id) {
                return false;
            }
            // is layer id invalid?
            var layerId = oskari_analyse_id.replace((this.id_prefix + 'layer_'), '');
            if (!layerId) {
                return false;
            }
            // do we find the layer?
            var layer = this.instance.getSandbox().findMapLayerFromSelectedMapLayers(layerId);
            if (!layer) {
                return false;
            }
            // is it the same layer as the selected layer?
            if (layer.getId() === selectedLayer.getId()) {
                return false;
            }
            // is the layer an analysis layer?
            if (!layer.isLayerOfType('ANALYSIS')) {
                return false;
            }
            // does the layer have the same fields as the selected layer
            var fields1 = (selectedLayer.getFields ? selectedLayer.getFields().slice() : []),
                fields2 = (layer.getFields ? layer.getFields().slice() : []),
                f1Len = fields1.length,
                f2Len = fields2.length,
                i;

            // arrays are of different lengths
            if (f1Len !== f2Len) {
                return false;
            }
            // compare the elemets
            for (i = 0; i < f1Len; ++i) {
                if (fields1[i] !== fields2[i]) {
                    return false;
                }
            }

            return true;
        },

        /**
         * Returns the analyse layers the user has selected for union.
         * Adds also the selected layer since it's not included in the checkboxes.
         *
         * @method _getLayerUnionLayers
         * @param  {jQuery} container
         * @return {Array[String]}
         */
        _getLayerUnionLayers: function (container) {
            var me = this,
                layerUnionLayers = container.find('input[name=layer_union]:checked'),
                selectedLayer = this._getSelectedMapLayer();

            layerUnionLayers = jQuery.map(layerUnionLayers, function (val, i) {
                return val.value.replace((me.id_prefix + 'layer_'), '');
            });

            layerUnionLayers.push(selectedLayer.getId());

            return layerUnionLayers;
        },

        /**
         * @method _modifyExtraParameters
         * @private
         * modify parameters data UI according to method
         * @param {String} method  analyse method
         */
        _modifyExtraParameters: function (method) {
            var me = this;
            var contentPanel = me.mainPanel.find('div.extra_params');
            // Remove old content
            contentPanel.empty();

            // Empty the attribute selector for preserved layer attributes
            // And create it unless the selected method is aggregate,
            // in which case create a dropdown to select an attribute to aggregate
            var columnsContainer = me.mainPanel.find('div.analyse-columns-container');
            if (me.id_prefix + 'aggregate' === method) {
                columnsContainer.empty();
                // me._createColumnsDropdown(columnsContainer);
                me._createColumnsSelector(columnsContainer, me.loc.params.aggreLabel);
            } else if (me.id_prefix + 'aggregateText' === method) {
                // nop
            } else if (me.id_prefix + 'aggregateNumeric' === method) {
                // nop
            } else {
                columnsContainer.empty();
                me._createColumnsSelector(columnsContainer, me.loc.params.label);
            }

            me._addExtraParameters(contentPanel.parent(), method);
        },

        /**
         * Creates a dropdown to choose an attribute to get aggregated.
         *
         * @method _createColumnsDropdown
         * @param {jQuery Object} columnsContainer the container where the dropdown should be appended to.
         */
        _createColumnsDropdown: function (columnsContainer) {
            var me = this,
                selectedLayer = this._getSelectedMapLayer(),
                aggreMagic = function () {
                    return function () {
                        if (me._isNumericField(this.value)) {
                            me._modifyExtraParameters(me.id_prefix + 'aggregateNumeric');
                        } else {
                            me._modifyExtraParameters(me.id_prefix + 'aggregateText');
                        }
                    };
                };

            var fields = ((selectedLayer && selectedLayer.getFields && selectedLayer.getFields()) ? selectedLayer.getFields().slice() : []),
                locales = ((selectedLayer && selectedLayer.getLocales && selectedLayer.getLocales()) ? selectedLayer.getLocales().slice() : []),
                dropdown = this.template.columnsDropdown.clone(),
                i,
                localizedLabel,
                featureListOption;

            // Placeholder
            dropdown.append(jQuery('<option value="' + null + '">' + this.loc.aggregate.attribute + '</option>'));

            for (i = 0; i < fields.length; ++i) {
                // Get only the fields which originate from the service,
                // that is, exclude those which are added by Oskari (starts with '__').
                // TODO: append only numeric fields. Cannot be done before we get info of fields' types.
                if (!fields[i].match(/^__/)) {
                    localizedLabel = locales[i] || fields[i];
                    featureListOption = jQuery('<option value="' + fields[i] + '">' + localizedLabel + '</option>');
                    dropdown.append(featureListOption);
                }
            }
            dropdown.change(aggreMagic());
            columnsContainer.append(dropdown);


        },
        /**
         * @method refreshAnalyseData
         * @private
         * refresh analyse data layers in selection box
         *
         */
        refreshAnalyseData: function (layer_id) {
            // Remove old
            this.contentPanel.emptyLayers();
            this._addAnalyseData(this.contentPanel, layer_id);

        },
        /**
         * @method refreshExtraParameters
         * @private
         * refresh analyse parameters UI in the selection box
         *
         */
        refreshExtraParameters: function () {
            var me = this,
                container = me.mainPanel,
                selectedMethod = container.find('input[name=method]:checked').val();
            me._modifyExtraParameters(selectedMethod);

        },
        /**
         * @method _gatherSelections
         * @private
         * Gathers analyse selections and returns them as JSON object
         * @return {Object}
         */
        _gatherSelections: function () {
            var container = this.mainPanel,
                sandbox = this.instance.getSandbox();

            // Get the name of the method
            var selectedMethod = container.find('input[name=method]:checked').val(),
                methodName = selectedMethod && selectedMethod.replace(this.id_prefix, ''),
                layer = this._getSelectedMapLayer();

            // No layers
            if (!layer) return;

            // Get the feature fields
            var selectedColumnmode = container.find('input[name=params]:checked').val();
            var fields = selectedColumnmode && selectedColumnmode.replace(this.id_prefix, '');
            // All fields
            if (fields === 'all') {
                fields = ((layer && layer.getFields && layer.getFields()) ? layer.getFields().slice() : [0]);
            } else if (fields === 'select') {
                // Selected fields
                var fieldsList = jQuery('div.analyse-featurelist').find('ul li input:checked');
                fields = jQuery.map(fieldsList, function (val, i) {
                    return val.value;
                });
            } else {
                // None
                fields = [];
            }

            var title = container.find('.settings_name_field').val();
            var defaults = {
                name: title,
                method: methodName,
                layerType: layer.getLayerType()
            };

            if (layer.isLayerOfType(this.contentPanel.getLayerType())) {
                defaults.fields = [];
                defaults.fieldTypes = {};
                defaults.layerId = -1;
                defaults.features = [layer.getFeature()];
            } else {
                defaults.fields = fields;
                defaults.fieldTypes = layer.getPropertyTypes();
                defaults.layerId = layer.getId();
            }
            // Get method specific selections
            var selections = this._getMethodSelections(layer, defaults);

            // Styles
            selections.style = this.getStyleValues();
            // Bbox
            selections.bbox = this.instance.getSandbox().getMap().getBbox();

            return selections;
        },

        /**
         * Adds method specific parameters to selections
         *
         * @method _getMethodSelections
         * @private
         * @param {Object} layer an Oskari layer
         * @param {Object} defaultSelections the defaults, such as name etc.
         * @return {Object} selections for a given method
         */
        _getMethodSelections: function (layer, defaultSelections) {
            var me = this,
                container = this.mainPanel,
                methodName = defaultSelections.method;

            // buffer
            var bufferSize = container.find('.settings_buffer_field').val(),
                bufferUnit = container.find('.settings_buffer_units option:selected').val(),
                bufferUnitMultiplier = this.bufferUnits[bufferUnit] || 1;
            bufferSize *= bufferUnitMultiplier;
            // aggregate
            var aggregateFunctions = container.find('input[name=aggre]:checked');
            aggregateFunctions = jQuery.map(aggregateFunctions, function (val, i) {
                return val.value.replace(me.id_prefix, '');
            });
            var aggregateAttribute = container.find('select.analyse-columns-dropdown option').filter(':selected').val();
            // union
            var unionLayerId = container.find('input[name=union]:checked').val();
            unionLayerId = unionLayerId && unionLayerId.replace((this.id_prefix + 'layer_'), '');
            // clip, intersect
            var intersectLayerId = container.find('input[name=intersect]:checked').val();
            intersectLayerId = intersectLayerId && intersectLayerId.replace((this.id_prefix + 'layer_'), '');
            var intersectFeatures,
                tempLayer = this.contentOptionsMap[intersectLayerId];
            if (tempLayer && tempLayer.temp) {
                tempLayer = this.contentPanel.findFeatureById(tempLayer.id);
                intersectLayerId = -1;
                intersectFeatures = [tempLayer.getFeature()];
            }
            var spatialOperator = container.find('input[name=spatial]:checked').val();
            spatialOperator = spatialOperator && spatialOperator.replace(this.id_prefix, '');
            // layer union
            var layerUnionLayers = this._getLayerUnionLayers(container);

            var areaCount = container.find('input.settings_area_count_field').val(),
                areaSize = container.find('input.settings_area_size_field').val(),
                areaUnit = container.find('.settings_area_size_units option:selected').val(),
                areaUnitMultiplier = this.bufferUnits[areaUnit] || 1,
                sectorCount = container.find('input.settings_sector_count_field').val();

            areaSize *= areaUnitMultiplier;

            var methodSelections = {
                'buffer': {
                    methodParams: {
                        distance: bufferSize
                    },
                    opacity: layer.getOpacity()
                },
                'aggregate': {
                    methodParams: {
                        functions: aggregateFunctions, // TODO: param name?
                        attribute: aggregateAttribute,
                        no_data: me._getNoDataValue()
                    }
                },
                'union': {
                    methodParams: {
                        layerId: unionLayerId
                    }
                },
                'clip': {
                    methodParams: {
                        layerId: intersectLayerId,
                        features: intersectFeatures
                    }
                },
                'intersect': {
                    methodParams: {
                        layerId: intersectLayerId,
                        operator: spatialOperator, // TODO: param name?
                        features: intersectFeatures
                    }
                },
                'layer_union': {
                    methodParams: {
                        layers: layerUnionLayers
                    }
                },
                'areas_and_sectors': {
                    methodParams: {
                        areaCount: areaCount,
                        areaDistance: areaSize,
                        sectorCount: sectorCount
                    },
                    opacity: layer.getOpacity()
                }
            };
            var s;
            for (s in methodSelections[methodName]) {
                if (methodSelections[methodName].hasOwnProperty(s)) {
                    defaultSelections[s] = methodSelections[methodName][s];
                }
            }
            return defaultSelections;
        },

        /**
         * @method _getAggregateLocalization
         * @private
         * @param {String}  funcKey Aggregate function key
         * @return {String} Localized aggregate function name
         * Get localized name for aggregate function
         */
        _getAggregateLocalization: function (funcKey) {
            var fullKey = 'oskari_analyse_' + funcKey,
                ret = null,
                i;

            for (i = 0; i < this.loc.aggregate.options.length; i++) {
                if (this.loc.aggregate.options[i].id === fullKey) {
                    ret = this.loc.aggregate.options[i].label;
                    break;
                }
            }

            return ret;
        },

        /**
         * @method _analyseMap
         * @private
         * Check parameters and execute analyse.
         *
         */
        _analyseMap: function () {
            var me = this,
                sandbox = this.instance.getSandbox(),
                url = sandbox.getAjaxUrl(),
                selections = me._gatherSelections(),
                i;

            // Check that parameters are a-okay
            if (me._checkSelections(selections)) {

                var data = {};

                // Sorry - use intersect method for clip
                if (selections.method === "clip") {
                    selections.method = "intersect";
                    selections.methodParams.operator = "clip";

                }

                if (selections.methodParams.functions &&
                    selections.methodParams.functions.length) {

                    selections.methodParams.locales = [];
                    for (i = 0; i < selections.methodParams.functions.length; i++) {
                        selections.methodParams.locales.push(
                            this._getAggregateLocalization(
                                selections.methodParams.functions[i]
                            )
                        );
                    }
                }

                data.analyse = JSON.stringify(selections);

                var layerId = selections.layerId,
                    layer = sandbox.findMapLayerFromSelectedMapLayers(layerId);
                if (this.getFilterJson(layerId)) {
                    var filterJson = this.getFilterJson(layerId);
                    // If the user wanted to include only selected/clicked
                    // features, get them now from the layer.
                    if (filterJson.featureIds) {
                        // no bbox filter when selected features
                        this._getSelectedFeatureIds(layer, filterJson);
                        delete filterJson.bbox;
                    }
                    else {
                        filterJson.featureIds = [];
                    }
                    data.filter1 = JSON.stringify(filterJson);
                }
                if ((selections.method === "intersect") || (selections.method === "clip")) {
                    var intersectLayerId = selections.methodParams.layerId,
                        ilayer = sandbox.findMapLayerFromSelectedMapLayers(intersectLayerId),
                        ifilterJson = this.getFilterJson(intersectLayerId);
                    if (ifilterJson) {
                        // If the user wanted to include only selected/clicked
                        // features, get them now from the layer.
                        if (ifilterJson.featureIds) {
                            this._getSelectedFeatureIds(ilayer, ifilterJson);
                        }
                        data.filter2 = JSON.stringify(ifilterJson);
                    }

                }

                // Send the data for analysis to the backend
                me.progressSpinner.start();
                me.instance.analyseService.sendAnalyseData(data,
                    // Success callback

                    function (response) {
                        me.progressSpinner.stop();
                        if (response) {
                            if (response.error) {
                                me.instance.showMessage(me.loc.error.title, me.loc.error[response.error] || response.error);
                            } else
                                me._handleAnalyseMapResponse(response);
                        }
                    },
                    // Error callback

                    function (jqXHR, textStatus, errorThrown) {
                        me.progressSpinner.stop();

                    });
            }

        },

        /**
         * Creates the map layer from the JSON given as a param
         * and adds it to the map and subsequently to be used in further analysis.
         *
         * @method _handleAnalyseMapResponse
         * @private
         * @param {JSON} analyseJson Layer JSON returned by server.
         */
        _handleAnalyseMapResponse: function (analyseJson) {
            // TODO: some error checking perhaps?
            var me = this,
                mapLayerService,
                mapLayer,
                requestBuilder,
                request;


            mapLayerService = this.instance.mapLayerService;
            // Create the layer model
            mapLayer = mapLayerService.createMapLayer(analyseJson);
            // Add the layer to the map layer service
            mapLayerService.addLayer(mapLayer);

            // Request the layer to be added to the map.
            // instance.js handles things from here on.
            requestBuilder = this.instance.sandbox.getRequestBuilder('AddMapLayerRequest');
            if (requestBuilder) {
                request = requestBuilder(mapLayer.getId());
                this.instance.sandbox.request(this.instance, request);
            }
            // Remove old layers if any
            if (analyseJson.mergeLayers) {
                var mlays = analyseJson.mergeLayers;
                if (mlays.length > 0) {
                    // TODO: shouldn't maplayerservice send removelayer request by default on remove layer?
                    // also we need to do it before service.remove() to avoid problems on other components
                    var removeMLrequestBuilder = this.instance.sandbox.getRequestBuilder('RemoveMapLayerRequest'),
                        i;

                    for (i in mlays) {
                        if (mlays.hasOwnProperty(i)) {
                            request = removeMLrequestBuilder(mlays[i]);
                            this.instance.sandbox.request(this.instance, request);
                            mapLayerService.removeLayer(mlays[i]);
                        }
                    }
                }
            }
        },

        /**
         * @method _saveAnalyse
         * @private
         * Save analyse data.
         * @param {Object} selections analyse params as returned by _gatherSelections()
         */
        _saveAnalyse: function (selections, features) {
            var me = this,
                sandbox = this.instance.getSandbox(),
                url = sandbox.getAjaxUrl();

            alert('TODO: save analyse data operations');
        },
        /**
         * @method _infoRequest
         * @private
         * Request sandbox for to open metadata info
         * @param {jQuery} tools  table div where info icon is located
         * @param {int} layer_id  layer id for to retreave layer object
         */
        _infoRequest: function (tools, layer_id) {
            layer_id = layer_id.replace(this.id_prefix + 'layer_', '');
            var me = this,
                layer = me.instance.getSandbox().findMapLayerFromSelectedMapLayers(layer_id);

            tools.find('div.layer-info').bind('click', function () {
                var rn = 'catalogue.ShowMetadataRequest',
                    uuid = layer.getMetadataIdentifier(),
                    additionalUuids = [],
                    additionalUuidsCheck = {};
                additionalUuidsCheck[uuid] = true;

                var subLayers = layer.getSubLayers(),
                    s,
                    subUuid;
                if (subLayers && subLayers.length > 0) {
                    for (s = 0; s < subLayers.length; s++) {
                        subUuid = subLayers[s].getMetadataIdentifier();
                        if (subUuid && subUuid !== "" && !additionalUuidsCheck[subUuid]) {
                            additionalUuidsCheck[subUuid] = true;
                            additionalUuids.push({
                                uuid: subUuid
                            });
                        }
                    }

                }

                me.instance.getSandbox().postRequestByName(
                    rn, [{
                            uuid: uuid
                        },
                        additionalUuids
                    ]
                );
            });
        },
        /**
         * Requests to remove a layer from the map.
         *
         * @method _removeLayerRequest
         * @private
         * @param  {String} analyseLayerId
         */
        _removeLayerRequest: function (analyseLayerId) {
            var layerId = analyseLayerId.replace(this.id_prefix + 'layer_', ''),
                sandbox = this.instance.getSandbox(),
                layer = sandbox.findMapLayerFromSelectedMapLayers(layerId),
                reqBuilder = sandbox.getRequestBuilder('RemoveMapLayerRequest'),
                request;

            if (layer && reqBuilder) {
                request = reqBuilder(layer.getId());
                sandbox.request(this.instance, request);
            }
        },
        /**
         * Returns the Oskari layer object for currently selected layer
         *
         * @method _getSelectedMapLayer
         * @private
         * @return {Object/null} an Oskari layer or null if no layer selected
         */
        _getSelectedMapLayer: function () {
            var selectedLayer = this._selectedLayers(),
                layerId;

            selectedLayer = selectedLayer && selectedLayer[0];

            if (!selectedLayer) {
                return;
            }

            if (selectedLayer.temp) {
                layerId = selectedLayer.id;
                return this.contentPanel.findFeatureById(layerId);
            } else {
                layerId = selectedLayer.id.replace((this.id_prefix + 'layer_'), '');
                return (this.instance
                    .getSandbox()
                    .findMapLayerFromSelectedMapLayers(layerId));
            }
        },

        /**
         * Gets the clicked/selected features' ids and sets it to filterJson.
         *
         * @method _getSelectedFeatureIds
         * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
         * @param {JSON} filterJson
         */
        _getSelectedFeatureIds: function (layer, filterJson) {
            if (!layer || !filterJson) {
                return;
            }
            filterJson.featureIds = (layer.getClickedFeatureListIds() ? layer.getClickedFeatureListIds().slice() : []);
        },
        /**
         * Add field property types {fieldname1:type1,...} to layer and wps_params
         * @param layers selected layers
         * @private
         */
        _addPropertyTypes: function (layers) {
            var me = this,
                i;
            for (i = 0; i < layers.length; i++) {
                if (layers[i].hasFeatureData()) {
                    if (jQuery.isEmptyObject(layers[i].getPropertyTypes())) {
                        me.instance.analyseService.loadWFSLayerPropertiesAndTypes(layers[i].getId());
                    }
                }
            }
        },
        /**
         * Check if wfs field type is numeric
         * @param fieldName  property name
         * @private
         */
        _isNumericField: function (fieldName) {
            var me = this,
                isIt = false,
                selectedLayer = me._getSelectedMapLayer(),
                data = selectedLayer.getPropertyTypes();
            jQuery.each(data, function (key, value) {
                if (fieldName === key) {
                    if (value === 'numeric') {
                        isIt = true;
                    }
                }
            });

            return isIt;
        },
        /**
         * Get selected wfs layer's no_data value for wps analyse
         * There is no no_value for selected layer, if return value is undefined
         * @return no_data value
         * @private
         */
        _getNoDataValue: function () {
            var me = this,
                no_data,
                selectedLayer = me._getSelectedMapLayer();
            if ( !selectedLayer) return no_data;
            var params = selectedLayer.getWpsLayerParams();
            if (params) {
                jQuery.each(params, function (key, value) {
                    if (key === "no_data") {
                        no_data = value;
                    }
                });
            }

            return no_data;
        },
        /**
         * Modify analyse name when analyse layer is changed
         * @private
         */
        _modifyAnalyseName: function () {
            var me = this,
                container = me.mainPanel,
                selected_layer = me._getSelectedMapLayer(),
                name = '_';
            if (selected_layer) {
                name = selected_layer.getName().substring(0, 15) + name;
            }
            container.find('.settings_name_field').attr({
                'value': name,
                'placeholder': me.loc.analyse_name.tooltip
            });
        },
        /**
         * Inform user, if more than 10 fields in analyse input layer
         *
         */
        showInfos: function () {
            var me = this,
                selectedLayer = me._getSelectedMapLayer(),
                isAnalyseLayer,
                exceedsFieldsCount,
                tooManyFieldsMsg;

            // No layer selected - nothing to do here
            if (!selectedLayer) return;

            isAnalyseLayer = selectedLayer.getId().toString()
                .indexOf(me.layer_prefix) > -1;
            // No checks for analysis layers
            if (isAnalyseLayer) return;

            exceedsFieldsCount = (selectedLayer.getFields &&
                selectedLayer.getFields().length > me.max_analyse_layer_fields);

            if (exceedsFieldsCount) {
                tooManyFieldsMsg = (me.loc.infos.layer +
                    " " + selectedLayer.getName() +
                    " " + me.loc.infos.over10);
                me.instance.showMessage(me.loc.infos.title, tooManyFieldsMsg);
            }
        },
        /**
         * Check if the selected layer has more fields available
         * than the permitted maximum number and if so,
         * disable the 'all fields' selection.
         *
         * @method _checkParamsSelection
         * @private
         */
        _checkParamsSelection: function () {
            var selectedLayer = this._getSelectedMapLayer(),
                exceedsFieldsCount = (
                    selectedLayer &&
                    selectedLayer.getFields &&
                    (selectedLayer.getFields().length >
                        this.max_analyse_layer_fields)
                );

            if (exceedsFieldsCount) {
                this._disableAllParamsSelection();
            } else {
                this._enableAllParamsSelection();
            }
        },
        _enableAllParamsSelection: function () {
            var paramsCont = jQuery('.analyse-columns-container');

            paramsCont
                .find('#oskari_analyse_all')
                .prop('disabled', false)
                .prop('checked', true)
                .change();
        },
        _disableAllParamsSelection: function () {
            var paramsCont = jQuery('.analyse-columns-container');

            paramsCont
                .find('#oskari_analyse_all')
                .prop('disabled', true);

            paramsCont
                .find('#oskari_analyse_select')
                .prop('checked', true)
                .change();
        },
        /**
         * Change default colors for analyse in random range order
         * @method randomColors
         */
        randomizeColors: function () {
            if (!this.mainPanel.find('input[name=randomize_colors]').is(':checked')) {
                return;
            }

            if (this.colorCount === undefined || this.colorCount === 16) {
                this.colorCount = 0;
            } else {
                ++this.colorCount;
            }

            var line_point_border_colors = [
                'e31a1c', '2171b5', '238b45', '88419d',
                '2b8cbe', '238b45', 'd94801', 'd7301f',
                '0570b0', '02818a', 'ce1256', '6a51a3',
                'ae017e', 'cb181d', '238443', '225ea8',
                'cc4c02'
            ],
                fill_colors = [
                    'fd8d3c', '6baed6', '66c2a4', '8c96c6',
                    '7bccc4', '74c476', 'fd8d3c', 'fc8d59',
                    '74a9cf', '67a9cf', 'df65b0', '9e9ac8',
                    'f768a1', 'fb6a4a', '78c679', '41b6c4',
                    'fe9929'
                ],
                values = {
                    point: {
                        color: line_point_border_colors[this.colorCount]
                    },
                    line: {
                        color: line_point_border_colors[this.colorCount]
                    },
                    area: {
                        lineColor: line_point_border_colors[this.colorCount],
                        fillColor: fill_colors[this.colorCount]
                    }
                };

            if (this.visualizationForm) {
                this.visualizationForm.setValues(values);
            }
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
        setEnabled: function (enabled) {
            this.isEnabled = enabled;

            if (enabled) {
                this.contentPanel.start();
            } else {
                this.contentPanel.stop();
            }
        },
        getEnabled: function () {
            return this.isEnabled;
        },
        getState: function () {
            return {}; // TODO: later this._gatherSelections();
        },
        setState: function (formState) {

        }
    });
