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

            /* format options from localisations files */
            var format = me._templates.format.clone(),
                i,
                f,
                option,
                toolContainer,
                label;

            format.find('.printout_format_label').html(me.loc.format.label);
            me.formatOptions.forEach( function ( printformat ) {
                option = printformat;
                toolContainer = me._templates.formatOptionTool.clone();
                label = printformat.label;

                toolContainer.find('label').append(label).attr({
                    'for': printformat.id,
                    'class': 'printout_radiolabel'
                });
                if (printformat.selected) {
                    toolContainer.find('input').attr('checked', 'checked');
                }
                format.append(toolContainer);
                toolContainer.find('input').attr({
                    'value': printformat.format,
                    'name': 'format',
                    'id': printformat.id
                });
                toolContainer.find('input').on('change', { self : me, fOption: option }, function ( evt ) {
                    var self = evt.data.self;
                    var option = evt.data.fOption;
                    var format = jQuery( this ).val();
                    for ( i = 0; i < self.formatOptions.length; i += 1 ) {
                        self.formatOptions[i].selected = false;
                    }
                    option.selected = true;
                });
            });

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

            this.setElement(panel);
            return this.getElement();
        },
        getContentOptions: function () {
            return this.contentOptionDivs;
        }
    }, {

    });