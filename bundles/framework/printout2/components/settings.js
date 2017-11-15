Oskari.clazz.define("Oskari.mapping.printout2.components.settings",

    function ( view ) {
        this.view = view;
        this.loc = view.instance._localization["BasicView"];
        this.instance = view.instance;
        this.selectionsPanel = null;
        /* format options listed in localisations */
        this.formatOptions = this.loc.format.options;
        this.formatOptionsMap = {};
        for (f = 0; f < this.formatOptions.length; f += 1) {
            this.formatOptionsMap[this.formatOptions[f].id] = this.formatOptions[f];
        }
        /* content options listed in localisations */
        this.contentOptions = this.loc.content.options;
        this.contentOptionsMap = {};
        for (f = 0; f < this.contentOptions.length; f += 1) {
            this.contentOptionsMap[this.contentOptions[f].id] = this.contentOptions[f];
        }
        /* legend options listed in localisations */
        this.legendOptions = this.loc.legend.options;
        this.legendOptionsMap = {};
        for (f = 0; f < this.legendOptions.length; f += 1) {
            this.legendOptionsMap[this.legendOptions[f].id] = this.legendOptions[f];
        }

        this.contentOptionDivs = {};

    }, {      
        _templates: {
            help: jQuery('<div class="help icon-info"></div>'),
            format: jQuery('<div class="printout_format_cont printout_settings_cont"><div class="printout_format_label"></div></div>'),
            formatOptionTool: jQuery('<div class="tool ">' + '<input type="radio" name="format" />' + '<label></label></div>'),
            title: jQuery('<div class="printout_title_cont printout_settings_cont"><div class="printout_title_label"></div><input class="printout_title_field" type="text"></div>'),
            option: jQuery('<div class="printout_option_cont printout_settings_cont">' + '<input type="checkbox" />' + '<label></label></div>'),
            legend: jQuery('<div class="printout_legend_cont printout_settings_cont"><div class="printout_legend_label"></div></div>'),
            legendOptionTool: jQuery('<div class="tool ">' + '<input type="radio" name="legend" />' + '<label></label></div>')

        },
        getElement: function () {
            return this.selectionsPanel;
        },
        setElement: function ( element ) {
            this.selectionsPanel = element;
        },
     /**
         * @private @method _createSettingsPanel
         * Creates a settings panel for printout
         *
         * @return {jQuery} Returns the created panel
         */
        _createSettingsPanel: function () {
            var me = this,
                panel = Oskari.clazz.create(
                    'Oskari.userinterface.component.AccordionPanel'
                );

            panel.setTitle(me.loc.settings.label);
            var contentPanel = panel.getContainer();
            // tooltip
            var tooltipCont = me._templates.help.clone();
            tooltipCont.attr('title', me.loc.settings.tooltip);
            contentPanel.append(tooltipCont);

            var closureMagic = function (tool) {
                return function () {
                    var format = contentPanel.find('input[name=format]:checked').val(),
                        i;
                    // reset previous setting
                    for (i = 0; i < me.formatOptions.length; i += 1) {
                        me.formatOptions[i].selected = false;
                    }
                    tool.selected = true;

                };
            };
            /* format options from localisations files */
            var format = me._templates.format.clone(),
                i,
                f,
                option,
                toolContainer,
                label;

            format.find('.printout_format_label').html(me.loc.format.label);
            for (i = 0; i < me.formatOptions.length; i += 1) {
                option = me.formatOptions[i];
                toolContainer = me._templates.formatOptionTool.clone();
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

            var mapTitle = me._templates.title.clone();
            mapTitle.find('.printout_title_label').html(me.loc.mapTitle.label);
            mapTitle.find('.printout_title_field').attr({
                'value': '',
                'placeholder': me.loc.mapTitle.label
            });

            contentPanel.append(mapTitle);

            // /* CONTENT options from localisations files */

            for (f = 0; f < me.contentOptions.length; f += 1) {
                var dat = me.contentOptions[f],
                    opt = me._templates.option.clone();

                opt.find('input').attr({
                    'id': dat.id,
                    'checked': dat.checked
                });
                opt.find('label').html(dat.label).attr({
                    'for': dat.id,
                    'class': 'printout_checklabel'
                });
                me.contentOptionDivs[dat.id] = opt;
                contentPanel.append(opt);

            }

            // var legend = this.createLegend( contentPanel );
            // contentPanel.append(legend);
            this.setElement(panel);
            return this.getElement();
        },
        createLegend: function () {
            var me = this;
            // Lengend options
            var closureMagic2 = function (tool) {
                return function () {
                    var legend = el.find('input[name=legend]:checked').val(),
                        i;
                    // reset previous setting
                    for (i = 0; i < me.legendOptions.length; i += 1) {
                        me.legendOptions[i].selected = false;
                    }
                    tool.selected = true;

                };
            };

            var legend = me._templates.legend.clone();
            legend.find('.printout_legend_label').html(me.loc.legend.label);
            for (i = 0; i < me.legendOptions.length; i += 1) {
                option = me.legendOptions[i];
                toolContainer = me._templates.legendOptionTool.clone();
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
            return legend;
            // this.setElement(el);
            // return this.getElement();
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
                var container = me.view.getElement();
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
                    selections[p] = me.contentOptionDivs[p].find('input').prop('checked');
                }
            }

            return selections;
        },
    }, {

    });