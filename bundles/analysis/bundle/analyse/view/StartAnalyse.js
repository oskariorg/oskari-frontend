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
function(instance, localization) {
    var me = this;
    this.isEnabled = false;
    this.instance = instance;
    this.loc = localization;
    this.id_prefix = 'oskari_analyse_';
    this.layer_prefix = 'analysis_';

    /* templates */
    this.template = {};
    for (p in this.__templates ) {
        this.template[p] = jQuery(this.__templates[p]);
    }

    /* Analyse method options in localisations */
    this.methodOptions = this.loc.method.options;

    this.methodOptionsMap = {};
    for (var s = 0; s < this.methodOptions.length; s++) {
        this.methodOptionsMap[this.methodOptions[s].id] = this.methodOptions[s];
    }

    /* parameter options listed in localisations */
    this.paramsOptions = this.loc.params.options;
    this.paramsOptionsMap = {};
    for (var f = 0; f < this.paramsOptions.length; f++) {
        this.paramsOptionsMap[this.paramsOptions[f].id] = this.paramsOptions[f];
    }

    /* aggregate options listed in localisations */
    this.aggreOptions = this.loc.aggregate.options;
    this.aggreOptionsMap = {};
    for (var f = 0; f < this.aggreOptions.length; f++) {
        this.aggreOptionsMap[this.aggreOptions[f].id] = this.aggreOptions[f];
    }

    /* spatial options listed in localisations for intersect */
    this.spatialOptions = this.loc.spatial.options;
    this.spatialOptionsMap = {};
    for (var f = 0; f < this.spatialOptions.length; f++) {
        this.spatialOptionsMap[this.spatialOptions[f].id] = this.spatialOptions[f];
    }

    // content options listed in localisations
    this.contentOptionsMap = {};
    this.intersectOptionsMap = {};
    this.unionOptionsMap = {};

    this.contentOptions = {};
    this.intersectOptions = {};
    this.unionOptions = {};

    this.accordion = null;
    this.mainPanel = null;

    this.progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
    this.alert = Oskari.clazz.create('Oskari.userinterface.component.Alert');

    this.previewContent = null;
    this.previewImgDiv = null;

    this.contentOptionDivs = {};

    this.paramsOptionDivs = {};
    this.aggreOptionDivs = {};

    this._filterJsons = {};
    this._filterPopups = {};

}, {
    __templates : {
        "content" : '<div class="layer_data"></div>',
        "icons_layer" : '<table class=layer-icons> <tr> <td><div class="layer-icon layer-wfs" title="Tietotuote"></div></td><td><div class="layer-info icon-info"></div></td><td><div class="filter icon-funnel"></div></td></tr></table>',
        "tool" : '<div class="tool ">' + '<input type="checkbox"/>' + '<label></label></div>',
        "buttons" : '<div class="buttons"></div>',
        "help" : '<div class="help icon-info"></div>',
        "main" : '<div class="basic_analyse">' + '<div class="header">' + '<div class="icon-close">' + '</div>' + '<h3></h3>' + '</div>' + '<div class="content">' + '</div>' + '</div>',
        "columnsContainer" : '<div class="analyse-columns-container"></div>',
        "columnsDropdown" : '<select class="analyse-columns-dropdown"></select>',
        "paramsOptionExtra" : '<div class="extra_params"></div>',
        "paramsOptionTool" : '<div class="tool ">' + '<input type="radio" name="params" />' + '<label></label></div>',
        "aggreOptionTool" : '<div class="tool ">' + '<input type="checkbox" name="aggre" />' + '<label></label></div>',
        "spatialOptionTool" : '<div class="tool ">' + '<input type="radio" name="spatial" />' + '<label></label></div>',
        "intersectOptionTool" : '<div class="tool ">' + '<input type="radio" name="intersect" />' + '<label></label></div>',
        "unionOptionTool" : '<div class="tool ">' + '<input type="radio" name="union" />' + '<label></label></div>',
        "title" : '<div class="analyse_title_cont analyse_settings_cont"><div class="settings_buffer_label"></div><input class="settings_buffer_field" type="text"></div>',
        "title_name" : '<div class="analyse_title_name analyse_settings_cont"><div class="settings_name_label"></div><input class="settings_name_field" type="text"></div>',
        "title_color" : '<div class="analyse_title_colcont analyse_output_cont"><div class="output_color_label"></div></div>',
        "title_columns" : '<div class="analyse_title_columns analyse_output_cont"><div class="columns_title_label"></div></div>',
        "title_extra" : '<div class="analyse_title_extra analyse_output_cont"><div class="extra_title_label"></div></div>',
        "icon_colors" : '<div class="icon-menu"></div>',
        "option" : '<div class="analyse_option_cont analyse_settings_cont">' + '<input type="radio" name="selectedlayer" />' + '<label></label></div>',
        "methodOptionTool" : '<div class="tool ">' + '<input type="radio" name="method" />' + '<label></label></div>',
        "featureListSelect" : '<div class="analyse-select-featurelist"><a href="#">...</a></div>',
        "featureList" : '<div class="analyse-featurelist"><ul></ul></div>',
        "featureListElement" : '<li><input type="checkbox"></input><label></label></li>'

    },
    /**
     * @method render
     * Renders view to given DOM element
     * @param {jQuery} container reference to DOM element this component will be
     * rendered to
     */
    render : function(container) {
        var me = this;
        var content = this.template.main.clone();

        this.mainPanel = content;
        content.find('div.header h3').append(this.loc.title);

        container.append(content);
        var contentDiv = content.find('div.content');

        this.alert.insertTo(contentDiv);

        var accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
        this.accordion = accordion;

        var contentPanel = this._createContentPanel();
        contentPanel.open();

        accordion.addPanel(contentPanel);

        var methodPanel = this._createMethodPanel();
        methodPanel.open();
        accordion.addPanel(methodPanel);

        var settingsPanel = this._createSettingsPanel();
        settingsPanel.open();

        accordion.addPanel(settingsPanel);

        var outputPanel = this._createOutputPanel();
        //outputPanel.open();

        accordion.addPanel(outputPanel);

        accordion.insertTo(contentDiv);

        // buttons
        // close
        container.find('div.header div.icon-close').bind('click', function() {
            me.instance.setAnalyseMode(false);
        });
        contentDiv.append(this._getButtons());

        var inputs = this.mainPanel.find('input[type=text]');
        inputs.focus(function() {
            me.instance.sandbox.postRequestByName('DisableMapKeyboardMovementRequest');
        });
        inputs.blur(function() {
            me.instance.sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
        });
        // bind help tags
        var helper = Oskari.clazz.create('Oskari.userinterface.component.UIHelper', this.instance.sandbox);
        helper.processHelpLinks(this.loc.help, content, this.loc.error.title, this.loc.error.nohelp);

    },
    /**
     * @method _createContentPanel
     * @private
     * Creates the content layer selection panel for analyse
     * @return {jQuery} Returns the created panel
     */
    _createContentPanel : function() {
        var me = this;
        var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
        panel.setTitle(this.loc.content.label);
        me.contentPanel = panel.getContainer();

        var tooltipCont = this.template.help.clone();
        tooltipCont.attr('title', this.loc.content.tooltip);
        me.contentPanel.append(tooltipCont);
        me._addAnalyseData(me.contentPanel);

        var dataBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        dataBtn.setTitle(this.loc.buttons.data);
        dataBtn.addClass('primary');
        dataBtn.setHandler(function() {

            me._modifyAnalyseData(me.contentPanel);

        });
        dataBtn.insertTo(me.contentPanel);

        return panel;
    },
    /**
     * @method _createMethodPanel
     * @private
     * Creates the method selection panel for analyse
     * @return {jQuery} Returns the created panel
     */
    _createMethodPanel : function() {
        var me = this;
        var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
        panel.setTitle(this.loc.method.label);
        var contentPanel = panel.getContainer();
        // content
        var closureMagic = function(tool) {
            return function() {
                var size = contentPanel.find('input[name=method]:checked').val();
                // reset previous setting
                for (var i = 0; i < me.methodOptions.length; ++i) {
                    me.methodOptions[i].selected = false;
                }
                tool.selected = true;

            };
        };
        var clickMagic = function(tool) {
            return function() {
                me._modifyExtraParameters(tool.id);
            };
        };
        for (var i = 0; i < this.methodOptions.length; ++i) {
            var option = this.methodOptions[i];
            me.option_id = option.id;
            var toolContainer = this.template.methodOptionTool.clone();
            var label = option.label;
            if (option.width && option.height) {
                label = label + ' (' + option.width + ' x ' + option.height + 'px)';
            }
            toolContainer.find('label').append(label).attr({
                'for' : option.id,
                'class' : 'method_radiolabel'
            });
            if (option.selected) {
                toolContainer.find('input').attr('checked', 'checked');
            }
            var tooltipCont = this.template.help.clone();
            tooltipCont.attr('title', option.tooltip);
            toolContainer.append(tooltipCont);

            contentPanel.append(toolContainer);
            toolContainer.find('input').attr({
                'value' : option.id,
                'name' : 'method',
                'id' : option.id
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
    _createSettingsPanel : function() {
        var me = this;
        var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
        panel.setTitle(this.loc.settings.label);
        var contentPanel = panel.getContainer();
        // tooltip
        var tooltipCont = this.template.help.clone();
        tooltipCont.attr('title', this.loc.settings.tooltip);
        contentPanel.append(tooltipCont);

        // Changing part of parameters ( depends on method)
        var extra = this.template.paramsOptionExtra.clone();
        contentPanel.append(extra);
        // buffer is default method
        me._addExtraParameters(contentPanel, me.id_prefix + "buffer");

        var columnsContainer = this.template.columnsContainer.clone();
        this._createColumnsSelector(columnsContainer);
        contentPanel.append(columnsContainer);

        // Analyse NAME
        var selected_layers = me._selectedLayers();
        var name = '_';
        if (selected_layers[0])
            name = selected_layers[0].name.substring(0, 15)+name;
        var analyseTitle = me.template.title_name.clone();
        analyseTitle.find('.settings_name_label').html(me.loc.analyse_name.label);
        analyseTitle.find('.settings_name_field').attr({
            'value' : name,
            'placeholder' : me.loc.analyse_name.tooltip
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
    _createColumnsSelector : function(columnsContainer) {
        var me = this;

        var columnsTitle = this.template.title_columns.clone();
        columnsTitle.find('.columns_title_label').html(this.loc.params.label);
        columnsContainer.append(columnsTitle);

        var closureMagic = function(tool) {
            return function() {
                var size = columnsContainer.find('input[name=params]:checked').val();
                // reset previous setting
                for (var i = 0; i < me.paramsOptions.length; ++i) {
                    me.paramsOptions[i].selected = false;
                }
                tool.selected = true;

            };
        };

        for (var i = 0; i < this.paramsOptions.length; ++i) {
            var option = this.paramsOptions[i];
            var toolContainer = this.template.paramsOptionTool.clone();
            var label = option.label;
            if (option.width && option.height) {
                label = label + ' (' + option.width + ' x ' + option.height + 'px)';
            }
            toolContainer.find('label').append(label).attr({
                'for' : option.id,
                'class' : 'params_radiolabel'
            });
            if (option.selected) {
                toolContainer.find('input[name=params]').attr('checked', 'checked');
            }

            if (option.id === 'oskari_analyse_select') {
                this._appendFeatureList(toolContainer);
            }

            columnsContainer.append(toolContainer);
            toolContainer.find('input[name=params]').attr({
                'value' : option.id,
                'name' : 'params',
                'id' : option.id
            });
            toolContainer.find('input[name=params]').change(closureMagic(option));
        }
    },

    /**
     * Creates a list to select fields to include in analyse
     *
     * @method _appendFeatureList
     * @param {jQuery object} toolContainer
     */
    _appendFeatureList : function(toolContainer) {
        var featureListSelect = this.template.featureListSelect.clone(), featureList = this.template.featureList.clone();

        featureListSelect.append(featureList);
        toolContainer.append(featureListSelect);
        featureList.hide();
        featureList.find('ul').empty();
        this._appendFields(featureList);

        featureListSelect.find('a').on('click', function(e) {
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
    _appendFields : function(featureList) {
        var selectedLayer = this._getSelectedMapLayer();
        if (!selectedLayer) {
            return;
        }

        var fields = ((selectedLayer.getFields && selectedLayer.getFields()) ? selectedLayer.getFields().slice() : [] ), locales = ((selectedLayer.getLocales && selectedLayer.getLocales()) ? selectedLayer.getLocales().slice() : [] ), i, featureListElement, localizedLabel;

        for ( i = 0; i < fields.length; ++i) {
            // Get only the fields which originate from the service,
            // that is, exclude those which are added by Oskari (starts with '__').
            if (!fields[i].match(/^__/)) {
                localizedLabel = locales[i] || fields[i];
                featureListElement = this.template.featureListElement.clone();
                featureListElement.find('input').val(fields[i]);
                featureListElement.find('label').append(localizedLabel).attr({
                    'for' : fields[i]
                });
                featureList.find('ul').append(featureListElement);
            }
        }
    },

    /**
     * Refreshes the fields list after a layer has been added or changed.
     *
     * @method _refreshFields
     */
    _refreshFields : function() {
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
    _createOutputPanel : function() {
        var me = this;
        var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
        panel.setTitle(this.loc.output.label);
        var contentPanel = panel.getContainer();
        // tooltip
        var tooltipCont = this.template.help.clone();
        tooltipCont.attr('title', this.loc.output.tooltip);
        contentPanel.append(tooltipCont);

        var colorTitle = this.template.title_color.clone();
        colorTitle.find('.output_color_label').html(this.loc.output.color_label);

        contentPanel.append(colorTitle);
        // ... icon maybe later
        // var icon_colors = this.template.icon_colors.clone();
        // icon_colors.attr('title', this.loc.output.colorset_tooltip);
        // contentPanel.append(icon_colors);
        // Select colors for
        // icon_colors.click(function() {
        me._colorSelector(contentPanel);
        // });

        return panel;
    },
    /**
     * @method _selectedLayers
     * @private
     * Select selected layers for analyse
     * @return {Json ?} Returns selected layers
     */
    _selectedLayers : function() {
        var me = this;
        var layers = [];
        if (me.contentOptionDivs) {
            for (var p in me.contentOptionsMap ) {
                if (me.contentOptionDivs[p] != undefined) {
                    if (me.contentOptionDivs[p].find('input').prop('checked')) {
                        var layer = {
                            id : me.contentOptionsMap[p].id,
                            name : me.contentOptionsMap[p].label
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
    _columnSelector : function(layers) {

        alert('TODO: add columns selector - use grid component - layers: ' + JSON.stringify(layers));
    },
    /**
     * @method _colorSelector
     * @private
     * Select colors for analyse
     * @param {jQuery} coldiv  div, to where append style setup form
     *
     */
    _colorSelector : function(coldiv) {
        var me = this;
        // Use myplace style setup
        me.categoryForm = Oskari.clazz.create('Oskari.analysis.bundle.analyse.view.CategoryForm', me.instance);
        // hide myplace layer name input
        var myform = me.categoryForm.getForm();
        myform.find('div.field:first').hide();
        coldiv.append(myform);
    },
    /**
     * @method getStyleValues
     * Returns style values as an object
     * @return {Object}
     */
    getStyleValues : function() {
        var me = this;
        var values = {};
        // infobox will make us lose our reference so search
        // from document using the form-class
        var onScreenForm = me.mainPanel;

        if (onScreenForm.length > 0) {
            // found form on screen
            // Point style
            var dotSize = onScreenForm.find('input[name=dotSize]').val();
            var dotColor = '#'+onScreenForm.find('input[name=dotColor]').val();
            values.dot = {
                size : dotSize,
                color : dotColor
            }
            // Line style
            var lineSize = onScreenForm.find('input[name=lineSize]').val();
            var lineColor = '#'+onScreenForm.find('input[name=lineColor]').val();
            values.line = {
                size : lineSize,
                color : lineColor
            }
            // Polygon style
            var areaLineSize = onScreenForm.find('input[name=areaLineSize]').val();
            var areaLineColor = '#'+onScreenForm.find('input[name=areaLineColor]').val();
            var areaFillColor = '#'+onScreenForm.find('input[name=areaFillColor]').val();
            values.area = {
                size : areaLineSize,
                lineColor : areaLineColor,
                fillColor : areaFillColor
            }
        }
        return values;
    },
    /**
     * @method _getButtons
     * @private
     * Renders data buttons to DOM snippet and returns it.
     * @return {jQuery} container with buttons
     */
    _getButtons : function() {
        var me = this;

        var buttonCont = this.template.buttons.clone();

        var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        cancelBtn.setTitle(this.loc.buttons.cancel);
        cancelBtn.setHandler(function() {
            me.instance.setAnalyseMode(false);
        });
        cancelBtn.insertTo(buttonCont);

        var saveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        saveBtn.setTitle(this.loc.buttons.save);
        //saveBtn.addClass('primary');
        saveBtn.setHandler(function() {

            var selections = me._gatherSelections();
            if (selections) {
                me._saveAnalyse(selections);
            }
        });
        saveBtn.insertTo(buttonCont);

        var analyseBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        analyseBtn.setTitle(this.loc.buttons.analyse);
        analyseBtn.addClass('primary');
        analyseBtn.setHandler(function() {

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
     */
    _addAnalyseData : function(contentPanel_in) {
        var me = this;
        var contentPanel = contentPanel_in.find('.help:first');
        var layers = this.instance.getSandbox().findAllSelectedMapLayers();
        // Add property types for WFS layer, if not there
        this._addPropertyTypes(layers);
        var options = [];
        var ii = 0;
        var selected_layer = me._getSelectedMapLayer();
        // request updates for map tiles
        for (var i = 0; i < layers.length; i++) {
            if (layers[i].isLayerOfType('WFS') || layers[i].isLayerOfType('ANALYSIS')) {
                var option = {
                    id : me.id_prefix + 'layer_' + layers[i].getId(),
                    label : layers[i].getName()
                };
                ii++;
                if(selected_layer)
                {
                    // keep previous setup
                    if(selected_layer.getName() === layers[i].getName() )option.checked = "checked";
                }
                else if (ii == 1) option.checked = "checked";

                options.push(option);
            }
        }
        me.contentOptions = options;
        me.contentOptionsMap = {};
        for (var f = 0; f < me.contentOptions.length; f++) {
            me.contentOptionsMap[me.contentOptions[f].id] = me.contentOptions[f];
        }

        me.contentOptionDivs = {};
        for (var f = 0; f < me.contentOptions.length; f++) {
            var dat = me.contentOptions[f];

            var opt = me.template.option.clone();
            opt.find('input').attr({
                'id' : dat.id,
                'checked' : dat.checked
            }).change(function(e) {
                me._refreshFields();
            });
            opt.find('label').html(dat.label).attr({
                'for' : dat.id,
                'class' : 'params_checklabel'
            });
            me.contentOptionDivs[dat.id] = opt;
            // Icons
            var icons = me.template.icons_layer.clone();
            //cb info
            me._infoRequest(icons, dat.id);
            //cb filter
            me._filterRequest(icons, dat.id);

            opt.append(icons);
            contentPanel.after(opt);

        }
        // Analyse name
        me._modifyAnalyseName();
        var clickMagic = function() {
            return function() {
                me._modifyAnalyseName();
            };
        };

        // layer changed cb
        me.contentPanel.find('input').click(clickMagic());

        me._refreshFields();
    },
    /**
     * @method _addExtraParameters
     * @private
     * Add parameters data UI according to method
     * @param {String} method  analyse method
     */
    _addExtraParameters : function(contentPanel, method) {
        var me = this;
        var extra = contentPanel.find('.extra_params')
        if (method == this.id_prefix + "buffer") {
            var bufferTitle = me.template.title.clone();
            bufferTitle.find('.settings_buffer_label').html(me.loc.buffer_size.label);
            bufferTitle.find('.settings_buffer_field').attr({
                'value' : '',
                'placeholder' : me.loc.buffer_size.tooltip
            });

            extra.append(bufferTitle);

        }
        else if (method == this.id_prefix + "aggregate") {
            // sum, count, min, max, med

            me._aggregateExtra(extra);

        }
        else if (method == this.id_prefix + "aggregateNumeric") {
            // sum, count, min, max, med

            me._aggregateExtra(extra);

        }else if (method == this.id_prefix + "aggregateText") {
            // sum, count, min, max, med

            me._aggregateExtraText(extra);

        } else if (method == this.id_prefix + "intersect") {
            // intersecting layer selection
            me._intersectExtra(extra);

        } else if (method == this.id_prefix + "union") {
            // union input 2 layer selection
            // deprecated  me._unionExtra(extra);

        }
    },
    /**
     * @method _aggregateExtra
     * @private
     ** Add extra parameters for params UI according to method aggregate
     * @param {jQuery} contentPanel  div to append extra params
     */
    _aggregateExtra : function(contentPanel) {
        var me = this;
        //title
        var title = this.template.title_extra.clone();
        title.find('.extra_title_label').html(this.loc.aggregate.label);
        contentPanel.append(title);

        // sum, count, min, max, med
        var closureMagic = function(tool) {
            return function() {
                var size = contentPanel.find('input[name=aggre]:checked').val();
                // reset previous setting
                for (var i = 0; i < me.aggreOptions.length; ++i) {
                    me.aggreOptions[i].selected = false;
                }
                tool.selected = true;

            };
        };

        for (var i = 0; i < this.aggreOptions.length; ++i) {
            var option = this.aggreOptions[i];
            var toolContainer = this.template.aggreOptionTool.clone();
            var label = option.label;
            if (option.width && option.height) {
                label = label + ' (' + option.width + ' x ' + option.height + 'px)';
            }
            toolContainer.find('label').append(label).attr({
                'for': option.id,
                'class': 'params_radiolabel'
            })
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
         * @method _aggregateExtraText
         * @private
         ** Add extra parameters for params UI according to method aggregate
         * @param {jQuery} contentPanel  div to append extra params
         */
        _aggregateExtraText : function(contentPanel) {
            var me = this;
            var text_parm_len = 1;
            //title
            var title = this.template.title_extra.clone();
            title.find('.extra_title_label').html(this.loc.aggregate.label);
            contentPanel.append(title);

            // sum, count, min, max, med
            var closureMagic = function(tool) {
                return function() {
                    var size = contentPanel.find('input[name=aggre]:checked').val();
                    // reset previous setting
                    for (var i = 0; i < text_parm_len; ++i) {
                        me.aggreOptions[i].selected = false;
                    }
                    tool.selected = true;

                };
            };

            for (var i = 0; i < text_parm_len; ++i) {
                var option = this.aggreOptions[i];
                var toolContainer = this.template.aggreOptionTool.clone();
                var label = option.label;
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
     * Add extra parameters for params UI according to method intersect
     * @param {jQuery} contentPanel  div to append extra params
     */
    _intersectExtra : function(contentPanel) {
        var me = this;

        // Set radiobuttons for selecting intersecting layer
        var options = [];
        // Checked data layers
        if (me.contentOptionDivs) {
            for (var p in me.contentOptionsMap ) {
                if (me.contentOptionDivs[p] != undefined) {
                    // true or false var test = me.contentOptionDivs[p].find('input').prop('checked');
                    var option = {
                        id : me.contentOptionsMap[p].id,
                        label : me.contentOptionsMap[p].label
                    };
                    options.push(option);
                }
            }
        }

        me.intersectOptions = options;
        me.intersectOptionsMap = {};

        for (var f = 0; f < me.intersectOptions.length; f++) {
            me.intersectOptionsMap[me.intersectOptions[f].id] = me.intersectOptions[f];
        }
        // title
        var title = me.template.title_extra.clone();
        title.find('.extra_title_label').html(me.loc.intersect.label);
        contentPanel.append(title);

        var closureMagic = function(tool) {
            return function() {
                var size = contentPanel.find('input[name=aggre]:checked').val();
                // reset previous setting
                for (var i = 0; i < me.intersectOptions.length; ++i) {
                    me.intersectOptions[i].selected = false;
                }
                tool.selected = true;

            };
        };

        for (var i = 0; i < me.intersectOptions.length; ++i) {
            var option = me.intersectOptions[i];
            var toolContainer = me.template.intersectOptionTool.clone();
            var label = option.label;
            if (option.width && option.height) {
                label = label + ' (' + option.width + ' x ' + option.height + 'px)';
            }
            toolContainer.find('label').append(label).attr({
                'for' : option.id,
                'class' : 'params_radiolabel'
            });
            if (option.selected) {
                toolContainer.find('input').attr('checked', 'checked');
            }
            contentPanel.append(toolContainer);
            toolContainer.find('input').attr({
                'value' : option.id,
                'name' : 'intersect',
                'id' : option.id
            });
            toolContainer.find('input').change(closureMagic(option));
        }

        //title spatial operator
        var titlespa = this.template.title_extra.clone();
        titlespa.find('.extra_title_label').html(this.loc.spatial.label);
        contentPanel.append(titlespa);

        var closureMagic = function(tool) {
            return function() {
                var size = contentPanel.find('input[name=spatial]:checked').val();
                // reset previous setting
                for (var i = 0; i < me.spatialOptions.length; ++i) {
                    me.spatialOptions[i].selected = false;
                }
                tool.selected = true;

            };
        };

        // spatial operators
        for (var i = 0; i < this.spatialOptions.length; ++i) {
            var option = this.spatialOptions[i];
            var toolContainer = this.template.spatialOptionTool.clone();
            var label = option.label;
            if (option.width && option.height) {
                label = label + ' (' + option.width + ' x ' + option.height + 'px)';
            }
            toolContainer.find('label').append(label).attr({
                'for' : option.id,
                'class' : 'params_radiolabel'
            });
            if (option.selected) {
                toolContainer.find('input').attr('checked', 'checked');
            }
            contentPanel.append(toolContainer);
            toolContainer.find('input').attr({
                'value' : option.id,
                'name' : 'spatial',
                'id' : option.id
            });
            toolContainer.find('input').change(closureMagic(option));
        }

    },
    /**
     * @method _unionExtra
     * @private
     * Add extra parameters for params UI according to method union
     * @param {jQuery} contentPanel  div to append extra params
     */
    _unionExtra : function(contentPanel) {
        var me = this;

        // Set radiobuttons for selecting union layer
        var options = [];
        // Checked data layers
        if (me.contentOptionDivs) {
            for (var p in me.contentOptionsMap ) {
                if (me.contentOptionDivs[p] != undefined) {
                    // true or false var test = me.contentOptionDivs[p].find('input').prop('checked');
                    var option = {
                        id : me.contentOptionsMap[p].id,
                        label : me.contentOptionsMap[p].label
                    };
                    options.push(option);
                }
            }
        }

        me.unionOptions = options;
        me.unionOptionsMap = {};

        for (var f = 0; f < me.unionOptions.length; f++) {
            me.unionOptionsMap[me.unionOptions[f].id] = me.unionOptions[f];
        }
        // title
        var title = me.template.title_extra.clone();
        title.find('.extra_title_label').html(me.loc.union.label);
        contentPanel.append(title);

        var closureMagic = function(tool) {
            return function() {
                var size = contentPanel.find('input[name=aggre]:checked').val();
                // reset previous setting
                for (var i = 0; i < me.unionOptions.length; ++i) {
                    me.unionOptions[i].selected = false;
                }
                tool.selected = true;

            };
        };

        for (var i = 0; i < me.unionOptions.length; ++i) {
            var option = me.unionOptions[i];
            var toolContainer = me.template.unionOptionTool.clone();
            var label = option.label;
            if (option.width && option.height) {
                label = label + ' (' + option.width + ' x ' + option.height + 'px)';
            }
            toolContainer.find('label').append(label).attr({
                'for' : option.id,
                'class' : 'params_radiolabel'
            });
            if (option.selected) {
                toolContainer.find('input').attr('checked', 'checked');
            }
            contentPanel.append(toolContainer);
            toolContainer.find('input').attr({
                'value' : option.id,
                'name' : 'union',
                'id' : option.id
            });
            toolContainer.find('input').change(closureMagic(option));
        }

        //title spatial operator
        var titlespa = this.template.title_extra.clone();
        titlespa.find('.extra_title_label').html(this.loc.spatial.label);
        contentPanel.append(titlespa);

        var closureMagic = function(tool) {
            return function() {
                var size = contentPanel.find('input[name=spatial]:checked').val();
                // reset previous setting
                for (var i = 0; i < me.spatialOptions.length; ++i) {
                    me.spatialOptions[i].selected = false;
                }
                tool.selected = true;

            };
        };

        // spatial operators
        for (var i = 0; i < this.spatialOptions.length; ++i) {
            var option = this.spatialOptions[i];
            var toolContainer = this.template.spatialOptionTool.clone();
            var label = option.label;
            if (option.width && option.height) {
                label = label + ' (' + option.width + ' x ' + option.height + 'px)';
            }
            toolContainer.find('label').append(label).attr({
                'for' : option.id,
                'class' : 'params_radiolabel'
            });
            if (option.selected) {
                toolContainer.find('input').attr('checked', 'checked');
            }
            contentPanel.append(toolContainer);
            toolContainer.find('input').attr({
                'value' : option.id,
                'name' : 'spatial',
                'id' : option.id
            });
            toolContainer.find('input').change(closureMagic(option));
        }

    },
    /**
     * @method _modifyExtraParameters
     * @private
     * modify parameters data UI according to method
     * @param {String} method  analyse method
     */
    _modifyExtraParameters : function(method) {
        var me = this;
        var contentPanel = me.mainPanel.find('div.extra_params');
        // Remove old content
        contentPanel.empty();

        // Empty the attribute selector for preserved layer attributes
        // And create it unless the selected method is aggregate,
        // in which case create a dropdown to select an attribute to aggregate
        var columnsContainer = me.mainPanel.find('div.analyse-columns-container');
        if (me.id_prefix + 'aggregate' === method ) {
            columnsContainer.empty();
            me._createColumnsDropdown(columnsContainer);
        }
        else if (me.id_prefix + 'aggregateText' === method ) {
            // nop
        }
        else if (me.id_prefix + 'aggregateNumeric' === method ) {
            // nop
        }else {
            columnsContainer.empty();
            me._createColumnsSelector(columnsContainer);
        }

        me._addExtraParameters(contentPanel.parent(), method);
    },

    /**
     * Creates a dropdown to choose an attribute to get aggregated.
     *
     * @method _createColumnsDropdown
     * @param {jQuery Object} columnsContainer the container where the dropdown should be appended to.
     */
    _createColumnsDropdown : function(columnsContainer) {
        var selectedLayer = this._getSelectedMapLayer();
        var me = this;
        var aggreMagic = function() {
            return function() {
               if (me._isNumericField(this.value))
               me._modifyExtraParameters(me.id_prefix+'aggregateNumeric');
               else me._modifyExtraParameters(me.id_prefix+'aggregateText');
            };
        };

        var fields = ((selectedLayer && selectedLayer.getFields && selectedLayer.getFields()) ? selectedLayer.getFields().slice() : [] ), locales = ((selectedLayer && selectedLayer.getLocales && selectedLayer.getLocales()) ? selectedLayer.getLocales().slice() : [] ), dropdown = this.template.columnsDropdown.clone(), i, localizedLabel, featureListOption;

        // Placeholder
        dropdown.append(jQuery('<option value="' + null + '">' + this.loc.aggregate.attribute + '</option>'));

        for ( i = 0; i < fields.length; ++i) {
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
     * @method _modifyAnalyseData
     * @private
     * modify analyse data layers in selection box
     * @param {jQuery} contentPanel  content panel for data layer selections
     */
    _modifyAnalyseData : function(contentPanel) {
        var me = this;
        // Open layerselector
        //me.instance.setAnalyseMode(false);
        var name = 'LayerSelector';
        var extension = me._getFakeExtension(name);
        var rn = 'userinterface.UpdateExtensionRequest';
        me.instance.getSandbox().postRequestByName(rn, [extension, 'attach']);

    },
    _getFakeExtension : function(name) {
        return {
            getName : function() {
                return name;
            }
        };
    },
    /**
     * @method refreshAnalyseData
     * @private
     * refresh analyse data layers in selection box
     *
     */
    refreshAnalyseData : function() {
        var me = this;
        var contentPanel = me.mainPanel;
        // Remove old
        contentPanel.find('.analyse_option_cont').remove();
        me._addAnalyseData(contentPanel);

    },
    /**
     * @method refreshExtraParameters
     * @private
     * refresh analyse parameters UI in the selection box
     *
     */
    refreshExtraParameters : function() {
        var me = this;
        var container = me.mainPanel;
        var selectedMethod = container.find('input[name=method]:checked').val();
        me._modifyExtraParameters(selectedMethod);

    },
    /**
     * @method _gatherSelections
     * @private
     * Gathers analyse selections and returns them as JSON object
     * @return {Object}
     */
    _gatherSelections : function() {
        var container = this.mainPanel;
        var sandbox = this.instance.getSandbox();

        // Get the name of the method
        var selectedMethod = container.find('input[name=method]:checked').val();
        var methodName = selectedMethod && selectedMethod.replace(this.id_prefix, '');

        var layer = this._getSelectedMapLayer();

        // Get the feature fields
        var selectedColumnmode = container.find('input[name=params]:checked').val();
        var fields = selectedColumnmode && selectedColumnmode.replace(this.id_prefix, '');
        // All fields
        if (fields == 'all') {
            fields = ((layer && layer.getFields && layer.getFields()) ? layer.getFields().slice() : [0] );
        }
        // Selected fields
        else if (fields == 'select') {
            var fieldsList = jQuery('div.analyse-featurelist').find('ul li input:checked');
            fields = jQuery.map(fieldsList, function(val, i) {
                return val.value;
            });
        }
        // None
        else {
            fields = [];
        }

        var title = container.find('.settings_name_field').val();

        // Get method specific selections
        var selections = this._getMethodSelections(layer, {
            name : title,
            method : methodName,
            fields : fields,
            fieldTypes : layer.getPropertyTypes(),
            layerId : layer.getId(),
            layerType : layer.getLayerType()
        });

        // Styles
        selections["style"] = this.getStyleValues();
        // Bbox
        selections["bbox"] = this.instance.getSandbox().getMap().getBbox();

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
    _getMethodSelections : function(layer, defaultSelections) {
        var me = this;
        var container = this.mainPanel;
        var methodName = defaultSelections.method;

        // buffer
        var bufferSize = container.find('.settings_buffer_field').val();
        // aggregate
        var aggregateFunctions = container.find('input[name=aggre]:checked');
        aggregateFunctions = jQuery.map(aggregateFunctions, function(val, i) {
            return val.value.replace(me.id_prefix, '');
        });
        var aggregateAttribute = container.find('select.analyse-columns-dropdown option').filter(':selected').val();
        // union
        var unionLayerId = container.find('input[name=union]:checked').val();
        unionLayerId = unionLayerId && unionLayerId.replace((this.id_prefix + 'layer_'), '');
        // intersect
        var intersectLayerId = container.find('input[name=intersect]:checked').val();
        intersectLayerId = intersectLayerId && intersectLayerId.replace((this.id_prefix + 'layer_'), '');
        var spatialOperator = container.find('input[name=spatial]:checked').val();
        spatialOperator = spatialOperator && spatialOperator.replace(this.id_prefix, '');

        var methodSelections = {
            'buffer' : {
                methodParams : {
                    distance : bufferSize
                },
                opacity : layer.getOpacity()
            },
            'aggregate' : {
                methodParams : {
                    functions : aggregateFunctions, // TODO: param name?
                    attribute : aggregateAttribute
                }
            },
            'union' : {
                methodParams : {
                    layerId : unionLayerId
                }
            },
            'intersect' : {
                methodParams : {
                    layerId : intersectLayerId,
                    operator : spatialOperator // TODO: param name?
                }
            }
        };

        for (var s in methodSelections[methodName]) {
            defaultSelections[s] = methodSelections[methodName][s];
        }
        return defaultSelections;
    },

    /**
     * @method _analyseMap
     * @private
     * Check parameters and execute analyse.
     *
     */
    _analyseMap : function() {
        var me = this;
        var sandbox = this.instance.getSandbox();
        var url = sandbox.getAjaxUrl();
        var selections = me._gatherSelections();
        var data = {};
        data.analyse = JSON.stringify(selections);

        var layerId = selections.layerId;
        var layer = sandbox.findMapLayerFromSelectedMapLayers(layerId);
        if (this.getFilterJson(layerId)) {
            var filterJson = this.getFilterJson(layerId);
            // If the user wanted to include only selected/clicked
            // features, get them now from the layer.
            if (filterJson.featureIds) {
                this._getSelectedFeatureIds(layer, filterJson);
            }
            data.filter = JSON.stringify(filterJson);
        }
        // Check that parameters are a-okay
        if (me._checkSelections(selections)) {
            // Send the data for analysis to the backend
            me.instance.analyseService.sendAnalyseData(data,
            // Success callback
            function(response) {
                if (response) {
                    me._handleAnalyseMapResponse(response);
                }
            },
            // Error callback
            function(jqXHR, textStatus, errorThrown) {
                me.instance.showMessage(me.loc.error.title, me.loc.error.saveFailed);
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
    _handleAnalyseMapResponse : function(analyseJson) {
        // TODO: some error checking perhaps?
        var me=this;
        var mapLayerService, mapLayer, requestBuilder, request;

        // TODO: Handle WPS results when no FeatureCollection eg. aggregate
        if (analyseJson.wpsLayerId == "-1") {
            this.instance.showMessage("Tulokset", analyseJson.result);
        } else {

            mapLayerService = this.instance.mapLayerService;
            // Prefix the id to avoid collisions
            // FIXME: temporary, server should respond with an actual
            // id so that further analysis with this layer is possible.
            analyseJson.id = this.layer_prefix + analyseJson.id + '_' + analyseJson.wpsLayerId;
            // Create the layer model
            mapLayer = mapLayerService.createMapLayer(analyseJson);
            mapLayer.setWpsUrl(analyseJson.wpsUrl);
            mapLayer.setWpsName(analyseJson.wpsName);
            //mapLayer.setWpsUrl('/karttatiili/wpshandler?');
            //mapLayer.setWpsName('ana:analysis_data');
            // Add the layer to the map layer service
            mapLayerService.addLayer(mapLayer);

            // Request the layer to be added to the map.
            // instance.js handles things from here on.
            requestBuilder = this.instance.sandbox.getRequestBuilder('AddMapLayerRequest');
            if (requestBuilder) {
                request = requestBuilder(mapLayer.getId());
                this.instance.sandbox.request(this.instance, request);
            }
        }
        // Set random colors for next analyse
        me.categoryForm.randomColors();

    },

    /**
     * @method _saveAnalyse
     * @private
     * Save analyse data.
     * @param {Object} selections analyse params as returned by _gatherSelections()
     */
    _saveAnalyse : function(selections, features) {
        var me = this;
        var sandbox = this.instance.getSandbox();
        var url = sandbox.getAjaxUrl();

        alert('TODO: save analyse data operations');
    },
    /**
     * @method _infoRequest
     * @private
     * Request sandbox for to open metadata info
     * @param {jQuery} tools  table div where info icon is located
     * @param {int} layer_id  layer id for to retreave layer object
     */
    _infoRequest : function(tools, layer_id) {
        layer_id = layer_id.replace(this.id_prefix + 'layer_', '');
        var layer = this.instance.getSandbox().findMapLayerFromSelectedMapLayers(layer_id);
        var me = this;
        tools.find('div.layer-info').bind('click', function() {
            var rn = 'catalogue.ShowMetadataRequest';
            var uuid = layer.getMetadataIdentifier();
            var additionalUuids = [];
            var additionalUuidsCheck = {};
            additionalUuidsCheck[uuid] = true;

            var subLayers = layer.getSubLayers();
            if (subLayers && subLayers.length > 0) {
                for (var s = 0; s < subLayers.length; s++) {
                    var subUuid = subLayers[s].getMetadataIdentifier();
                    if (subUuid && subUuid != "" && !additionalUuidsCheck[subUuid]) {
                        additionalUuidsCheck[subUuid] = true;
                        additionalUuids.push({
                            uuid : subUuid
                        });
                    }
                }

            }

            me.instance.getSandbox().postRequestByName(rn, [{
                uuid : uuid
            }, additionalUuids]);
        });
    },

    /**
     * Returns the Oskari layer object for currently selected layer
     *
     * @method _getSelectedMapLayer
     * @private
     * @return {Object/null} an Oskari layer or null if no layer selected
     */
    _getSelectedMapLayer : function() {
        var selectedLayer = this._selectedLayers();
        selectedLayer = selectedLayer && selectedLayer[0];
        selectedLayer = selectedLayer && selectedLayer.id;
        selectedLayer = selectedLayer && selectedLayer.replace((this.id_prefix + 'layer_'), '');

        return this.instance.getSandbox().findMapLayerFromSelectedMapLayers(selectedLayer);
    },

    /**
     * Gets the clicked/selected features' ids and sets it to filterJson.
     *
     * @method _getSelectedFeatureIds
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @param {JSON} filterJson
     */
    _getSelectedFeatureIds : function(layer, filterJson) {
        if (!layer || !filterJson)
            return;
        filterJson.featureIds = (layer.getClickedFeatureListIds ? layer.getClickedFeatureListIds().slice() : [] );
    },
        /**
         * Add field property types {fieldname1:type1,...} to layer
         * @param layers selected layers
         * @private
         */
    _addPropertyTypes : function(layers) {
        var me = this;
        for (var i = 0; i < layers.length; i++) {
            if (layers[i].hasFeatureData()) {
                if (jQuery.isEmptyObject(layers[i].getPropertyTypes())) {
                    me.instance.analyseService.loadWFSLayerPropertiesAndTypes(layers[i].getId())
                }
            }
        }
        },
        /**
         * Check if wfs field type is numeric
         * @param layers
         * @private
         */
        _isNumericField: function (fieldName) {
            var me = this;
            var isIt = false;
            var selectedLayer = me._getSelectedMapLayer();
            var data = selectedLayer.getPropertyTypes();
            jQuery.each(data, function (key, value) {
                if (fieldName === key) {
                    if (value == 'numeric')  isIt = true;
                }
            });


            return isIt;
        },
        /**
         * Modify analyse name when analyse layer is changed
         * @private
         */
        _modifyAnalyseName: function () {
            var me = this;
            var container = me.mainPanel;
            var selected_layer = me._getSelectedMapLayer();
            var name = '_';
            if (selected_layer)
                name = selected_layer.getName().substring(0, 15)+name;
            container.find('.settings_name_field').attr({
                'value' : name,
                'placeholder' : me.loc.analyse_name.tooltip
            });
        },
        /**
     * @method destroy
     * Destroyes/removes this view from the screen.
     */
    destroy : function() {
        this.mainPanel.remove();
    },
    hide : function() {
        this.mainPanel.hide();
    },
    show : function() {
        this.mainPanel.show();
    },
    setEnabled : function(e) {
        this.isEnabled = e;
    },
    getEnabled : function() {
        return this.isEnabled;
    },

    getState : function() {
        return {} // TODO: later this._gatherSelections();
    },
    setState : function(formState) {

    }
});
