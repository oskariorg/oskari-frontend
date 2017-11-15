Oskari.clazz.define("Oskari.mapping.printout2.components.sizepanel",
    function ( view ) {
        this.view = view;
        this.loc = view.instance._localization["BasicView"];
        this.instance = view.instance;
        this.panel = null;
        
        /* page sizes listed in localisations */
        this.sizeOptions = this.loc.size.options;

        this.sizeOptionsMap = {};
        for (s = 0; s < this.sizeOptions.length; s += 1) {
            this.sizeOptionsMap[this.sizeOptions[s].id] = this.sizeOptions[s];
        }
}, {
    template: {
        help: jQuery('<div class="help icon-info"></div>'),
        sizeOptionTool: jQuery('<div class="tool ">' + '<input type="radio" name="size" />' + '<label></label></div>')
    },
    getElement: function () {
        return this.panel;
    },
    setElement: function ( element ) {
        this.panel = element;
    },
    /**
     * @private @method _createSizePanel
     * Creates the size selection panel for printout
     *
     *
     * @return {jQuery} Returns the created panel
     */
    _createSizePanel: function () {
        var me = this,
            panel = Oskari.clazz.create(
                'Oskari.userinterface.component.AccordionPanel'
            ),
            contentPanel = panel.getContainer(),
            tooltipCont = me.template.help.clone(),
            i;

        panel.setTitle(me.loc.size.label);
        tooltipCont.attr('title', me.loc.size.tooltip);
        contentPanel.append(tooltipCont);
        // content
        var closureMagic = function (tool) {
            return function () {
                var size = contentPanel.find('input[name=size]:checked').val(),
                    i;
                // reset previous setting
                for (i = 0; i < me.sizeOptions.length; i += 1) {
                    me.sizeOptions[i].selected = false;
                }
                tool.selected = true;
                me.view.preview._cleanMapPreview();
                me.view.preview._updateMapPreview();
                // Update legend
                me._createLegend();
            };
        };
        for (i = 0; i < me.sizeOptions.length; i += 1) {
            var option = me.sizeOptions[i],
                toolContainer = me.template.sizeOptionTool.clone(),
                label = option.label;

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

        this.setElement( panel );
        return this.getElement();
    },
}, {

});