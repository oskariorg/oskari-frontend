/**
 * @class Oskari.mapframework.bundle.publisher.view.PublisherLayoutForm
 * 
 * Represents the layout (colours, fonts, tool style etc.) view for the publisher 
 * as an Oskari.userinterface.component.AccordionPanel
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher.view.PublisherLayoutForm',

/**
 * @method create called automatically on construction
 * @static
 * @param {Object} localization
 *       publisher localization data
 * @param {Oskari.mapframework.bundle.publisher.view.BasicPublisher} publisher
 *       publisher reference for language change
 */
function(localization, publisher) {
	this.loc = localization;
    this._publisher = publisher;

    this.template = {};
    for (var t in this.__templates ) {
        this.template[t] = jQuery(this.__templates[t]);
    }

    this.values = null;

    // TODO: these should propably come from conf or smth...
    this.initialValues = {
        colours: [
            {name: 'Light grey', val: 'light_grey'},
            {name: 'Dark grey', val: 'dark_grey'},
            {name: 'Blue', val: 'blue'},
            {name: 'Red', val: 'red'},
            {name: 'Green', val: 'green'},
            {name: 'Yellow', val: 'yellow'}
        ],
        fonts: [
            {name: 'Arial', val: 'arial'},
            {name: 'Comic Sans', val: 'comic_sans'}
        ],
        toolStyles: [
            {name: 'Rounded', val: 'rounded'},
            {name: 'Sharp edges', val: 'sharp'},
            {name: '3D', val: '3d'}
        ]
    };

	this.fields = {
        'colours': {
            'label': this.loc.layout.fields.colours.label,
            'getContent': this._getColoursTemplate
        },
        'fonts': {
            'label': this.loc.layout.fields.fonts.label,
            'getContent': this._getFontsTemplate
        },
        'toolStyles': {
            'label': this.loc.layout.fields.toolStyles.label,
            'getContent': this._getToolStylesTemplate
        }
	};
}, {
    __templates: {
        "colours":      '<div id="publisher-layout-colours">' +
                            '<label for="publisher-colours"></label>' +
                            '<div id="publisher-layout-coloursSelector">' +
                                '<p id="publisher-selected-colour"></p>' +
                                '<button id="publisher-colours"></button>' +
                            '</div>' +
                        '</div>',
        "fonts":        '<div id="publisher-layout-fonts">' +
                            '<label for="publisher-fonts"></label>' +
                            '<select name="publisher-fonts"></select>' +
                        '</div>',
        "toolStyles":   '<div id="publisher-layout-toolStyles">' +
                            '<label for="publisher-toolStyles"></label>' +
                            '<select name="publisher-toolStyles"></select>' +
                        '</div>',
        "option":       '<option></option>',
        "inputRadio":   '<div><input type="radio" /><label></label></div>',
        "coloursPopup": '<div id="publisher-colour-popup">' +
                            '<div id="publisher-colour-inputs"></div>' +
                            '</div id="publisher-colour-preview"></div>' +
                        '</div>'
    },

    /**
     * Creates the DOM elements for layout change components and
     * prepopulates the fields if pData parameter is given.
     * 
     * @method init
     * @param {Object} pData initial data 
     */
	init : function(pData) {
        var self = this,
            f, field, template;
        pData = pData || {};

        this.values = {
            colourScheme: pData.colourScheme,
            font: pData.font,
            toolStyle: pData.toolStyle
        };

        // "Precompile" the templates
        for (f in this.fields) {
            field = this.fields[f];
            template = field.getContent.apply(self, arguments);
            field.content = template;
        }
	},
    /**
     * Returns the UI panel and populates it with the data that we want to show the user.
     * 
     * @method getPanel
     * @return {Oskari.userinterface.component.AccordionPanel}
     */
	getPanel : function() {
        var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel'),
            contentPanel = panel.getContainer(),
            f, field, template;

        panel.setTitle(this.loc.layout.label);

        for (f in this.fields) {
            field = this.fields[f];
            contentPanel.append(field.content);
        }
		
		return panel;
	},
    /**
     * Returns the selections the user has done with the form inputs (all strings).
     * {
     *     colourScheme : <selected colour scheme>,
     *     font : <selected font>,
     *     toolStyle : <selected toolStyle>
     * }
     * 
     * @method getValues
     * @return {Object}
     */
	getValues : function() {
        this.values.colourScheme = jQuery('p#publisher-selected-colour').text() || null;
        this.values.font = jQuery('select[name=publisher-fonts]').val();
        this.values.toolStyle = jQuery('select[name=publisher-toolStyles]').val();

		return this.values;
    },

    /**
     * @method _getColoursTemplate
     */
    _getColoursTemplate: function() {
        var self = this,
            template = this.template.colours.clone();

        // Set the localizations.
        template.find('label').html(this.loc.layout.fields.colours.label);

        // Set the button handler
        template.find('button').html(this.loc.layout.fields.colours.buttonLabel).on('click', function(e) {
            // TODO: create the popup to choose the colour scheme from.
            self._openColourDialog(jQuery(this));
            template.find('p#publisher-selected-colour').html('ULLATUS!');
            console.log(self.getValues());
        });

        // Prepopulate data
        template.find('p#publisher-selected-colour').html(this.values.colourScheme);

        return template;
    },

    /**
     * @method _getFontsTemplate
     */
    _getFontsTemplate: function() {
        var self = this,
            template = this.template.fonts.clone(),
            fonts = this.initialValues.fonts,
            fLen = fonts.length,
            fontOption,
            i;

        // Set the localization.
        template.find('label').html(this.loc.layout.fields.fonts.label);

        for (i = 0; i < fLen; ++i) {
            fontOption = this.template.option.clone();
            fontOption.attr({
                value: fonts[i].val
            }).html(fonts[i].name);
            template.find('select').append(fontOption);
        }

        // Set the select change handler.
        template.find('select').on('change', function(e) {
        });

        // Prepopulate data
        jQuery(template.find('select option')).filter(function () {
            return (jQuery(this).val() == self.values.font); 
        }).prop('selected', 'selected');

        return template;
    },

    /**
     * @method _openColourDialog
     */
    _openColourDialog: function(target) {
        var popup = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            closeButton = popup.createCloseButton(this.loc.layout.popup.close),
            title = this.loc.layout.popup.title,
            content = this.template.coloursPopup.clone(),
            colours = this.initialValues.colours,
            cLen = colours.length,
            colourInput, i;

        for (i = 0; i < cLen; ++i) {
            colourInput = this.template.inputRadio.clone();
            
            colourInput.find('input[type=radio]').attr({
                'id': colours[i].val,
                'name': 'colour',
                'value': colours[i].val
            });
            colourInput.find('label').html(colours[i].name).attr({
                'for': colours[i].val
            });

            content.find('div#publisher-colour-inputs').append(colourInput);
        }

        popup.moveTo(target);
        popup.show(title, content, [closeButton]);
    },

    /**
     * @method _getToolStylesTemplate
     */
    _getToolStylesTemplate: function() {
        var self = this,
            template = this.template.toolStyles.clone(),
            toolStyles = this.initialValues.toolStyles,
            tsLen = toolStyles.length,
            toolStyleOption,
            i;

        // Set the localizations.
        template.find('label').html(this.loc.layout.fields.toolStyles.label);

        for (i = 0; i < tsLen; ++i) {
            toolStyleOption = this.template.option.clone();
            toolStyleOption.attr({
                value: toolStyles[i].val
            }).html(toolStyles[i].name);
            template.find('select').append(toolStyleOption);
        }

        // Set the select change handler.
        template.find('select').on('change', function(e) {
            // TODO: reflect the change to preview map
            // Specifically, the tools' styles should change immediatly after the change.
        });

        // Prepopulate data
        jQuery(template.find('select option')).filter(function () {
            return (jQuery(this).val() == self.values.toolStyle); 
        }).prop('selected', 'selected');

        return template;
    }
});

